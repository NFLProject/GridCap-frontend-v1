"use client";
import { api } from "../../lib/api";
import { getToken } from "../../lib/auth";
import type { Me } from "../../lib/types";


type Player = { id:number; name:string; pos:string; team:string; price_m:number };

const CAP = 100.0;
const REQUIRED = 15;
const GW = 1;

export default function Market() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [pos, setPos] = useState<"ALL"|"QB"|"RB"|"WR"|"TE"|"K"|"DST">("ALL");
  const [err, setErr] = useState<string|null>(null);
  useEffect(() => {
    if (!getToken()) { router.replace("/"); return; }
    api<Player[]>("/players").then(setPlayers).catch(e=>setErr(e.message));
  }, [router]);

  const filtered = useMemo(()=> pos==="ALL" ? players : players.filter(p=>p.pos===pos), [pos, players]);
  const used = selected.reduce((sum,id)=> sum + (players.find(p=>p.id===id)?.price_m || 0), 0);

  function toggle(id:number) {
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : (prev.length<REQUIRED ? [...prev, id] : prev));
  }

  async function save() {
    setErr(null);
    if (selected.length !== REQUIRED) return setErr(`Pick exactly ${REQUIRED}.`);
    if (used > CAP) return setErr(`Over budget (£${used.toFixed(1)}m / £${CAP.toFixed(1)}m).`);
    try {
      await api("/squad/set", { method:"POST", body: JSON.stringify({ gameweek: GW, player_ids: selected }) });
      router.replace("/lineup");
    } catch (e:any) { setErr(e.message); }
  }

  return (
    <div className="grid" style={{gap:12}}>
      <div className="card">
        <div className="row" style={{alignItems:"center"}}>
          <div className="badge">Budget</div>
          <div>£{used.toFixed(1)}m / £{CAP.toFixed(1)}m</div>
          <div style={{marginLeft:"auto"}}>Selected: {selected.length}/{REQUIRED}</div>
          <button className="btn" onClick={save} disabled={selected.length!==REQUIRED || used>CAP}>Save squad</button>
        </div>
        <div className="row" style={{marginTop:8}}>
          {(["ALL","QB","RB","WR","TE","K","DST"] as const).map(t =>
            <button key={t} className={`btn ${pos===t?"":"secondary"}`} onClick={()=>setPos(t)}>{t}</button>
          )}
        </div>
        {err && <div style={{color:"#b91c1c", marginTop:8}}>{err}</div>}
      </div>

      <div className="grid grid3">
        {filtered.map(p=>{
          const on = selected.includes(p.id);
          return (
            <div key={p.id} className="card">
              <div style={{fontSize:12, color:"#64748b"}}>{p.pos} • {p.team}</div>
              <div style={{fontWeight:700}}>{p.name}</div>
              <div style={{fontSize:12}}>£{p.price_m.toFixed(1)}m</div>
              <button className={`btn ${on?"secondary":""}`} onClick={()=>toggle(p.id)}>{on?"Remove":"Add"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
