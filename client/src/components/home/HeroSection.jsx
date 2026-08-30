import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit3, Search, Sparkles } from 'lucide-react';
import PhoneMockup from '../ui/PhoneMockup';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-[60px] pb-[80px] min-h-[520px]" id="hero">
      {/* Background — Real cityscape photo with smooth gradient overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-0 right-0 w-[65%] h-full z-0 max-md:w-full max-md:opacity-20"
      >
        <img
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80&auto=format"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, transparent 85%)',
          }}
        />
      </motion.div>

      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between relative z-10 max-md:flex-col max-md:text-center">
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[520px] max-md:max-w-full max-md:mb-10"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full text-[0.82rem] font-semibold text-green-700 mb-7 shadow-xs"
          >
            <Sparkles size={15} className="text-green-600 animate-spin-slow" />
            Smart Reporting. Faster Resolution. Better Cities.
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="font-primary text-[3.5rem] max-lg:text-[2.8rem] max-md:text-[2.4rem] max-sm:text-[2rem] font-black leading-[1.1] text-gray-900 mb-5"
          >
            Your City.
            <br />
            Your Voice.
            <br />
            <span className="text-green-600 highlight-underline">Our Priority.</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-[1.05rem] leading-relaxed text-gray-500 mb-8 max-w-[440px] max-md:max-w-full"
          >
            Report civic issues, track progress, and help your community become cleaner, safer, and
            better for everyone.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex gap-3.5 mb-9 max-md:justify-center max-sm:flex-col max-sm:items-center"
          >
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-600 text-white rounded-[10px] text-[0.95rem] font-semibold shadow-md shadow-green-600/25 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/35 transition-all"
                id="btn-report-issue"
              >
                <Edit3 size={18} />
                Report an Issue
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/track"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-700 border-[1.5px] border-gray-300 rounded-[10px] text-[0.95rem] font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
                id="btn-track-issue"
              >
                <Search size={18} />
                Track an Issue
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 max-md:justify-center"
          >
            <div className="flex">
              <img src="https://i.pravatar.cc/36?img=1" alt="" className="w-9 h-9 rounded-full border-[2.5px] border-white shadow-sm object-cover" />
              <img src="https://i.pravatar.cc/36?img=5" alt="" className="w-9 h-9 rounded-full border-[2.5px] border-white shadow-sm object-cover -ml-2.5" />
              <img src="https://i.pravatar.cc/36?img=8" alt="" className="w-9 h-9 rounded-full border-[2.5px] border-white shadow-sm object-cover -ml-2.5" />
              <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 text-[0.7rem] font-bold flex items-center justify-center border-[2.5px] border-white -ml-2.5">
                12K+
              </div>
            </div>
            <p className="text-[0.85rem] text-gray-500 font-medium">
              Active citizens building better cities
            </p>
          </motion.div>
        </motion.div>

        {/* Phone Mockup with continuous float motion */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0"
        >
          <motion.div
            animate={{
              y: [-8, 8, -8],
              rotate: [0, 1, 0, -1, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <PhoneMockup className="w-[300px] max-lg:w-[250px] max-md:w-[220px]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
