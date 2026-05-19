import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Activity,
  BrainCircuit,
  Gauge,
  HardDriveDownload,
  Loader2,
  ServerCrash,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useState } from "react";

import { EmptyState } from "@/components/EmptyState";

import { AdminCreateUserPanel } from "@/components/operations/AdminCreateUserPanel";
import { DangerZonePanel } from "@/components/operations/DangerZonePanel";
import { HealthGrid } from "@/components/operations/HealthGrid";
import { MetricsTable } from "@/components/operations/MetricsTable";
import { StatsSummaryPanel } from "@/components/operations/StatsSummaryPanel";

import {
  api,
  ApiError,
} from "@/lib/api";

import { isAdmin } from "@/lib/access";

import { useAuth } from "@/lib/auth";

import {
  formatNumber,
  formatPercent,
} from "@/lib/format";

export function OperationsPage() {
  /* -------------------------------------------------------------------------- */
  /*                                   State                                    */
  /* -------------------------------------------------------------------------- */

  const queryClient =
    useQueryClient();

  const { role } =
    useAuth();

  const [
    confirmation,
    setConfirmation,
  ] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                                   Queries                                  */
  /* -------------------------------------------------------------------------- */

  const healthQuery = useQuery({
    queryKey: [
      "health",
      "deep",
    ],

    queryFn:
      api.getHealthDeep,

    refetchInterval:
      30_000,

    staleTime: 15_000,
  });

  const statsQuery = useQuery({
    queryKey: ["stats"],

    queryFn:
      api.getStats,

    refetchInterval:
      20_000,

    staleTime: 15_000,
  });

  const metricsQuery =
    useQuery({
      queryKey: [
        "metrics",
        "json",
      ],

      queryFn:
        api.getMetricsJson,

      enabled: isAdmin(
        role
      ),

      refetchInterval:
        20_000,

      staleTime: 15_000,
    });

  /* -------------------------------------------------------------------------- */
  /*                                  Mutation                                  */
  /* -------------------------------------------------------------------------- */

  const deleteAllMutation =
    useMutation({
      mutationFn:
        api.deleteAllData,

      onSuccess:
        async () => {
          await Promise.all([
            queryClient.invalidateQueries(
              {
                queryKey: [
                  "stats",
                ],
              }
            ),

            queryClient.invalidateQueries(
              {
                queryKey: [
                  "cases",
                ],
              }
            ),

            queryClient.invalidateQueries(
              {
                queryKey: [
                  "scripts",
                ],
              }
            ),
          ]);

          setConfirmation(
            ""
          );
        },
    });

  /* -------------------------------------------------------------------------- */
  /*                              Derived Values                                */
  /* -------------------------------------------------------------------------- */

  const systemStatus =
    healthQuery.data
      ?.status ||
    "Loading";

  const queueSize =
    formatNumber(
      statsQuery.data
        ?.ingestion
        ?.queue_size
    );

  const errorRate =
    formatPercent(
      healthQuery.data
        ?.metrics
        ?.error_rate
    );

  const adminMode =
    isAdmin(role);

  const isLoading =
    healthQuery.isLoading ||
    statsQuery.isLoading;

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-8 p-6">

      {/* Top Grid */}
      <section className="grid grid-cols-1 gap-8">

        <HealthGrid
          health={
            healthQuery.data
          }
        />

        <StatsSummaryPanel
          stats={
            statsQuery.data
          }
        />

      </section>

      {/* Admin Sections */}
      {adminMode ? (
        <>

          {/* Metrics + User Creation */}
          <section className="flex flex-col gap-8">

            <MetricsTable
              metrics={
                metricsQuery.data
              }
            />

            <AdminCreateUserPanel />

          </section>

          {/* Danger Zone */}
          <section className="flex flex-col gap-8">

            <DangerZonePanel
              confirmation={
                confirmation
              }
              isDeleting={
                deleteAllMutation.isPending
              }
              message={
                deleteAllMutation.data
                  ? `Deleted ${
                      deleteAllMutation
                        .data
                        .testcases_deleted
                    } testcases and ${
                      deleteAllMutation
                        .data
                        .scripts_deleted
                    } scripts.`
                  : null
              }
              error={
                deleteAllMutation.error instanceof
                ApiError
                  ? deleteAllMutation
                      .error
                      .message
                  : null
              }
              onConfirmationChange={
                setConfirmation
              }
              onDelete={() =>
                deleteAllMutation.mutate()
              }
            />

            {/* Admin Insights */}
            <div className="overflow-hidden rounded-[36px] border border-white/60 bg-white/75 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">

              <div className="flex h-full flex-col gap-8 p-8">

                {/* Header */}
                <div>

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                    
                    <ShieldCheck
                      size={14}
                    />

                    Admin Privileges

                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Administrative Workspace
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    You currently have access
                    to infrastructure metrics,
                    destructive operations,
                    user provisioning, and
                    protected backend telemetry.
                  </p>

                </div>

                {/* Capability List */}
                <div className="flex flex-col gap-4">

                  <CapabilityItem
                    title="Deep Infrastructure Metrics"
                    description="Realtime Prometheus-aligned request and latency telemetry."
                  />

                  <CapabilityItem
                    title="Role-based User Provisioning"
                    description="Create and manage secured platform accounts."
                  />

                  <CapabilityItem
                    title="Protected Destructive Controls"
                    description="Execute guarded repository deletion workflows."
                  />

                  <CapabilityItem
                    title="Operational Monitoring"
                    description="Track ingestion workers, queues, and health diagnostics."
                  />

                </div>

                {/* Footer */}
                <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50/70 p-5">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <Activity
                        size={20}
                        className="text-slate-700"
                      />
                    </div>

                    <div>

                      <h3 className="text-sm font-semibold text-slate-900">
                        Live Operations Active
                      </h3>

                      <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        Platform operational
                        monitoring and backend
                        diagnostics are actively
                        streaming updates.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>

        </>
      ) : (
        <div className="rounded-[36px] border border-white/60 bg-white/75 p-10 shadow-sm backdrop-blur-xl">

          <EmptyState
            title="Admin operations are restricted"
            description="Viewer and editor roles can inspect platform health and infrastructure summaries, while advanced telemetry, user management, and destructive operations remain protected behind administrator permissions."
          />

        </div>
      )}

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

function HeroStatCard({
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
    | "blue"
    | "rose";
}) {
  const accentStyles = {
    amber:
      "border-amber-100 bg-amber-50/70 text-amber-700",

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

          <h3 className="mt-2 text-2xl font-bold text-slate-900 capitalize">
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

function CapabilityItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">

      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        <Sparkles size={18} />
      </div>

      <div>

        <h3 className="text-sm font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}