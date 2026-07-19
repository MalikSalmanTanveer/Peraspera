import { useEffect, type ReactNode } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { BlogPage } from './pages/BlogPage';
import { AboutPage } from './pages/AboutPage';
import { LabsPage } from './pages/LabsPage';
import { Navbar } from './sections/Navbar';
import { Footer } from './sections/Footer';
import { WhatsAppWidget, BackToTop } from './sections/FloatingWidgets';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppWidget />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[10000] focus:bg-accent focus:text-ink focus:px-4 focus:py-2 focus:rounded-pill"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/services"
          element={
            <PageShell>
              <ServicesPage />
            </PageShell>
          }
        />
        <Route
          path="/portfolio"
          element={
            <PageShell>
              <PortfolioPage />
            </PageShell>
          }
        />
        <Route path="/works" element={<Navigate to="/portfolio" replace />} />
        <Route
          path="/blog"
          element={
            <PageShell>
              <BlogPage />
            </PageShell>
          }
        />
        <Route
          path="/about"
          element={
            <PageShell>
              <AboutPage />
            </PageShell>
          }
        />
        <Route
          path="/labs"
          element={
            <PageShell>
              <LabsPage />
            </PageShell>
          }
        />
      </Routes>
    </>
  );
}
