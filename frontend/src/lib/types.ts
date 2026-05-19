export type Role = "viewer" | "editor" | "admin";

export interface User {
  id: string;
  username: string;
  role: Role;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface SearchRequest {
  query: string;
  feature?: string;
  tags?: string[];
  priority?: string;
  platform?: string;
  ranking_variant: string;
}

export interface SearchResult {
  id: string;
  probability: number;
  test_case_id: string;
  feature: string;
  description: string;
  prerequisites: string;
  steps: string;
  summary: string;
  keywords: string[];
  tags: string[];
  priority?: string | null;
  platform?: string | null;
  playwright_script_id?: string | null;
}

export interface SearchResponse {
  query: string;
  feature_filter?: string | null;
  results_count: number;
  results: SearchResult[];
  from_cache: boolean;
  ranking_variant: string;
}

export interface UploadSummary {
  testcases_inserted: number;
  scripts_inserted: number;
  duplicates_skipped: number;
  total_groups: number;
}

export interface UploadResponse extends Partial<UploadSummary> {
  success: boolean;
  mode: "sync" | "background";
  job_id?: string;
  status?: string;
  filename?: string;
  created_at?: string;
  status_endpoint?: string;
}

export interface UploadJob {
  id: string;
  filename: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  started_at?: string | null;
  completed_at?: string | null;
  requested_by?: {
    id?: string | null;
    username?: string | null;
    role?: Role | null;
  };
  result?: UploadSummary | null;
  error?: string | null;
  progress?: Record<string, unknown>;
}

export interface UploadJobsResponse {
  success: boolean;
  count: number;
  jobs: UploadJob[];
}

export interface UploadJobResponse {
  success: boolean;
  job: UploadJob;
}

export interface TestCaseRecord {
  id?: string;
  _id?: string;
  "Test Case ID": string;
  Feature?: string;
  "Test Case Description"?: string;
  "Pre-requisites"?: string;
  Steps?: string;
  TestCaseSummary?: string;
  TestCaseKeywords?: string[];
  Tags?: string[];
  Priority?: string;
  Platform?: string;
  Popularity?: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  playwright_script_id?: string;
}

export interface TestCaseListResponse {
  success: boolean;
  count: number;
  skip: number;
  limit: number;
  test_cases: TestCaseRecord[];
}

export interface TestCaseResponse {
  success: boolean;
  test_case: TestCaseRecord;
}

export interface UpdateCasePayload {
  feature?: string;
  summary?: string;
  description?: string;
  prerequisites?: string;
  steps?: string;
  keywords?: string[];
  tags?: string[];
  priority?: string;
  platform?: string;
  popularity?: number;
  playwright_script_id?: string;
}

export interface PlaywrightScriptRecord {
  _id?: string;
  id?: string;
  testcase_id: string;
  testcase_object_id: string;
  script: string;
  created_at?: string;
}

export interface ScriptListEntry {
  test_case_id: string;
  test_case_description?: string;
  feature?: string;
  script?: PlaywrightScriptRecord | null;
}

export interface ScriptListResponse {
  success: boolean;
  count: number;
  skip: number;
  limit: number;
  data: ScriptListEntry[];
}

export interface CleanScriptResponse {
  code: string;
}

export interface HealthComponent {
  status: string;
  latency_ms?: number;
  preset?: string;
  model_name?: string;
  dimensions?: number;
  provider?: string;
  available?: boolean;
  details?: Record<string, unknown>;
  errors?: string[];
  error?: string;
  timestamp?: string;
}

export interface HealthDeepResponse {
  status: string;
  timestamp: string;
  uptime_seconds: number;
  components: Record<string, HealthComponent>;
  metrics: {
    requests_total: number;
    errors_total: number;
    error_rate: number;
  };
}

export interface StatsResponse {
  total_test_cases: number;
  total_scripts: number;
  cache?: {
    status?: string;
    backend?: string;
    namespace_version?: number;
    hit_rate?: number;
    hits?: number;
    misses?: number;
  };
  ingestion?: {
    started?: boolean;
    worker_count?: number;
    active_workers?: number;
    queue_size?: number;
    queue_max_size?: number;
  };
  metrics?: MetricsSnapshot;
  timestamp: string;
}

export interface MetricsSnapshot {
  timestamp: string;
  http_requests: Record<string, { count: number; avg_ms: number }>;
  http_errors: Record<string, number>;
  search: {
    total_operations: number;
    avg_results: number;
  };
  upload: {
    total_operations: number;
    total_documents: number;
  };
  cache: {
    hits: number;
    misses: number;
    hit_rate: number;
  };
  tracing: {
    sampled_requests: number;
  };
  background_jobs: Record<string, number>;
}

export interface DeleteAllResponse {
  success: boolean;
  message: string;
  testcases_deleted: number;
  scripts_deleted: number;
}
