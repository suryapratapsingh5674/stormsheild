import { Outlet } from "react-router-dom";
import Navbar from "../components/ui/Navbar";

export default function AppShell() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
