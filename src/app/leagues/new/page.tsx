"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "../../lib/api";

export default function CreateLeague() {
  const router = useRouter();
  const [leagueName, setLeagueName] = useState("GridCap League");
  const [teamName, setTeamName] = useState("");
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => { if (!getToken()) router.replace("/"); }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    try {
      const data = await api<{league_id:number; entry_id:number}>("/league/create", {
        method: "POST", body: JSON.stringify({ name: leagueName, team_name: teamName })
      });
      localStorage.setItem("leagueId", String(data.league_id));
      localStorage.setItem("entryId", String(data.entry_id));
      router.replace("/market");
    } catch (e:any) { setErr(e.message); }
  }

  return (
    <div className="card">
      <h2>Create a league</h2>
      <form onSubmit={submit} className="grid" style={{gap:12, marginTop:8}}>
        <label>League name
          <input className="input" value={leagueName} onChange={e=>setLeagueName(e.target.value)} required />
        </label>
        <label>Your team name
          <input className="input" value={teamName} onChange={e=>setTeamName(e.target.value)} required />
        </label>
        {err && <div style={{color:"#b91c1c"}}>{err}</div>}
        <button className="btn">Create & continue</button>
      </form>
    </div>
  );
}
