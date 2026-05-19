import { Activity, BookCopy, Database, LayoutDashboard, Search, Upload } from "lucide-react";

import type { Role } from "@/lib/types";

export const navigationItems: Array<{
  to: string;
  label: string;
  title: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}> = [
  { to: "/", label: "Overview", title: "Platform Overview", icon: LayoutDashboard, roles: ["viewer", "editor", "admin"] },
  { to: "/search", label: "Search", title: "Semantic Search", icon: Search, roles: ["viewer", "editor", "admin"] },
  { to: "/library", label: "Library", title: "Case Library", icon: BookCopy, roles: ["viewer", "editor", "admin"] },
  { to: "/upload", label: "Upload", title: "Ingestion Workspace", icon: Upload, roles: ["editor", "admin"] },
  { to: "/scripts", label: "Scripts", title: "Script Explorer", icon: Database, roles: ["viewer", "editor", "admin"] },
  { to: "/operations", label: "Operations", title: "Operations Center", icon: Activity, roles: ["viewer", "editor", "admin"] },
];

export function resolveRouteTitle(pathname: string): string {
  const directMatch = navigationItems.find((item) => item.to === pathname);
  if (directMatch) {
    return directMatch.title;
  }

  return "Workspace";
}
