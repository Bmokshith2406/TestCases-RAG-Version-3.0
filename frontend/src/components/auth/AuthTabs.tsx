import type { AuthTabsProps } from "@/types/auth.types";

export function AuthTabs({ mode, setMode }: AuthTabsProps) {
  return (
    <div className="auth-tabbar">
      <button type="button" onClick={() => setMode("login")} className={`auth-tab ${mode === "login" ? "active" : ""}`.trim()}>
        Sign In
      </button>

      <button
        type="button"
        onClick={() => setMode("register")}
        className={`auth-tab ${mode === "register" ? "active" : ""}`.trim()}
      >
        Register
      </button>
    </div>
  );
}
