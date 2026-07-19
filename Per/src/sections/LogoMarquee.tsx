import { BRAND_ROW_ONE, BRAND_ROW_TWO, type BrandItem } from '../data/brands';
import { Marquee } from '../components/Marquee';

const LOGO_SLOT =
  'flex h-[96px] w-[210px] shrink-0 items-center justify-center rounded-2xl bg-paper px-4 transition-colors duration-medium hover:bg-white max-md:h-[80px] max-md:w-[170px]';

function BrandLogo({ brand }: { brand: BrandItem }) {
  return (
    <div className={LOGO_SLOT}>
      <img
        src={brand.src}
        alt={brand.name}
        loading="lazy"
        className="max-h-[68px] max-w-[170px] h-auto w-auto object-contain object-center opacity-85 transition-all duration-medium grayscale hover:grayscale-0 hover:opacity-100 max-md:max-h-[56px] max-md:max-w-[140px]"
      />
    </div>
  );
}

export function LogoMarquee() {
  return (
    <section
      className="overflow-hidden bg-white py-10 max-md:py-8"
      aria-label="Trusted brands"
    >
      <div className="mask-marquee max-md:mask-marquee-mobile mb-6 max-md:mb-5">
        <Marquee direction="left" gapClass="gap-5 md:gap-8">
          {BRAND_ROW_ONE.map((brand) => (
            <BrandLogo key={`r1-${brand.name}`} brand={brand} />
          ))}
        </Marquee>
      </div>

      <div className="mask-marquee max-md:mask-marquee-mobile">
        <Marquee direction="right" gapClass="gap-5 md:gap-8">
          {BRAND_ROW_TWO.map((brand) => (
            <BrandLogo key={`r2-${brand.name}`} brand={brand} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
