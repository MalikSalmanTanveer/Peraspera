import { useEffect, useState } from 'react';
import { WHATSAPP_REGIONS } from '../data/content-extended';
import { BRAND } from '../data/site';
import { AppIcon } from '../components/AppIcon';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-[23px] h-[23px]">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed right-floating-offset bottom-floating-offset z-[9999] flex flex-col items-end gap-3 max-md:right-floating-offset-mobile max-md:bottom-floating-offset-mobile pointer-events-none font-body"
    >
      <div
        className={`wa-panel-gradient absolute right-0 bottom-[calc(100%+12px)] w-[380px] max-w-[calc(100vw-34px)] border border-overlay-accent-border-42 rounded-wa-panel shadow-wa-panel overflow-hidden transition-all duration-slow pointer-events-none ${open ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-[18px] scale-[0.96]'}`}
        role="dialog"
        aria-label="Chat support"
        aria-hidden={!open}
      >
        <div className="relative px-[22px] pt-[22px] pb-[18px] text-white bg-[radial-gradient(180px_110px_at_90%_0%,rgba(254,163,39,0.22),transparent_65%)]">
          <button
            type="button"
            className="absolute right-3.5 top-3.5 w-[34px] h-[34px] rounded-full border border-overlay-white-16 bg-overlay-white-08 text-white text-xl leading-none cursor-pointer"
            aria-label="Close chat panel"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          <div className="inline-flex items-center gap-2 text-2xs font-black uppercase tracking-widest text-accent mb-2.5 before:content-[''] before:w-[22px] before:h-[3px] before:rounded-pill before:bg-accent">
            Peraspera Support
          </div>
          <h3 className="text-3xl font-black leading-tight tracking-tighter mb-2 pr-9">
            Chat with <span className="text-accent">{BRAND.name}</span>
          </h3>
          <p className="text-[12.5px] leading-relaxed text-overlay-wa-subtext max-w-[290px]">
            Choose your country team and discuss logo, branding, website, UI/UX, packaging, or
            automation projects.
          </p>
        </div>

        <div className="p-3 grid gap-2 bg-overlay-white-08">
          {WHATSAPP_REGIONS.map((region) => (
            <a
              key={region.country}
              href={region.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-wa-link bg-overlay-white-08 border border-overlay-white-08 text-white transition-all duration-medium hover:-translate-y-0.5 hover:border-overlay-accent-border-42 hover:bg-accent/10 pointer-events-auto"
              onClick={() => setOpen(false)}
            >
              <span className="w-[42px] h-[42px] rounded-wa-flag bg-white text-ink grid place-items-center shrink-0 text-2xl">
                <span role="img" aria-hidden="true">{region.flag}</span>
              </span>
              <span className="font-black text-md leading-tight flex-1">{region.country}</span>
              <span className="w-[30px] h-[30px] rounded-full bg-accent text-wa-arrow-text grid place-items-center font-black shrink-0">
                →
              </span>
            </a>
          ))}
        </div>

        <p className="px-[18px] pb-[18px] text-xs leading-normal text-overlay-wa-foot">
          Fast response from the Peraspera team for design, development, and product support.
        </p>
      </div>

      <button
        type="button"
        className="pointer-events-auto rounded-pill bg-ink text-white min-w-[218px] h-[58px] px-3 flex items-center gap-2.5 shadow-wa-trigger cursor-pointer border border-overlay-accent-border-50 transition-all duration-medium hover:-translate-y-0.5 hover:shadow-wa-trigger-hover max-md:min-w-[58px] max-md:w-[58px] max-md:p-0 max-md:justify-center"
        aria-expanded={open}
        aria-label="Open WhatsApp support"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="w-10 h-10 rounded-full bg-accent text-ink grid place-items-center shadow-wa-icon-ring">
          <WhatsAppIcon />
        </span>
        <span className="flex flex-col items-start leading-tight max-md:hidden">
          <strong className="text-sm-plus text-white">WhatsApp {BRAND.name}</strong>
          <span className="text-[10.5px] text-overlay-wa-trigger-sub mt-0.5">
            Choose country support
          </span>
        </span>
      </button>
    </div>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      className={`fixed left-floating-offset bottom-floating-offset w-12 h-12 rounded-full border border-overlay-accent-border-55 bg-ink text-white grid place-items-center shadow-back-top cursor-pointer transition-all duration-medium z-[9998] max-md:left-floating-offset-mobile max-md:bottom-[18px] max-md:w-[46px] max-md:h-[46px] hover:bg-accent hover:text-ink hover:-translate-y-0.5 ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3.5 pointer-events-none'}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <AppIcon name="ChevronUp" className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
}
