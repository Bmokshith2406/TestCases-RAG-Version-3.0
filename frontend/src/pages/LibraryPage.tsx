import {
  AlertTriangle,
  Database,
  Loader2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { CaseEditorPanel } from "@/components/library/CaseEditorPanel";
import { CaseListPanel } from "@/components/library/CaseListPanel";

import { EmptyState } from "@/components/EmptyState";

import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

import {
  buildUpdatePayload,
  emptyCaseForm,
  mapTestCaseToUpdatePayload,
} from "@/lib/testcaseForm";

import type { UpdateCasePayload } from "@/lib/types";

export function LibraryPage() {
  const queryClient = useQueryClient();

  const { role } = useAuth();

  const [page, setPage] = useState(0);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [
    isEditorOpen,
    setIsEditorOpen,
  ] = useState(false);

  const [sortBy, setSortBy] =
    useState("UpdatedAt");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [formState, setFormState] =
    useState<UpdateCasePayload>(
      emptyCaseForm
    );

  /* -------------------------------------------------------------------------- */
  /*                             Modal Scroll Lock                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (isEditorOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [isEditorOpen]);

  /* -------------------------------------------------------------------------- */
  /*                             ESC Close Support                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        closeEditor();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                            Reset Pagination                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  /* -------------------------------------------------------------------------- */
  /*                                   Queries                                  */
  /* -------------------------------------------------------------------------- */

  const casesQuery = useQuery({
    queryKey: [
      "cases",
      page,
      sortBy,
      searchTerm,
    ],

    queryFn: () =>
      api.listCases({
        skip: page * 20,
        limit: 20,
        sortBy,
        order: -1,
      }),

    staleTime: 30_000,
  });

  const filteredCases = useMemo(() => {
    const records =
      casesQuery.data?.test_cases ||
      [];

    if (!searchTerm.trim()) {
      return records;
    }

    const needle =
      searchTerm.toLowerCase();

    return records.filter((record) =>
      [
        record["Test Case ID"],
        record.Feature,
        record[
          "Test Case Description"
        ],
        record.TestCaseSummary,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(needle)
        )
    );
  }, [
    casesQuery.data?.test_cases,
    searchTerm,
  ]);

  /* -------------------------------------------------------------------------- */
  /*                             Selection Sync                                 */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!filteredCases.length) {
      setSelectedId(null);
      return;
    }

    const hasSelection =
      filteredCases.some(
        (record) =>
          String(
            record.id ||
              record._id ||
              ""
          ) === selectedId
      );

    if (!hasSelection) {
      setSelectedId(
        String(
          filteredCases[0].id ||
            filteredCases[0]._id ||
            ""
        )
      );
    }
  }, [filteredCases, selectedId]);

  /* -------------------------------------------------------------------------- */
  /*                             Selected Case                                  */
  /* -------------------------------------------------------------------------- */

  const selectedCaseQuery = useQuery({
    queryKey: ["case", selectedId],

    queryFn: () =>
      api.getCaseById(selectedId!),

    enabled: Boolean(selectedId),

    staleTime: 15_000,
  });

  useEffect(() => {
    const testcase =
      selectedCaseQuery.data
        ?.test_case;

    if (!testcase) {
      return;
    }

    setFormState(
      mapTestCaseToUpdatePayload(
        testcase
      )
    );
  }, [selectedCaseQuery.data]);

  /* -------------------------------------------------------------------------- */
  /*                                Mutations                                   */
  /* -------------------------------------------------------------------------- */

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCasePayload;
    }) =>
      api.updateCase(id, payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["cases"],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "case",
            selectedId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: ["stats"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["scripts"],
        }),
      ]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.deleteCase(id),

    onSuccess: async () => {
      closeEditor();

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["cases"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["stats"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["scripts"],
        }),
      ]);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                Derived Data                                */
  /* -------------------------------------------------------------------------- */

  const selectedCase =
    selectedCaseQuery.data?.test_case;

  const isLoadingInitial =
    casesQuery.isLoading;

  const isFetchingCase =
    selectedCaseQuery.isFetching;

  const totalRecords =
    filteredCases.length;

  /* -------------------------------------------------------------------------- */
  /*                                Actions                                     */
  /* -------------------------------------------------------------------------- */

  function closeEditor() {
    setIsEditorOpen(false);

    setTimeout(() => {
      setFormState(emptyCaseForm);
      setSelectedId(null);
    }, 150);
  }

  function saveUpdates() {
    if (
      !selectedId ||
      !selectedCase
    ) {
      return;
    }

    const payload =
      buildUpdatePayload(
        selectedCase,
        formState
      );

    if (
      Object.keys(payload)
        .length === 0
    ) {
      return;
    }

    updateMutation.mutate({
      id: selectedId,
      payload,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */

  if (
    casesQuery.isError &&
    casesQuery.error instanceof
      ApiError
  ) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
        <div className="flex items-start gap-4 rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <AlertTriangle size={22} />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">
              Unable to load repository
            </h2>

            <p className="text-sm leading-relaxed opacity-90">
              {
                casesQuery.error
                  .message
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 p-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[36px] border border-white/60 bg-gradient-to-br from-white via-amber-50/40 to-slate-50 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_30%)]" />

        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Testcase Library Workspace
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              Explore, refine, and
              manage semantic
              testcase assets with a
              modern repository
              editing workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <OverviewCard
              title="Visible Records"
              value={String(
                totalRecords
              )}
              subtitle="Filtered dataset"
              icon={
                <Database size={18} />
              }
            />

            <OverviewCard
              title="Current Page"
              value={String(
                page + 1
              )}
              subtitle="Repository pagination"
              icon={
                <ShieldCheck
                  size={18}
                />
              }
            />

            <OverviewCard
              title="Selection"
              value={
                selectedCase
                  ? "Active"
                  : "None"
              }
              subtitle="Editing context"
              icon={
                isFetchingCase ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Sparkles
                    size={18}
                  />
                )
              }
            />
          </div>
        </div>
      </section>

      {/* Loading */}
      {isLoadingInitial ? (
        <div className="flex min-h-[420px] items-center justify-center rounded-[32px] border border-white/60 bg-white/70 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
              <Loader2
                size={28}
                className="animate-spin text-slate-700"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Loading repository
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching testcase
                assets and metadata...
              </p>
            </div>
          </div>
        </div>
      ) : filteredCases.length ===
        0 ? (
        <div className="rounded-[32px] border border-white/60 bg-white/70 p-8 shadow-sm backdrop-blur-xl">
          <EmptyState
            title="No testcases found"
            description="No repository records matched the current search criteria."
          />
        </div>
      ) : (
        <>
          {/* List */}
          <section>
            <div className="min-h-[70vh]">
              <CaseListPanel
                records={
                  filteredCases
                }
                selectedId={
                  selectedId
                }
                sortBy={sortBy}
                searchTerm={
                  searchTerm
                }
                page={page}
                onSortChange={
                  setSortBy
                }
                onSearchSubmit={(value) => {
                  setPage(0);
                  setSearchTerm(value);
                }}
                onSelect={(id) => {
                  setSelectedId(id);

                  setIsEditorOpen(
                    true
                  );
                }}
                onPreviousPage={() =>
                  setPage(
                    (current) =>
                      Math.max(
                        0,
                        current - 1
                      )
                  )
                }
                onNextPage={() =>
                  setPage(
                    (current) =>
                      current + 1
                  )
                }
              />
            </div>
          </section>

          {/* Modal */}
          {isEditorOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md md:p-6"
              onClick={closeEditor}
            >
              <div
                className="relative h-[96vh] w-full max-w-7xl overflow-hidden rounded-[36px] border border-white/20 bg-white shadow-[0_25px_120px_rgba(15,23,42,0.35)]"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-5 backdrop-blur-xl md:px-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Testcase Workspace
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Semantic testcase
                      inspection and
                      repository editing
                      workflow.
                    </p>
                  </div>

                  <button
                    onClick={
                      closeEditor
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="h-[calc(96vh-88px)] overflow-y-auto bg-gradient-to-b from-slate-50/60 to-white p-4 md:p-6">
                  {isFetchingCase ? (
                    <div className="flex h-full min-h-[500px] items-center justify-center">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
                          <Loader2
                            size={28}
                            className="animate-spin text-slate-700"
                          />
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            Loading testcase
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Preparing
                            semantic
                            testcase
                            details...
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    selectedCase && (
                      <CaseEditorPanel
                        role={role}
                        testcase={
                          selectedCase
                        }
                        formState={
                          formState
                        }
                        saveError={
                          updateMutation.error instanceof
                          ApiError
                            ? updateMutation
                                .error
                                .message
                            : null
                        }
                        deleteError={
                          deleteMutation.error instanceof
                          ApiError
                            ? deleteMutation
                                .error
                                .message
                            : null
                        }
                        isSaving={
                          updateMutation.isPending
                        }
                        isDeleting={
                          deleteMutation.isPending
                        }
                        onChange={(
                          field,
                          value
                        ) =>
                          setFormState(
                            (
                              current
                            ) => ({
                              ...current,
                              [field]:
                                value,
                            })
                          )
                        }
                        onSave={
                          saveUpdates
                        }
                        onDelete={() => {
                          if (
                            selectedId
                          ) {
                            deleteMutation.mutate(
                              selectedId
                            );
                          }
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </>
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
    <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-md">
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