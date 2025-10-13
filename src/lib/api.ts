import { getToken } from "../lib/auth";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://nfl-fpl-backend.onrender.com";

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const uid = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": uid ?? "",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}
