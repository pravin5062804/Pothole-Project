import { motion } from 'framer-motion';
import { MapPin, FileText, Bell, CheckCircle } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

const STEPS = [
  {
    number: 1,
    icon: <MapPin size={26} />,
    title: 'Spot an Issue',
    description: 'Notice a civic problem in your area? Open the app and start reporting.',
  },
  {
    number: 2,
    icon: <FileText size={26} />,
    title: 'Report It',
    description: 'Take a photo, add details, and submit the report with location.',
  },
  {
    number: 3,
    icon: <Bell size={26} />,
    title: 'Track Progress',
    description: 'Get real-time notifications as authorities work on fixing the issue.',
  },
  {
    number: 4,
    icon: <CheckCircle size={26} />,
    title: 'Issue Resolved',
    description: 'The issue gets fixed and you can verify the resolution.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-gray-50" id="how-it-works">
      <SectionHeader
        title="How It Works"
        accent="It Works"
        subtitle="Report and resolve civic issues in 4 simple steps"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="max-w-[1200px] mx-auto px-6 grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:max-w-[400px] gap-6"
      >
        {STEPS.map((step) => (
          <motion.div
            variants={stepVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 transition-shadow duration-300 hover:shadow-xl hover:border-green-200 group"
            key={step.title}
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="w-12 h-12 rounded-full bg-green-100 text-green-700 font-primary text-xl font-extrabold flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors duration-200"
            >
              {step.number}
            </motion.div>
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              {step.icon}
            </div>
            <h3 className="font-primary text-[1.05rem] font-bold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-[0.85rem] text-gray-500 leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
