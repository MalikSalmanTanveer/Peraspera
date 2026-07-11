import { type ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'left-slow' | 'left-innov' | 'left-testi';
  className?: string;
  gapClass?: string;
}

const animationClass = {
  left: 'animate-scroll-left',
  right: 'animate-scroll-right',
  'left-slow': 'animate-scroll-left-slow',
  'left-innov': 'animate-scroll-left-innov',
  'left-testi': 'animate-scroll-left-testi',
} as const;

export function Marquee({
  children,
  direction = 'left',
  className = '',
  gapClass = 'gap-gap-marquee md:gap-gap-marquee-lg max-md:gap-gap-marquee-tablet max-sm:gap-gap-marquee-mobile',
}: MarqueeProps) {
  return (
    <div
      className={`group overflow-hidden w-full ${className}`}
    >
      <div
        className={`flex items-center w-max will-change-transform ${gapClass} ${animationClass[direction]} group-hover:[animation-play-state:paused]`}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
