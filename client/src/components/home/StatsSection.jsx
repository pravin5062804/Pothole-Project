import { ClipboardCheck, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
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

export default function StatsSection() {
  const [ref, isInView] = useInView();

  return (
    <section className="bg-gray-50 border-t border-b border-gray-100" id="stats" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-4 max-md:grid-cols-2 max-md:gap-5 max-sm:grid-cols-1">
        {STATS.map((stat, index) => (
          <div
            className={`flex items-start gap-4 px-7 py-5 relative ${
              index < STATS.length - 1 ? 'stat-divider' : ''
            }`}
            key={stat.label}
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.5s ease ${index * 0.1}s`,
            }}
          >
            <div
              className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0 ${stat.bgClass} ${stat.iconClass}`}
            >
              {stat.icon}
            </div>
            <div>
              <h3 className="font-primary text-[1.9rem] font-extrabold text-gray-900 leading-tight">
                <AnimatedCounter target={stat.number} />
              </h3>
              <h4 className="text-[0.85rem] font-semibold text-gray-700 mb-0.5">{stat.label}</h4>
              <p className="text-[0.78rem] text-gray-500 leading-snug">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
