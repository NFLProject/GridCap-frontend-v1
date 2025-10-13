// src/app/dashboard/page.tsx
"use client";

import { api } from "../../lib/api";
import { getToken } from "../../lib/auth";
import type { Me } from "../../lib/types";


export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    const uid = getToken();
    if (!uid) {
      router.replace("/");
      return;
    }

    (async () => {
      try {
        // NOTE: backend route is /me (not /auth/me)
        const data = await api<Me>("/me");
        setMe(data);
      } catch {
        router.replace("/");
      }
    })();
  }, [router]);

  if (!me) return null;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Welcome, {me.name}</h1>
      <p className="text-sm text-gray-500">{me.email}</p>
      {/* ...your dashboard UI... */}
    </main>
  );
}
