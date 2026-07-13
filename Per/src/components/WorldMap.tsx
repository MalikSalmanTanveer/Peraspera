import { SERVED_COUNTRIES } from '../data/countries';

export function WorldMap() {
  return (
    <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden border border-overlay-white-12 bg-dark-elevated">
      <div className="absolute inset-0 hero-grid-bg opacity-50" aria-hidden="true" />
      <img
        src="/world-map.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-contain p-6 opacity-90"
      />
      <svg
        viewBox="0 0 100 50"
        className="absolute inset-0 w-full h-full p-6"
        role="img"
        aria-label="World map showing countries Peraspera serves"
      >
        {SERVED_COUNTRIES.map((country) => {
          const cx = (country.mapX / 100) * 100;
          const cy = (country.mapY / 100) * 50;
          return (
            <g key={country.code}>
              <circle cx={cx} cy={cy} r="1.8" fill="rgba(254,163,39,0.2)" />
              <circle cx={cx} cy={cy} r="0.7" fill="#fea327" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
