import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  FolderKanban,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { Panel, PanelHeader } from "@/components/Panel";
import { trimText } from "@/lib/format";

import type { TestCaseRecord } from "@/lib/types";

type Props = {
  records: TestCaseRecord[];
  selectedId: string | null;
  sortBy: string;
  searchTerm: string;
  page: number;

  onSortChange: (
    value: string
  ) => void;

  onSearchSubmit: (
    value: string
  ) => void;

  onSelect: (
    id: string
  ) => void;

  onPreviousPage: () => void;

  onNextPage: () => void;
};

export function CaseListPanel({
  records,
  selectedId,
  sortBy,
  searchTerm,
  page,
  onSortChange,
  onSearchSubmit,
  onSelect,
  onPreviousPage,
  onNextPage,
}: Props) {
  const [localSearch, setLocalSearch] =
    useState(searchTerm);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  return (
    <Panel className="overflow-hidden rounded-3xl border border-white/60 bg-white/75 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <PanelHeader
        eyebrow="Repository"
        title="Stored test cases"
        // description="Browse persisted cases exactly as the backend repository endpoints expose them."
        actions={
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
            <SlidersHorizontal
              size={16}
              className="text-slate-500"
            />

            <select
              value={sortBy}
              onChange={(event) =>
                onSortChange(
                  event.target.value
                )
              }
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              <option value="UpdatedAt">
                Updated At
              </option>

              <option value="CreatedAt">
                Created At
              </option>

              <option value="Feature">
                Feature
              </option>

              <option value="Popularity">
                Popularity
              </option>
            </select>
          </div>
        }
      />

      <div className="flex flex-col gap-6 p-6">
        {/* Search Toolbar */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            placeholder="Search testcase summaries, descriptions, or features..."
            value={localSearch}
            onChange={(event) =>
              setLocalSearch(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                onSearchSubmit(
                  localSearch.trim()
                );
              }
            }}
            className="
              h-12 w-full rounded-2xl border border-slate-200
              bg-white/90 pl-11 pr-28 text-sm text-slate-800
              outline-none transition-all duration-200
              placeholder:text-slate-400
              focus:border-slate-400
              focus:ring-4 focus:ring-slate-100
            "
          />

          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            Press Enter
          </div>
        </div>

        {/* Records List */}
        <div className="flex flex-col gap-3">
          {records.length > 0 ? (
            records.map((record) => {
              const id = String(
                record.id ||
                  record._id ||
                  ""
              );

              const active =
                selectedId === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    onSelect(id)
                  }
                  className={`
                    group relative overflow-hidden rounded-2xl border p-5 text-left
                    transition-all duration-200
                    ${
                      active
                        ? `
                          border-slate-900 bg-slate-900 text-white
                          shadow-xl shadow-slate-900/10
                        `
                        : `
                          border-slate-200 bg-white/85 hover:border-slate-300
                          hover:-translate-y-0.5 hover:shadow-md
                        `
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            flex h-10 w-10 items-center justify-center rounded-2xl
                            ${
                              active
                                ? "bg-white/10"
                                : "bg-slate-100"
                            }
                          `}
                        >
                          <FolderKanban
                            size={18}
                            className={
                              active
                                ? "text-white"
                                : "text-slate-600"
                            }
                          />
                        </div>

                        <div className="min-w-0">
                          <h3
                            className={`
                              truncate text-sm font-semibold
                              ${
                                active
                                  ? "text-white"
                                  : "text-slate-900"
                              }
                            `}
                          >
                            {
                              record[
                                "Test Case ID"
                              ]
                            }
                          </h3>

                          <p
                            className={`
                              mt-0.5 text-xs font-medium
                              ${
                                active
                                  ? "text-slate-300"
                                  : "text-slate-500"
                              }
                            `}
                          >
                            {record.Feature ||
                              "Unassigned feature"}
                          </p>
                        </div>
                      </div>

                      <p
                        className={`
                          mt-4 line-clamp-2 text-sm leading-relaxed
                          ${
                            active
                              ? "text-slate-200"
                              : "text-slate-600"
                          }
                        `}
                      >
                        {trimText(
                          record.TestCaseSummary ||
                            record[
                              "Test Case Description"
                            ],
                          120
                        )}
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className={`
                        mt-1 flex-shrink-0 transition-transform duration-200
                        group-hover:translate-x-0.5
                        ${
                          active
                            ? "text-slate-300"
                            : "text-slate-400"
                        }
                      `}
                    />
                  </div>

                  {active ? (
                    <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-amber-300" />
                  ) : null}
                </button>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Search
                  size={22}
                  className="text-slate-400"
                />
              </div>

              <h3 className="text-base font-semibold text-slate-800">
                No matching testcases
              </h3>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                Try refining your
                search query or
                changing the sorting
                strategy to discover
                additional repository
                records.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-slate-500">
            Page{" "}
            <span className="font-semibold text-slate-800">
              {page + 1}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={
                onPreviousPage
              }
              className="
                inline-flex items-center gap-2 rounded-2xl
                border border-slate-200 bg-white px-4 py-2.5
                text-sm font-semibold text-slate-700
                transition-all duration-200
                hover:border-slate-300 hover:bg-slate-50
              "
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            <button
              type="button"
              onClick={
                onNextPage
              }
              className="
                inline-flex items-center gap-2 rounded-2xl
                bg-slate-900 px-4 py-2.5
                text-sm font-semibold text-white
                transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-lg
              "
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </Panel>
  );
}