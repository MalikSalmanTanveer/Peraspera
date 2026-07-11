import colors from '../../design-system/colors.json';
import typography from '../../design-system/typography.json';
import spacing from '../../design-system/spacing.json';
import radius from '../../design-system/radius.json';
import shadows from '../../design-system/shadows.json';
import breakpoints from '../../design-system/breakpoints.json';
import animations from '../../design-system/animations.json';

export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  breakpoints,
  animations,
} as const;

export type DesignTokens = typeof tokens;
