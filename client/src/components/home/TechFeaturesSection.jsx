import { motion } from 'framer-motion';
import { Sparkles, Navigation, BellRing, ShieldCheck, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: <Cpu size={26} />,
    title: 'Groq Vision AI Triaging',
    tag: 'Automated AI',
    desc: 'Our multimodal AI analyzes uploaded damage photos instantly, auto-classifies issue categories, and computes accurate priority hazard scores.',
    iconBox: 'bg-purple-50 text-purple-700 border-purple-200/80',
    tagBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    highlight: 'Instant Severity Analysis',
  },
  {
    icon: <Navigation size={26} />,
    title: '75m Geo-Clustering & Deduplication',
    tag: 'Smart Geospatial',
    desc: 'Prevents redundant tickets by grouping multiple citizen reports within a 75-meter radius, merging photo evidence to boost resolution urgency.',
    iconBox: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
    tagBadge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    highlight: 'Zero Duplicate Backlog',
  },
  {
    icon: <BellRing size={26} />,
    title: 'Real-Time Dispatch & WebSocket Push',
    tag: 'Live Sync',
    desc: 'From worker assignment to repair progress updates, citizens receive immediate live milestone notifications directly on their device.',
    iconBox: 'bg-amber-50 text-amber-700 border-amber-200/80',
    tagBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    highlight: 'Live Status Timeline',
  },
  {
    icon: <ShieldCheck size={26} />,
    title: 'Community Verification Protocol',
    tag: 'Democratic Oversight',
    desc: 'A ticket cannot be closed without citizen confirmation. Residents vote to verify repaired sites or dispute unsatisfactory work with one click.',
    iconBox: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    tagBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    highlight: 'Citizen-Audited Fixes',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function TechFeaturesSection() {
  return (
    <section className="py-20 bg-white" id="features">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          title="How CivicLink Automates Municipal Governance"
          accent="Automates"
          subtitle="Eliminating bureaucracy with multimodal AI, geospatial radius clustering, and community-verified accountability."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 max-md:grid-cols-1 gap-6"
        >
          {FEATURES.map((feat) => (
            <motion.div
              key={feat.title}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-8 hover:border-emerald-300 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center border shadow-xs group-hover:scale-110 transition-transform ${feat.iconBox}`}
                  >
                    {feat.icon}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-2xs ${feat.tagBadge}`}
                  >
                    {feat.tag}
                  </span>
                </div>
                <h3 className="font-primary text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-6">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  {feat.highlight}
                </span>
                <Link
                  to="/report"
                  className="text-xs font-bold text-slate-500 group-hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  <span>Experience it</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
