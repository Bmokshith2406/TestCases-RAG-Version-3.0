import { UserPlus } from "lucide-react";

import type { AuthFieldErrors, RegisterFormProps } from "@/types/auth.types";

import { PasswordField } from "./PasswordField";

type Props = RegisterFormProps & {
  errors?: AuthFieldErrors;
};

export function RegisterForm({
  username,
  password,
  role,
  setUsername,
  setPassword,
  setRole,
  onSubmit,
  loading,
  errors,
}: Props) {
  return (
    <form
      className="auth-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="field">
        <label>
          <span>Username</span>
        </label>

        <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Choose username" className="input" />
        {errors?.username ? <p className="field-error">{errors.username}</p> : null}
      </div>

      <div className="field">
        <label>
          <span>Password</span>
        </label>

        <PasswordField value={password} onChange={setPassword} placeholder="Create password" />
        {errors?.password ? <p className="field-error">{errors.password}</p> : null}
      </div>

      <div className="field">
        <label>
          <span>Role</span>
        </label>

        <select value={role} onChange={(event) => setRole(event.target.value as RegisterFormProps["role"])} className="input">
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        {errors?.role ? <p className="field-error">{errors.role}</p> : null}
      </div>

      <button type="submit" disabled={loading} className="button primary full-width auth-submit">
        {loading ? "Creating..." : "Create Account"}
        <UserPlus size={18} />
      </button>
    </form>
  );
}
