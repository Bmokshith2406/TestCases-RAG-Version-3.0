import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import type { ZodError } from "zod";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHero } from "@/components/auth/AuthHero";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { FeaturePills } from "@/components/auth/FeaturePills";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useLogin } from "@/hooks/useLogin";
import { useRegister } from "@/hooks/useRegister";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import type { AuthFieldErrors, AuthMode, LoginFormState, RegisterFormState } from "@/types/auth.types";

function toLoginFieldErrors(error: ZodError<LoginFormState>) {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    username: fieldErrors.username?.[0],
    password: fieldErrors.password?.[0],
  } satisfies AuthFieldErrors;
}

function toRegisterFieldErrors(error: ZodError<RegisterFormState>) {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    username: fieldErrors.username?.[0],
    password: fieldErrors.password?.[0],
    role: fieldErrors.role?.[0],
  } satisfies AuthFieldErrors;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginState, setLoginState] = useState<LoginFormState>({
    username: "",
    password: "",
  });
  const [registerState, setRegisterState] = useState<RegisterFormState>({
    username: "",
    password: "",
    role: "viewer",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [loginErrors, setLoginErrors] = useState<AuthFieldErrors>({});
  const [registerErrors, setRegisterErrors] = useState<AuthFieldErrors>({});

  const loginMutation = useLogin({
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      setMessage(error instanceof ApiError ? error.message : "Unable to sign in. Please try again.");
      setMessageType("error");
    },
  });

  const registerMutation = useRegister({
    onSuccess: () => {
      setMessage("Account created successfully. You can now sign in.");
      setMessageType("success");
      setMode("login");
      setRegisterState({
        username: "",
        password: "",
        role: "viewer",
      });
      setRegisterErrors({});
    },
    onError: (error) => {
      setMessage(error instanceof ApiError ? error.message : "Unable to create account. Please try again.");
      setMessageType("error");
    },
  });

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setMessage(null);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [message]);

  function submitLogin() {
    const parsed = loginSchema.safeParse(loginState);
    if (!parsed.success) {
      setLoginErrors(toLoginFieldErrors(parsed.error));
      setMessage("Please correct the highlighted sign-in fields.");
      setMessageType("error");
      return;
    }

    setLoginErrors({});
    loginMutation.mutate(parsed.data);
  }

  function submitRegister() {
    const parsed = registerSchema.safeParse(registerState);
    if (!parsed.success) {
      setRegisterErrors(toRegisterFieldErrors(parsed.error));
      setMessage("Please correct the highlighted registration fields.");
      setMessageType("error");
      return;
    }

    setRegisterErrors({});
    registerMutation.mutate(parsed.data);
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-shell">
      <section className="auth-showcase auth-showcase-modular">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <AuthHero />
        </motion.div>
      </section>

      <section className="auth-panel panel auth-panel-modular">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="auth-panel-inner"
        >
          <div className="auth-panel-body">
            <AuthCard>
              <div className="auth-stack">
                <div className="auth-heading">
                  <div>
                    <p className="eyebrow">{mode === "login" ? "Welcome Back" : "Secure Registration"}</p>
                    <h2>{mode === "login" ? "Sign in to continue" : "Create your account"}</h2>
                    <p className="muted">
                      {mode === "login"
                        ? "Access your AI-powered QA workspace and operational dashboard."
                        : "Create a secure account to access the intelligent automation platform."}
                    </p>
                  </div>

                  {/* UI/UX For Feature Pills is Commented, if needed in future , you can change in components and uncomment here       */}
                  {/* <FeaturePills /> */}
                  <AuthTabs mode={mode} setMode={setMode} />
                </div>

                {message ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`message ${messageType === "success" ? "success" : "error"}`.trim()}
                  >
                    {message}
                  </motion.div>
                ) : null}

                {mode === "login" ? (
                  <LoginForm
                    username={loginState.username}
                    password={loginState.password}
                    setUsername={(value) => setLoginState((current) => ({ ...current, username: value }))}
                    setPassword={(value) => setLoginState((current) => ({ ...current, password: value }))}
                    onSubmit={submitLogin}
                    loading={loginMutation.isPending}
                    errors={loginErrors}
                  />
                ) : (
                  <RegisterForm
                    username={registerState.username}
                    password={registerState.password}
                    role={registerState.role}
                    setUsername={(value) => setRegisterState((current) => ({ ...current, username: value }))}
                    setPassword={(value) => setRegisterState((current) => ({ ...current, password: value }))}
                    setRole={(value) => setRegisterState((current) => ({ ...current, role: value }))}
                    onSubmit={submitRegister}
                    loading={registerMutation.isPending}
                    errors={registerErrors}
                  />
                )}

                {/* <div className="auth-footer">
                  <div className="auth-footer-items">
                    <span>JWT Secured</span>
                    <span className="auth-footer-dot" />
                    <span>Role-Based Access</span>
                    <span className="auth-footer-dot" />
                    <span>Enterprise Ready</span>
                  </div>
                </div> */}
              </div>
            </AuthCard>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
