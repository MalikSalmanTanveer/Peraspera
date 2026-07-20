import type { Testimonial } from '../data/content-extended';

export function testimonialAvatarClassName(
  testimonial: Pick<Testimonial, 'avatarFit' | 'avatarShape'>,
  size: 'md' | 'sm' = 'md',
): string {
  const dimensions = size === 'md' ? 'h-12 w-12' : 'h-11 w-11';
  const shape = testimonial.avatarShape === 'square' ? 'rounded-lg' : 'rounded-full';
  const fit =
    testimonial.avatarFit === 'contain'
      ? 'bg-white object-contain p-1.5'
      : 'object-cover object-top';

  return `${dimensions} shrink-0 ${shape} ${fit} ring-2 ring-border`;
}
