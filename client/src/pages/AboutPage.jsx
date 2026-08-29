import { Shield, Users, Target, Heart, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';

const TEAM_MEMBERS = [
  { name: 'Priya Sharma', role: 'Founder & CEO', color: 'bg-green-400' },
  { name: 'Rahul Mehta', role: 'CTO', color: 'bg-blue-400' },
  { name: 'Ananya Gupta', role: 'Head of Design', color: 'bg-purple-400' },
  { name: 'Vikram Singh', role: 'Lead Developer', color: 'bg-orange-400' },
];

const VALUES = [
  {
    icon: <Shield size={28} />,
    title: 'Transparency',
    description: 'We believe in open communication between citizens and government bodies.',
  },
  {
    icon: <Users size={28} />,
    title: 'Community First',
    description: 'Every decision we make is driven by the needs of the community.',
  },
  {
    icon: <Target size={28} />,
    title: 'Accountability',
    description: 'We hold ourselves and authorities accountable for timely resolutions.',
  },
  {
    icon: <Heart size={28} />,
    title: 'Empathy',
    description: 'We understand the frustration of living with unresolved civic issues.',
  },
];

const MILESTONES = [
  { year: '2023', event: 'CivicLink founded with a vision to transform civic engagement' },
  { year: '2024', event: 'Launched in 5 major cities with 10,000+ active users' },
  { year: '2025', event: 'Partnered with 50+ municipal corporations across India' },
  { year: '2026', event: '25,000+ active citizens and 12,500+ issues resolved' },
];

export default function AboutPage() {
  const [ref, isInView] = useInView();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 py-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm text-white/90 font-medium mb-6">
            <Award size={16} />
            Our Story
          </div>
          <h1 className="font-primary text-5xl max-md:text-3xl font-extrabold text-white mb-4">
            About CivicLink
          </h1>
          <p className="text-white/85 text-lg max-w-[640px] mx-auto leading-relaxed">
            We're on a mission to bridge the gap between citizens and local governance, making every
            city cleaner, safer, and more livable.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-16 items-center">
          <div>
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3 block">
              Our Mission
            </span>
            <h2 className="font-primary text-3xl font-extrabold text-gray-900 mb-5 leading-tight">
              Empowering Citizens to Build Better Cities
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Municipalities struggle with unorganized citizen complaints regarding potholes, garbage
              accumulation, and drainage failures, leading to delayed repairs and public frustration.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              CivicLink effectively categorizes, deduplicates, and prioritizes reported civic
              problems, ensuring prompt municipal accountability and improved urban living
              conditions.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: '12,547', label: 'Issues Reported' },
              { num: '8,231', label: 'Issues Resolved' },
              { num: '50+', label: 'City Partners' },
              { num: '94%', label: 'Satisfaction Rate' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100"
              >
                <p className="font-primary text-2xl font-extrabold text-green-600">{stat.num}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-20 px-6" ref={ref}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3 block">
              What Drives Us
            </span>
            <h2 className="font-primary text-3xl font-extrabold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
            {VALUES.map((value, i) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.1}s`,
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="font-primary text-base font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3 block">
              Our Journey
            </span>
            <h2 className="font-primary text-3xl font-extrabold text-gray-900">Milestones</h2>
          </div>
          <div className="space-y-0">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white font-primary font-bold text-sm flex items-center justify-center shrink-0">
                    {m.year}
                  </div>
                  {i < MILESTONES.length - 1 && <div className="w-0.5 h-16 bg-green-200" />}
                </div>
                <div className="bg-gray-50 rounded-xl p-5 flex-1 border border-gray-100 mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3 block">
              The People Behind CivicLink
            </span>
            <h2 className="font-primary text-3xl font-extrabold text-gray-900">Our Team</h2>
          </div>
          <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-20 h-20 rounded-full ${member.color} mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-primary text-base font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
