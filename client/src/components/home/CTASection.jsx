import { Link } from 'react-router-dom';
import { useInView } from '../../hooks/useInView';

export default function CTASection() {
  const [ref, isInView] = useInView();

  return (
    <section className="py-20" id="cta" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div
          className="bg-gradient-to-br from-green-800 via-green-600 to-emerald-600 rounded-3xl px-20 py-16 flex items-center justify-between relative overflow-hidden max-md:flex-col max-md:text-center max-md:px-8 max-md:py-12"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'scale(1)' : 'scale(0.96)',
            transition: 'all 0.6s ease',
          }}
        >
          <div className="cta-circle-top" />
          <div className="cta-circle-bottom" />

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
            <Link
              to="/report"
              className="px-8 py-3.5 bg-white text-green-700 rounded-[10px] text-[0.95rem] font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all"
              id="btn-cta-report"
            >
              Report an Issue
            </Link>
            <Link
              to="/about"
              className="px-8 py-3.5 bg-transparent text-white border-2 border-white/40 rounded-[10px] text-[0.95rem] font-semibold hover:border-white hover:bg-white/10 transition-all"
              id="btn-cta-learn"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
