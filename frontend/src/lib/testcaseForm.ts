import type { TestCaseRecord, UpdateCasePayload } from "@/lib/types";

export const emptyCaseForm: UpdateCasePayload = {
  feature: "",
  summary: "",
  description: "",
  prerequisites: "",
  steps: "",
  keywords: [],
  tags: [],
  priority: "",
  platform: "",
  popularity: 0,
  playwright_script_id: "",
};

export function mapTestCaseToUpdatePayload(testcase: TestCaseRecord): UpdateCasePayload {
  return {
    feature: testcase.Feature || "",
    summary: testcase.TestCaseSummary || "",
    description: testcase["Test Case Description"] || "",
    prerequisites: testcase["Pre-requisites"] || "",
    steps: testcase.Steps || "",
    keywords: testcase.TestCaseKeywords || [],
    tags: testcase.Tags || [],
    priority: testcase.Priority || "",
    platform: testcase.Platform || "",
    popularity: testcase.Popularity || 0,
    playwright_script_id: testcase.playwright_script_id || "",
  };
}

function sameString(left?: string | null, right?: string | null): boolean {
  return String(left || "").trim() === String(right || "").trim();
}

function sameList(left?: string[] | null, right?: string[] | null): boolean {
  const a = (left || []).map((item) => String(item || "").trim()).filter(Boolean);
  const b = (right || []).map((item) => String(item || "").trim()).filter(Boolean);
  return JSON.stringify(a) === JSON.stringify(b);
}

export function buildUpdatePayload(original: TestCaseRecord, draft: UpdateCasePayload): UpdateCasePayload {
  const payload: UpdateCasePayload = {};
  const baseline = mapTestCaseToUpdatePayload(original);

  if (!sameString(draft.feature, baseline.feature) && String(draft.feature || "").trim()) {
    payload.feature = String(draft.feature || "").trim();
  }

  if (!sameString(draft.summary, baseline.summary) && String(draft.summary || "").trim()) {
    payload.summary = String(draft.summary || "").trim();
  }

  if (!sameString(draft.description, baseline.description) && String(draft.description || "").trim()) {
    payload.description = String(draft.description || "").trim();
  }

  if (!sameString(draft.prerequisites, baseline.prerequisites) && String(draft.prerequisites || "").trim()) {
    payload.prerequisites = String(draft.prerequisites || "").trim();
  }

  if (!sameString(draft.steps, baseline.steps) && String(draft.steps || "").trim()) {
    payload.steps = String(draft.steps || "").trim();
  }

  if (!sameList(draft.keywords, baseline.keywords)) {
    payload.keywords = (draft.keywords || []).map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (!sameList(draft.tags, baseline.tags)) {
    payload.tags = (draft.tags || []).map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (!sameString(draft.priority, baseline.priority)) {
    payload.priority = String(draft.priority || "").trim();
  }

  if (!sameString(draft.platform, baseline.platform)) {
    payload.platform = String(draft.platform || "").trim();
  }

  if ((draft.popularity || 0) !== (baseline.popularity || 0)) {
    payload.popularity = Number(draft.popularity || 0);
  }

  if (!sameString(draft.playwright_script_id, baseline.playwright_script_id)) {
    payload.playwright_script_id = String(draft.playwright_script_id || "").trim();
  }

  return payload;
}
