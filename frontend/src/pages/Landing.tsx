import { Link } from "react-router-dom";
import { Shield, ArrowRight, Zap, Map, Brain, AlertTriangle } from "lucide-react";

const FEATURES = [
  { icon: Map, title: "Real-Time Track Visualization", desc: "Live cyclone position, projected track, and impact corridor on an interactive map" },
  { icon: AlertTriangle, title: "Infrastructure Risk Engine", desc: "Automatic vulnerability scoring for hospitals, power grids, bridges, and emergency facilities" },
  { icon: Brain, title: "AI Situation Analysis", desc: "Gemini-powered analysis of the current threat landscape with actionable response recommendations" },
  { icon: Zap, title: "Priority Response Routing", desc: "Data-driven prioritization of assets needing immediate attention from emergency teams" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-auto">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-3xl" />
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          ACTIVE CYCLONE ALERT — Bay of Bengal
        </div>

        {/* Logo + title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-2xl shadow-blue-600/30">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-6xl font-black text-white tracking-tight">
            Storm<span className="gradient-text">Shield</span>
          </h1>
        </div>

        <p className="text-xl text-slate-300 text-center max-w-2xl mb-3 font-medium">
          AI-powered cyclone impact &amp; infrastructure vulnerability intelligence
        </p>
        <p className="text-slate-500 text-center max-w-xl mb-12 text-sm leading-relaxed">
          Track cyclone impacts in real-time. Identify at-risk hospitals, power infrastructure, and emergency facilities.
          Get AI-driven response recommendations before disaster strikes.
        </p>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5"
          >
            <Map size={18} />
            Explore Risk Map
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/cyclones"
            className="flex items-center gap-2 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-6 py-3.5 rounded-xl transition-all font-medium text-sm"
          >
            View Active Cyclones
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-800/60 px-6 py-16 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-3">Disaster Intelligence Platform</h2>
          <p className="text-slate-400 text-center mb-12 text-sm">Built for emergency response teams, district administrators, and disaster management authorities</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass rounded-xl p-6 hover:border-slate-600/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 px-6 py-6 text-center">
        <p className="text-xs text-slate-600">
          StormShield · Hackathon Prototype · Odisha / Andhra Pradesh Coastal Region · Prototype Risk Model — Not for operational use
        </p>
      </footer>
    </div>
  );
}
