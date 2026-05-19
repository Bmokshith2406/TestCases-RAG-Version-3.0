import type { Role } from "./types";

export const ROLE_SCOPE_MATRIX: Record<Role, string[]> = {
  viewer: [
    "search:read",
    "cases:read",
    "scripts:read",
    "stats:read",
  ],
  editor: [
    "search:read",
    "cases:read",
    "scripts:read",
    "stats:read",
    "cases:write",
    "uploads:write",
  ],
  admin: [
    "search:read",
    "cases:read",
    "scripts:read",
    "stats:read",
    "cases:write",
    "uploads:write",
    "admin:write",
    "users:write",
  ],
};

export function canEdit(role?: Role | null): boolean {
  return role === "editor" || role === "admin";
}

export function isAdmin(role?: Role | null): boolean {
  return role === "admin";
}

export function titleCaseRole(role?: Role | null): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "editor":
      return "Editor";
    default:
      return "Viewer";
  }
}
