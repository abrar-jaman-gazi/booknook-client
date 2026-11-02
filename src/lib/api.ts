
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is missing.");
}

/**
 * Gets a JWT from the Next.js Better Auth session.
 */
async function getBackendToken(): Promise<string> {
  const response = await fetch("/api/backend-token", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.token) {
    throw new Error(data.message || "Authentication required.");
  }

  return data.token as string;
}

/**
 * Makes authenticated requests to the Express backend.
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getBackendToken();

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${token}`);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });
}

/**
 * Handles API responses and returns JSON data.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await apiFetch(endpoint, options);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong with the API request."
    );
  }

  return data as T;
}
