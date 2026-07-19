import { Link } from 'react-router-dom';
import { AboutHero } from '../components/about/AboutHero';
import { AboutPhilosophy } from '../components/about/AboutPhilosophy';
import { AboutTurningPoint } from '../components/about/AboutTurningPoint';
import { AboutBeliefs } from '../components/about/AboutBeliefs';
import { AboutConnectedModel } from '../components/about/AboutConnectedModel';
import { AboutDifference } from '../components/about/AboutDifference';
import { AboutLabsSection } from '../components/about/AboutLabsSection';
import { AboutObservatory } from '../components/about/AboutObservatory';
import { AboutPrinciples } from '../components/about/AboutPrinciples';
import { AboutForward } from '../components/about/AboutForward';

export function AboutPage() {
  return (
    <div className="bg-ink text-white">
      <AboutHero />
      <AboutPhilosophy />
      <AboutTurningPoint />
      <AboutBeliefs />
      <AboutConnectedModel />
      <AboutDifference />
      <AboutLabsSection />
      <AboutObservatory />
      <AboutPrinciples />
      <AboutForward />

      <div className="border-t border-white/[0.06] px-nav-x py-8 text-center max-md:px-nav-x-mobile">
        <Link
          to="/"
          className="text-sm font-bold text-overlay-white-55 transition-colors hover:text-accent"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
