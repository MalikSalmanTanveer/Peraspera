import { useCallback, useState } from 'react';
import { Navbar } from '../sections/Navbar';

import { Hero } from '../sections/Hero';

import { LogoMarquee } from '../sections/LogoMarquee';

import { ServicesGrid } from '../sections/ServicesGrid';

import { FeatureBlocks } from '../sections/FeatureBlocks';

import { ProcessSteps } from '../sections/ProcessSteps';

import { PerasperaLabsPromo } from '../sections/PerasperaLabsPromo';

import { CreativeStudio } from '../sections/WhyUsStats';

import { ToolsGrid } from '../sections/IndustriesTools';

import { Testimonials } from '../sections/Testimonials';

import { FAQ } from '../sections/FAQ';

import { GlobalReach } from '../sections/GlobalReach';

import { FinalCTA } from '../sections/FinalCTA';

import { ContactForm } from '../sections/ContactForm';

import { Footer } from '../sections/Footer';

import { WhatsAppWidget, BackToTop } from '../sections/FloatingWidgets';
import {
  markOpeningAnimationSeen,
  OpeningAnimation,
  shouldShowOpeningAnimation,
} from '../components/OpeningAnimation';



export function HomePage() {
  const [showIntro, setShowIntro] = useState(shouldShowOpeningAnimation);

  const completeIntro = useCallback(() => {
    markOpeningAnimationSeen();
    setShowIntro(false);
    document.body.style.overflow = '';
  }, []);

  return (

    <>

      {showIntro ? <OpeningAnimation onComplete={completeIntro} /> : null}

      <Navbar />

      <main id="main">

        <Hero />

        <LogoMarquee />

        <ServicesGrid />

        <FeatureBlocks />

        <ProcessSteps />

        <PerasperaLabsPromo />

        <CreativeStudio />

        <ToolsGrid />

        <Testimonials />

        <FAQ />

        <GlobalReach />

        <FinalCTA />

        <ContactForm />

      </main>

      <Footer />

      <WhatsAppWidget />

      <BackToTop />

    </>

  );

}

