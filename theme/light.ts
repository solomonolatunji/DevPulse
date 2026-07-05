import { palette } from './colors';

export const lightTheme = {
  colors: {
    background: '#FFFFFF',
    surface: palette.neutral[50],
    surfaceHighlight: palette.neutral[100],
    surfaceCard: '#FFFFFF',
    surfaceSubtle: palette.neutral[100],

    text: palette.neutral[900],
    textSecondary: palette.neutral[600],
    textTertiary: palette.neutral[400],
    textInverse: '#FFFFFF',
    textMuted: palette.neutral[500],
    onSurface: palette.neutral[700],

    primary: palette.brand[600],
    primaryForeground: '#FFFFFF',
    primaryContainer: palette.brand[50],
    primaryContainerForeground: palette.brand[700],

    secondary: palette.secondary[600],
    secondaryForeground: '#FFFFFF',
    secondaryContainer: palette.secondary[50],
    secondaryContainerForeground: palette.secondary[700],

    accent: palette.accent[500],
    accentForeground: '#FFFFFF',
    accentContainer: palette.accent[50],
    accentContainerForeground: palette.accent[700],

    border: palette.neutral[200],
    borderFocus: palette.brand[500],

    success: palette.success[600],
    successContainer: palette.success[50],
    warning: palette.warning[600],
    warningContainer: palette.warning[50],
    error: palette.error[600],
    errorContainer: palette.error[50],
    info: palette.info[600],
    infoContainer: palette.info[50],

    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  dark: false,
};

export type Theme = typeof lightTheme;
