interface AccentTickerProps {
  items: readonly string[];
}

export function AccentTicker({ items }: AccentTickerProps) {
  const sequence = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-y border-accent/40 bg-ink py-3"
      aria-label="Scrolling highlights"
    >
      <div className="coming-soon-track flex w-max items-center">
        {sequence.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center whitespace-nowrap px-5 text-xs font-extrabold uppercase tracking-[0.28em] text-accent md:px-6 md:text-sm"
          >
            {item}
            <span className="mx-5 text-accent/70 md:mx-6" aria-hidden="true">
              •
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
