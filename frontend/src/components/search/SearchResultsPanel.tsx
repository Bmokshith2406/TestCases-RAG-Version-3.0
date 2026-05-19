import { motion } from "framer-motion";

import {
  ChevronRight,
  Layers3,
  Monitor,
  ShieldCheck,
  Sparkles,
  Tags,
} from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { Panel, PanelHeader } from "@/components/Panel";

import type { SearchResult } from "@/lib/types";

type Props = {
  results: SearchResult[];
  selectedId: string | null;
  onSelect: (result: SearchResult) => void;
};

export function SearchResultsPanel({
  results,
  selectedId,
  onSelect,
}: Props) {
  return (
    <Panel className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

      <PanelHeader
        eyebrow="Results"
        title="Matched test cases"
        description="Explore semantically ranked testcases enriched with metadata, confidence scoring, and automation linkage."
      />

      {results.length ? (
        <div className="flex flex-col gap-4 p-6">

          {/* Summary Strip */}
          <div className="flex flex-wrap items-center gap-3">

            <SummaryPill
              icon={<Sparkles size={14} />}
              label={`${results.length} semantic matches`}
            />

            <SummaryPill
              icon={<Layers3 size={14} />}
              label="Hybrid retrieval"
            />

            <SummaryPill
              icon={
                <ShieldCheck size={14} />
              }
              label="LLM reranked"
            />

          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">

            {results.map(
              (result, index) => {
                const active =
                  selectedId === result.id;

                return (
                  <motion.button
                    key={result.id}
                    type="button"
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.04,
                      duration: 0.3,
                    }}
                    onClick={() =>
                      onSelect(result)
                    }
                    className={`
                      group relative overflow-hidden rounded-[28px]
                      border p-5 text-left transition-all duration-200
                      ${
                        active
                          ? `
                            border-slate-900 bg-slate-900 text-white
                            shadow-2xl shadow-slate-900/10
                          `
                          : `
                            border-slate-200 bg-white/90
                            hover:-translate-y-1 hover:border-slate-300
                            hover:shadow-lg
                          `
                      }
                    `}
                  >

                    {/* Glow */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_30%)]" />

                    <div className="relative flex flex-col gap-5">

                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 items-start gap-4">

                          <div
                            className={`
                              flex h-12 w-12 flex-shrink-0 items-center justify-center
                              rounded-2xl shadow-sm
                              ${
                                active
                                  ? "bg-white/10 text-white"
                                  : "bg-slate-100 text-slate-700"
                              }
                            `}
                          >
                            <Sparkles
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
                              {
                                result.test_case_id
                              }
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
                              {result.feature ||
                                "Unlabeled feature"}
                            </h3>

                          </div>

                        </div>

                        {/* Score */}
                        <div
                          className={`
                            flex flex-col items-end rounded-2xl px-4 py-3
                            ${
                              active
                                ? "bg-white/10"
                                : "bg-emerald-50"
                            }
                          `}
                        >
                          
                          <span
                            className={`
                              text-[11px] font-semibold uppercase tracking-wide
                              ${
                                active
                                  ? "text-slate-300"
                                  : "text-emerald-600"
                              }
                            `}
                          >
                            Match
                          </span>

                          <strong
                            className={`
                              mt-1 text-xl font-bold
                              ${
                                active
                                  ? "text-white"
                                  : "text-emerald-700"
                              }
                            `}
                          >
                            {result.probability}%
                          </strong>

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
                        {result.summary ||
                          result.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2">

                        {(result.tags || [])
                          .slice(0, 4)
                          .map((tag) => (
                            <Tag
                              key={tag}
                              label={tag}
                              active={
                                active
                              }
                              icon={
                                <Tags
                                  size={
                                    12
                                  }
                                />
                              }
                            />
                          ))}

                        {result.priority ? (
                          <Tag
                            label={
                              result.priority
                            }
                            active={
                              active
                            }
                            accent
                            icon={
                              <ShieldCheck
                                size={12}
                              />
                            }
                          />
                        ) : null}

                        {result.platform ? (
                          <Tag
                            label={
                              result.platform
                            }
                            active={
                              active
                            }
                            icon={
                              <Monitor
                                size={12}
                              />
                            }
                          />
                        ) : null}

                      </div>

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
                          Semantic relevance match
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
                          Inspect

                          <ChevronRight
                            size={16}
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                          />
                        </div>

                      </div>

                    </div>

                    {/* Active Border */}
                    {active ? (
                      <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-amber-300" />
                    ) : null}

                  </motion.button>
                );
              }
            )}

          </div>

        </div>
      ) : (
        <div className="p-8">
          
          <EmptyState
            title="No search results yet"
            description="Submit a semantic query to discover ranked testcase matches, metadata insights, and linked automation assets."
          />

        </div>
      )}

    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

function SummaryPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className="
        inline-flex items-center gap-2 rounded-full
        border border-slate-200 bg-white px-4 py-2
        text-xs font-semibold text-slate-700 shadow-sm
      "
    >
      {icon}
      {label}
    </div>
  );
}

function Tag({
  label,
  active,
  icon,
  accent,
}: {
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full
        px-3 py-1.5 text-xs font-semibold transition-colors
        ${
          active
            ? `
              bg-white/10 text-white
              border border-white/10
            `
            : accent
            ? `
              border border-amber-200 bg-amber-50
              text-amber-700
            `
            : `
              border border-slate-200 bg-slate-50
              text-slate-700
            `
        }
      `}
    >
      {icon}
      {label}
    </span>
  );
}