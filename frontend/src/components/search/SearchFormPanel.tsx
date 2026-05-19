import {
  Cpu,
  Layers3,
  Loader2,
  Search,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import type { FormEvent } from "react";

import { Panel, PanelHeader } from "@/components/Panel";

type SearchFormState = {
  query: string;
  feature: string;
  tags: string;
  priority: string;
  platform: string;
  rankingVariant: string;
};

type Props = {
  formState: SearchFormState;
  isSearching: boolean;
  message?: string | null;
  onChange: (
    patch: Partial<SearchFormState>
  ) => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
};

export function SearchFormPanel({
  formState,
  isSearching,
  message,
  onChange,
  onSubmit,
}: Props) {
  return (
    <Panel className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

      <PanelHeader
        eyebrow="Semantic Search"
        title="Search by intent, not just exact wording"
        // description="Drive semantic normalization, embeddings, vector retrieval, ranking strategies, and LLM reranking through an enterprise-grade search workflow."
      />

      <div className="flex flex-col gap-8 p-6">

        {/* AI Capability Strip */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <CapabilityCard
            icon={<Cpu size={18} />}
            title="Hybrid Retrieval"
            description="Vector + semantic reranking"
            accent="amber"
          />

          <CapabilityCard
            icon={
              <WandSparkles size={18} />
            }
            title="Query Expansion"
            description="Intent-aware enhancement"
            accent="blue"
          />

          <CapabilityCard
            icon={<Layers3 size={18} />}
            title={`Ranking ${formState.rankingVariant}`}
            description="Adaptive scoring pipeline"
            accent="emerald"
          />

        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-6"
        >

          {/* Query Area */}
          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50/40 to-amber-50/20 p-5 shadow-sm">

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_28%)]" />

            <div className="relative flex items-start gap-4">

              <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
                <Search size={20} />
              </div>

              <div className="flex-1">

                <div className="mb-3">
                  
                  <h3 className="text-sm font-semibold text-slate-900">
                    Natural Language Query
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Describe the expected behavior,
                    validation flow, edge case, or
                    user interaction naturally.
                  </p>

                </div>

                <textarea
                  rows={5}
                  value={formState.query}
                  onChange={(event) =>
                    onChange({
                      query:
                        event.target.value,
                    })
                  }
                  placeholder="Example: login should fail with wrong password and show a clear validation message"
                  className="
                    min-h-[150px] w-full resize-none rounded-2xl
                    border border-slate-200 bg-white/90
                    px-5 py-4 text-sm leading-relaxed text-slate-800
                    outline-none transition-all duration-200
                    placeholder:text-slate-400
                    focus:border-slate-400
                    focus:ring-4 focus:ring-slate-100
                  "
                />

              </div>

            </div>

          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">

            <Field
              label="Feature"
              description="Functional area"
            >
              <input
                value={formState.feature}
                onChange={(event) =>
                  onChange({
                    feature:
                      event.target.value,
                  })
                }
                placeholder="Authentication"
                className={inputClass()}
              />
            </Field>

            <Field
              label="Tags"
              description="Semantic labels"
            >
              <input
                value={formState.tags}
                onChange={(event) =>
                  onChange({
                    tags:
                      event.target.value,
                  })
                }
                placeholder="login,negative,validation"
                className={inputClass()}
              />
            </Field>

            <Field
              label="Priority"
              description="Execution priority"
            >
              <input
                value={formState.priority}
                onChange={(event) =>
                  onChange({
                    priority:
                      event.target.value,
                  })
                }
                placeholder="High"
                className={inputClass()}
              />
            </Field>

            <Field
              label="Platform"
              description="Target environment"
            >
              <input
                value={formState.platform}
                onChange={(event) =>
                  onChange({
                    platform:
                      event.target.value,
                  })
                }
                placeholder="Web"
                className={inputClass()}
              />
            </Field>

            <Field
              label="Ranking Variant"
              description="Scoring strategy"
            >
              <select
                value={
                  formState.rankingVariant
                }
                onChange={(event) =>
                  onChange({
                    rankingVariant:
                      event.target.value,
                  })
                }
                className={inputClass()}
              >
                <option value="A">
                  Variant A
                </option>

                <option value="B">
                  Variant B
                </option>
              </select>
            </Field>

          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-5 border-t border-slate-100 pt-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Pills */}
            <div className="flex flex-wrap items-center gap-3">

              <InfoPill
                icon={<Cpu size={14} />}
                label="Vector + LLM"
              />

              {/* <InfoPill
                icon={
                  <Sparkles size={14} />
                }
                label="Semantic Intent"
              />

              <InfoPill
                icon={
                  <WandSparkles size={14} />
                }
                label="Expansion Aware"
              />

              <InfoPill
                icon={
                  <Layers3 size={14} />
                }
                label={`Variant ${formState.rankingVariant}`}
              /> */}

            </div>

            {/* Submit */}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">

              {message ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                  {message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSearching}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-2xl bg-slate-900 px-6 py-3
                  text-sm font-semibold text-white
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-lg
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSearching ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={16} />

                    Run Search
                  </>
                )}
              </button>

            </div>

          </div>

        </form>

      </div>

    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      
      <div>
        
        <span className="text-sm font-semibold text-slate-700">
          {label}
        </span>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>

      </div>

      {children}

    </label>
  );
}

function CapabilityCard({
  title,
  description,
  icon,
  accent,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent:
    | "amber"
    | "blue"
    | "emerald";
}) {
  const styles = {
    amber:
      "border-amber-100 bg-amber-50/70 text-amber-700",
    blue:
      "border-blue-100 bg-blue-50/70 text-blue-700",
    emerald:
      "border-emerald-100 bg-emerald-50/70 text-emerald-700",
  };

  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm backdrop-blur-sm ${styles[accent]}`}
    >
      
      <div className="flex items-start justify-between gap-4">

        <div>
          
          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
            {title}
          </p>

          <p className="mt-2 text-sm font-medium text-slate-700">
            {description}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
          {icon}
        </div>

      </div>

    </div>
  );
}

function InfoPill({
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
        text-xs font-semibold text-slate-700
        shadow-sm transition-colors
        hover:bg-slate-50
      "
    >
      {icon}
      {label}
    </div>
  );
}

function inputClass() {
  return `
    h-12 w-full rounded-2xl border border-slate-200
    bg-white/90 px-4 text-sm text-slate-800
    outline-none transition-all duration-200
    placeholder:text-slate-400
    focus:border-slate-400
    focus:ring-4 focus:ring-slate-100
  `;
}