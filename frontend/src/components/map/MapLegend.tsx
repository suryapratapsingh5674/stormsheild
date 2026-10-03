// Map legend — fixed position overlay (not a Leaflet control, simpler to style)
export default function MapLegend() {
  const items = [
    { label: "Critical", color: "#ef4444" },
    { label: "High", color: "#f97316" },
    { label: "Medium", color: "#eab308" },
    { label: "Low", color: "#22c55e" },
  ];

  return (
    <div className="leaflet-bottom leaflet-right z-[400]" style={{ pointerEvents: "none" }}>
      <div
        className="glass rounded-xl p-3 mb-3 mr-3 shadow-lg"
        style={{ pointerEvents: "auto" }}
      >
        <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Risk Level</div>
        <div className="flex flex-col gap-1.5">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: item.color, boxShadow: `0 0 6px ${item.color}80` }}
              />
              <span className="text-xs text-slate-300">{item.label}</span>
            </div>
          ))}
          <div className="border-t border-slate-700 mt-1 pt-1.5 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-slate-400 opacity-70" />
              <span className="text-xs text-slate-400">Past Track</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-orange-400 opacity-90" style={{ borderTop: "2px dashed #f97316" }} />
              <span className="text-xs text-slate-400">Forecast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
