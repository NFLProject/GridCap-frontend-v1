export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://nfl-fpl-backend.onrender.com";

export async function api<T = any>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers(opts.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers, cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}${text ? `: ${text}` : ""}`);
  }
  return (await res.json().catch(() => ({}))) as T;
}
