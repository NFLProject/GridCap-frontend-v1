"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setAuth } from "./lib/api";

export default function HomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"register"|"login">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      if (mode === "register") {
        const data = await api<{token:string; user:any}>("/auth/register", { method:"POST", body: JSON.stringify({ name, email, password }) });
        setAuth(data.token, data.user);
      } else {
        const data = await api<{token:string; user:any}>("/auth/login", { method:"POST", body: JSON.stringify({ email, password }) });
        setAuth(data.token, data.user);
      }
      router.replace("/dashboard");
    } catch (e:any) { setErr(e.message || "Failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <div className="row">
          <button className={`btn ${mode==="register"?"":"secondary"}`} onClick={()=>setMode("register")}>Register</button>
          <button className={`btn ${mode==="login"?"":"secondary"}`} onClick={()=>setMode("login")}>Login</button>
        </div>
        <form onSubmit={submit} className="grid" style={{gap:12, marginTop:12}}>
          {mode==="register" && (
            <label> Name
              <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
            </label>
          )}
          <label>Email
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </label>
          <label>Password
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </label>
          {err && <div style={{color:"#b91c1c", fontSize:14}}>{err}</div>}
          <button className="btn" disabled={loading}>{loading?"Please wait…":(mode==="register"?"Create account":"Log in")}</button>
        </form>
      </div>
    </div>
  );
}
