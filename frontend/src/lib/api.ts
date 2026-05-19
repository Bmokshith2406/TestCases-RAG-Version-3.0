import type {
  CleanScriptResponse,
  DeleteAllResponse,
  HealthDeepResponse,
  MetricsSnapshot,
  ScriptListResponse,
  SearchRequest,
  SearchResponse,
  StatsResponse,
  TestCaseListResponse,
  TestCaseResponse,
  TokenResponse,
  UpdateCasePayload,
  UploadJobResponse,
  UploadJobsResponse,
  UploadResponse,
  User,
} from "./types";
import type { RegisterPayload } from "@/types/auth.types";

export const AUTH_STORAGE_KEY = "testcasesrag.access_token";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function getStoredToken(): string | null {
  return window.localStorage.getItem(AUTH_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  window.localStorage.setItem(AUTH_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const typedPayload = payload as {
      detail?: unknown;
      error?: { message?: string };
    };

    if (typeof typedPayload.detail === "string") {
      return typedPayload.detail;
    }

    if (
      typedPayload.detail &&
      typeof typedPayload.detail === "object" &&
      "message" in typedPayload.detail
    ) {
      const detailMessage = (typedPayload.detail as { message?: string }).message;
      if (typeof detailMessage === "string") {
        return detailMessage;
      }
    }

    if (typeof typedPayload.error?.message === "string") {
      return typedPayload.error.message;
    }
  }

  return fallback;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  options: { auth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  const usesFormData = init.body instanceof FormData;

  if (!usesFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false) {
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(payload, `Request failed with status ${response.status}`),
      response.status,
      payload,
    );
  }

  return payload as T;
}

export const api = {
  getHealthDeep: () => request<HealthDeepResponse>("/health/deep", { method: "GET" }, { auth: false }),
  getCurrentUser: () => request<User>("/auth/me"),
  login: (username: string, password: string) =>
    request<TokenResponse>(
      "/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      },
      { auth: false },
    ),
  register: (payload: RegisterPayload) =>
    request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  search: (payload: SearchRequest) =>
    request<SearchResponse>("/api/search", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  upload: (file: File, background: boolean) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<UploadResponse>(`/api/upload?background=${background ? "true" : "false"}`, {
      method: "POST",
      body: formData,
    });
  },
  listUploadJobs: (status?: string) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return request<UploadJobsResponse>(`/api/upload/jobs${query}`, { method: "GET" });
  },
  getUploadJob: (jobId: string) =>
    request<UploadJobResponse>(`/api/upload/jobs/${encodeURIComponent(jobId)}`, { method: "GET" }),
  listCases: (params: { skip: number; limit: number; sortBy: string; order: 1 | -1 }) =>
    request<TestCaseListResponse>(
      `/api/get-all?skip=${params.skip}&limit=${params.limit}&sort_by=${encodeURIComponent(params.sortBy)}&order=${params.order}`,
      { method: "GET" },
    ),
  getCaseById: (id: string) =>
    request<TestCaseResponse>(`/api/get-by-id/${encodeURIComponent(id)}`, { method: "GET" }),
  updateCase: (id: string, payload: UpdateCasePayload) =>
    request<{ success: boolean; message: string }>(`/api/update/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteCase: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/delete/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  listScripts: () => request<ScriptListResponse>("/api/get-all-scripts", { method: "GET" }),
  getCleanScript: (scriptId: string) =>
    request<CleanScriptResponse>(`/api/get-script/${encodeURIComponent(scriptId)}`, { method: "GET" }),
  getStats: () => request<StatsResponse>("/api/stats", { method: "GET" }),
  getMetricsJson: () => request<MetricsSnapshot>("/metrics/json", { method: "GET" }),
  deleteAllData: () =>
    request<DeleteAllResponse>("/api/delete-all?confirm=true", {
      method: "POST",
    }),
};
