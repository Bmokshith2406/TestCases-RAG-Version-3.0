import {
  AlertTriangle,
  PencilLine,
  Save,
  Trash2,
  ShieldCheck,
} from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { Panel, PanelHeader } from "@/components/Panel";
import { canEdit, isAdmin } from "@/lib/access";
import {
  formatDate,
  parseCommaSeparatedList,
} from "@/lib/format";
import type {
  Role,
  TestCaseRecord,
  UpdateCasePayload,
} from "@/lib/types";

type Props = {
  role: Role | null;
  testcase?: TestCaseRecord;
  formState: UpdateCasePayload;
  saveError?: string | null;
  deleteError?: string | null;
  isSaving: boolean;
  isDeleting: boolean;
  onChange: <K extends keyof UpdateCasePayload>(
    field: K,
    value: UpdateCasePayload[K]
  ) => void;
  onSave: () => void;
  onDelete: () => void;
};

export function CaseEditorPanel({
  role,
  testcase,
  formState,
  saveError,
  deleteError,
  isSaving,
  isDeleting,
  onChange,
  onSave,
  onDelete,
}: Props) {
  const editable = canEdit(role);
  const admin = isAdmin(role);

  return (
    <Panel className="border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] rounded-3xl overflow-hidden">
      
      <PanelHeader
        eyebrow="Detail + Curation"
        title={testcase?.["Test Case ID"] || "Select a testcase"}
        description={
          editable
            ? "Refine metadata, improve semantic quality, and push intentional updates through the platform."
            : "Viewer access is restricted to read-only inspection."
        }
      />

      {testcase ? (
        <div className="flex flex-col gap-8 p-6">

          {/* Top Meta Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <article className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5 backdrop-blur-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-amber-700/80 mb-2">
                Feature
              </p>

              <h3 className="text-sm font-semibold text-slate-900 leading-relaxed">
                {testcase.Feature || "Unknown"}
              </h3>
            </article>

            <article className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5 backdrop-blur-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-sky-700/80 mb-2">
                Updated
              </p>

              <h3 className="text-sm font-semibold text-slate-900">
                {formatDate(
                  testcase.UpdatedAt || testcase.CreatedAt
                )}
              </h3>
            </article>

            <article className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 backdrop-blur-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700/80 mb-2">
                Linked Script
              </p>

              <h3 className="text-sm font-semibold text-slate-900 break-all">
                {testcase.playwright_script_id || "None"}
              </h3>
            </article>

          </div>

          {/* Form Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            <Field
              label="Feature"
              disabled={!editable}
            >
              <input
                className={inputClass(editable)}
                value={formState.feature || ""}
                disabled={!editable}
                onChange={(event) =>
                  onChange("feature", event.target.value)
                }
              />
            </Field>

            <Field
              label="Priority"
              disabled={!editable}
            >
              <input
                className={inputClass(editable)}
                value={formState.priority || ""}
                disabled={!editable}
                onChange={(event) =>
                  onChange("priority", event.target.value)
                }
              />
            </Field>

            <Field
              label="Platform"
              disabled={!editable}
            >
              <input
                className={inputClass(editable)}
                value={formState.platform || ""}
                disabled={!editable}
                onChange={(event) =>
                  onChange("platform", event.target.value)
                }
              />
            </Field>

            <Field
              label="Popularity"
              disabled={!editable}
            >
              <input
                type="number"
                step="0.1"
                className={inputClass(editable)}
                disabled={!editable}
                value={formState.popularity ?? 0}
                onChange={(event) =>
                  onChange(
                    "popularity",
                    Number(event.target.value || 0)
                  )
                }
              />
            </Field>

            <Field
              label="Summary"
              disabled={!editable}
              span
            >
              <textarea
                rows={3}
                className={textareaClass(editable)}
                disabled={!editable}
                value={formState.summary || ""}
                onChange={(event) =>
                  onChange("summary", event.target.value)
                }
              />
            </Field>

            <Field
              label="Description"
              disabled={!editable}
              span
            >
              <textarea
                rows={5}
                className={textareaClass(editable)}
                disabled={!editable}
                value={formState.description || ""}
                onChange={(event) =>
                  onChange("description", event.target.value)
                }
              />
            </Field>

            <Field
              label="Pre-requisites"
              disabled={!editable}
              span
            >
              <textarea
                rows={4}
                className={textareaClass(editable)}
                disabled={!editable}
                value={formState.prerequisites || ""}
                onChange={(event) =>
                  onChange("prerequisites", event.target.value)
                }
              />
            </Field>

            <Field
              label="Steps"
              disabled={!editable}
              span
            >
              <textarea
                rows={8}
                className={textareaClass(editable)}
                disabled={!editable}
                value={formState.steps || ""}
                onChange={(event) =>
                  onChange("steps", event.target.value)
                }
              />
            </Field>

            <Field
              label="Keywords"
              disabled={!editable}
            >
              <input
                className={inputClass(editable)}
                disabled={!editable}
                value={(formState.keywords || []).join(", ")}
                onChange={(event) =>
                  onChange(
                    "keywords",
                    parseCommaSeparatedList(event.target.value)
                  )
                }
              />
            </Field>

            <Field
              label="Tags"
              disabled={!editable}
            >
              <input
                className={inputClass(editable)}
                disabled={!editable}
                value={(formState.tags || []).join(", ")}
                onChange={(event) =>
                  onChange(
                    "tags",
                    parseCommaSeparatedList(event.target.value)
                  )
                }
              />
            </Field>

            <Field
              label="Linked Playwright Script ID"
              disabled={!editable}
              span
            >
              <input
                className={inputClass(editable)}
                disabled={!editable}
                value={formState.playwright_script_id || ""}
                onChange={(event) =>
                  onChange(
                    "playwright_script_id",
                    event.target.value
                  )
                }
              />
            </Field>

          </div>

          {/* Errors */}
          <div className="space-y-3">
            
            {saveError ? (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 flex-shrink-0"
                />

                <span className="text-sm font-medium">
                  {saveError}
                </span>
              </div>
            ) : null}

            {deleteError ? (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 flex-shrink-0"
                />

                <span className="text-sm font-medium">
                  {deleteError}
                </span>
              </div>
            ) : null}

          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">

            {!editable ? (
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                <ShieldCheck size={16} />

                <span className="text-sm font-medium">
                  Read-only mode enabled.
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />

                {isSaving ? "Saving..." : "Save updates"}
              </button>
            )}

            {admin ? (
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={16} />

                {isDeleting
                  ? "Deleting..."
                  : "Delete testcase"}
              </button>
            ) : null}

          </div>

        </div>
      ) : (
        <div className="p-6">
          <EmptyState
            title="No testcase selected"
            description="Choose a testcase from the explorer to inspect and manage its stored metadata."
          />
        </div>
      )}
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*                                UI Helpers                                   */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  children,
  disabled,
  span,
}: {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
  span?: boolean;
}) {
  return (
    <label
      className={`flex flex-col gap-2 ${
        span ? "xl:col-span-2" : ""
      }`}
    >
      <span
        className={`text-sm font-semibold ${
          disabled
            ? "text-slate-500"
            : "text-slate-700"
        }`}
      >
        {label}
      </span>

      {children}
    </label>
  );
}

function inputClass(editable: boolean) {
  return `
    w-full rounded-2xl border px-4 py-3 text-sm
    transition-all duration-200 outline-none
    ${
      editable
        ? `
          border-slate-200 bg-white/90 text-slate-900
          focus:border-slate-400 focus:ring-4 focus:ring-slate-100
        `
        : `
          border-slate-100 bg-slate-50 text-slate-500
          cursor-not-allowed
        `
    }
  `;
}

function textareaClass(editable: boolean) {
  return `
    min-h-[120px] w-full resize-y rounded-2xl border px-4 py-3 text-sm leading-relaxed
    transition-all duration-200 outline-none
    ${
      editable
        ? `
          border-slate-200 bg-white/90 text-slate-900
          focus:border-slate-400 focus:ring-4 focus:ring-slate-100
        `
        : `
          border-slate-100 bg-slate-50 text-slate-500
          cursor-not-allowed
        `
    }
  `;
}