import { AboutForward } from '../components/about/AboutForward';
import { AboutMeasuredImpact } from '../components/about/AboutMeasuredImpact';

export function AboutPage() {
  return (
    <div className="bg-ink text-white">
      <AboutForward />
      <AboutMeasuredImpact />
    </div>
  );
}
