"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "../../lib/api";
import { getToken, clearToken } from "../../lib/auth";
import type { Me } from "../../lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Require a token; if none, go back to sign-in
    const token = getToken();
    if (!token) {
      router.replace("/");
      return;
    }

    // Load the current user
    api<Me>("/me")
      .then(setMe)
      .catch((e) => {
        console.error(e);
        setError("Could not load your account. Please sign in again.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const signOut = () => {
    clearToken();
    router.replace("/");
  };

  if (loading) return <main className="p-6">Loading…</main>;

  if (error || !me) {
    return (
      <main className="p-6 space-y-4">
        <p className="text-red-600">{error ?? "Session expired."}</p>
        <button
          onClick={signOut}
          className="rounded px-4 py-2 bg-black text-white"
        >
          Go to sign in
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome, {me.name}</h1>

      <section className="space-x-3">
        <button
          onClick={() => router.push("/leagues")}
          className="rounded px-4 py-2 bg-black text-white"
        >
          Create / Join a League
        </button>
        <button
          onClick={() => router.push("/lineup")}
          className="rounded px-4 py-2 border"
        >
          Build Your Team
        </button>
      </section>

      <section className="text-sm text-gray-500">
        <button onClick={signOut} className="underline">
          Sign out
        </button>
      </section>
    </main>
  );
}
