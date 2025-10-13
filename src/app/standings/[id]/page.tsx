"use client";
import { api } from "../../lib/api";
import { getToken } from "../../lib/auth";
import type { Me } from "../../lib/types";

type Row = { entry_id:number; team_name:string; points:number };

export default function Standings() {
  const router = useRouter();
  const params = useParams();
  const leagueId = Number(params?.id);
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => {
    if (!getToken()) { router.replace("/"); return; }
    api<Row[]>(`/standings/${leagueId}`).then(setRows).catch(e=>setErr(e.message));
  }, [router, leagueId]);

  return (
    <div className="card">
      <h2>Standings (League {leagueId})</h2>
      {err && <div style={{color:"#b91c1c"}}>{err}</div>}
      <div className="grid" style={{gap:8, marginTop:8}}>
        {rows.map((r,i)=>
          <div key={r.entry_id} className="row" style={{justifyContent:"space-between"}}>
            <div>#{i+1} &nbsp; {r.team_name}</div>
            <div style={{fontWeight:700}}>{r.points}</div>
          </div>
        )}
        {rows.length===0 && <div style={{color:"#64748b"}}>No entries yet.</div>}
      </div>
    </div>
  );
}
