import { motion } from 'framer-motion';
import { Quote, Star, CheckCircle, ShieldCheck, Heart, Building, PhoneCall, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';

const TESTIMONIALS = [
  {
    name: 'Aarav Nair',
    role: 'Resident, Ward 4',
    content: 'Reported a dangerous pothole near my kids school. Within 3 hours I received an SMS that the crew was dispatched, and it was fixed before next morning!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/100?img=12',
  },
  {
    name: 'Meera Deshmukh',
    role: 'Community Representative, Ward 8',
    content: 'The 75m deduplication is brilliant. When 15 neighbors reported the same water pipe leakage, CivicLink grouped our evidence into a top-priority ticket.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/100?img=47',
  },
  {
    name: 'Ramesh Kulkarni',
    role: 'Municipal Field Engineer',
    content: 'Groq Vision AI pre-tags the damage category and geo-coordinates accurately. Our field teams spend zero time searching and fix problems much faster.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/100?img=33',
  },
];

export default function CitizenImpactSection() {
  return (
    <section className="py-20 bg-white" id="impact">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          title="Loved by Citizens, Trusted by Municipalities"
          accent="Trusted"
          subtitle="Real feedback from active citizens and ward field officers building cleaner, safer neighborhoods."
        />

        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6 mb-16">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-slate-50/70 rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-6 italic">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/40 shadow-xs"
                />
                <div>
                  <h4 className="font-primary text-sm font-bold text-slate-900 leading-tight">{t.name}</h4>
                  <p className="text-[11px] text-emerald-700 font-semibold">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Emergency Civic Hotline Ribbon */}
        <div className="bg-gradient-to-br from-emerald-900 via-green-800 to-slate-900 rounded-3xl p-8 text-white flex items-center justify-between gap-6 max-md:flex-col max-md:text-center shadow-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
              <PhoneCall size={14} />
              24/7 Citizen Support & Helpline
            </div>
            <h3 className="font-primary text-xl font-bold mb-1">Need Immediate Assistance with a Hazard?</h3>
            <p className="text-xs text-emerald-100/80 max-w-[500px]">
              Direct connection to municipal control rooms for gas leaks, open manholes, or fallen live wires.
            </p>
          </div>
          <div className="flex gap-3 shrink-0 flex-wrap justify-center">
            <a
              href="tel:112"
              className="px-5 py-2.5 bg-white text-emerald-900 font-bold rounded-xl text-xs hover:bg-emerald-50 shadow-md transition-all flex items-center gap-2"
            >
              <PhoneCall size={13} className="text-emerald-700" />
              <span>National Helpline: 112</span>
            </a>
            <Link
              to="/report"
              className="px-5 py-2.5 bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs border border-emerald-400/30 transition-all flex items-center gap-1.5"
            >
              <span>File Report Online</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
