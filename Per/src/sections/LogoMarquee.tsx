import { BRAND_ROW_ONE, BRAND_ROW_TWO } from '../data/brands';
import { Marquee } from '../components/Marquee';

function BrandLogo({ src, index }: { src: string; index: number }) {
  const isRectangular = index % 2 === 0;

  const slotClass = isRectangular
    ? 'w-[180px] h-[96px] max-2xl:w-[160px] max-2xl:h-[85px] max-md:w-[140px] max-md:h-[75px] max-sm:w-[120px] max-sm:h-[64px]'
    : 'w-[96px] h-[96px] max-2xl:w-[85px] max-2xl:h-[85px] max-md:w-[75px] max-md:h-[75px] max-sm:w-[64px] max-sm:h-[64px]';

  return (
    <div
      className={`${slotClass} flex items-center justify-center shrink-0 px-2`}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        className="max-w-full max-h-full w-auto h-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-medium grayscale hover:grayscale-0"
      />
    </div>
  );
}

export function LogoMarquee() {
  return (
    <section
      className="bg-white overflow-hidden py-section-y-brands pb-28 max-2xl:py-section-y-brands-tablet max-md:py-section-y-brands-mobile max-md:pb-20"
      aria-label="Trusted brands"
    >
      <div className="text-center mb-20 max-2xl:mb-16 max-md:mb-12">
        <span className="font-display text-lg font-extrabold uppercase tracking-marquee text-brands-title max-md:text-sm max-md:tracking-marquee-mobile">
          Trusted by Growing Brands Worldwide
        </span>
      </div>

      <div className="mask-marquee max-md:mask-marquee-mobile mb-14 max-md:mb-10">
        <Marquee direction="left">
          {BRAND_ROW_ONE.map((src, i) => (
            <BrandLogo key={`r1-${i}`} src={src} index={i} />
          ))}
        </Marquee>
      </div>

      <div className="mask-marquee max-md:mask-marquee-mobile">
        <Marquee direction="right">
          {BRAND_ROW_TWO.map((src, i) => (
            <BrandLogo key={`r2-${i}`} src={src} index={BRAND_ROW_ONE.length + i} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
