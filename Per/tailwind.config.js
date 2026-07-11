/** @type {import('tailwindcss').Config} */
import colors from './design-system/colors.json' with { type: 'json' };
import typography from './design-system/typography.json' with { type: 'json' };
import spacing from './design-system/spacing.json' with { type: 'json' };
import radius from './design-system/radius.json' with { type: 'json' };
import shadows from './design-system/shadows.json' with { type: 'json' };
import breakpoints from './design-system/breakpoints.json' with { type: 'json' };
import animations from './design-system/animations.json' with { type: 'json' };

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: breakpoints.xs,
      sm: breakpoints.sm,
      md: breakpoints.md,
      lg: breakpoints.lg,
      xl: breakpoints.xl,
      '2xl': breakpoints['2xl'],
      '3xl': breakpoints['3xl'],
      '4xl': breakpoints['4xl'],
      '5xl': breakpoints['5xl'],
    },
    extend: {
      colors: {
        ink: colors.ink,
        paper: colors.paper,
        white: colors.white,
        accent: colors.accent,
        'accent-dark': colors['accent-dark'],
        'accent-gold': colors['accent-gold'],
        'accent-emphasis': colors['accent-emphasis'],
        muted: colors.muted,
        'muted-alt': colors['muted-alt'],
        'muted-light': colors['muted-light'],
        border: colors.border,
        'contact-bg': colors['contact-bg'],
        'nav-warm': colors['nav-warm'],
        'dark-elevated': colors['dark-elevated'],
        'dark-card': colors['dark-card'],
        'footer-office-bg': colors['footer-office-bg'],
        placeholder: colors.placeholder,
        'contact-text': colors['contact-text'],
        'contact-role': colors['contact-role'],
        'contact-avatar-bg': colors['contact-avatar-bg'],
        'select-text': colors['select-text'],
        'select-hover-bg': colors['select-hover-bg'],
        'select-icon-bg': colors['select-icon-bg'],
        'pill-bg': colors['pill-bg'],
        'wa-arrow-text': colors['wa-arrow-text'],
        'wa-head-dark': colors['wa-head-dark'],
        star: colors.star,
        'brands-title': colors['brands-title'],
        'mega-panel-gradient-start': colors['mega-panel-gradient-start'],
        'mega-panel-gradient-mid': colors['mega-panel-gradient-mid'],
        'mega-panel-gradient-end': colors['mega-panel-gradient-end'],
        overlay: colors.overlay,
        'mega-icon': colors['mega-icon'],
      },
      fontFamily: {
        display: typography.fontFamily.display,
        body: typography.fontFamily.body,
      },
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      letterSpacing: typography.letterSpacing,
      spacing: spacing,
      borderRadius: radius,
      boxShadow: shadows,
      transitionDuration: animations.duration,
      transitionTimingFunction: {
        smooth: animations.easing.smooth,
      },
      keyframes: animations.keyframes,
      animation: {
        'scroll-left': `scrollLeft ${animations.duration['marquee-left']} ${animations.easing.linear} infinite`,
        'scroll-left-slow': `scrollLeft ${animations.duration['marquee-left-slow']} ${animations.easing.linear} infinite`,
        'scroll-right': `scrollRight ${animations.duration['marquee-right']} ${animations.easing.linear} infinite`,
        'scroll-left-innov': `scrollLeft ${animations.duration['marquee-innov']} ${animations.easing.linear} infinite`,
        'scroll-left-testi': `scrollLeft ${animations.duration['marquee-testimonial']} ${animations.easing.linear} infinite`,
      },
      maxWidth: {
        container: spacing.container,
        'container-wide': spacing['container-wide'],
        'container-cta': spacing['container-cta'],
        'container-contact': spacing['container-contact'],
        'container-mega': spacing['container-mega'],
        'container-nav-float': spacing['container-nav-float'],
      },
    },
  },
  plugins: [],
};
