import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, ArrowRight, ShieldCheck, ThumbsUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';

const RESOLUTIONS = [
  {
    ticketId: 'CR-2026-8941',
    category: 'Potholes & Roads',
    title: 'Deep road sinkhole repair & resurfacing',
    location: 'Sector 4 Main Market Avenue',
    resolvedIn: '18 hours',
    ward: 'Ward 4 - Central Zone',
    votes: '42 Citizen Confirmations',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&q=80&auto=format',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    ticketId: 'CR-2026-7210',
    category: 'Streetlights & Electrical',
    title: '5 non-functional streetlights replaced',
    location: 'Greenwood Colony Crossroad',
    resolvedIn: '12 hours',
    ward: 'Ward 8 - South Zone',
    votes: '28 Citizen Confirmations',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80&auto=format',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    ticketId: 'CR-2026-5633',
    category: 'Drainage & Waste',
    title: 'Monsoon stormwater drain desilting & clearing',
    location: 'Metro Gate 2 Pedestrian Walkway',
    resolvedIn: '24 hours',
    ward: 'Ward 11 - West Zone',
    votes: '65 Citizen Confirmations',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80&auto=format',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
];

export default function RecentResolutionsSection() {
  return (
    <section className="py-20 bg-slate-50/60" id="resolutions">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          title="Recent Municipal Resolutions in Action"
          accent="Resolutions"
          subtitle="Real problems spotted by citizens, resolved by municipal teams, and verified by local communities."
        />

        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6">
          {RESOLUTIONS.map((res, index) => (
            <motion.div
              key={res.ticketId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner with Live Verified Badge */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={res.image}
                    alt={res.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-slate-800 shadow-sm border border-white/50">
                    #{res.ticketId}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-sm flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>Fixed</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {res.category}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 ml-auto">
                      <Clock size={12} />
                      {res.resolvedIn}
                    </span>
                  </div>

                  <h3 className="font-primary text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors leading-snug">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                    <MapPin size={13} className="text-red-500 shrink-0" />
                    <span>{res.location} &bull; {res.ward}</span>
                  </p>
                </div>
              </div>

              {/* Card Footer with Verification Votes */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <ThumbsUp size={13} className="text-emerald-600" />
                  {res.votes}
                </span>
                <Link
                  to="/track"
                  className="text-xs font-bold text-slate-600 group-hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>Audit Trail</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
