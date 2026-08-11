import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BRAND, NAV_LINKS } from '../data/site';
import { AppIcon } from '../components/AppIcon';
import { Logo } from '../components/Logo';
import { detectNavBackgroundIsLight } from '../utils/detectNavBackground';

const WHATSAPP_LINK = `${BRAND.whatsapp.href}?text=${encodeURIComponent('Hi Peraspera — I would like to speak with your team.')}`;

/** Extra space required between logo / links / CTA so they never look cramped. */
const OVERLAP_GAP = 8;
/** Hysteresis so the menu does not flicker at the breakpoint. */
const EXPAND_BUFFER = 12;

const pillShellDark =
  'pointer-events-auto mx-auto overflow-visible rounded-[28px] border border-white/10 bg-ink/78 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-card ease-smooth md:rounded-[34px]';

const pillShellLight =
  'pointer-events-auto mx-auto overflow-visible rounded-[28px] border border-black/10 bg-white/88 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition-all duration-card ease-smooth md:rounded-[34px]';

export function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [overLightBg, setOverLightBg] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => location.pathname === href.split('#')[0];
  // Mobile drawer is always dark — keep light logo/icon contrast while open.
  const useLightTheme = overLightBg && !mobileOpen;

  useLayoutEffect(() => {
    const nav = navRef.current;
    const logo = logoRef.current;
    const links = linksRef.current;
    const cta = ctaRef.current;
    if (!nav || !logo || !links || !cta) return;

    const evaluate = () => {
      // Use the rendered logo image width, not the oversized hit-area wrapper —
      // so the big logo can stay as-is without collapsing the nav too early.
      const logoImg = logo.querySelector('img');
      const logoRight = (logoImg ?? logo).getBoundingClientRect().right;
      const navRect = nav.getBoundingClientRect();
      const linksWidth = links.scrollWidth;
      const ctaWidth = Math.max(cta.scrollWidth, cta.getBoundingClientRect().width);
      const available =
        navRect.right - OVERLAP_GAP - ctaWidth - (logoRight + OVERLAP_GAP);

      setShowMobileNav((wasCompact) => {
        if (wasCompact) {
          return linksWidth + EXPAND_BUFFER > available;
        }
        return linksWidth > available;
      });
    };

    evaluate();

    const logoImg = logo.querySelector('img');
    const onLogoLoad = () => evaluate();
    logoImg?.addEventListener('load', onLogoLoad);

    const observer = new ResizeObserver(() => {
      evaluate();
    });
    observer.observe(nav);
    observer.observe(logo);
    if (logoImg) observer.observe(logoImg);
    observer.observe(links);
    observer.observe(cta);
    window.addEventListener('resize', evaluate);

    return () => {
      logoImg?.removeEventListener('load', onLogoLoad);
      observer.disconnect();
      window.removeEventListener('resize', evaluate);
    };
  }, [scrolled]);

  useEffect(() => {
    let frame = 0;
    const shell = document.querySelector('[data-navbar-shell]');

    const updateTheme = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bottom = shell?.getBoundingClientRect().bottom ?? 110;
        const sampleY = Math.min(window.innerHeight - 8, Math.round(bottom + 12));
        setOverLightBg(
          detectNavBackgroundIsLight(
            ['[data-navbar-shell]', '[data-mobile-nav-panel]'],
            sampleY,
          ),
        );
      });
    };

    updateTheme();
    window.addEventListener('scroll', updateTheme, { passive: true });
    window.addEventListener('resize', updateTheme);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateTheme);
      window.removeEventListener('resize', updateTheme);
    };
  }, [location.pathname, scrolled, showMobileNav]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!showMobileNav) setMobileOpen(false);
  }, [showMobileNav]);

  return (
    <>
      <div
        data-navbar-shell
        className="pointer-events-none fixed inset-x-0 top-5 z-[800] px-4 md:top-6 md:px-6"
      >
        <header
          className={`${useLightTheme ? pillShellLight : pillShellDark} ${
            scrolled
              ? 'w-full max-w-container-nav-float'
              : 'w-[calc(100%-8px)] max-w-[min(100%,1420px)] md:w-[calc(100%-16px)]'
          }`}
        >
          <nav
            ref={navRef}
            className={`relative flex items-center justify-between transition-all duration-card ease-smooth ${
              scrolled ? 'h-[72px] px-5 lg:px-8' : 'h-[88px] px-6 md:h-[92px] lg:px-10'
            }`}
            aria-label="Main navigation"
          >
            <Link
              ref={logoRef}
              to="/"
              className="relative z-10 inline-flex shrink-0 transition-transform duration-normal hover:scale-105"
              aria-label={`${BRAND.name} home`}
            >
              <span
                className={`relative flex items-center overflow-visible transition-all duration-card ease-smooth ${
                  scrolled
                    ? 'h-[4.5rem] w-[min(55vw,240px)] sm:h-[5rem] sm:w-[min(50vw,280px)] md:h-[5.5rem] md:w-[300px] lg:h-[6rem] lg:w-[330px] xl:h-[6.5rem] xl:w-[360px]'
                    : 'h-[6.5rem] w-[min(70vw,280px)] sm:h-[7.5rem] sm:w-[min(65vw,340px)] md:h-[8.5rem] md:w-[380px] lg:h-[10rem] lg:w-[460px] xl:h-[11rem] xl:w-[520px]'
                }`}
              >
                <Logo
                  variant="primary"
                  inverted={!useLightTheme}
                  className={`relative left-0 h-full w-auto max-w-full object-contain object-left transition-all duration-card ease-smooth ${
                    useLightTheme ? 'brightness-0' : ''
                  } ${
                    scrolled
                      ? 'max-h-[4.5rem] sm:max-h-[5rem] md:max-h-[5.5rem] lg:max-h-[6rem] xl:max-h-[6.5rem]'
                      : 'max-h-[6.5rem] sm:max-h-[7.5rem] md:max-h-[8.5rem] lg:max-h-[10rem] xl:max-h-[11rem]'
                  }`}
                />
              </span>
            </Link>

            <div
              ref={linksRef}
              aria-hidden={showMobileNav}
              className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap transition-all duration-card ease-smooth ${
                showMobileNav ? 'pointer-events-none invisible' : 'pointer-events-auto visible'
              } ${scrolled ? 'gap-6 lg:gap-7' : 'gap-8 lg:gap-10'}`}
            >
              {NAV_LINKS.map((link) => {
                const isLabs = 'isLabs' in link && link.isLabs;
                // Labs only after scroll: logo shrinks and the bar expands for links.
                if (isLabs && !scrolled) return null;

                return (
                <div key={link.label} className={`relative transition-all duration-card ${scrolled ? 'py-3' : 'py-5'}`}>
                  {isLabs ? (
                    <Link
                      to={link.href}
                      tabIndex={showMobileNav ? -1 : undefined}
                      className={`group/labs relative inline-flex items-center gap-1.5 overflow-hidden rounded-pill border border-dashed font-semibold uppercase transition-all duration-card ease-smooth ${
                        scrolled
                          ? 'px-3 py-1.5 text-[12px] tracking-[0.1em]'
                          : 'px-3.5 py-2 text-[13px] tracking-[0.12em] md:text-sm'
                      } ${
                        isActive(link.href)
                          ? 'border-accent bg-accent/20 text-ink shadow-[0_0_28px_rgba(254,163,39,0.35)]'
                          : 'border-accent/55 bg-accent/10 text-accent shadow-[0_0_18px_rgba(254,163,39,0.18)] hover:border-accent hover:bg-accent/18 hover:text-ink hover:shadow-[0_0_26px_rgba(254,163,39,0.32)]'
                      }`}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                    >
                      <span
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.16)_50%,transparent_65%)] opacity-0 transition-opacity duration-normal group-hover/labs:opacity-100"
                        aria-hidden="true"
                      />
                      <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 ring-1 ring-accent/30">
                        <AppIcon
                          name="FlaskConical"
                          className={`text-accent transition-colors duration-normal group-hover/labs:text-ink ${scrolled ? 'h-3 w-3' : 'h-3.5 w-3.5'}`}
                          strokeWidth={2.25}
                        />
                      </span>
                      <span className="relative">{link.label}</span>
                      <span
                        className="relative ml-0.5 h-1.5 w-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(254,163,39,0.9)]"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={link.href}
                        tabIndex={showMobileNav ? -1 : undefined}
                        className={`font-body font-medium uppercase transition-all duration-card ease-smooth ${
                          scrolled
                            ? 'text-[13px] tracking-[0.12em]'
                            : 'text-[15px] tracking-[0.14em] md:text-base'
                        } ${
                          isActive(link.href)
                            ? useLightTheme
                              ? 'text-ink'
                              : 'text-white'
                            : useLightTheme
                              ? 'text-ink/70 hover:text-ink'
                              : 'text-accent hover:text-white'
                        }`}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                      {'showChevron' in link && link.showChevron ? (
                        <AppIcon
                          name="ChevronDown"
                          className={`transition-all duration-card ${
                            useLightTheme ? 'text-ink/55' : 'text-accent/70'
                          } ${scrolled ? 'h-3 w-3' : 'h-3.5 w-3.5'}`}
                          strokeWidth={2.25}
                        />
                      ) : null}
                    </div>
                  )}
                </div>
                );
              })}
            </div>

            <div
              ref={ctaRef}
              aria-hidden={showMobileNav}
              className={`z-10 items-center ${
                showMobileNav ? 'pointer-events-none invisible absolute right-6' : 'flex'
              }`}
            >
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={showMobileNav ? -1 : undefined}
                aria-label="Call Peraspera on WhatsApp"
                className={`group relative flex items-center justify-center rounded-full bg-accent text-ink shadow-[0_0_20px_rgba(254,163,39,0.4)] transition-all duration-card ease-smooth hover:scale-110 ${
                  scrolled ? 'h-11 w-11' : 'h-14 w-14 md:h-[58px] md:w-[58px]'
                }`}
              >
                <span className="absolute inset-0 rounded-full bg-accent/30" aria-hidden="true" />
                <AppIcon
                  name="Phone"
                  className={`relative z-[1] transition-all duration-card ${scrolled ? 'h-5 w-5' : 'h-[22px] w-[22px]'}`}
                  strokeWidth={2.25}
                />
              </a>
            </div>

            {showMobileNav ? (
              <button
                type="button"
                className={`relative z-10 rounded-xl p-3 transition-transform duration-normal active:scale-90 ${
                  useLightTheme ? 'bg-black/5 text-ink' : 'bg-white/5 text-white'
                }`}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((value) => !value)}
              >
                <span className="flex flex-col gap-[5px]">
                  <span
                    className={`block h-[1.5px] w-[22px] transition-all duration-card ${
                      useLightTheme ? 'bg-ink' : 'bg-white'
                    } ${mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''}`}
                  />
                  <span
                    className={`block h-[1.5px] w-[22px] transition-all duration-card ${
                      useLightTheme ? 'bg-ink' : 'bg-white'
                    } ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`}
                  />
                  <span
                    className={`block h-[1.5px] w-[22px] transition-all duration-card ${
                      useLightTheme ? 'bg-ink' : 'bg-white'
                    } ${mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`}
                  />
                </span>
              </button>
            ) : null}
          </nav>
        </header>
      </div>

      {mobileOpen && showMobileNav ? (
        <div
          data-mobile-nav-panel
          className="fixed inset-0 z-[850] overflow-y-auto bg-ink px-nav-x-mobile pb-10 pt-[8.5rem]"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`block border-b border-white/10 py-4 ${
                'isLabs' in link && link.isLabs ? 'flex items-center gap-3' : ''
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {'isLabs' in link && link.isLabs ? (
                <>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-accent/60 bg-accent/10">
                    <AppIcon name="FlaskConical" className="h-5 w-5 text-accent" />
                  </span>
                  <span className="font-display text-3xl font-bold uppercase tracking-wide text-accent">
                    {link.label}
                  </span>
                </>
              ) : (
                <span
                  className={`font-display text-3xl font-bold uppercase tracking-wide ${
                    isActive(link.href) ? 'text-white' : 'text-accent'
                  }`}
                >
                  {link.label}
                </span>
              )}
            </Link>
          ))}

          <div className="mt-8 flex flex-col gap-3">
            <a
              href="/#contact"
              className="rounded-pill border border-white/15 px-5 py-3 text-center font-body text-sm-plus font-medium text-white/80"
              onClick={() => setMobileOpen(false)}
            >
              Book a meeting
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-pill bg-accent px-5 py-3 text-center font-body text-sm-plus font-semibold text-ink"
              onClick={() => setMobileOpen(false)}
            >
              Live call agent
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
