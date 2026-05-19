import {
  CheckCircle2,
  ClipboardList,
  FileCode2,
  FileText,
  Layers3,
  Loader2,
  Sparkles,
  Tags,
} from "lucide-react";

import { CodeBlock } from "@/components/CodeBlock";
import { EmptyState } from "@/components/EmptyState";
import { Panel, PanelHeader } from "@/components/Panel";

import type { SearchResult } from "@/lib/types";

type Props = {
  result: SearchResult | null;
  scriptCode?: string;
  isScriptLoading: boolean;
};

export function SearchDetailPanel({
  result,
  scriptCode,
  isScriptLoading,
}: Props) {
  return (
    <Panel className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

      <PanelHeader
        eyebrow="Detail"
        title={
          result
            ? result.test_case_id
            : "Select a result"
        }
        description={
          result
            ? "Inspect semantic testcase metadata, execution flow, and linked automation assets."
            : "Choose a testcase result from the explorer to inspect its complete semantic payload."
        }
      />

      {result ? (
        <div className="flex flex-col gap-6 p-6">

          {/* Overview Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <OverviewCard
              icon={
                <Sparkles size={18} />
              }
              title="Semantic Match"
              value="Active"
              accent="amber"
            />

            <OverviewCard
              icon={
                <Layers3 size={18} />
              }
              title="Keywords"
              value={String(
                result.keywords?.length || 0
              )}
              accent="blue"
            />

            <OverviewCard
              icon={
                <FileCode2 size={18} />
              }
              title="Script Linked"
              value={
                result.playwright_script_id
                  ? "Available"
                  : "None"
              }
              accent="emerald"
            />

          </div>

          {/* Summary */}
          <DetailCard
            title="Summary"
            icon={<FileText size={18} />}
          >
            <p className="text-sm leading-relaxed text-slate-600">
              {result.summary ||
                "No summary available."}
            </p>
          </DetailCard>

          {/* Description */}
          <DetailCard
            title="Description"
            icon={<ClipboardList size={18} />}
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {result.description ||
                "No description available."}
            </p>
          </DetailCard>

          {/* Prerequisites */}
          <DetailCard
            title="Pre-requisites"
            icon={
              <CheckCircle2 size={18} />
            }
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {result.prerequisites ||
                "No prerequisites specified."}
            </p>
          </DetailCard>

          {/* Steps */}
          <DetailCard
            title="Execution Steps"
            icon={
              <ClipboardList size={18} />
            }
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
              
              <pre className="overflow-x-auto p-5 text-sm leading-relaxed text-slate-100">
                {result.steps ||
                  "No steps available."}
              </pre>

            </div>
          </DetailCard>

          {/* Keywords */}
          <DetailCard
            title="Keywords"
            icon={<Tags size={18} />}
          >
            {result.keywords?.length ? (
              <div className="flex flex-wrap gap-2">
                
                {result.keywords.map(
                  (keyword) => (
                    <span
                      key={keyword}
                      className="
                        inline-flex items-center rounded-2xl
                        border border-slate-200 bg-slate-50
                        px-3 py-1.5 text-xs font-semibold
                        text-slate-700 transition-colors
                        hover:bg-slate-100
                      "
                    >
                      {keyword}
                    </span>
                  )
                )}

              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No keywords available.
              </p>
            )}
          </DetailCard>

          {/* Linked Script */}
          {result.playwright_script_id ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                
                <div className="flex items-center gap-3">
                  
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <FileCode2 size={18} />
                  </div>

                  <div>
                    
                    <h3 className="text-sm font-semibold text-slate-900">
                      Linked Automation Script
                    </h3>

                    <p className="text-xs text-slate-500">
                      {
                        result.playwright_script_id
                      }
                    </p>

                  </div>

                </div>

                {isScriptLoading ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />

                    Loading

                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    
                    <CheckCircle2 size={14} />

                    Ready

                  </div>
                )}

              </div>

              <div className="bg-slate-950">
                
                <CodeBlock
                  title={`Script ${result.playwright_script_id}`}
                  code={
                    scriptCode ||
                    (isScriptLoading
                      ? "// Loading script..."
                      : "// Script unavailable")
                  }
                />

              </div>

            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-8">
              
              <EmptyState
                title="No linked script"
                description="This testcase does not currently expose an associated Playwright automation script."
              />

            </div>
          )}

        </div>
      ) : (
        <div className="p-8">
          
          <EmptyState
            title="Nothing selected"
            description="Once you select a testcase result, this panel expands into a full semantic detail and automation inspection workspace."
          />

        </div>
      )}

    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

function DetailCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          {icon}
        </div>

        <div>
          
          <h3 className="text-sm font-semibold text-slate-900">
            {title}
          </h3>

        </div>

      </div>

      <div className="p-5">
        {children}
      </div>

    </article>
  );
}

function OverviewCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string;
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

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
          {icon}
        </div>

      </div>

    </div>
  );
}