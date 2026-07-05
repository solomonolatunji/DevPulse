import { useTheme } from '@/hooks/useTheme';
import { Stack, type NativeStackNavigationOptions } from 'expo-router';

interface DefaultStackLayoutProps {
  children: React.ReactNode;
  screenOptions?: NativeStackNavigationOptions;
}

export default function DefaultStackLayout({
  children,
  screenOptions,
}: DefaultStackLayoutProps) {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'left',
        headerBackTitle: '',
        headerTransparent: false,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontFamily: theme.typography.families.bold,
          fontSize: theme.typography.sizes.xl,
        },
        headerShadowVisible: false,
        animation: 'slide_from_bottom',
        ...screenOptions,
      }}
    >
      {children}
    </Stack>
  );
}
