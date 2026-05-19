from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import get_settings
from app.core.logging import logger
from app.db.mongo import build_id_query, get_users_collection

# ---------------------------------------------------------------------
# Settings
# ---------------------------------------------------------------------

settings = get_settings()

ROLE_SCOPE_MAP = {
    "viewer": {
        "search:read",
        "cases:read",
        "scripts:read",
        "stats:read",
    },
    "editor": {
        "search:read",
        "cases:read",
        "scripts:read",
        "stats:read",
        "cases:write",
        "uploads:write",
    },
    "admin": {
        "search:read",
        "cases:read",
        "scripts:read",
        "stats:read",
        "cases:write",
        "uploads:write",
        "admin:write",
        "users:write",
    },
}
ALLOWED_ROLES = tuple(ROLE_SCOPE_MAP.keys())

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

MAX_BCRYPT_BYTES = 72

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# ---------------------------------------------------------------------
# Internal safety
# ---------------------------------------------------------------------

def _safe_password(password: str) -> str:
    """
    Ensure all passwords:
    - Encode safely
    - Are truncated to bcrypt's byte limit
    - Never crash hashing or verification
    """
    try:
        pw_bytes = password.encode("utf-8")
    except Exception:
        logger.error("Password encoding failure", exc_info=True)
        pw_bytes = str(password).encode("utf-8", errors="ignore")

    if len(pw_bytes) > MAX_BCRYPT_BYTES:
        logger.warning("Password >72 bytes detected — truncating safely")
        pw_bytes = pw_bytes[:MAX_BCRYPT_BYTES]

    return pw_bytes.decode("utf-8", errors="ignore")

# ---------------------------------------------------------------------
# Password utils
# ---------------------------------------------------------------------

def hash_password(password: str) -> str:
    """
    Hash a password safely using bcrypt.

    Guaranteed to:
    - Not exceed bcrypt byte limits
    - Fail loudly but gracefully if bcrypt breaks
    """
    try:
        safe_password = _safe_password(password)
        return pwd_context.hash(safe_password)
    except Exception:
        logger.critical(
            "CRITICAL: bcrypt hashing failure",
            exc_info=True,
        )
        raise HTTPException(
            status_code=500,
            detail="Password hashing service unavailable"
        )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password safely & crash-free.
    """
    try:
        safe_password = _safe_password(plain_password)
        return pwd_context.verify(safe_password, hashed_password)
    except Exception:
        logger.error("bcrypt verification failure", exc_info=True)
        return False


def normalize_role(role: Optional[str]) -> str:
    normalized = str(role or "viewer").strip().lower()
    if normalized not in ROLE_SCOPE_MAP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Allowed roles: {', '.join(ALLOWED_ROLES)}",
        )
    return normalized


def scopes_for_role(role: Optional[str]) -> list[str]:
    normalized = normalize_role(role)
    return sorted(ROLE_SCOPE_MAP[normalized])

# ---------------------------------------------------------------------
# JWT utils
# ---------------------------------------------------------------------

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:

    try:
        to_encode = data.copy()
    except Exception:
        to_encode = {}

    try:
        expire = datetime.utcnow() + (
            expires_delta or timedelta(
                minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
            )
        )
    except Exception:
        expire = datetime.utcnow()

    role = to_encode.get("role", "viewer")
    scopes = to_encode.get("scopes") or scopes_for_role(role)

    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "role": normalize_role(role),
        "scopes": scopes,
    })

    try:
        return jwt.encode(
            to_encode,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM,
        )
    except Exception:
        logger.exception("JWT encoding failure")
        raise HTTPException(
            status_code=500,
            detail="Token generation failed",
        )


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    except Exception:
        logger.exception("Unexpected JWT decode failure")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

# ---------------------------------------------------------------------
# Auth dependencies
# ---------------------------------------------------------------------

async def _load_current_user_from_token(token: Optional[str]) -> Optional[dict]:
    if not token:
        return None

    try:
        payload = decode_token(token)
    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication"
        )

    try:
        col = get_users_collection()
        user_doc = await col.find_one(build_id_query(user_id))
    except HTTPException:
        raise
    except Exception:
        logger.exception("User lookup failed during token validation")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable",
        )

    if not user_doc or not user_doc.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication"
        )

    role = normalize_role(user_doc.get("role", payload.get("role", "viewer")))
    scopes = user_doc.get("scopes") or payload.get("scopes") or scopes_for_role(role)

    return {
        "id": str(user_doc.get("_id")),
        "username": user_doc.get("username"),
        "role": role,
        "scopes": sorted(set(str(scope) for scope in scopes)),
    }


async def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[dict]:
    return await _load_current_user_from_token(token)


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme)
) -> dict:
    current_user = await _load_current_user_from_token(token)

    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return current_user


def require_role(*allowed_roles: str):
    normalized_roles = {normalize_role(role) for role in allowed_roles}

    async def _checker(
        current_user: dict = Depends(get_current_user)
    ):
        try:
            if current_user["role"] not in normalized_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions"
                )
        except KeyError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid role permissions"
            )

        return current_user

    return _checker


def require_scopes(*required_scopes: str):
    required = {scope.strip() for scope in required_scopes if scope and scope.strip()}

    async def _checker(
        current_user: dict = Depends(get_current_user)
    ):
        user_scopes = set(current_user.get("scopes") or [])

        missing = sorted(required - user_scopes)
        if missing:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "message": "Insufficient permissions",
                    "missing_scopes": missing,
                },
            )

        return current_user

    return _checker
