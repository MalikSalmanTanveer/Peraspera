import { BRAND_ROW_ONE, BRAND_ROW_TWO, type BrandItem } from '../data/brands';
import { Marquee } from '../components/Marquee';

function BrandTile({ brand }: { brand: BrandItem }) {
  return (
    <div className="relative flex h-[108px] w-[250px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-overlay-white-12 bg-overlay-white-04 px-4 max-md:h-[92px] max-md:w-[210px]">
      <span className="absolute right-3 top-3 max-w-[58%] truncate text-right text-[10px] font-extrabold uppercase tracking-wider text-accent md:text-2xs">
        {brand.name}
      </span>
      <div className="absolute bottom-3 left-3 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.28)] max-md:h-[46px] max-md:w-[46px]">
        <img
          src={brand.src}
          alt={brand.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );
}

export function LogoMarquee() {
  return (
    <section
      className="relative overflow-hidden border-y border-overlay-white-08 bg-ink py-10 md:py-12"
      aria-label="Trusted brands"
    >
      <div className="hero-grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative z-[1]">
        <p className="mb-8 text-center font-display text-sm font-extrabold uppercase tracking-[0.22em] text-overlay-white-48 max-md:text-2xs">
          Trusted by Growing Brands Worldwide
        </p>

        <div className="mask-marquee max-md:mask-marquee-mobile mb-5 md:mb-6">
          <Marquee direction="left" gapClass="gap-5 md:gap-8">
            {BRAND_ROW_ONE.map((brand) => (
              <BrandTile key={brand.name + brand.src} brand={brand} />
            ))}
          </Marquee>
        </div>

        <div className="mask-marquee max-md:mask-marquee-mobile">
          <Marquee direction="right" gapClass="gap-5 md:gap-8">
            {BRAND_ROW_TWO.map((brand) => (
              <BrandTile key={brand.name + brand.src} brand={brand} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
