import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Database,
  Layers3,
  ServerCrash,
  Sparkles,
} from "lucide-react";

import { Panel, PanelHeader } from "@/components/Panel";

import type { HealthDeepResponse } from "@/lib/types";

type Props = {
  health?: HealthDeepResponse;
};

export function HealthGrid({
  health,
}: Props) {
  const components =
    Object.entries(
      health?.components || {}
    );

  return (
    <Panel className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

      <PanelHeader
        eyebrow="Health"
        title="Component diagnostics"
        description="Real-time infrastructure diagnostics sourced directly from the backend deep health endpoint."
      />

      <div className="flex flex-col gap-8 p-6">

        {/* Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <OverviewCard
            title="Components"
            value={String(
              components.length
            )}
            subtitle="Tracked services"
            icon={
              <Layers3 size={18} />
            }
            accent="amber"
          />

          <OverviewCard
            title="Healthy"
            value={String(
              components.filter(
                ([, component]) =>
                  component.status ===
                  "healthy"
              ).length
            )}
            subtitle="Operational"
            icon={
              <CheckCircle2
                size={18}
              />
            }
            accent="emerald"
          />

          <OverviewCard
            title="Degraded"
            value={String(
              components.filter(
                ([, component]) =>
                  component.status !==
                  "healthy"
              ).length
            )}
            subtitle="Attention required"
            icon={
              <AlertTriangle
                size={18}
              />
            }
            accent="rose"
          />

          <OverviewCard
            title="Monitoring"
            value="Live"
            subtitle="Realtime diagnostics"
            icon={
              <Activity size={18} />
            }
            accent="blue"
          />

        </div>

        {/* Components */}
        {components.length ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {components.map(
              ([key, component]) => {
                const healthy =
                  component.status ===
                  "healthy";

                const title =
                  key.replace(
                    /_/g,
                    " "
                  );

                const descriptions: Record<
                  string,
                  string
                > = {
                  database:
                    "Vector database connectivity and semantic storage health.",

                  embedding_model:
                    "Embedding generation pipeline and vector dimension availability.",

                  llm:
                    "Large language model provider connectivity and inference health.",

                  cache:
                    "Cache synchronization and retrieval performance monitoring.",

                  configuration:
                    "Environment configuration and runtime validation checks.",

                  ingestion:
                    "Document ingestion workers and queue processing health.",
                };

                const description =
                  component.error ||
                  descriptions[key] ||
                  "Operational infrastructure component.";

                return (
                  <article
                    key={key}
                    className={`
                      group relative overflow-hidden rounded-[28px]
                      border p-5 transition-all duration-200
                      hover:-translate-y-1 hover:shadow-lg
                      ${
                        healthy
                          ? `
                            border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50
                          `
                          : `
                            border-rose-100 bg-gradient-to-br from-white to-rose-50/50
                          `
                      }
                    `}
                  >

                    {/* Glow */}
                    <div
                      className={`
                        pointer-events-none absolute inset-0 opacity-70
                        ${
                          healthy
                            ? `
                              bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_30%)]
                            `
                            : `
                              bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.08),transparent_30%)]
                            `
                        }
                      `}
                    />

                    <div className="relative flex h-full flex-col gap-5">

                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">

                        <div className="flex items-start gap-4">

                          <div
                            className={`
                              flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm
                              ${
                                healthy
                                  ? `
                                    bg-emerald-100 text-emerald-700
                                  `
                                  : `
                                    bg-rose-100 text-rose-700
                                  `
                              }
                            `}
                          >
                            {resolveIcon(
                              key,
                              healthy
                            )}
                          </div>

                          <div>

                            <p
                              className={`
                                text-xs font-semibold uppercase tracking-[0.18em]
                                ${
                                  healthy
                                    ? "text-emerald-700/80"
                                    : "text-rose-700/80"
                                }
                              `}
                            >
                              {healthy ? "Operational" : "Degraded"}
                            </p>

                            <h3 className="mt-1 text-lg font-semibold capitalize text-slate-900">
                              {title}
                            </h3>

                          </div>

                        </div>

                        {/* Status */}
                        <div
                          className={`
                            inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm
                            ${
                              healthy
                                ? `
                                  border border-emerald-200 bg-emerald-50 text-emerald-700
                                `
                                : `
                                  border border-rose-200 bg-rose-50 text-rose-700
                                `
                            }
                          `}
                        >
                          <span
                            className={`
                              h-2 w-2 rounded-full
                              ${
                                healthy
                                  ? "bg-emerald-500"
                                  : "bg-rose-500"
                              }
                            `}
                          />

                          {
                            component.status
                          }

                        </div>

                      </div>

                      {/* Body */}
                      <div className="flex-1">

                        <p className="text-sm leading-relaxed text-slate-600">
                          {description}
                        </p>

                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4">

                        <div className="text-xs font-medium text-slate-500">
                          {healthy
                          ? "Realtime monitoring active"
                          : "Diagnostic intervention required"}
                        </div>

                        <div
                          className={`
                            inline-flex items-center gap-2 text-xs font-semibold
                            ${
                              healthy
                                ? "text-emerald-700"
                                : "text-rose-700"
                            }
                          `}
                        >
                          {healthy ? (
                            <>
                              <CheckCircle2
                                size={14}
                              />

                              Operational
                            </>
                          ) : (
                            <>
                              <AlertTriangle
                                size={14}
                              />

                              Requires Attention
                            </>
                          )}
                        </div>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-20 text-center">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
              <ServerCrash
                size={28}
                className="text-slate-400"
              />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              No diagnostics available
            </h3>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-500">
              The backend has not yet reported
              component health diagnostics through
              the deep health endpoint.
            </p>

          </div>
        )}

      </div>

    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

function OverviewCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accent:
    | "amber"
    | "emerald"
    | "rose"
    | "blue";
}) {
  const accentStyles = {
    amber:
      "border-amber-100 bg-amber-50/70 text-amber-700",

    emerald:
      "border-emerald-100 bg-emerald-50/70 text-emerald-700",

    rose:
      "border-rose-100 bg-rose-50/70 text-rose-700",

    blue:
      "border-blue-100 bg-blue-50/70 text-blue-700",
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

function resolveIcon(
  key: string,
  healthy: boolean
) {
  const iconClass = healthy
    ? "text-emerald-700"
    : "text-rose-700";

  if (
    key.includes("embedding")
  ) {
    return (
      <Layers3
        size={20}
        className={iconClass}
      />
    );
  }

  if (key.includes("llm")) {
    return (
      <Sparkles
        size={20}
        className={iconClass}
      />
    );
  }

  if (
    key.includes("database")
  ) {
    return (
      <Database
        size={20}
        className={iconClass}
      />
    );
  }

  return (
    <Cpu
      size={20}
      className={iconClass}
    />
  );
}