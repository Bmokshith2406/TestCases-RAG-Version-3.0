import uuid
import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pymongo.errors import DuplicateKeyError

from app.core.analytics import log_api_call
from app.core.config import get_settings
from app.core.logging import logger
from app.core.security import (
    create_access_token,
    get_current_user,
    get_optional_current_user,
    hash_password,
    normalize_role,
    scopes_for_role,
    verify_password,
)
from app.db.mongo import get_users_collection
from app.models.schemas import Token, UserCreate, UserOut

router = APIRouter()
settings = get_settings()
USERNAME_PATTERN = re.compile(r"^[A-Za-z0-9_-]{3,32}$")


def _validate_registration_inputs(username: str, password: str) -> None:
    if not username:
        raise HTTPException(status_code=400, detail="Username cannot be empty")

    if not USERNAME_PATTERN.fullmatch(username):
        raise HTTPException(
            status_code=400,
            detail="Username must be 3-32 characters and contain only letters, numbers, underscores, or hyphens",
        )

    if len(password or "") < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    if not re.search(r"[A-Z]", password or ""):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")

    if not re.search(r"[a-z]", password or ""):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter")

    if not re.search(r"[0-9]", password or ""):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")


def _normalize_username(username: str) -> str:
    return str(username or "").strip().lower()


def _serialize_user(doc: dict) -> UserOut:
    return UserOut(
        id=str(doc.get("_id")),
        username=doc.get("username", ""),
        role=doc.get("role", "viewer"),
    )


def _sanitized_user_payload(user: UserCreate, resolved_role: str) -> dict:
    return {
        "username": _normalize_username(user.username),
        "role": resolved_role,
    }


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register_user(
    payload: UserCreate,
    current_user: dict | None = Depends(get_optional_current_user),
):
    users = get_users_collection()
    username = _normalize_username(payload.username)

    _validate_registration_inputs(username, payload.password or "")

    try:
        existing_count = await users.count_documents({})
    except Exception:
        logger.exception("Failed to determine user bootstrap state")
        raise HTTPException(status_code=503, detail="Authentication service unavailable")

    if existing_count == 0:
        resolved_role = "admin"
    elif settings.ALLOW_PUBLIC_USER_REGISTRATION and current_user is None:
        resolved_role = "viewer"
    else:
        if current_user is None:
            raise HTTPException(status_code=401, detail="Authentication required")
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        resolved_role = normalize_role(payload.role)

    user_doc = {
        "_id": str(uuid.uuid4()),
        "username": username,
        "password_hash": hash_password(payload.password),
        "role": resolved_role,
        "scopes": scopes_for_role(resolved_role),
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    try:
        existing_user = await users.find_one({"username": username})
        if existing_user:
            raise HTTPException(status_code=409, detail="Username already exists")

        await users.insert_one(user_doc)
    except HTTPException:
        raise
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="Username already exists")
    except Exception:
        logger.exception("User registration failed")
        raise HTTPException(status_code=500, detail="Failed to create user")

    created_user = _serialize_user(user_doc)

    try:
        await log_api_call(
            endpoint="/auth/register",
            method="POST",
            user=current_user or {
                "id": user_doc["_id"],
                "username": username,
                "role": resolved_role,
            },
            payload=_sanitized_user_payload(payload, resolved_role),
            extra={"bootstrap": existing_count == 0},
        )
    except Exception:
        pass

    return created_user


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    users = get_users_collection()
    username = _normalize_username(form_data.username)

    try:
        user_doc = await users.find_one({"username": username})
    except Exception:
        logger.exception("Login lookup failed")
        raise HTTPException(status_code=503, detail="Authentication service unavailable")

    if not user_doc or not user_doc.get("is_active", True):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not verify_password(form_data.password, user_doc.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    role = normalize_role(user_doc.get("role", "viewer"))
    access_token = create_access_token(
        data={
            "sub": str(user_doc.get("_id")),
            "username": user_doc.get("username"),
            "role": role,
            "scopes": user_doc.get("scopes") or scopes_for_role(role),
        }
    )

    try:
        await log_api_call(
            endpoint="/auth/login",
            method="POST",
            user={
                "id": str(user_doc.get("_id")),
                "username": user_doc.get("username"),
                "role": role,
            },
            payload={"username": username},
        )
    except Exception:
        pass

    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserOut)
async def read_current_user(
    current_user: dict = Depends(get_current_user),
):
    return UserOut(
        id=current_user["id"],
        username=current_user["username"],
        role=current_user["role"],
    )
