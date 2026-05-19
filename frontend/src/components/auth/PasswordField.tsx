import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import type { PasswordFieldProps } from "@/types/auth.types";

export function PasswordField({ value, onChange, placeholder }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="input password-input"
      />

      <button type="button" onClick={() => setVisible((prev) => !prev)} className="password-toggle">
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
