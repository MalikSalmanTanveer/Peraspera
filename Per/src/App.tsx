import { useEffect, type ReactNode } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AboutPage } from './pages/AboutPage';
import { LabsPage } from './pages/LabsPage';
import { CareersPage } from './pages/CareersPage';
import { CareerJobPage } from './pages/CareerJobPage';
import { AdminApp } from './pages/admin/AdminApp';
import { Navbar } from './sections/Navbar';
import { Footer } from './sections/Footer';
import { WhatsAppWidget, BackToTop } from './sections/FloatingWidgets';
import { scrollToHashElement } from './utils/scrollToHash';
import {
  resolvePortfolioReviewScrollTarget,
  type PortfolioReviewNavState,
} from './utils/portfolioReviewNav';
import { IntroGates, introGatesAllowSite } from './components/IntroGates';

/** If Site URL lands auth tokens on the marketing site, send them to admin password pages. */
function AuthCallbackRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const blob = `${search}${hash}`.toLowerCase();
    const isAuth =
      blob.includes('access_token') ||
      blob.includes('refresh_token') ||
      blob.includes('type=recovery') ||
      blob.includes('type=invite') ||
      blob.includes('type=signup') ||
      /[?&#]code=/.test(blob);

    if (!isAuth) return;

    const path =
      blob.includes('type=recovery') ? '/admin/reset-password' : '/admin/set-password';
    navigate(`${path}${search}${hash}`, { replace: true });
  }, [location.pathname, location.search, location.hash, navigate]);

  return null;
}

function ScrollToTop() {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    const navState = state as PortfolioReviewNavState | null;

    if (hash) {
      const targetId =
        pathname === '/portfolio'
          ? resolvePortfolioReviewScrollTarget(hash, navState)
          : hash.replace('#', '');

      scrollToHashElement(targetId);
      return;
    }

    if (pathname === '/portfolio' && navState?.focusReview) {
      scrollToHashElement(navState.focusReview);
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname, hash, state]);

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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const gatesAllowSite = introGatesAllowSite();

  if (isAdminRoute) {
    return (
      <>
        <AuthCallbackRedirect />
        <ScrollToTop />
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <AuthCallbackRedirect />
      <IntroGates />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[10000] focus:bg-accent focus:text-ink focus:px-4 focus:py-2 focus:rounded-pill"
      >
        Skip to main content
      </a>
      {gatesAllowSite ? (
        <>
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
              path="/blog/:slug"
              element={
                <PageShell>
                  <BlogPostPage />
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
            <Route
              path="/careers"
              element={
                <PageShell>
                  <CareersPage />
                </PageShell>
              }
            />
            <Route
              path="/careers/:slug"
              element={
                <PageShell>
                  <CareerJobPage />
                </PageShell>
              }
            />
          </Routes>
        </>
      ) : null}
    </>
  );
}
