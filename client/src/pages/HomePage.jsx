import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import CategoriesSection from '../components/home/CategoriesSection';
import CitizenBenefitsSection from '../components/home/CitizenBenefitsSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import RecentResolutionsSection from '../components/home/RecentResolutionsSection';
import CitizenImpactSection from '../components/home/CitizenImpactSection';
import CTASection from '../components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <CitizenBenefitsSection />
      <HowItWorksSection />
      <RecentResolutionsSection />
      <CitizenImpactSection />
    </>
  );
}


