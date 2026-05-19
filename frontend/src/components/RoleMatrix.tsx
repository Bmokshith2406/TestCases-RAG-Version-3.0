import { ShieldCheck, Sparkles } from "lucide-react";

import { ROLE_SCOPE_MATRIX } from "../lib/access";
import type { Role } from "../lib/types";
import { Panel, PanelHeader } from "./Panel";

const roleLabels: Record<Role, string> = {
  viewer: "Viewer",
  editor: "Editor",
  admin: "Admin",
};

export function RoleMatrix() {
  return (
    <Panel>
      <PanelHeader
        eyebrow="RBAC"
        title="Role Coverage"
        description="The frontend mirrors the backend JWT + scope model so every screen respects the actual permission boundary."
      />
      <div className="role-matrix">
        {(Object.keys(ROLE_SCOPE_MATRIX) as Role[]).map((role) => (
          <article key={role} className="role-card">
            <div className="role-card-title">
              {role === "admin" ? <ShieldCheck size={18} /> : <Sparkles size={18} />}
              <h3>{roleLabels[role]}</h3>
            </div>
            <p className="muted">
              {role === "viewer"
                ? "Read-only search, library, scripts, and statistics."
                : role === "editor"
                  ? "Content operations, updates, and uploads."
                  : "Full platform governance, metrics, and destructive controls."}
            </p>
            <ul className="scope-list">
              {ROLE_SCOPE_MATRIX[role].map((scope) => (
                <li key={scope}>{scope}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Panel>
  );
}
