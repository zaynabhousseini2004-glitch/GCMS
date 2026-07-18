const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

// ─── Token helpers ────────────────────────────────────────────────────────────
// sessionStorage is tab-isolated: each browser window keeps its own credentials
// even within the same incognito session, preventing windows from overwriting
// each other's tokens when multiple roles are tested simultaneously.

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("token");
}

export function setToken(token: string): void {
  sessionStorage.setItem("token", token);
}

export function clearToken(): void {
  sessionStorage.removeItem("token");
}

// ─── Error ────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Whether to attach the Bearer token. Defaults to true. */
  auth?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true, params } = options;

  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ message: res.statusText }));
    const message = (errData as { message?: string }).message ?? res.statusText;

    // When the server signals the account is inactive or campus access was revoked,
    // clear the session immediately so the user cannot continue acting on stale state.
    if (res.status === 403 && typeof window !== 'undefined') {
      const lower = message.toLowerCase();
      if (lower.includes('inactive')) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('auth_user');
        window.location.href = '/login?reason=inactive';
      } else if (lower.includes('no longer have admin access')) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('auth_user');
        window.location.href = '/login?reason=no-campus';
      }
    }

    throw new ApiError(res.status, message, errData);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
