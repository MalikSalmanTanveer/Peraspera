type Props = {
  live: boolean;
  alert?: boolean;
};

export function LiveBadge({ live, alert }: Props) {
  return (
    <p
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        alert
          ? 'border-accent bg-accent/15 text-ink motion-safe:animate-pulse'
          : live
            ? 'border-[#e0e0e0] bg-white text-ink'
            : 'border-[#e0e0e0] bg-white text-[#8a8a8a]'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          alert ? 'bg-accent' : live ? 'bg-emerald-500' : 'bg-[#ccc]'
        }`}
      />
      {alert ? 'New application' : live ? 'Live' : 'Offline'}
    </p>
  );
}
