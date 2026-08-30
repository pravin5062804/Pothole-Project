import { motion } from 'framer-motion';
import { Zap, Camera, BellRing, Users, ArrowRight, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { Link } from 'react-router-dom';

const BENEFITS = [
  {
    icon: <Zap size={26} />,
    title: 'Fast & Direct Resolution',
    badge: 'No Bureaucracy',
    desc: 'Skip long queues and government office visits. Your report goes directly to your local ward repair team for immediate scheduling.',
    iconBox: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    tagBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    highlight: 'Direct to Ward Teams',
  },
  {
    icon: <Camera size={26} />,
    title: 'Report in 60 Seconds',
    badge: 'Super Simple',
    desc: 'All you need is a phone. Snap a photo of the pothole, garbage, or broken light, tag your location, and submit with one tap.',
    iconBox: 'bg-blue-50 text-blue-700 border-blue-200/80',
    tagBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    highlight: 'Photo & GPS Friendly',
  },
  {
    icon: <BellRing size={26} />,
    title: 'Live Stage-by-Stage Tracking',
    badge: '100% Transparent',
    desc: 'Stay informed at every step. Receive milestone updates when an officer is assigned, workers arrive on site, and the fix is complete.',
    iconBox: 'bg-amber-50 text-amber-700 border-amber-200/80',
    tagBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    highlight: 'Real-Time Updates',
  },
  {
    icon: <Users size={26} />,
    title: 'Stronger Community Voice',
    badge: 'Community Power',
    desc: 'When multiple neighbors report or confirm the same issue, it automatically gains priority urgency on the city repair calendar.',
    iconBox: 'bg-purple-50 text-purple-700 border-purple-200/80',
    tagBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    highlight: 'Neighbor Support',
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

export default function CitizenBenefitsSection() {
  return (
    <section className="py-20 bg-white" id="benefits">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          title="Why Citizens Love Using CivicLink"
          accent="Citizens"
          subtitle="Making your voice heard and your neighborhood cleaner, safer, and better for your family."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 max-md:grid-cols-1 gap-6"
        >
          {BENEFITS.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-8 hover:border-emerald-300 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center border shadow-xs group-hover:scale-110 transition-transform ${item.iconBox}`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-2xs ${item.tagBadge}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-primary text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  {item.highlight}
                </span>
                <Link
                  to="/report"
                  className="text-xs font-bold text-slate-500 group-hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  <span>Report an Issue</span>
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
