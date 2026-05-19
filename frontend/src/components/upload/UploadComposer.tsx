import {
  CheckCircle2,
  CloudUpload,
  DatabaseZap,
  FileSpreadsheet,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Props = {
  file: File | null;
  background: boolean;
  isUploading: boolean;
  error?: string | null;
  message?: string | null;
  onFileChange: (
    file: File | null
  ) => void;
  onBackgroundChange: (
    value: boolean
  ) => void;
  onSubmit: () => void;
};

export function UploadComposer({
  file,
  background,
  isUploading,
  error,
  message,
  onFileChange,
  onBackgroundChange,
  onSubmit,
}: Props) {
  return (
    <div className="flex flex-col gap-8">

      {/* Top Capability Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <CapabilityCard
          title="Semantic Ingestion"
          description="Structured testcase parsing"
          icon={
            <DatabaseZap size={18} />
          }
          accent="amber"
        />

        <CapabilityCard
          title="Background Workers"
          description="Queue-based processing"
          icon={
            <ShieldCheck size={18} />
          }
          accent="blue"
        />

        <CapabilityCard
          title="Supported Formats"
          description="CSV, XLSX, XLS"
          icon={
            <FileSpreadsheet
              size={18}
            />
          }
          accent="emerald"
        />

      </div>

      {/* Main Upload Workspace */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">

        {/* Upload Area */}
        <label className="group relative overflow-hidden rounded-[36px] border border-dashed border-slate-300 bg-gradient-to-br from-white via-slate-50/60 to-amber-50/20 p-8 shadow-sm transition-all duration-300 hover:border-slate-400 hover:shadow-lg">

          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.10),transparent_30%)] opacity-80" />

          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(event) =>
              onFileChange(
                event.target.files?.[0] ||
                  null
              )
            }
          />

          <div className="relative flex h-full flex-col items-center justify-center text-center">

            {/* Upload Icon */}
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] bg-white shadow-xl transition-transform duration-300 group-hover:scale-105">
              
              <CloudUpload
                size={38}
                className="text-slate-700"
              />

            </div>

            {/* Text */}
            <h3 className="text-2xl font-bold text-slate-900">
              {file
                ? file.name
                : "Drop or choose a dataset"}
            </h3>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500">
              Upload structured testcase datasets
              for semantic ingestion, indexing,
              metadata enrichment, and automated
              vector embedding generation.
            </p>

            {/* Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">

              <UploadPill
                icon={
                  <FileSpreadsheet
                    size={14}
                  />
                }
                label="CSV"
              />

              <UploadPill
                icon={
                  <FileSpreadsheet
                    size={14}
                  />
                }
                label="XLSX"
              />

              <UploadPill
                icon={
                  <Sparkles
                    size={14}
                  />
                }
                label="Semantic Ready"
              />

            </div>

            {/* Selected */}
            {file ? (
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                
                <CheckCircle2
                  size={15}
                />

                File ready for ingestion

              </div>
            ) : null}

          </div>

        </label>

        {/* Configuration Panel */}
        <div className="overflow-hidden rounded-[36px] border border-white/60 bg-white/80 shadow-sm backdrop-blur-xl">

          <div className="flex h-full flex-col gap-8 p-7">

            {/* Header */}
            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                
                <DatabaseZap
                  size={14}
                />

                Execution Controls

              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                Ingestion Configuration
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Configure how uploaded datasets
                should be processed and routed
                through the ingestion pipeline.
              </p>

            </div>

            {/* Execution Mode */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h4 className="text-sm font-semibold text-slate-900">
                    Background Processing
                  </h4>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Queue ingestion jobs for async
                    execution and scalable worker
                    processing.
                  </p>

                </div>

                {/* Toggle */}
                <label className="relative inline-flex cursor-pointer items-center">

                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={background}
                    onChange={(
                      event
                    ) =>
                      onBackgroundChange(
                        event.target
                          .checked
                      )
                    }
                  />

                  <div
                    className="
                      peer h-7 w-12 rounded-full bg-slate-300
                      transition-colors duration-300
                      peer-checked:bg-slate-900
                      after:absolute after:left-1 after:top-1
                      after:h-5 after:w-5 after:rounded-full
                      after:bg-white after:transition-transform
                      after:duration-300 after:content-['']
                      peer-checked:after:translate-x-5
                    "
                  />

                </label>

              </div>

              {/* Status */}
              <div
                className={`
                  mt-5 rounded-2xl border px-4 py-3 text-sm font-medium
                  ${
                    background
                      ? `
                        border-emerald-200 bg-emerald-50 text-emerald-700
                      `
                      : `
                        border-amber-200 bg-amber-50 text-amber-700
                      `
                  }
                `}
              >
                {background
                  ? "Recommended for large datasets. The API returns a queued job id and processes ingestion asynchronously."
                  : "Runs ingestion inline and immediately returns the processing summary response."}
              </div>

            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={
                isUploading || !file
              }
              className="
                inline-flex items-center justify-center gap-3
                rounded-3xl bg-slate-900 px-6 py-4
                text-sm font-semibold text-white
                transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isUploading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />

                  Uploading...
                </>
              ) : (
                <>
                  <CloudUpload
                    size={18}
                  />

                  Start ingestion
                </>
              )}
            </button>

            {/* Footer */}
            {/* <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50/70 p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Sparkles
                    size={20}
                    className="text-slate-700"
                  />
                </div>

                <div>

                  <h4 className="text-sm font-semibold text-slate-900">
                    AI Pipeline Enabled
                  </h4>

                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    Uploaded datasets will be
                    normalized, enriched, indexed,
                    and embedded automatically.
                  </p>

                </div>

              </div>

            </div> */}

          </div>

        </div>

      </div>

      {/* Messages */}
      <div className="space-y-4">

        {error ? (
          <div className="flex items-start gap-4 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 shadow-sm">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
              <CloudUpload
                size={18}
              />
            </div>

            <div>

              <h4 className="text-sm font-semibold">
                Upload failed
              </h4>

              <p className="mt-1 text-sm leading-relaxed opacity-90">
                {error}
              </p>

            </div>

          </div>
        ) : null}

        {message ? (
          <div className="flex items-start gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 shadow-sm">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
              <CheckCircle2
                size={18}
              />
            </div>

            <div>

              <h4 className="text-sm font-semibold">
                Upload completed
              </h4>

              <p className="mt-1 text-sm leading-relaxed opacity-90">
                {message}
              </p>

            </div>

          </div>
        ) : null}

      </div>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

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

function UploadPill({
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