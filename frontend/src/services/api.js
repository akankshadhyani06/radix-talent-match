/**
 * Centralized browser-side API request helpers.
 * Configure VITE_API_BASE_URL in the frontend environment when needed.
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}.`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getHealth() {
  return apiRequest("/health");
}
