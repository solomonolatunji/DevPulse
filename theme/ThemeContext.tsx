import { settingsService } from '@/services/settings.service';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme } from './dark';
import { lightTheme, Theme } from './light';
import { spacing } from './spacing';
import { tokens } from './tokens';
import { typography } from './typography';

export type AppTheme = Theme & {
  spacing: typeof spacing;
  typography: typeof typography;
  tokens: typeof tokens;
};

interface ThemeContextType {
  theme: AppTheme;
  isDark: boolean;
  themeMode: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>(
    'system',
  );
  const [accentColor, setAccentColorState] = useState('#3B82F6');
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await settingsService.getSettings();
      setThemeModeState(settings.themeMode);
      setAccentColorState(settings.accentColor);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  const themeColors = isDark ? darkTheme : lightTheme;

  const theme = {
    ...themeColors,
    colors: {
      ...themeColors.colors,
      primary: accentColor,
    },
    spacing,
    typography,
    tokens,
  };

  const setThemeMode = async (mode: 'light' | 'dark' | 'system') => {
    setThemeModeState(mode);
    await settingsService.updateSettings({ themeMode: mode });
  };

  const setAccentColor = async (color: string) => {
    setAccentColorState(color);
    await settingsService.updateSettings({ accentColor: color });
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        themeMode,
        toggleTheme,
        setThemeMode,
        accentColor,
        setAccentColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
