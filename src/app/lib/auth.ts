// src/lib/auth.ts
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("uid");
}
