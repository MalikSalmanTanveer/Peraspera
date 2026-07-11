interface PlaceholderImageProps {
  gradient: string;
  className?: string;
  label?: string;
}

export function PlaceholderImage({
  gradient,
  className = '',
  label,
}: PlaceholderImageProps) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} ${className}`}
      role="img"
      aria-label={label ?? 'Project preview placeholder'}
    />
  );
}
