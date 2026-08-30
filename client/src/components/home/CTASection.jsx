import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-20" id="cta">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-br from-green-800 via-green-600 to-emerald-600 rounded-3xl px-20 py-16 flex items-center justify-between relative overflow-hidden shadow-2xl shadow-green-900/20 max-md:flex-col max-md:text-center max-md:px-8 max-md:py-12"
        >
          {/* Animated decorative background circles */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.45, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="cta-circle-top pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="cta-circle-bottom pointer-events-none"
          />

          <div className="relative z-10 max-w-[500px]">
            <h2 className="font-primary text-[2.2rem] font-extrabold text-white mb-3 leading-tight">
              Ready to Make Your City Better?
            </h2>
            <p className="text-white/85 text-base leading-relaxed mb-7">
              Join thousands of active citizens who are making a real difference in their
              communities. Start reporting issues today.
            </p>
          </div>

          <div className="flex gap-3.5 relative z-10 max-md:flex-col max-md:items-center">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/report"
                className="inline-block px-8 py-3.5 bg-white text-green-700 rounded-[10px] text-[0.95rem] font-bold shadow-lg hover:shadow-xl transition-shadow"
                id="btn-cta-report"
              >
                Report an Issue
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/about"
                className="inline-block px-8 py-3.5 bg-transparent text-white border-2 border-white/40 rounded-[10px] text-[0.95rem] font-semibold hover:border-white hover:bg-white/10 transition-all"
                id="btn-cta-learn"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
