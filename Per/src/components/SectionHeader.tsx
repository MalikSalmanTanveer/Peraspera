interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  light?: boolean;
  darkLabel?: boolean;
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  light = false,
  darkLabel = false,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`max-w-[820px] mx-auto text-center mb-[58px] ${className}`}>
      <span
        className={`section-label ${light ? 'section-label-light' : ''} ${darkLabel ? 'section-label-dark' : ''}`}
      >
        {label}
      </span>
      <h2 className={`section-heading ${light ? 'text-white' : ''}`}>{title}</h2>
      {description && (
        <p
          className={`mt-[18px] text-md-plus leading-body-lg ${light ? 'text-overlay-white-55' : 'text-muted'}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
