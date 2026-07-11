import { type ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section';
  wide?: boolean;
}

export function Container({
  children,
  className = '',
  as: Tag = 'div',
  wide = false,
}: ContainerProps) {
  const maxWidth = wide ? 'max-w-container-wide' : 'max-w-container';

  return (
    <Tag className={`${maxWidth} mx-auto w-full ${className}`}>{children}</Tag>
  );
}
