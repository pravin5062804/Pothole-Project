import { motion } from 'framer-motion';
import { BarChart3, Clock, CheckCircle2, Flame, Users, TrendingUp } from 'lucide-react';

export default function AdminStatsGrid({ totalReports, inProgressReports, resolvedReports, criticalReports }) {
  const cards = [
    {
      title: 'Total Filings',
      value: totalReports,
      sub: 'All categories logged',
      icon: <BarChart3 size={20} />,
      bg: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'Active Dispatches',
      value: inProgressReports,
      sub: 'Field crews deployed',
      icon: <Clock size={20} />,
      bg: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Citizen Confirmed',
      value: resolvedReports,
      sub: 'Verified fixed by residents',
      icon: <CheckCircle2 size={20} />,
      bg: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Critical Hazards',
      value: criticalReports,
      sub: 'Immediate urgency',
      icon: <Flame size={20} />,
      bg: 'bg-red-50 text-red-700',
    },
  ];

  return (
    <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.title}</span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.bg}`}>
              {card.icon}
            </div>
          </div>
          <div>
            <p className="font-primary text-3xl font-black text-slate-900 mb-1">{card.value}</p>
            <p className="text-[11px] text-slate-400 font-medium">{card.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
