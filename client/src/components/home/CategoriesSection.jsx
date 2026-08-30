import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import {
  PotholeIllustration,
  GarbageIllustration,
  StreetlightIllustration,
  DrainageIllustration,
  WaterSupplyIllustration,
  OthersIllustration,
} from '../ui/CategoryIllustrations';

const CATEGORIES = [
  {
    Illustration: PotholeIllustration,
    title: 'Potholes & Roads',
    description: 'Damaged roads, potholes & footpath issues',
    count: '1,234 reports',
    bgColor: 'bg-red-50',
  },
  {
    Illustration: GarbageIllustration,
    title: 'Garbage & Waste',
    description: 'Garbage overflow, waste collection issues',
    count: '2,156 reports',
    bgColor: 'bg-green-50',
  },
  {
    Illustration: StreetlightIllustration,
    title: 'Streetlights',
    description: 'Non-functional streetlights & electrical issues',
    count: '987 reports',
    bgColor: 'bg-amber-50',
  },
  {
    Illustration: DrainageIllustration,
    title: 'Drainage',
    description: 'Drainage blockage, waterlogging & sewer issues',
    count: '1,543 reports',
    bgColor: 'bg-blue-50',
  },
  {
    Illustration: WaterSupplyIllustration,
    title: 'Water Supply',
    description: 'Water leakage, supply problems & quality issues',
    count: '876 reports',
    bgColor: 'bg-sky-50',
  },
  {
    Illustration: OthersIllustration,
    title: 'Others',
    description: "Other civic issues that don't fit in above categories",
    count: '2,431 reports',
    bgColor: 'bg-gray-50',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function CategoriesSection() {
  return (
    <section className="py-20" id="categories">
      <SectionHeader title="Common Issues in Your City" accent="Issues" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="max-w-[1200px] mx-auto px-6 grid grid-cols-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-5"
      >
        {CATEGORIES.map((cat) => (
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 text-left cursor-pointer transition-shadow duration-300 hover:border-green-300 hover:shadow-xl hover:shadow-green-600/10 group flex flex-col justify-between"
            key={cat.title}
          >
            <div>
              <div
                className={`w-full h-[100px] flex items-center justify-center mb-4 rounded-[10px] overflow-hidden ${cat.bgColor} transition-transform duration-300 group-hover:scale-105`}
              >
                <cat.Illustration />
              </div>
              <h3 className="font-primary text-[0.95rem] font-bold text-gray-900 mb-1.5 group-hover:text-green-700 transition-colors">
                {cat.title}
              </h3>
              <p className="text-[0.78rem] text-gray-500 leading-relaxed mb-3.5 min-h-[46px]">
                {cat.description}
              </p>
            </div>
            
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
