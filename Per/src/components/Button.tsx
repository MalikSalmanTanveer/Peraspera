import { type ReactNode } from 'react';

type ButtonVariant = 'yellow' | 'light' | 'dark' | 'outline';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  ariaLabel?: string;
}

const variantClass: Record<ButtonVariant, string> = {
  yellow: 'btn-yellow',
  light: 'btn-light',
  dark: 'btn-dark',
  outline: 'btn-outline',
};

export function Button({
  children,
  variant = 'yellow',
  href,
  className = '',
  type = 'button',
  onClick,
  ariaLabel,
}: ButtonProps) {
  const classes = `${variantClass[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
