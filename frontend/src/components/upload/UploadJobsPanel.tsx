import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  DatabaseZap,
  Loader2,
  ShieldAlert,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { EmptyState } from "@/components/EmptyState";

import {
  Panel,
  PanelHeader,
} from "@/components/Panel";

import {
  formatDate,
} from "@/lib/format";

import type {
  UploadJob,
} from "@/lib/types";

type Props = {
  jobs: UploadJob[];
};

export function UploadJobsPanel({
  jobs,
}: Props) {
  const completedJobs =
    jobs.filter(
      (job) =>
        job.status ===
        "completed"
    ).length;

  const processingJobs =
    jobs.filter(
      (job) =>
        job.status ===
          "processing" ||
        job.status ===
          "queued"
    ).length;

  const failedJobs =
    jobs.filter(
      (job) =>
        job.status ===
          "failed" ||
        job.error
    ).length;

  return (
    <Panel className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

      <PanelHeader
        eyebrow="Jobs"
        title="Background upload queue"
        description="Realtime visibility into Database-backed ingestion jobs, execution progress, and semantic processing states."
      />

      <div className="flex flex-col gap-8 p-6">

        {/* Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <OverviewCard
            title="Total Jobs"
            value={String(
              jobs.length
            )}
            subtitle="Tracked uploads"
            icon={
              <UploadCloud
                size={18}
              />
            }
            accent="amber"
          />

          <OverviewCard
            title="Completed"
            value={String(
              completedJobs
            )}
            subtitle="Successfully processed"
            icon={
              <CheckCircle2
                size={18}
              />
            }
            accent="emerald"
          />

          <OverviewCard
            title="Active"
            value={String(
              processingJobs
            )}
            subtitle="Currently processing"
            icon={
              <Loader2
                size={18}
                className="animate-spin"
              />
            }
            accent="blue"
          />

          <OverviewCard
            title="Failed"
            value={String(
              failedJobs
            )}
            subtitle="Attention required"
            icon={
              <AlertTriangle
                size={18}
              />
            }
            accent="rose"
          />

        </div>

        {/* Job List */}
        {jobs.length ? (
          <div className="flex flex-col gap-5">

            {jobs.map((job) => {
              const completed =
                job.status ===
                "completed";

              const processing =
                job.status ===
                  "processing" ||
                job.status ===
                  "queued";

              const failed =
                job.status ===
                  "failed" ||
                Boolean(
                  job.error
                );

              return (
                <article
                  key={job.id}
                  className={`
                    group relative overflow-hidden rounded-[32px]
                    border p-6 shadow-sm transition-all duration-200
                    hover:-translate-y-1 hover:shadow-lg
                    ${
                      completed
                        ? `
                          border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40
                        `
                        : processing
                        ? `
                          border-blue-100 bg-gradient-to-br from-white to-blue-50/40
                        `
                        : `
                          border-rose-100 bg-gradient-to-br from-white to-rose-50/40
                        `
                    }
                  `}
                >

                  {/* Glow */}
                  <div
                    className={`
                      pointer-events-none absolute inset-0 opacity-70
                      ${
                        completed
                          ? `
                            bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_30%)]
                          `
                          : processing
                          ? `
                            bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_30%)]
                          `
                          : `
                            bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.08),transparent_30%)]
                          `
                      }
                    `}
                  />

                  <div className="relative flex flex-col gap-6">

                    {/* Top */}
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      <div className="flex items-start gap-4">

                        <div
                          className={`
                            flex h-14 w-14 items-center justify-center rounded-3xl shadow-sm
                            ${
                              completed
                                ? `
                                  bg-emerald-100 text-emerald-700
                                `
                                : processing
                                ? `
                                  bg-blue-100 text-blue-700
                                `
                                : `
                                  bg-rose-100 text-rose-700
                                `
                            }
                          `}
                        >
                          {resolveStatusIcon(
                            completed,
                            processing
                          )}
                        </div>

                        <div className="min-w-0">

                          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm">
                            
                            <DatabaseZap
                              size={12}
                            />

                            Ingestion Job

                          </div>

                          <h3 className="truncate text-xl font-bold text-slate-900">
                            {job.filename}
                          </h3>

                          <p className="mt-2 font-mono text-xs text-slate-500">
                            {job.id}
                          </p>

                        </div>

                      </div>

                      {/* Status */}
                      <div
                        className={`
                          inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-xs font-semibold shadow-sm
                          ${
                            completed
                              ? `
                                border border-emerald-200 bg-emerald-50 text-emerald-700
                              `
                              : processing
                              ? `
                                border border-blue-200 bg-blue-50 text-blue-700
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
                              completed
                                ? "bg-emerald-500"
                                : processing
                                ? "bg-blue-500"
                                : "bg-rose-500"
                            }
                          `}
                        />

                        {job.status}

                      </div>

                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                      <MetaCard
                        label="Created"
                        value={formatDate(
                          job.created_at
                        )}
                        icon={
                          <Clock3
                            size={15}
                          />
                        }
                      />

                      <MetaCard
                        label="Updated"
                        value={formatDate(
                          job.updated_at
                        )}
                        icon={
                          <Activity
                            size={15}
                          />
                        }
                      />

                      <MetaCard
                        label="Requester"
                        value={
                          job
                            .requested_by
                            ?.username ||
                          "Unknown"
                        }
                        icon={
                          <Sparkles
                            size={15}
                          />
                        }
                      />

                    </div>

                    {/* Result Metrics */}
                    {job.result ? (
                      <div className="flex flex-wrap items-center gap-3">

                        <MetricPill
                          label={`Cases ${job.result.testcases_inserted}`}
                        />

                        <MetricPill
                          label={`Scripts ${job.result.scripts_inserted}`}
                        />

                        <MetricPill
                          label={`Skipped ${job.result.duplicates_skipped}`}
                        />

                      </div>
                    ) : null}

                    {/* Error */}
                    {job.error ? (
                      <div className="flex items-start gap-4 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 shadow-sm">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                          <ShieldAlert
                            size={18}
                          />
                        </div>

                        <div>

                          <h4 className="text-sm font-semibold">
                            Processing error
                          </h4>

                          <p className="mt-1 text-sm leading-relaxed opacity-90">
                            {job.error}
                          </p>

                        </div>

                      </div>
                    ) : null}

                  </div>

                </article>
              );
            })}

          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-slate-50/70 p-10">

            <EmptyState
              title="No jobs yet"
              description="Queue a background upload and it will appear here with live ingestion progress, execution state transitions, and semantic processing results."
            />

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
    | "blue"
    | "rose";
}) {
  const accentStyles = {
    amber:
      "border-amber-100 bg-amber-50/70 text-amber-700",

    emerald:
      "border-emerald-100 bg-emerald-50/70 text-emerald-700",

    blue:
      "border-blue-100 bg-blue-50/70 text-blue-700",

    rose:
      "border-rose-100 bg-rose-50/70 text-rose-700",
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

function MetaCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">

      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function MetricPill({
  label,
}: {
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
      
      <Sparkles size={13} />

      {label}

    </div>
  );
}

function resolveStatusIcon(
  completed: boolean,
  processing: boolean
) {
  if (completed) {
    return (
      <CheckCircle2
        size={24}
      />
    );
  }

  if (processing) {
    return (
      <Loader2
        size={24}
        className="animate-spin"
      />
    );
  }

  return (
    <AlertTriangle
      size={24}
    />
  );
}