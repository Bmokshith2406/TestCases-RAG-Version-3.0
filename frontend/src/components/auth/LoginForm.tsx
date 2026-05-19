import { ArrowRight } from "lucide-react";

import type { AuthFieldErrors, LoginFormProps } from "@/types/auth.types";

import { PasswordField } from "./PasswordField";

type Props = LoginFormProps & {
  errors?: AuthFieldErrors;
};

export function LoginForm({
  username,
  password,
  setUsername,
  setPassword,
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

        <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter username" className="input" />
        {errors?.username ? <p className="field-error">{errors.username}</p> : null}
      </div>

      <div className="field">
        <label>
          <span>Password</span>
        </label>

        <PasswordField value={password} onChange={setPassword} placeholder="Enter password" />
        {errors?.password ? <p className="field-error">{errors.password}</p> : null}
      </div>

      <button type="submit" disabled={loading} className="button primary full-width auth-submit">
        {loading ? "Signing In..." : "Continue"}
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
