import {
  Binary,
  Braces,
  CheckCircle2,
  Code2,
  FileCode2,
  Layers3,
  Loader2,
  Sparkles,
} from "lucide-react";

import { CodeBlock } from "@/components/CodeBlock";

import { EmptyState } from "@/components/EmptyState";

import {
  Panel,
  PanelHeader,
} from "@/components/Panel";

import type {
  ScriptListEntry,
} from "@/lib/types";

type Props = {
  selectedScriptId: string | null;
  selectedScript?: ScriptListEntry;
  scriptCode?: string;
  isLoading: boolean;
};

export function ScriptDetailPanel({
  selectedScriptId,
  selectedScript,
  scriptCode,
  isLoading,
}: Props) {
  const hasScript =
    Boolean(
      selectedScriptId
    );

  return (
    <Panel className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">

      <PanelHeader
        eyebrow="Code View"
        title={
          selectedScript
            ?.test_case_id ||
          "Select a script"
        }
        description="Formatted Playwright source generated through the backend script formatting and cleanup pipeline."
      />

      {hasScript ? (
        <div className="flex flex-col gap-8 p-6">

          {/* Top Summary */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

            <OverviewCard
              title="Framework"
              value="Playwright"
              subtitle="Automation engine"
              icon={
                <Code2 size={18} />
              }
              accent="amber"
            />

            <OverviewCard
              title="Feature"
              value={
                selectedScript
                  ?.feature ||
                "Unknown"
              }
              subtitle="Mapped capability"
              icon={
                <Layers3
                  size={18}
                />
              }
              accent="blue"
            />

            <OverviewCard
              title="Status"
              value={
                scriptCode
                  ? "Loaded"
                  : isLoading
                  ? "Loading"
                  : "Unavailable"
              }
              subtitle="Formatting output"
              icon={
                isLoading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCircle2
                    size={18}
                  />
                )
              }
              accent="emerald"
            />

            <OverviewCard
              title="Language"
              value="TS/JS"
              subtitle="Script source"
              icon={
                <Binary size={18} />
              }
              accent="violet"
            />

          </div>

          {/* Metadata Section */}
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50/60 to-amber-50/20 shadow-sm">

            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_28%)]" />

            <div className="relative flex flex-col gap-8 p-6">

              {/* Header */}
              <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm">
                    
                    <FileCode2
                      size={14}
                    />

                    Script Metadata

                  </div>

                  <h3 className="text-2xl font-bold text-slate-900">
                    Automation Script Overview
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                    Inspect formatted Playwright
                    automation code linked to the
                    selected testcase and enriched
                    through the backend formatting
                    service.
                  </p>

                </div>

                {/* Status */}
                <div
                  className={`
                    inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold shadow-sm
                    ${
                      scriptCode
                        ? `
                          border border-emerald-200 bg-emerald-50 text-emerald-700
                        `
                        : `
                          border border-amber-200 bg-amber-50 text-amber-700
                        `
                    }
                  `}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />

                      Formatting...
                    </>
                  ) : (
                    <>
                      <Sparkles
                        size={15}
                      />

                      Backend formatted
                    </>
                  )}
                </div>

              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                <MetaCard
                  label="Feature"
                  value={
                    selectedScript
                      ?.feature ||
                    "Unknown"
                  }
                  icon={
                    <Layers3
                      size={16}
                    />
                  }
                />

                <MetaCard
                  label="Script ID"
                  value={
                    selectedScriptId
                  }
                  icon={
                    <Braces
                      size={16}
                    />
                  }
                  mono
                />

                <MetaCard
                  label="Source"
                  value="Playwright"
                  icon={
                    <Code2
                      size={16}
                    />
                  }
                />

              </div>

            </div>

          </div>

          {/* Code Section */}
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h3 className="text-lg font-semibold text-slate-900">
                  Formatted Script Output
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Cleaned and formatted automation
                  code returned by the backend
                  formatting endpoint.
                </p>

              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                
                <Sparkles size={13} />

                Pretty Printed

              </div>

            </div>

            <div className="p-6 pt-0">

              <CodeBlock
                title="Formatted script output"
                code={
                  scriptCode ||
                  (isLoading
                    ? "// Loading script..."
                    : "// Script unavailable")
                }
              />

            </div>

          </div>

        </div>
      ) : (
        <div className="p-10">

          <EmptyState
            title="No script selected"
            description="Choose a testcase record from the script repository to inspect the cleaned Playwright automation source."
          />

        </div>
      )}

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

function MetaCard({
  label,
  value,
  icon,
  mono,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">

      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">

        {icon}

        {label}

      </div>

      <p
        className={`
          mt-3 text-sm font-semibold text-slate-900
          ${
            mono
              ? "font-mono"
              : ""
          }
        `}
      >
        {value}
      </p>

    </div>
  );
}