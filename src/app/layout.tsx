import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GridCap — Same players. Smarter fantasy.",
  description: "Salary-cap fantasy for gridiron fans.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{borderBottom:"1px solid #e5e7eb", background:"#fff"}}>
          <div className="container" style={{display:"flex",alignItems:"center",gap:16}}>
            <a href="/" style={{fontWeight:800,fontSize:20}}>GridCap</a>
            <a href="/how-it-works">How it works</a>
            <a href="/rules">Rules</a>
            <a href="/pricing">Pricing</a>
            <div style={{marginLeft:"auto"}} />
            <a href="/dashboard">Dashboard</a>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
