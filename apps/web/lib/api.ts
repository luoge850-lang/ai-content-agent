// API client for the FastAPI backend.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, body.detail || "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export const auth = {
  register: (data: { email: string; password: string; display_name?: string; team_name?: string }) =>
    request<{ access_token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    request<{ access_token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: () => request<User>("/auth/me"),
  updateMe: (data: { display_name?: string; team_name?: string }) =>
    request<User>("/auth/me", { method: "PATCH", body: JSON.stringify(data) }),
};

// Projects
export const projects = {
  list: () => request<Project[]>("/projects/"),
  create: (data: { name: string; product_description?: string; target_audience?: string }) =>
    request<Project>("/projects/", { method: "POST", body: JSON.stringify(data) }),
  get: (id: string) => request<Project>(`/projects/${id}`),
  update: (id: string, data: Partial<Project>) =>
    request<Project>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/projects/${id}`, { method: "DELETE" }),
};

// Contents
export const contents = {
  list: (params?: { project_id?: string; platform_slug?: string; status?: string }) => {
    const search = new URLSearchParams();
    if (params?.project_id) search.set("project_id", params.project_id);
    if (params?.platform_slug) search.set("platform_slug", params.platform_slug);
    if (params?.status) search.set("status", params.status);
    const qs = search.toString();
    return request<Content[]>(`/contents/${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => request<Content>(`/contents/${id}`),
  update: (id: string, data: Partial<Content>) =>
    request<Content>(`/contents/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`/contents/${id}`, { method: "DELETE" }),
};

// Generate
export const generate = {
  create: (data: {
    project_id: string;
    platform_slug?: string;
    platform_slugs?: string[];
    tone: string;
    product_description?: string;
    target_audience?: string;
  }) =>
    request<GenerateResult>("/generate/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  batch: (data: {
    project_id: string;
    platform_slugs: string[];
    tone: string;
    product_description?: string;
    target_audience?: string;
  }) =>
    request<BatchGenerateResult>("/generate/batch", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Analytics
export const analytics = {
  summary: () => request<AnalyticsSummary>("/analytics/summary"),
};

// Types
export interface User {
  id: string;
  email: string;
  display_name: string;
  team_name: string;
  plan: string;
  credits_remaining: number;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  product_description: string;
  target_audience: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  display_id: string;
  project_id: string;
  platform_slug: string;
  platform_display_name: string;
  title: string;
  body: string;
  image_prompt: string;
  tone: string;
  status: string;
  generation_status: string;
  views: number;
  likes: number;
  conversion: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GenerateResult {
  content_id: string;
  display_id: string;
  title: string;
  body: string;
  image_prompt: string;
  platform_slug: string;
  tone: string;
  model: string;
  tokens_used: number;
  duration_ms: number;
  generation_status: string;
}

export interface BatchGenerateResult {
  results: GenerateResult[];
  total_credits_used: number;
}

export interface AnalyticsSummary {
  total_projects: number;
  total_contents: number;
  total_views: number;
  total_likes: number;
  total_conversion: number;
  credits_used: number;
  by_platform: PlatformMetrics[];
}

export interface PlatformMetrics {
  platform_slug: string;
  platform_display_name: string;
  total_contents: number;
  total_views: number;
  total_likes: number;
  total_conversion: number;
}

export { ApiError };
