import { ArrowRight } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
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

export default function CategoriesSection() {
  const [ref, isInView] = useInView();

  return (
    <section className="py-20" id="categories" ref={ref}>
      <SectionHeader title="Common Issues in Your City" accent="Issues" />

      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-5">
        {CATEGORIES.map((cat, index) => (
          <div
            className="bg-white border border-gray-200 rounded-2xl p-6 text-left cursor-pointer transition-all duration-300 hover:border-green-300 hover:shadow-lg hover:shadow-green-600/10 hover:-translate-y-1 group"
            key={cat.title}
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(24px)',
              transition: `all 0.5s ease ${index * 0.08}s`,
            }}
          >
            <div
              className={`w-full h-[100px] flex items-center justify-center mb-4 rounded-[10px] overflow-hidden ${cat.bgColor}`}
            >
              <cat.Illustration />
            </div>
            <h3 className="font-primary text-[0.95rem] font-bold text-gray-900 mb-1.5">
              {cat.title}
            </h3>
            <p className="text-[0.78rem] text-gray-500 leading-relaxed mb-3.5 min-h-[46px]">
              {cat.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[0.82rem] font-semibold text-orange-500">{cat.count}</span>
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 transition-all duration-200 group-hover:bg-green-600 group-hover:text-white">
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
