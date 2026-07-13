import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { LogoMarquee } from './sections/LogoMarquee';
import { GlobalReach } from './sections/GlobalReach';
import { TrustStrip } from './sections/TrustStrip';
import { ServicesGrid } from './sections/ServicesGrid';
import { FeatureBlocks } from './sections/FeatureBlocks';
import { PortfolioGrid } from './sections/PortfolioGrid';
import { ProcessSteps } from './sections/ProcessSteps';
import { CreativeStudio } from './sections/WhyUsStats';
import { IndustriesGrid, ToolsGrid } from './sections/IndustriesTools';
import { Testimonials } from './sections/Testimonials';
import { FAQ } from './sections/FAQ';
import { BlogSection } from './sections/BlogSection';
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
        <GlobalReach />
        <TrustStrip />
        <ServicesGrid />
        <FeatureBlocks />
        <PortfolioGrid />
        <ProcessSteps />
        <CreativeStudio />
        <IndustriesGrid />
        <ToolsGrid />
        <Testimonials />
        <BlogSection />
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
