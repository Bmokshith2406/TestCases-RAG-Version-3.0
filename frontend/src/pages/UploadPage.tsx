import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Activity,
  BrainCircuit,
  DatabaseZap,
  FileSpreadsheet,
  Loader2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { useState } from "react";

import { EmptyState } from "@/components/EmptyState";

import {
  Panel,
  PanelHeader,
} from "@/components/Panel";

import { UploadComposer } from "@/components/upload/UploadComposer";
import { UploadJobsPanel } from "@/components/upload/UploadJobsPanel";

import {
  api,
  ApiError,
} from "@/lib/api";

import { canEdit } from "@/lib/access";

import { useAuth } from "@/lib/auth";

export function UploadPage() {
  /* -------------------------------------------------------------------------- */
  /*                                   State                                    */
  /* -------------------------------------------------------------------------- */

  const queryClient =
    useQueryClient();

  const { role } =
    useAuth();

  const [file, setFile] =
    useState<File | null>(
      null
    );

  const [
    background,
    setBackground,
  ] = useState(true);

  /* -------------------------------------------------------------------------- */
  /*                                  Mutation                                  */
  /* -------------------------------------------------------------------------- */

  const uploadMutation =
    useMutation({
      mutationFn: () => {
        if (!file) {
          throw new Error(
            "Choose a CSV or Excel file first."
          );
        }

        return api.upload(
          file,
          background
        );
      },

      onSuccess:
        async () => {
          await Promise.all([
            queryClient.invalidateQueries(
              {
                queryKey: [
                  "upload",
                  "jobs",
                ],
              }
            ),

            queryClient.invalidateQueries(
              {
                queryKey: [
                  "stats",
                ],
              }
            ),

            queryClient.invalidateQueries(
              {
                queryKey: [
                  "cases",
                ],
              }
            ),

            queryClient.invalidateQueries(
              {
                queryKey: [
                  "scripts",
                ],
              }
            ),
          ]);
        },
    });

  /* -------------------------------------------------------------------------- */
  /*                                   Query                                    */
  /* -------------------------------------------------------------------------- */

  const jobsQuery = useQuery({
    queryKey: [
      "upload",
      "jobs",
    ],

    queryFn: () =>
      api.listUploadJobs(),

    enabled:
      canEdit(role),

    refetchInterval:
      5000,

    staleTime: 3000,
  });

  /* -------------------------------------------------------------------------- */
  /*                              Derived Values                                */
  /* -------------------------------------------------------------------------- */

  const canUpload =
    canEdit(role);

  const uploadMessage =
    uploadMutation.data
      ? uploadMutation.data
          .mode ===
        "background"
        ? `Background job queued: ${uploadMutation.data.job_id}`
        : `Inserted ${
            uploadMutation.data
              .testcases_inserted ||
            0
          } cases and ${
            uploadMutation.data
              .scripts_inserted ||
            0
          } scripts.`
      : null;

  const uploadError =
    uploadMutation.error instanceof
    ApiError
      ? uploadMutation.error
          .message
      : uploadMutation.error
      ? String(
          uploadMutation.error
        )
      : null;

  const totalJobs =
    jobsQuery.data?.jobs
      ?.length || 0;

  const processingJobs =
    jobsQuery.data?.jobs?.filter(
      (job) =>
        job.status ===
          "queued" ||
        job.status ===
          "processing"
    ).length || 0;

  /* -------------------------------------------------------------------------- */
  /*                               Access Guard                                 */
  /* -------------------------------------------------------------------------- */

  if (!canUpload) {
    return (
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 p-6">

        <Panel className="overflow-hidden rounded-[36px] border border-white/60 bg-white/75 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">

          <div className="p-10">

            <EmptyState
              title="Upload access is restricted"
              description="This ingestion workflow requires editor or administrator privileges because uploaded datasets directly modify the semantic testcase repository and linked automation assets."
            />

          </div>

        </Panel>

      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-8 p-6">


      {/* Upload Workspace */}
      <Panel className="overflow-hidden rounded-[36px] border border-white/60 bg-white/75 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">

        <PanelHeader
          eyebrow="Ingestion"
          title="Push new testcase files"
          description="Upload CSV or Excel datasets and process them synchronously or through the persistent background queue."
        />

        <div className="p-6 pt-0">

          <UploadComposer
            file={file}
            background={
              background
            }
            isUploading={
              uploadMutation.isPending
            }
            error={uploadError}
            message={
              uploadMessage
            }
            onFileChange={
              setFile
            }
            onBackgroundChange={
              setBackground
            }
            onSubmit={() =>
              uploadMutation.mutate()
            }
          />

        </div>

      </Panel>

      {/* Upload Jobs */}
      <UploadJobsPanel
        jobs={
          jobsQuery.data
            ?.jobs || []
        }
      />

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