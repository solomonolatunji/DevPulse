import { palette } from './colors';
import { Theme } from './light';

export const darkTheme: Theme = {
  colors: {
    background: palette.neutral[950],
    surface: palette.neutral[900],
    surfaceHighlight: palette.neutral[800],
    surfaceCard: palette.neutral[900],
    surfaceSubtle: 'rgba(255, 255, 255, 0.05)',

    text: '#FFFFFF',
    textSecondary: palette.neutral[400],
    textTertiary: palette.neutral[600],
    textInverse: palette.neutral[900],
    textMuted: palette.neutral[500],
    onSurface: palette.neutral[300],

    primary: palette.brand[400],
    primaryForeground: palette.brand[950],
    primaryContainer: palette.brand[900],
    primaryContainerForeground: palette.brand[300],

    secondary: palette.secondary[400],
    secondaryForeground: palette.secondary[950],
    secondaryContainer: palette.secondary[900],
    secondaryContainerForeground: palette.secondary[300],

    accent: palette.accent[400],
    accentForeground: palette.accent[950],
    accentContainer: palette.accent[900],
    accentContainerForeground: palette.accent[300],

    border: palette.neutral[800],
    borderFocus: palette.brand[400],

    success: palette.success[400],
    successContainer: palette.success[900],
    warning: palette.warning[400],
    warningContainer: palette.warning[900],
    error: palette.error[400],
    errorContainer: palette.error[900],
    info: palette.info[400],
    infoContainer: palette.info[900],

    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  dark: true,
};
