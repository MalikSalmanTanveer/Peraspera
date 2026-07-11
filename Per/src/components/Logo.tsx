import navbarLogo from '../assets/logos/Navbar-logo.png';
import primaryLogo from '../assets/logos/Primary.png';

type LogoVariant = 'navbar' | 'primary';

interface LogoProps {
  variant: LogoVariant;
  /** Light logo for dark backgrounds (footer, scrolled nav) */
  inverted?: boolean;
  className?: string;
}

const sources: Record<LogoVariant, string> = {
  navbar: navbarLogo,
  primary: primaryLogo,
};

export function Logo({ variant, inverted = false, className = '' }: LogoProps) {
  return (
    <img
      src={sources[variant]}
      alt="Peraspera"
      className={`block object-contain object-left ${inverted ? 'brightness-0 invert' : ''} ${className}`}
    />
  );
}
