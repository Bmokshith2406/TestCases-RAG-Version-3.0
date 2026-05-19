import {
  ArrowRight,
  Binary,
  Code2,
  Layers3,
  Search,
  Sparkles,
} from "lucide-react";

import {
  Panel,
  PanelHeader,
} from "@/components/Panel";

import { trimText } from "@/lib/format";

import type {
  ScriptListEntry,
} from "@/lib/types";

type Props = {
  records: ScriptListEntry[];
  selectedScriptId: string | null;
  filter: string;
  onFilterChange: (
    value: string
  ) => void;
  onSelect: (
    scriptId: string
  ) => void;
};

export function ScriptRecordList({
  records,
  selectedScriptId,
  filter,
  onFilterChange,
  onSelect,
}: Props) {
  return (
    <Panel className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">

      <PanelHeader
        eyebrow="Automation"
        title="Linked Playwright scripts"
        // description="Operational interface for linked Playwright automation assets and backend script retrieval endpoints."
      />

      <div className="flex flex-col gap-6 p-6">

        {/* Top Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <OverviewCard
            title="Scripts"
            value={String(
              records.length
            )}
            subtitle="Automation assets"
            icon={
              <Code2 size={18} />
            }
            accent="amber"
          />

          <OverviewCard
            title="Framework"
            value="Playwright"
            subtitle="Execution engine"
            icon={
              <Binary size={18} />
            }
            accent="blue"
          />

          <OverviewCard
            title="Repository"
            value="Linked"
            subtitle="Mapped testcases"
            icon={
              <Layers3
                size={18}
              />
            }
            accent="emerald"
          />

        </div>

        {/* Search */}
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50/60 to-amber-50/20 shadow-sm">

          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_28%)]" />

          <div className="relative p-5">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <Search size={18} />
              </div>

              <div>

                <h3 className="text-sm font-semibold text-slate-900">
                  Search Script Repository
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Filter by testcase ID,
                  feature, or semantic
                  description.
                </p>

              </div>

            </div>

            <input
              value={filter}
              onChange={(event) =>
                onFilterChange(
                  event.target.value
                )
              }
              placeholder="Filter by testcase id, feature, or description..."
              className="
                h-14 w-full rounded-2xl border border-slate-200
                bg-white/90 px-5 text-sm text-slate-800
                outline-none transition-all duration-200
                placeholder:text-slate-400
                focus:border-slate-400
                focus:ring-4 focus:ring-slate-100
              "
            />

          </div>

        </div>

        {/* Record List */}
        <div className="flex flex-col gap-4">

          {records.map(
            (record) => {
              const scriptId =
                String(
                  record.script
                    ?._id ||
                    record
                      .script
                      ?.id ||
                    ""
                );

              const active =
                selectedScriptId ===
                scriptId;

              return (
                <button
                  key={`${record.test_case_id}-${scriptId}`}
                  type="button"
                  onClick={() =>
                    onSelect(
                      scriptId
                    )
                  }
                  className={`
                    group relative overflow-hidden rounded-[30px]
                    border p-5 text-left transition-all duration-200
                    hover:-translate-y-1 hover:shadow-lg
                    ${
                      active
                        ? `
                          border-slate-900 bg-slate-900 text-white
                          shadow-2xl shadow-slate-900/10
                        `
                        : `
                          border-slate-200 bg-white/90
                          hover:border-slate-300
                        `
                    }
                  `}
                >

                  {/* Glow */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_30%)]" />

                  <div className="relative flex flex-col gap-5">

                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">

                      <div className="flex min-w-0 items-start gap-4">

                        <div
                          className={`
                            flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm
                            ${
                              active
                                ? `
                                  bg-white/10 text-white
                                `
                                : `
                                  bg-slate-100 text-slate-700
                                `
                            }
                          `}
                        >
                          <Code2
                            size={20}
                          />
                        </div>

                        <div className="min-w-0">

                          <div
                            className={`
                              text-xs font-semibold uppercase tracking-[0.18em]
                              ${
                                active
                                  ? "text-slate-300"
                                  : "text-slate-500"
                              }
                            `}
                          >
                            Testcase
                          </div>

                          <h3
                            className={`
                              mt-1 truncate text-lg font-semibold
                              ${
                                active
                                  ? "text-white"
                                  : "text-slate-900"
                              }
                            `}
                          >
                            {
                              record.test_case_id
                            }
                          </h3>

                        </div>

                      </div>

                      {/* Feature */}
                      <div
                        className={`
                          inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-sm
                          ${
                            active
                              ? `
                                border border-white/10 bg-white/10 text-white
                              `
                              : `
                                border border-amber-200 bg-amber-50 text-amber-700
                              `
                          }
                        `}
                      >
                        <Sparkles
                          size={13}
                        />

                        {record.feature ||
                          "Unknown feature"}

                      </div>

                    </div>

                    {/* Description */}
                    <p
                      className={`
                        line-clamp-3 text-sm leading-relaxed
                        ${
                          active
                            ? "text-slate-200"
                            : "text-slate-600"
                        }
                      `}
                    >
                      {trimText(
                        record.test_case_description ||
                          "No description available.",
                        140
                      )}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">

                      <div
                        className={`
                          text-xs font-medium
                          ${
                            active
                              ? "text-slate-300"
                              : "text-slate-500"
                          }
                        `}
                      >
                        Linked automation asset
                      </div>

                      <div
                        className={`
                          inline-flex items-center gap-2 text-sm font-semibold
                          ${
                            active
                              ? "text-white"
                              : "text-slate-700"
                          }
                        `}
                      >
                        Inspect script

                        <ArrowRight
                          size={15}
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </div>

                    </div>

                  </div>

                  {/* Active Indicator */}
                  {active ? (
                    <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-amber-300" />
                  ) : null}

                </button>
              );
            }
          )}

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

        <div className="min-w-0">

          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
            {title}
          </p>

          <h3 className="mt-2 truncate text-2xl font-bold text-slate-900">
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