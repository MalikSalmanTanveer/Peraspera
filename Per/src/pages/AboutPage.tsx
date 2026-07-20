import { AboutForward } from '../components/about/AboutForward';
import { AboutMeasuredImpact } from '../components/about/AboutMeasuredImpact';
import { AboutConnectedModel } from '../components/about/AboutConnectedModel';
import { AboutObservatory } from '../components/about/AboutObservatory';

export function AboutPage() {
  return (
    <div className="bg-ink text-white">
      <AboutForward />
      <AboutMeasuredImpact />
      <AboutConnectedModel />
      <AboutObservatory />
    </div>
  );
}
