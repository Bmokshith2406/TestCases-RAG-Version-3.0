import {
  Activity,
  Boxes,
  Database,
  Layers3,
  ServerCog,
  Sparkles,
  Waypoints,
} from "lucide-react";

import {
  Panel,
  PanelHeader,
} from "@/components/Panel";

import {
  formatNumber,
  formatPercent,
} from "@/lib/format";

import type { StatsResponse } from "@/lib/types";

type Props = {
  stats?: StatsResponse;
};

export function StatsSummaryPanel({
  stats,
}: Props) {
  const statItems = [
    {
      label: "Total Testcases",
      value: formatNumber(
        stats?.total_test_cases
      ),
      icon: (
        <Layers3 size={18} />
      ),
      accent: "amber",
      description:
        "Semantic repository assets",
    },

    {
      label: "Total Scripts",
      value: formatNumber(
        stats?.total_scripts
      ),
      icon: (
        <Database size={18} />
      ),
      accent: "blue",
      description:
        "Linked automation scripts",
    },

    {
      label: "Cache Hit Rate",
      value: formatPercent(
        stats?.cache?.hit_rate
      ),
      icon: (
        <Waypoints size={18} />
      ),
      accent: "emerald",
      description:
        "Search cache efficiency",
    },

    {
      label: "Ingestion Workers",
      value: formatNumber(
        stats?.ingestion
          ?.worker_count
      ),
      icon: (
        <ServerCog size={18} />
      ),
      accent: "violet",
      description:
        "Background processing workers",
    },

    {
      label: "Active Workers",
      value: formatNumber(
        stats?.ingestion
          ?.active_workers
      ),
      icon: (
        <Activity size={18} />
      ),
      accent: "rose",
      description:
        "Currently processing tasks",
    },

    {
      label: "Queue Max Size",
      value: formatNumber(
        stats?.ingestion
          ?.queue_max_size
      ),
      icon: (
        <Boxes size={18} />
      ),
      accent: "cyan",
      description:
        "Pipeline queue capacity",
    },
  ] as const;

  return (
    <Panel className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

      <PanelHeader
        eyebrow="Platform Stats"
        title="Traffic, cache, and ingestion summary"
        description="Operational statistics and ingestion telemetry sourced directly from the protected platform stats endpoint."
      />

      <div className="flex flex-col gap-8 p-6">

        {/* Top Overview */}
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50/60 to-amber-50/30 p-6 shadow-sm">

          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_28%)]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <h3 className="text-2xl font-bold text-slate-900">
                System Operational Snapshot
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Monitor semantic repository growth,
                cache efficiency, ingestion workers,
                and queue processing health across
                the platform infrastructure.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                label="Assets"
                value={formatNumber(
                  stats?.total_test_cases
                )}
              />

              <MiniStat
                label="Scripts"
                value={formatNumber(
                  stats?.total_scripts
                )}
              />

            </div>

          </div>

        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {statItems.map(
            (
              {
                label,
                value,
                icon,
                accent,
                description,
              },
              index
            ) => (
              <StatCard
                key={`${label}-${index}`}
                label={label}
                value={value}
                icon={icon}
                accent={accent}
                description={
                  description
                }
              />
            )
          )}

        </div>

      </div>

    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  icon,
  accent,
  description,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent:
    | "amber"
    | "blue"
    | "emerald"
    | "violet"
    | "rose"
    | "cyan";
  description: string;
}) {
  const accentStyles = {
    amber:
      "border-amber-100 bg-amber-50/70 text-amber-700",

    blue:
      "border-blue-100 bg-blue-50/70 text-blue-700",

    emerald:
      "border-emerald-100 bg-emerald-50/70 text-emerald-700",

    violet:
      "border-violet-100 bg-violet-50/70 text-violet-700",

    rose:
      "border-rose-100 bg-rose-50/70 text-rose-700",

    cyan:
      "border-cyan-100 bg-cyan-50/70 text-cyan-700",
  };

  return (
    <div
      className={`
        group relative overflow-hidden rounded-[28px]
        border p-5 shadow-sm transition-all duration-200
        hover:-translate-y-1 hover:shadow-lg
        ${accentStyles[accent]}
      `}
    >

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_35%)]" />

      <div className="relative flex h-full flex-col gap-5">

        {/* Top */}
        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
              {label}
            </p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {value}
            </h3>

          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
            {icon}
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-white/40 pt-4">

          <p className="text-sm leading-relaxed text-slate-600">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-xl">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <h3 className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </h3>

    </div>
  );
}