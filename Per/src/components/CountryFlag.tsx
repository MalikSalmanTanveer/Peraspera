interface CountryFlagProps {
  code: string;
  name: string;
  className?: string;
}

export function CountryFlag({ code, name, className = 'h-6 w-8 rounded-sm object-cover shadow-sm' }: CountryFlagProps) {
  const iso = code.toLowerCase();

  return (
    <img
      src={`https://flagcdn.com/w80/${iso}.png`}
      srcSet={`https://flagcdn.com/w160/${iso}.png 2x`}
      alt={`${name} flag`}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
