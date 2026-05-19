import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  UserPlus2,
  Users,
} from "lucide-react";

import { useState } from "react";

import type { ZodError } from "zod";

import { RegisterForm } from "@/components/auth/RegisterForm";

import {
  Panel,
  PanelHeader,
} from "@/components/Panel";

import { useRegister } from "@/hooks/useRegister";

import { ApiError } from "@/lib/api";

import { registerSchema } from "@/schemas/auth.schema";

import type {
  AuthFieldErrors,
  RegisterFormState,
} from "@/types/auth.types";

function toFieldErrors(
  error: ZodError<RegisterFormState>
) {
  const fieldErrors =
    error.flatten().fieldErrors;

  return {
    username:
      fieldErrors.username?.[0],

    password:
      fieldErrors.password?.[0],

    role: fieldErrors.role?.[0],
  } satisfies AuthFieldErrors;
}

export function AdminCreateUserPanel() {
  /* -------------------------------------------------------------------------- */
  /*                                   State                                    */
  /* -------------------------------------------------------------------------- */

  const [formState, setFormState] =
    useState<RegisterFormState>({
      username: "",
      password: "",
      role: "viewer",
    });

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState<AuthFieldErrors>(
    {}
  );

  const [message, setMessage] =
    useState<string | null>(null);

  const [
    messageType,
    setMessageType,
  ] = useState<
    "success" | "error"
  >("error");

  /* -------------------------------------------------------------------------- */
  /*                                 Mutation                                   */
  /* -------------------------------------------------------------------------- */

  const registerMutation =
    useRegister({
      onSuccess: () => {
        setMessage(
          "User created successfully."
        );

        setMessageType("success");

        setFormState({
          username: "",
          password: "",
          role: "viewer",
        });

        setFieldErrors({});
      },

      onError: (error) => {
        setMessage(
          error instanceof ApiError
            ? error.message
            : "Unable to create user."
        );

        setMessageType("error");
      },
    });

  /* -------------------------------------------------------------------------- */
  /*                                  Actions                                   */
  /* -------------------------------------------------------------------------- */

  function submitRegistration() {
    const parsed =
      registerSchema.safeParse(
        formState
      );

    if (!parsed.success) {
      setFieldErrors(
        toFieldErrors(
          parsed.error
        )
      );

      setMessage(
        "Please correct the highlighted fields."
      );

      setMessageType("error");

      return;
    }

    setFieldErrors({});

    registerMutation.mutate(
      parsed.data
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Panel className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

      <PanelHeader
        eyebrow="Admin"
        title="Create platform users"
        description="Provision new users through the authenticated registration pipeline with role-based access control and validation safeguards."
      />

      <div className="flex flex-col gap-8 p-6">

        {/* Top Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <OverviewCard
            title="Access Control"
            subtitle="Role protected"
            value="Secure"
            icon={
              <ShieldCheck size={18} />
            }
            accent="amber"
          />

          <OverviewCard
            title="Provisioning"
            subtitle="Registration pipeline"
            value="Active"
            icon={
              <UserPlus2 size={18} />
            }
            accent="blue"
          />

          <OverviewCard
            title="User Roles"
            subtitle="Permission mapping"
            value={
              formState.role
            }
            icon={
              <Users size={18} />
            }
            accent="emerald"
          />

        </div>

        {/* Message */}
        {message ? (
          <div
            className={`
              flex items-start gap-4 rounded-3xl border px-5 py-4 shadow-sm
              ${
                messageType ===
                "success"
                  ? `
                    border-emerald-200 bg-emerald-50 text-emerald-700
                  `
                  : `
                    border-rose-200 bg-rose-50 text-rose-700
                  `
              }
            `}
          >

            <div
              className={`
                flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm
              `}
            >
              {messageType ===
              "success" ? (
                <CheckCircle2
                  size={20}
                />
              ) : (
                <AlertTriangle
                  size={20}
                />
              )}
            </div>

            <div className="flex-1">

              <h3 className="text-sm font-semibold">
                {messageType ===
                "success"
                  ? "User created"
                  : "Registration issue"}
              </h3>

              <p className="mt-1 text-sm leading-relaxed opacity-90">
                {message}
              </p>

            </div>

          </div>
        ) : null}

        {/* Registration Workspace */}
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50/40 to-amber-50/20 shadow-sm">

          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_28%)]" />

          <div className="relative p-6">

            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm">
                  
                  <ShieldCheck
                    size={14}
                  />

                  Secure Provisioning

                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  User Registration Workspace
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                  Create and onboard platform
                  users with validated role
                  assignments and authenticated
                  backend integration.
                </p>

              </div>

              {/* Loading */}
              <div className="flex items-center gap-3">

                {registerMutation.isPending ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                    
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />

                    Creating user...

                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                    
                    <CheckCircle2
                      size={15}
                    />

                    System Ready

                  </div>
                )}

              </div>

            </div>

            {/* Form */}
            <RegisterForm
              username={
                formState.username
              }
              password={
                formState.password
              }
              role={formState.role}
              setUsername={(
                value
              ) =>
                setFormState(
                  (
                    current
                  ) => ({
                    ...current,
                    username:
                      value,
                  })
                )
              }
              setPassword={(
                value
              ) =>
                setFormState(
                  (
                    current
                  ) => ({
                    ...current,
                    password:
                      value,
                  })
                )
              }
              setRole={(value) =>
                setFormState(
                  (
                    current
                  ) => ({
                    ...current,
                    role:
                      value,
                  })
                )
              }
              onSubmit={
                submitRegistration
              }
              loading={
                registerMutation.isPending
              }
              errors={fieldErrors}
            />

          </div>

        </div>

      </div>

    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

function OverviewCard({
  title,
  subtitle,
  value,
  icon,
  accent,
}: {
  title: string;
  subtitle: string;
  value: string;
  icon: React.ReactNode;
  accent:
    | "amber"
    | "blue"
    | "emerald";
}) {
  const accentStyles = {
    amber:
      "border-amber-100 bg-amber-50/70 text-amber-700",

    blue:
      "border-blue-100 bg-blue-50/70 text-blue-700",

    emerald:
      "border-emerald-100 bg-emerald-50/70 text-emerald-700",
  };

  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm backdrop-blur-sm ${accentStyles[accent]}`}
    >

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
          {icon}
        </div>

      </div>

    </div>
  );
}