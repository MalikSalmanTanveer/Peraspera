import { BRAND_ROW_ONE, BRAND_ROW_TWO } from '../data/brands';
import { Marquee } from '../components/Marquee';

function BrandLogo({ src }: { src: string }) {
  return (
    <div className="w-[172px] h-16 max-2xl:w-[150px] max-2xl:h-[58px] max-md:w-[126px] max-md:h-[50px] max-sm:w-[108px] max-sm:h-11 flex items-center justify-center shrink-0 px-3">
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
            <BrandLogo key={`r1-${i}`} src={src} />
          ))}
        </Marquee>
      </div>

      <div className="mask-marquee max-md:mask-marquee-mobile">
        <Marquee direction="right">
          {BRAND_ROW_TWO.map((src, i) => (
            <BrandLogo key={`r2-${i}`} src={src} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
