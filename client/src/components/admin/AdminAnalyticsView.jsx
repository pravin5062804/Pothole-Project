export default function AdminAnalyticsView() {
  return (
    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
      {/* Category Breakdown */}
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
        <h3 className="font-primary text-lg font-bold text-slate-900 mb-2">Category Distribution</h3>
        <p className="text-xs text-slate-500 mb-6">Volume of complaints categorized by public infrastructure sector.</p>

        <div className="space-y-4">
          {[
            { name: 'Potholes & Roads', count: 342, pct: 35, color: 'bg-red-500' },
            { name: 'Garbage & Waste Disposal', count: 289, pct: 28, color: 'bg-emerald-500' },
            { name: 'Streetlights & Electrical', count: 187, pct: 18, color: 'bg-amber-500' },
            { name: 'Drainage & Sewage Pooling', count: 124, pct: 12, color: 'bg-blue-500' },
            { name: 'Water Pipe Leaks', count: 68, pct: 7, color: 'bg-cyan-500' },
          ].map((cat) => (
            <div key={cat.name}>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>{cat.name}</span>
                <span>{cat.count} ({cat.pct}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ward Performance */}
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
        <h3 className="font-primary text-lg font-bold text-slate-900 mb-2">Ward Response Times</h3>
        <p className="text-xs text-slate-500 mb-6">Average hours taken from citizen filing to crew dispatch.</p>

        <div className="space-y-3.5">
          {[
            { ward: 'Ward 4 - Central Market', time: '14 hrs', rate: '96%', grade: 'A+' },
            { ward: 'Ward 8 - South Residential', time: '18 hrs', rate: '92%', grade: 'A' },
            { ward: 'Ward 1 - Metro Zone', time: '22 hrs', rate: '89%', grade: 'B+' },
            { ward: 'Ward 11 - Industrial West', time: '28 hrs', rate: '84%', grade: 'B' },
            { ward: 'Ward 6 - Eastern Suburbs', time: '34 hrs', rate: '78%', grade: 'C' },
          ].map((w) => (
            <div key={w.ward} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div>
                <p className="text-xs font-bold text-slate-900">{w.ward}</p>
                <p className="text-[11px] text-slate-500">Avg. Turnaround: {w.time}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {w.rate} Fixed
                </span>
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  {w.grade}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
