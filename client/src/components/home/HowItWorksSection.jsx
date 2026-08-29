import { MapPin, FileText, Bell, CheckCircle } from 'lucide-react';
import { useInView } from '../../hooks/useInView';
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

export default function HowItWorksSection() {
  const [ref, isInView] = useInView();

  return (
    <section className="py-20 bg-gray-50" id="how-it-works" ref={ref}>
      <SectionHeader
        title="How It Works"
        accent="It Works"
        subtitle="Report and resolve civic issues in 4 simple steps"
      />

      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:max-w-[400px] gap-6">
        {STEPS.map((step, index) => (
          <div
            className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            key={step.title}
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(24px)',
              transition: `all 0.5s ease ${index * 0.12}s`,
            }}
          >
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 font-primary text-xl font-extrabold flex items-center justify-center mx-auto mb-4">
              {step.number}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
              {step.icon}
            </div>
            <h3 className="font-primary text-[1.05rem] font-bold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-[0.85rem] text-gray-500 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
