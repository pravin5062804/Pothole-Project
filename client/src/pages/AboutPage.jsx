import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Target,
  Heart,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  Compass,
  Cpu,
  Globe2,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const VALUES = [
  {
    icon: <Shield size={26} />,
    title: 'Radical Transparency',
    description:
      'Every reported issue, officer assignment, and resolution timestamp is publicly auditable and citizen-verifiable.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    icon: <Users size={26} />,
    title: 'Community-Driven Power',
    description:
      'Neighbors upvote and verify local fixes. Collective voice accelerates municipal urgency and budget prioritization.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    icon: <Cpu size={26} />,
    title: 'AI & Geo Intelligence',
    description:
      'Groq Vision AI and 75m geospatial clustering eliminate duplicate paperwork and automatically dispatch field crews.',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    icon: <Heart size={26} />,
    title: 'Citizen-First Empathy',
    description:
      'We understand the everyday struggle with potholes, water leaks, and broken lights. We build for a safer, cleaner tomorrow.',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
];

const MILESTONES = [
  {
    year: '2023',
    title: 'The Civic Vision',
    desc: 'Founded with a prototype system in Sector 4 to test AI-driven pothole recognition and automated municipal alerts.',
  },
  {
    year: '2024',
    title: 'Rapid Citywide Expansion',
    desc: 'Adopted across 5 major urban zones with over 10,000 active citizens and 8,000+ verified hazard fixes.',
  },
  {
    year: '2025',
    title: 'Municipal Corporation Integration',
    desc: 'Direct dispatch integrations with 50+ ward engineering divisions and real-time SLA verification dashboards.',
  },
  {
    year: '2026',
    title: 'Next-Gen Smart Cities',
    desc: '25,000+ citizens, Groq AI multimodal triaging, and real-time community resolution verification protocols.',
  },
];

const TEAM_MEMBERS = [
  {
    name: 'Priya Sharma',
    role: 'Founder & CEO',
    bio: 'Former Urban Planning Lead with 8+ years optimizing smart city infrastructure.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format',
    tag: 'Leadership',
  },
  {
    name: 'Rahul Mehta',
    role: 'Chief Technology Officer',
    bio: 'Distributed systems architect specialized in GIS mapping and real-time WebSockets.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80&auto=format',
    tag: 'Engineering',
  },
  {
    name: 'Ananya Gupta',
    role: 'Head of Civic Design',
    bio: 'Advocate for accessible digital public goods and intuitive citizen micro-interactions.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format',
    tag: 'Product Design',
  },
  {
    name: 'Vikram Singh',
    role: 'Lead AI Engineer',
    bio: 'Building vision models for real-time hazard severity triage and duplicate clustering.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format',
    tag: 'Groq AI Team',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Header Banner with Urban Civic Landscape & Cinematic Overlay */}
      <div className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-28 px-6 shadow-lg border-b border-emerald-900/30">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80&auto=format"
            alt="Urban Cityscape"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.65] contrast-[1.1]"
          />
          {/* Multi-layered cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/90 to-slate-950/90" />
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        {/* Ambient Glow Orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-emerald-500 blur-3xl pointer-events-none z-0"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-teal-500 blur-3xl pointer-events-none z-0"
        />

        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-100 mb-5 shadow-xs">
              <Sparkles size={14} className="text-yellow-300 animate-spin-slow" />
              Bridging Citizens & Municipal Governance
            </div>
            <h1 className="font-primary text-5xl max-md:text-3xl font-black text-white mb-4 tracking-tight leading-tight">
              About Civic<span className="text-emerald-400">Link</span>
            </h1>
            <p className="text-emerald-100/90 text-lg max-w-[680px] mx-auto leading-relaxed">
              We empower citizens and municipal authorities with modern digital tools to spot, report,
              and resolve civic infrastructure issues faster than ever before.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-12 relative z-20">
        {/* Mission & Impact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-10 max-sm:p-6 mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 mb-3">
                <Target size={14} />
                OUR CORE PURPOSE
              </div>
              <h2 className="font-primary text-3xl max-sm:text-2xl font-black text-slate-900 mb-4 leading-tight">
                Empowering Citizens to Transform Urban Living
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Traditional municipal reporting has long been slowed down by fragmented paperwork, lost complaints,
                and delayed emergency repairs. Potholes deepen, streetlights stay dark, and drainage clogs repeat.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                CivicLink connects everyday residents directly with ward engineers. Armed with real-time GPS,
                Groq Vision AI classification, and democratic community confirmation, we ensure accountability at every stage.
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl text-xs font-bold hover:from-emerald-700 hover:to-green-700 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <span>Report a Problem</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/track"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all"
                >
                  <span>Track Live Issues</span>
                </Link>
              </div>
            </div>

            {/* Stat Counters Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '12,547+', label: 'Issues Logged', sub: 'Citizen submissions across 12 zones', color: 'text-emerald-600' },
                { num: '8,231+', label: 'Verified Fixed', sub: 'Validated by community confirmations', color: 'text-blue-600' },
                { num: '50+', label: 'Municipal Wards', sub: 'Connected field crew divisions', color: 'text-purple-600' },
                { num: '94%', label: 'Resolution Rate', sub: 'Within target 48-hour SLA', color: 'text-amber-600' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-slate-50/70 rounded-2xl p-6 text-center border border-slate-200/70 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all group"
                >
                  <p className={`font-primary text-3xl font-black ${stat.color} mb-1 group-hover:scale-105 transition-transform`}>
                    {stat.num}
                  </p>
                  <p className="text-xs font-bold text-slate-800">{stat.label}</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Core Values Section */}
        <div className="mb-14">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Guiding Principles
            </span>
            <h2 className="font-primary text-3xl font-black text-slate-900 mt-3">What Drives CivicLink</h2>
            <p className="text-xs text-slate-500 max-w-[500px] mx-auto mt-1.5">
              Built on transparency, community feedback, and cutting-edge civic automation.
            </p>
          </div>

          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
            {VALUES.map((val) => (
              <motion.div
                key={val.title}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${val.badgeColor}`}>
                    {val.icon}
                  </div>
                  <h3 className="font-primary text-base font-bold text-slate-900 mb-2">
                    {val.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Milestones Journey */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-10 max-sm:p-6 mb-14">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Evolution
            </span>
            <h2 className="font-primary text-3xl font-black text-slate-900 mt-3">Our Growth Journey</h2>
            <p className="text-xs text-slate-500 max-w-[500px] mx-auto mt-1.5">
              From a localized sector prototype to a state-of-the-art municipal civic network.
            </p>
          </div>

          <div className="max-w-[760px] mx-auto space-y-6">
            {MILESTONES.map((m, i, arr) => (
              <div key={m.year} className="flex gap-5 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 text-white font-primary font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                    {m.year}
                  </div>
                  {i < arr.length - 1 && <div className="w-0.5 h-16 bg-emerald-200/70 mt-2" />}
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 flex-1 border border-slate-200/60">
                  <h4 className="font-primary text-sm font-bold text-slate-900 mb-1">{m.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Team Section */}
        <div className="mb-14">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Leadership & Builders
            </span>
            <h2 className="font-primary text-3xl font-black text-slate-900 mt-3">The People Behind CivicLink</h2>
            <p className="text-xs text-slate-500 max-w-[500px] mx-auto mt-1.5">
              Passionate engineers, urban planners, and civic technology advocates.
            </p>
          </div>

          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <motion.div
                key={member.name}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all text-center group"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-emerald-200 shadow-sm group-hover:scale-105 transition-transform">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-2">
                  {member.tag}
                </span>
                <h3 className="font-primary text-base font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs font-semibold text-emerald-600 mb-2">{member.role}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-gradient-to-br from-emerald-800 via-green-700 to-emerald-600 rounded-3xl p-10 text-white flex items-center justify-between gap-8 max-md:flex-col max-md:text-center shadow-xl shadow-emerald-900/20">
          <div>
            <h3 className="font-primary text-2xl font-black mb-2">Make a Difference in Your Neighborhood Today</h3>
            <p className="text-emerald-100/90 text-xs max-w-[520px] leading-relaxed">
              Found a broken road, clogged drainage, or street hazard? Submit a report in 60 seconds and track its resolution step by step.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/report"
              className="px-6 py-3 bg-white text-emerald-800 font-bold rounded-xl text-xs hover:bg-emerald-50 shadow-md transition-all"
            >
              Report an Issue Now
            </Link>
            <Link
              to="/track"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-all"
            >
              Track Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
