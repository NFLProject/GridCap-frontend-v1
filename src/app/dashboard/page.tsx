"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, getUser, clearAuth } from "../lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [me, setMe] = useState<{id:number;name:string;email:string}|null>(null);

  useEffect(() => {
    if (!getToken()) { router.replace("/"); return; }
    api("/auth/me").then(setMe).catch(()=>router.replace("/"));
  }, [router]);

  if (!me) return null;

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <div className="row" style={{alignItems:"center"}}>
          <div className="badge">Signed in</div>
          <div style={{fontWeight:700}}>{me.name}</div>
          <div style={{color:"#64748b"}}>{me.email}</div>
          <div style={{marginLeft:"auto"}} />
          <button className="btn secondary" onClick={() => { clearAuth(); router.replace("/"); }}>Logout</button>
        </div>
      </div>

      <div className="row">
        <div className="card" style={{flex:1}}>
          <h3>Create a league</h3>
          <p>Make your league and your first team.</p>
          <a className="btn" href="/leagues/new">Create league</a>
        </div>
        <div className="card" style={{flex:1}}>
          <h3>Join a league</h3>
          <p>Enter a League ID and your team name.</p>
          <a className="btn" href="/leagues/join">Join league</a>
        </div>
      </div>
    </div>
  );
}
