import {
  Activity,
  ArrowUpRight,
  Clock3,
  Globe,
  Server,
  Sparkles,
} from "lucide-react";

import { EmptyState } from "@/components/EmptyState";

import {
  Panel,
  PanelHeader,
} from "@/components/Panel";

import { formatNumber } from "@/lib/format";

import type { MetricsSnapshot } from "@/lib/types";

type Props = {
  metrics?: MetricsSnapshot;
};

export function MetricsTable({
  metrics,
}: Props) {
  const rows = Object.entries(
    metrics?.http_requests || {}
  ).slice(0, 10);

  const totalRequests =
    rows.reduce(
      (
        total,
        [, value]
      ) => total + value.count,
      0
    );

  const averageLatency =
    rows.length > 0
      ? Math.round(
          rows.reduce(
            (
              total,
              [, value]
            ) =>
              total +
              value.avg_ms,
            0
          ) / rows.length
        )
      : 0;

  return (
    <Panel className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

      <PanelHeader
        eyebrow="Metrics"
        title="Prometheus-aligned request snapshot"
        description="Administrative HTTP telemetry sourced directly from the metrics aggregation endpoint."
      />

      <div className="flex flex-col gap-8 p-6">

        {/* Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <OverviewCard
            title="Tracked Routes"
            value={String(
              rows.length
            )}
            subtitle="Visible endpoints"
            icon={
              <Globe size={18} />
            }
            accent="amber"
          />

          <OverviewCard
            title="Requests"
            value={formatNumber(
              totalRequests
            )}
            subtitle="Aggregated traffic"
            icon={
              <Activity size={18} />
            }
            accent="blue"
          />

          <OverviewCard
            title="Average Latency"
            value={`${averageLatency}ms`}
            subtitle="Mean response time"
            icon={
              <Clock3 size={18} />
            }
            accent="emerald"
          />

          <OverviewCard
            title="Monitoring"
            value="Live"
            subtitle="Prometheus aligned"
            icon={
              <Sparkles size={18} />
            }
            accent="violet"
          />

        </div>

        {/* Table */}
        {metrics ? (
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h3 className="text-lg font-semibold text-slate-900">
                  HTTP Request Metrics
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Endpoint request volume and
                  average response latency.
                </p>

              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
                
                <Activity size={14} />

                Live Snapshot

              </div>

            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">

              <table className="min-w-full border-collapse">

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Route
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Requests
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Avg Latency
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {rows.map(
                    ([key, value]) => (
                      <tr
                        key={key}
                        className="group border-b border-slate-100 transition-colors duration-200 hover:bg-slate-50/70"
                      >

                        {/* Route */}
                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                              <Server
                                size={18}
                              />
                            </div>

                            <div>

                              <p className="font-mono text-sm font-semibold text-slate-900">
                                {key}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                HTTP endpoint
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Count */}
                        <td className="px-6 py-5">

                          <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                            {formatNumber(
                              value.count
                            )}
                          </div>

                        </td>

                        {/* Avg ms */}
                        <td className="px-6 py-5">

                          <div className="flex flex-col">

                            <span className="text-sm font-semibold text-slate-900">
                              {value.avg_ms}
                              ms
                            </span>

                            <span className="mt-1 text-xs text-slate-500">
                              Average response
                            </span>

                          </div>

                        </td>

                        {/* Status */}
                        <td className="px-6 py-5 text-right">

                          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            
                            <ArrowUpRight
                              size={13}
                            />

                            Active

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* Mobile Cards */}
            <div className="flex flex-col gap-4 p-5 lg:hidden">

              {rows.map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0 flex-1">

                        <div className="mb-3 flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                            <Server
                              size={16}
                            />
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate font-mono text-sm font-semibold text-slate-900">
                              {key}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              Endpoint route
                            </p>

                          </div>

                        </div>

                        <div className="grid grid-cols-2 gap-4">

                          <div>

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Requests
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-900">
                              {formatNumber(
                                value.count
                              )}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Avg Latency
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-900">
                              {
                                value.avg_ms
                              }
                              ms
                            </p>

                          </div>

                        </div>

                      </div>

                      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        
                        <Activity
                          size={13}
                        />

                        Active

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-slate-50/70 p-10">

            <EmptyState
              title="Metrics not loaded"
              description="Once the metrics endpoint becomes reachable, request telemetry, counters, and latency diagnostics will appear here."
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
    | "blue"
    | "emerald"
    | "violet";
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