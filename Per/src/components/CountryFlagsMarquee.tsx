import { SERVED_COUNTRIES } from '../data/countries';
import { Marquee } from './Marquee';
import { CountryFlag } from './CountryFlag';

export function CountryFlagsMarquee() {
  return (
    <div className="mask-marquee mt-10">
      <Marquee direction="left-slow" gapClass="gap-3 md:gap-4">
        {SERVED_COUNTRIES.map((country) => (
          <div
            key={country.code}
            title={country.name}
            className="flex shrink-0 items-center gap-2.5 rounded-xl border border-overlay-white-12 bg-overlay-white-08 px-3 py-2 transition-colors duration-normal hover:border-accent/45 hover:bg-accent/10"
          >
            <CountryFlag
              code={country.code}
              name={country.name}
              className="h-5 w-7 rounded-[3px] object-cover shadow-sm"
            />
            <span className="whitespace-nowrap text-xs font-semibold text-white/75 md:text-sm">
              {country.name}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
