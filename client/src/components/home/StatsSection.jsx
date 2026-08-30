import { motion } from 'framer-motion';
import { ClipboardCheck, CheckCircle, TrendingUp, Users } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';

const STATS = [
  {
    icon: <ClipboardCheck size={24} />,
    bgClass: 'bg-green-100',
    iconClass: 'text-green-600',
    number: 12547,
    label: 'Issues Reported',
    description: 'Total issues submitted by citizens',
  },
  {
    icon: <CheckCircle size={24} />,
    bgClass: 'bg-blue-100',
    iconClass: 'text-blue-600',
    number: 8231,
    label: 'Issues Resolved',
    description: 'Successfully resolved by authorities',
  },
  {
    icon: <TrendingUp size={24} />,
    bgClass: 'bg-orange-100',
    iconClass: 'text-orange-600',
    number: 2316,
    label: 'In Progress',
    description: 'Issues currently being worked on',
  },
  {
    icon: <Users size={24} />,
    bgClass: 'bg-purple-100',
    iconClass: 'text-purple-600',
    number: 25892,
    label: 'Active Citizens',
    description: 'Community members involved',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function StatsSection() {
  return (
    <section className="bg-gray-50 border-t border-b border-gray-100" id="stats">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-4 max-md:grid-cols-2 max-md:gap-5 max-sm:grid-cols-1"
      >
        {STATS.map((stat, index) => (
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-4 px-7 py-5 relative rounded-xl transition-colors hover:bg-white/70 ${
              index < STATS.length - 1 ? 'stat-divider' : ''
            }`}
            key={stat.label}
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${stat.bgClass} ${stat.iconClass}`}
            >
              {stat.icon}
            </motion.div>
            <div>
              <h3 className="font-primary text-[1.9rem] font-extrabold text-gray-900 leading-tight">
                <AnimatedCounter target={stat.number} />
              </h3>
              <h4 className="text-[0.85rem] font-semibold text-gray-700 mb-0.5">{stat.label}</h4>
              <p className="text-[0.78rem] text-gray-500 leading-snug">{stat.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
