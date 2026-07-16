import { BRAND_ROW_ONE, BRAND_ROW_TWO } from '../data/brands';
import { Marquee } from '../components/Marquee';

const LOGO_SLOT =
  'flex h-[96px] w-[210px] shrink-0 items-center justify-center rounded-2xl bg-paper px-4 transition-colors duration-medium hover:bg-white max-md:h-[80px] max-md:w-[170px]';

function BrandLogo({ src }: { src: string }) {
  return (
    <div className={LOGO_SLOT}>
      <img
        src={src}
        alt=""
        loading="lazy"
        className="max-h-[68px] max-w-[170px] w-auto h-auto object-contain object-center opacity-85 transition-all duration-medium grayscale hover:grayscale-0 hover:opacity-100 max-md:max-h-[56px] max-md:max-w-[140px]"
      />
    </div>
  );
}

export function LogoMarquee() {
  return (
    <section className="overflow-hidden bg-white py-10 md:py-12" aria-label="Client brands">
      <div className="mask-marquee max-md:mask-marquee-mobile mb-5 md:mb-6">
        <Marquee direction="left" gapClass="gap-5 md:gap-8">
          {BRAND_ROW_ONE.map((src, i) => (
            <BrandLogo key={`r1-${i}`} src={src} />
          ))}
        </Marquee>
      </div>

      <div className="mask-marquee max-md:mask-marquee-mobile">
        <Marquee direction="right" gapClass="gap-5 md:gap-8">
          {BRAND_ROW_TWO.map((src, i) => (
            <BrandLogo key={`r2-${i}`} src={src} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
