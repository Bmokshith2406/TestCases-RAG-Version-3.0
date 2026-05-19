import {
  AlertTriangle,
  BrainCircuit,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { SearchDetailPanel } from "@/components/search/SearchDetailPanel";
import { SearchFormPanel } from "@/components/search/SearchFormPanel";
import { SearchResultsPanel } from "@/components/search/SearchResultsPanel";

import { EmptyState } from "@/components/EmptyState";

import {
  api,
  ApiError,
} from "@/lib/api";

import {
  parseCommaSeparatedList,
} from "@/lib/format";

import type {
  SearchRequest,
  SearchResult,
} from "@/lib/types";

export function SearchPage() {
  /* -------------------------------------------------------------------------- */
  /*                                   State                                    */
  /* -------------------------------------------------------------------------- */

  const [formState, setFormState] =
    useState({
      query: "",
      feature: "",
      tags: "",
      priority: "",
      platform: "",
      rankingVariant: "A",
    });

  const [
    selectedResult,
    setSelectedResult,
  ] = useState<SearchResult | null>(
    null
  );

  /* -------------------------------------------------------------------------- */
  /*                                 Mutations                                  */
  /* -------------------------------------------------------------------------- */

  const searchMutation = useMutation({
    mutationFn: (
      payload: SearchRequest
    ) => api.search(payload),
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Queries                                  */
  /* -------------------------------------------------------------------------- */

  const scriptQuery = useQuery({
    queryKey: [
      "script",
      "clean",
      selectedResult
        ?.playwright_script_id,
    ],

    queryFn: () =>
      api.getCleanScript(
        selectedResult!
          .playwright_script_id!
      ),

    enabled: Boolean(
      selectedResult?.playwright_script_id
    ),

    staleTime: 30_000,
  });

  /* -------------------------------------------------------------------------- */
  /*                              Derived Values                                */
  /* -------------------------------------------------------------------------- */

  const results =
    searchMutation.data?.results ||
    [];

  const resultsCount =
    searchMutation.data
      ?.results_count || 0;

  const isFromCache =
    searchMutation.data?.from_cache;

  const resultMessage =
    useMemo(() => {
      if (
        searchMutation.isSuccess
      ) {
        return `Returned ${resultsCount} result${
          resultsCount === 1
            ? ""
            : "s"
        }${
          isFromCache
            ? " from cache"
            : ""
        }.`;
      }

      if (
        searchMutation.error instanceof
        ApiError
      ) {
        return searchMutation.error
          .message;
      }

      return null;
    }, [
      searchMutation.data,
      searchMutation.error,
      searchMutation.isSuccess,
      resultsCount,
      isFromCache,
    ]);

  /* -------------------------------------------------------------------------- */
  /*                                  Effects                                   */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!results.length) {
      setSelectedResult(null);
      return;
    }

    setSelectedResult(results[0]);
  }, [results]);

  /* -------------------------------------------------------------------------- */
  /*                                  Actions                                   */
  /* -------------------------------------------------------------------------- */

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    searchMutation.mutate({
      query:
        formState.query,

      feature:
        formState.feature ||
        undefined,

      tags:
        parseCommaSeparatedList(
          formState.tags
        ),

      priority:
        formState.priority ||
        undefined,

      platform:
        formState.platform ||
        undefined,

      ranking_variant:
        formState.rankingVariant,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="mx-auto flex w-full max-w-[1700px] flex-col gap-8 p-6">

      {/* Search Form */}
      <SearchFormPanel
        formState={formState}
        isSearching={
          searchMutation.isPending
        }
        message={resultMessage}
        onChange={(patch) =>
          setFormState(
            (current) => ({
              ...current,
              ...patch,
            })
          )
        }
        onSubmit={handleSubmit}
      />

      {/* Loading */}
      {searchMutation.isPending ? (
        <div className="flex min-h-[450px] items-center justify-center rounded-[32px] border border-white/60 bg-white/70 shadow-sm backdrop-blur-xl">

          <div className="flex flex-col items-center gap-5 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
              <Loader2
                size={30}
                className="animate-spin text-slate-700"
              />
            </div>

            <div>

              <h3 className="text-lg font-semibold text-slate-900">
                Running semantic search
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Generating embeddings, ranking
                vectors, and reranking matches...
              </p>

            </div>

          </div>

        </div>
      ) : searchMutation.error instanceof
        ApiError ? (
        <div className="flex items-start gap-4 rounded-[32px] border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">

          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <AlertTriangle
              size={22}
            />
          </div>

          <div>

            <h2 className="text-lg font-semibold">
              Search request failed
            </h2>

            <p className="mt-1 text-sm leading-relaxed opacity-90">
              {
                searchMutation.error
                  .message
              }
            </p>

          </div>

        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[480px_minmax(0,1fr)]">

          {/* Results */}
          <div className="min-h-[900px]">

            <SearchResultsPanel
              results={results}
              selectedId={
                selectedResult?.id ||
                null
              }
              onSelect={
                setSelectedResult
              }
            />

          </div>

          {/* Detail */}
          <div className="min-w-0">

            {results.length ? (
              <SearchDetailPanel
                result={
                  selectedResult
                }
                scriptCode={
                  scriptQuery.data
                    ?.code
                }
                isScriptLoading={
                  scriptQuery.isLoading
                }
              />
            ) : (
              <div className="rounded-[32px] border border-white/60 bg-white/75 p-10 shadow-sm backdrop-blur-xl">

                <EmptyState
                  title="No results yet"
                  description="Submit a semantic query to discover relevant testcase matches, execution metadata, and linked automation scripts."
                />

              </div>
            )}

          </div>

        </section>
      )}

    </div>
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
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          {icon}
        </div>

      </div>

    </div>
  );
}