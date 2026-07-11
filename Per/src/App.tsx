import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { LogoMarquee } from './sections/LogoMarquee';
import { TrustStrip } from './sections/TrustStrip';
import { ServicesGrid } from './sections/ServicesGrid';
import { FeatureBlocks } from './sections/FeatureBlocks';
import { PortfolioGrid } from './sections/PortfolioGrid';
import { ProcessSteps } from './sections/ProcessSteps';
import { WhyUsStats, CreativeStudio } from './sections/WhyUsStats';
import { IndustriesGrid, ToolsGrid } from './sections/IndustriesTools';
import { Testimonials } from './sections/Testimonials';
import { FAQ } from './sections/FAQ';
import { FinalCTA, PerasperaLabsBanner } from './sections/FinalCTA';
import { ContactForm } from './sections/ContactForm';
import { Footer } from './sections/Footer';
import { WhatsAppWidget, BackToTop } from './sections/FloatingWidgets';

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[10000] focus:bg-accent focus:text-ink focus:px-4 focus:py-2 focus:rounded-pill"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <LogoMarquee />
        <TrustStrip />
        <ServicesGrid />
        <FeatureBlocks />
        <PortfolioGrid />
        <ProcessSteps />
        <WhyUsStats />
        <CreativeStudio />
        <IndustriesGrid />
        <ToolsGrid />
        <Testimonials />
        <FAQ />
        <PerasperaLabsBanner />
        <FinalCTA />
        <ContactForm />
      </main>
      <Footer />
      <WhatsAppWidget />
      <BackToTop />
    </>
  );
}
