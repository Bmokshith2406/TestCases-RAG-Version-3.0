import {
  useQuery,
} from "@tanstack/react-query";

import {
  Activity,
  Binary,
  BrainCircuit,
  Code2,
  FileCode2,
  Loader2,
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { ScriptDetailPanel } from "@/components/scripts/ScriptDetailPanel";

import { ScriptRecordList } from "@/components/scripts/ScriptRecordList";

import { api } from "@/lib/api";

export function ScriptsPage() {
  /* -------------------------------------------------------------------------- */
  /*                                   State                                    */
  /* -------------------------------------------------------------------------- */

  const [filter, setFilter] =
    useState("");

  const [
    selectedScriptId,
    setSelectedScriptId,
  ] = useState<
    string | null
  >(null);

  const [
  isViewerOpen,
  setIsViewerOpen,
] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                   Query                                    */
  /* -------------------------------------------------------------------------- */

  const scriptsQuery =
    useQuery({
      queryKey: [
        "scripts",
        "all",
      ],

      queryFn:
        api.listScripts,

      staleTime: 30_000,
    });

  /* -------------------------------------------------------------------------- */
  /*                              Filtered Records                              */
  /* -------------------------------------------------------------------------- */

  const filteredScripts =
    useMemo(() => {
      const records =
        scriptsQuery.data
          ?.data || [];

      if (
        !filter.trim()
      ) {
        return records;
      }

      const needle =
        filter.toLowerCase();

      return records.filter(
        (record) =>
          [
            record.test_case_id,
            record.feature,
            record.test_case_description,
          ]
            .filter(Boolean)
            .some((value) =>
              String(
                value
              )
                .toLowerCase()
                .includes(
                  needle
                )
            )
      );
    }, [
      filter,
      scriptsQuery.data
        ?.data,
    ]);

  /* -------------------------------------------------------------------------- */
  /*                            Auto Script Selection                           */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (
      !filteredScripts.length
    ) {
      setSelectedScriptId(
        null
      );

      return;
    }

    const hasSelection =
      filteredScripts.some(
        (record) => {
          const id =
            String(
              record.script
                ?._id ||
                record
                  .script
                  ?.id ||
                ""
            );

          return (
            id ===
            selectedScriptId
          );
        }
      );

    if (
      !hasSelection
    ) {
      setSelectedScriptId(
        String(
          filteredScripts[0]
            .script
            ?._id ||
            filteredScripts[0]
              .script
              ?.id ||
            ""
        )
      );
    }
  }, [
    filteredScripts,
    selectedScriptId,
  ]);

  /* -------------------------------------------------------------------------- */
  /*                             Selected Script                                */
  /* -------------------------------------------------------------------------- */

  const selectedScript =
    filteredScripts.find(
      (record) =>
        record.script
          ?._id ===
          selectedScriptId ||
        record.script
          ?.id ===
          selectedScriptId
    );

  /* -------------------------------------------------------------------------- */
  /*                           Clean Script Fetching                            */
  /* -------------------------------------------------------------------------- */

  const cleanScriptQuery =
    useQuery({
      queryKey: [
        "scripts",
        "clean",
        selectedScriptId,
      ],

      queryFn: () =>
        api.getCleanScript(
          selectedScriptId!
        ),

      enabled:
        Boolean(
          selectedScriptId
        ),

      staleTime: 15_000,
    });

  /* -------------------------------------------------------------------------- */
  /*                              Derived Values                                */
  /* -------------------------------------------------------------------------- */

  const totalScripts =
    scriptsQuery.data
      ?.data?.length || 0;

  const activeFeatureCount =
    new Set(
      filteredScripts.map(
        (record) =>
          record.feature
      )
    ).size;

  const isLoading =
    scriptsQuery.isLoading;

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="mx-auto flex w-full max-w-[1850px] flex-col gap-8 p-6">

      {/* Workspace */}
      <section>

        <ScriptRecordList
          records={
            filteredScripts
          }
          selectedScriptId={
            selectedScriptId
          }
          filter={filter}
          onFilterChange={
            setFilter
          }
          onSelect={(id) => {
            setSelectedScriptId(id);
            setIsViewerOpen(true);
          }}
        />

      </section>

      {/* Script Viewer Modal */}
      {isViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 backdrop-blur-md p-6">

          <div className="relative h-[92vh] w-full max-w-7xl overflow-hidden rounded-[36px] border border-white/10 bg-white shadow-[0_25px_120px_rgba(15,23,42,0.35)]">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Script Inspection Workspace
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Semantic automation script analysis and code inspection.
                </p>

              </div>

              <button
                onClick={() =>
                  setIsViewerOpen(false)
                }
                className="rounded-2xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Close
              </button>

            </div>

            {/* Body */}
            <div className="h-[calc(92vh-88px)] overflow-y-auto p-6">

              <ScriptDetailPanel
                selectedScriptId={
                  selectedScriptId
                }
                selectedScript={
                  selectedScript
                }
                scriptCode={
                  cleanScriptQuery
                    .data?.code
                }
                isLoading={
                  cleanScriptQuery.isLoading
                }
              />

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

function HeroCard({
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

function CapabilityCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[32px] border border-white/60 bg-white/75 p-6 shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 shadow-sm">
          {icon}
        </div>

        <div>

          <h3 className="text-lg font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}

function InsightCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-white via-slate-50/70 to-amber-50/20 p-7 shadow-sm backdrop-blur-xl">

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_30%)]" />

      <div className="relative flex items-start gap-5">

        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white shadow-sm text-slate-700">
          {icon}
        </div>

        <div>

          <h3 className="text-lg font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}