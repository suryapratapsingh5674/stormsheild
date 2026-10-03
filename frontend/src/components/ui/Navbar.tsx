import { Link, useLocation } from "react-router-dom";
import { Shield, Sparkles, LayoutDashboard, CloudLightning } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { toggleAIPanel } from "../../store/slices/mapSlice";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cyclones", label: "Cyclones", icon: CloudLightning },
];

export default function Navbar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isAIOpen = useAppSelector((s) => s.map.isAIPanelOpen);

  return (
    <header className="h-14 glass-dark border-b border-slate-800/60 flex items-center px-4 gap-4 z-50 relative">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mr-4 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
          <Shield size={16} className="text-white" />
        </div>
        <span className="font-black text-white text-lg tracking-tight">
          Storm<span className="gradient-text">Shield</span>
        </span>
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-slate-400">ACTIVE ALERT</span>
        </div>

        {/* AI button */}
        <button
          onClick={() => dispatch(toggleAIPanel())}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
            isAIOpen
              ? "bg-violet-600/30 border-violet-500/40 text-violet-300"
              : "bg-slate-800/60 border-slate-700/50 text-slate-300 hover:border-violet-500/40 hover:text-violet-300"
          }`}
        >
          <Sparkles size={14} />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>
      </div>
    </header>
  );
}
