import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'left-slow' | 'left-innov' | 'left-testi' | 'left-tools' | 'right-tools';
  className?: string;
  gapClass?: string;
}

const animationClass = {
  left: 'animate-scroll-left',
  right: 'animate-scroll-right',
  'left-slow': 'animate-scroll-left-slow',
  'left-innov': 'animate-scroll-left-innov',
  'left-testi': 'animate-scroll-left-testi',
  'left-tools': 'animate-scroll-left-tools',
  'right-tools': 'animate-scroll-right-tools',
} as const;

export function Marquee({
  children,
  direction = 'left',
  className = '',
  gapClass = 'gap-gap-marquee md:gap-gap-marquee-lg max-md:gap-gap-marquee-tablet max-sm:gap-gap-marquee-mobile',
}: MarqueeProps) {
  const items = Children.toArray(children);

  const withKeys = (prefix: string) =>
    items.map((child, index) => {
      if (!isValidElement(child)) return child;

      return cloneElement(child as ReactElement<{ key?: string | number }>, {
        key: `${prefix}-${index}`,
      });
    });

  return (
    <div className={`group overflow-hidden w-full ${className}`}>
      <div
        className={`flex w-max items-center will-change-transform ${gapClass} ${animationClass[direction]} group-hover:[animation-play-state:paused]`}
      >
        {withKeys('marquee-a')}
        {withKeys('marquee-b')}
      </div>
    </div>
  );
}
