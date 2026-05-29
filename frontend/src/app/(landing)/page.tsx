import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionSection from '@/components/landing/SolutionSection';

export default function Home() {
  return (
    <div className="flex flex-col gap-32 pb-32">
      <HeroSection />
      
      {/* Generous spacing between minimalist sections */}
      <div className="pt-16">
        <ProblemSection />
      </div>

      <div className="pt-16">
        <SolutionSection />
      </div>
    </div>
  );
}
