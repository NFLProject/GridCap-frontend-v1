"use client";
import { api } from "../../lib/api";
import { getToken } from "../../lib/auth";
import type { Me } from "../../lib/types";


export default function JoinLeague() {
  const router = useRouter();
  const [leagueId, setLeagueId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => { if (!getToken()) router.replace("/"); }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    try {
      const data = await api<{league_id:number; entry_id:number}>("/league/join", {
        method: "POST", body: JSON.stringify({ league_id: Number(leagueId), team_name: teamName })
      });
      localStorage.setItem("leagueId", String(data.league_id));
      localStorage.setItem("entryId", String(data.entry_id));
      router.replace("/market");
    } catch (e:any) { setErr(e.message); }
  }

  return (
    <div className="card">
      <h2>Join a league</h2>
      <form onSubmit={submit} className="grid" style={{gap:12, marginTop:8}}>
        <label>League ID
          <input className="input" value={leagueId} onChange={e=>setLeagueId(e.target.value)} required />
        </label>
        <label>Your team name
          <input className="input" value={teamName} onChange={e=>setTeamName(e.target.value)} required />
        </label>
        {err && <div style={{color:"#b91c1c"}}>{err}</div>}
        <button className="btn">Join & continue</button>
      </form>
    </div>
  );
}
