import {
  AlertTriangle,
  CheckCircle2,
  DatabaseZap,
  Loader2,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import {
  Panel,
  PanelHeader,
} from "@/components/Panel";

type Props = {
  confirmation: string;
  isDeleting: boolean;
  message?: string | null;
  error?: string | null;
  onConfirmationChange: (
    value: string
  ) => void;
  onDelete: () => void;
};

export function DangerZonePanel({
  confirmation,
  isDeleting,
  message,
  error,
  onConfirmationChange,
  onDelete,
}: Props) {
  const isConfirmed =
    confirmation ===
    "DELETE ALL";

  return (
    <Panel className="overflow-hidden rounded-3xl border border-rose-200/60 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

      <PanelHeader
        eyebrow="Danger Zone"
        title="Destructive admin controls"
        description="Perform irreversible administrative operations that permanently remove testcase repositories and linked automation assets."
      />

      <div className="flex flex-col gap-8 p-6">

        {/* Warning Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <DangerCard
            title="Operation Type"
            value="Permanent"
            subtitle="No rollback support"
            icon={
              <Trash2 size={18} />
            }
          />

          <DangerCard
            title="Data Scope"
            value="Global"
            subtitle="All collections affected"
            icon={
              <DatabaseZap
                size={18}
              />
            }
          />

          <DangerCard
            title="Confirmation"
            value={
              isConfirmed
                ? "Verified"
                : "Pending"
            }
            subtitle="Manual validation required"
            icon={
              <ShieldAlert
                size={18}
              />
            }
          />

        </div>

        {/* Main Danger Workspace */}
        <div className="relative overflow-hidden rounded-[32px] border border-rose-200 bg-gradient-to-br from-white via-rose-50/40 to-red-50/20 shadow-sm">

          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.08),transparent_30%)]" />

          <div className="relative flex flex-col gap-8 p-6">

            {/* Warning Header */}
            <div className="flex flex-col gap-5 border-b border-rose-100 pb-6 lg:flex-row lg:items-start lg:justify-between">

              <div className="max-w-3xl">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                  
                  <AlertTriangle
                    size={14}
                  />

                  Critical Operation

                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Permanent Repository Wipe
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  This action permanently deletes
                  all testcase collections, linked
                  scripts, semantic metadata, and
                  repository relationships across
                  the platform backend.
                </p>

              </div>

              <div
                className={`
                  inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm
                  ${
                    isConfirmed
                      ? `
                        border border-emerald-200 bg-emerald-50 text-emerald-700
                      `
                      : `
                        border border-amber-200 bg-amber-50 text-amber-700
                      `
                  }
                `}
              >
                {isConfirmed ? (
                  <>
                    <CheckCircle2
                      size={15}
                    />

                    Confirmation Valid
                  </>
                ) : (
                  <>
                    <ShieldAlert
                      size={15}
                    />

                    Awaiting Confirmation
                  </>
                )}
              </div>

            </div>

            {/* Confirmation Input */}
            <div className="flex flex-col gap-4">

              <div>

                <label className="text-sm font-semibold text-slate-700">
                  Confirmation Phrase
                </label>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Type{" "}
                  <span className="rounded bg-rose-100 px-1.5 py-0.5 font-semibold text-rose-700">
                    DELETE ALL
                  </span>{" "}
                  exactly to unlock the destructive
                  operation.
                </p>

              </div>

              <input
                value={confirmation}
                onChange={(event) =>
                  onConfirmationChange(
                    event.target.value
                  )
                }
                placeholder="DELETE ALL"
                className={`
                  h-14 rounded-2xl border bg-white/90 px-5 text-sm font-medium
                  outline-none transition-all duration-200
                  placeholder:text-slate-400
                  ${
                    isConfirmed
                      ? `
                        border-emerald-300
                        focus:border-emerald-400
                        focus:ring-4 focus:ring-emerald-100
                      `
                      : `
                        border-rose-200
                        focus:border-rose-400
                        focus:ring-4 focus:ring-rose-100
                      `
                  }
                `}
              />

            </div>

            {/* Messages */}
            <div className="space-y-3">

              {error ? (
                <div className="flex items-start gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 shadow-sm">

                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <AlertTriangle
                      size={18}
                    />
                  </div>

                  <div>

                    <h4 className="text-sm font-semibold">
                      Deletion failed
                    </h4>

                    <p className="mt-1 text-sm leading-relaxed opacity-90">
                      {error}
                    </p>

                  </div>

                </div>
              ) : null}

              {message ? (
                <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 shadow-sm">

                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <CheckCircle2
                      size={18}
                    />
                  </div>

                  <div>

                    <h4 className="text-sm font-semibold">
                      Operation completed
                    </h4>

                    <p className="mt-1 text-sm leading-relaxed opacity-90">
                      {message}
                    </p>

                  </div>

                </div>
              ) : null}

            </div>

            {/* Action Footer */}
            <div className="flex flex-col gap-5 border-t border-rose-100 pt-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl text-xs leading-relaxed text-slate-500">
                This action cannot be undone. Ensure
                backups, exports, and audit
                validations are completed before
                proceeding with permanent deletion.
              </div>

              <button
                type="button"
                disabled={
                  !isConfirmed ||
                  isDeleting
                }
                onClick={onDelete}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-2xl bg-rose-600 px-6 py-3
                  text-sm font-semibold text-white
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-lg
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isDeleting ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Deleting...
                  </>
                ) : (
                  <>
                    <AlertTriangle
                      size={16}
                    />

                    Delete all data
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </div>

    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

function DangerCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-rose-100 bg-rose-50/70 p-5 shadow-sm backdrop-blur-sm">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wide text-rose-700/80">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-rose-700 shadow-sm">
          {icon}
        </div>

      </div>

    </div>
  );
}