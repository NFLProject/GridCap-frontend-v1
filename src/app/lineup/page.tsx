"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "../lib/api";

type Pick = { player_id:number };
type Player = { id:number; name:string; pos:string; team:string; price_m:number };
const GW = 1;

export default function Lineup() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [squad, setSquad] = useState<number[]>([]);
  const [starters, setStarters] = useState<number[]>([]);
  const [captain, setCaptain] = useState<number|null>(null);
  const [vice, setVice] = useState<number|null>(null);
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => {
    if (!getToken()) { router.replace("/"); return; }
    Promise.all([
      api<Player[]>("/players"),
      api<{picks:Pick[] }>(`/squad?gw=${GW}`)
    ]).then(([ps, sq]) => {
      setPlayers(ps);
      const ids = sq.picks.map(x=>x.player_id);
      if (ids.length < 15) { router.replace("/market"); return; }
      setSquad(ids);
    }).catch(e=>setErr(e.message));
  }, [router]);

  function toggle(id:number) {
    setStarters(prev => prev.includes(id) ? prev.filter(x=>x!==id) : (prev.length<9 ? [...prev, id] : prev));
  }

  async function save() {
    setErr(null);
    if (starters.length !== 9) return setErr("Pick exactly 9 starters.");
    if (!captain || !starters.includes(captain)) return setErr("Pick a captain from starters.");
    if (!vice || !starters.includes(vice)) return setErr("Pick a vice from starters.");
    if (captain === vice) return setErr("Captain and vice must be different.");
    try {
      await api("/lineup/set", { method:"POST", body: JSON.stringify({ gameweek: GW, starters, captain_id: captain, vice_captain_id: vice }) });
      router.replace("/dashboard");
    } catch (e:any) { setErr(e.message); }
  }

  const squadPlayers = players.filter(p => squad.includes(p.id));

  return (
    <div className="grid" style={{gap:12}}>
      <div className="card">
        <div className="row" style={{alignItems:"center"}}>
          <div className="badge">Set Lineup</div>
          <div>Starters: {starters.length}/9</div>
          <div style={{marginLeft:"auto"}} />
          <button className="btn" onClick={save}>Save lineup</button>
        </div>
        {err && <div style={{color:"#b91c1c", marginTop:8}}>{err}</div>}
      </div>

      <div className="grid grid3">
        {squadPlayers.map(p=>{
          const on = starters.includes(p.id);
          return (
            <div key={p.id} className="card">
              <div style={{fontSize:12, color:"#64748b"}}>{p.pos} • {p.team}</div>
              <div style={{fontWeight:700}}>{p.name}</div>
              <div className="row">
                <button className={`btn ${on?"secondary":""}`} onClick={()=>toggle(p.id)}>{on?"Bench":"Start"}</button>
                <button className={`btn ${captain===p.id?"":"secondary"}`} onClick={()=>setCaptain(p.id)}>C</button>
                <button className={`btn ${vice===p.id?"":"secondary"}`} onClick={()=>setVice(p.id)}>VC</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
