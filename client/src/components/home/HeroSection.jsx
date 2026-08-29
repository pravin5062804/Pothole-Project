import { Link } from 'react-router-dom';
import { Edit3, Search } from 'lucide-react';
import PhoneMockup from '../ui/PhoneMockup';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-[60px] pb-[80px] min-h-[520px]" id="hero">
      {/* Background — Real cityscape photo from Unsplash */}
      <div className="absolute top-0 right-0 w-[65%] h-full z-0 max-md:w-full max-md:opacity-20">
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
      </div>

      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between relative z-10 max-md:flex-col max-md:text-center">
        {/* Left Content */}
        <div className="max-w-[520px] animate-slide-left max-md:max-w-full max-md:mb-10">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full text-[0.82rem] font-semibold text-green-700 mb-7">
            <span className="text-base">⚡</span>
            Smart Reporting. Faster Resolution. Better Cities.
          </div>

          <h2 className="font-primary text-[3.5rem] max-lg:text-[2.8rem] max-md:text-[2.4rem] max-sm:text-[2rem] font-black leading-[1.1] text-gray-900 mb-5">
            Your City.
            <br />
            Your Voice.
            <br />
            <span className="text-green-600 highlight-underline">Our Priority.</span>
          </h2>

          <p className="text-[1.05rem] leading-relaxed text-gray-500 mb-8 max-w-[440px] max-md:max-w-full">
            Report civic issues, track progress, and help your community become cleaner, safer, and
            better for everyone.
          </p>

          <div className="flex gap-3.5 mb-9 max-md:justify-center max-sm:flex-col max-sm:items-center">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-600 text-white rounded-[10px] text-[0.95rem] font-semibold shadow-md shadow-green-600/25 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/35 transition-all"
              id="btn-report-issue"
            >
              <Edit3 size={18} />
              Report an Issue
            </Link>
            <Link
              to="/track"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-700 border-[1.5px] border-gray-300 rounded-[10px] text-[0.95rem] font-semibold hover:border-gray-400 hover:bg-gray-50 hover:-translate-y-0.5 transition-all"
              id="btn-track-issue"
            >
              <Search size={18} />
              Track an Issue
            </Link>
          </div>

          <div className="flex items-center gap-3 max-md:justify-center">
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
          </div>
        </div>

        {/* Phone Mockup */}
        <PhoneMockup className="flex-shrink-0 w-[300px] max-lg:w-[250px] max-md:w-[220px] animate-slide-right animate-float" />
      </div>
    </section>
  );
}
