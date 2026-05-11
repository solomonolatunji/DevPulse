import { AppProviders, ThemedToaster } from '@/components';
import { useUser } from '@/hooks';
import { registerBackgroundSync, telemetryService } from '@/services';
import { useAuthStore } from '@/stores';
import {
  requestNotificationPermissions,
  scheduleSmartDailyReminders,
  setupNotificationHandler,
} from '@/utilities';
import '@/utilities/webStorageShim';
import {
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { useFonts } from 'expo-font';
import { Stack, useGlobalSearchParams, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

function TelemetryUserObserver() {
  const { data: user } = useUser();

  useEffect(() => {
    let isMounted = true;

    const identify = async () => {
      if (!user?.data) {
        return;
      }

      await telemetryService.initTelemetry();

      if (isMounted) {
        telemetryService.identifyUser(user.data);
      }
    };

    void identify();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return null;
}

function TelemetryBridge() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const serializedParams = JSON.stringify(params);

  useEffect(() => {
    let isMounted = true;

    const trackScreen = async () => {
      await telemetryService.initTelemetry();

      if (isMounted) {
        telemetryService.trackScreen(pathname, params);
      }
    };

    void trackScreen();

    return () => {
      isMounted = false;
    };
  }, [pathname, serializedParams]);

  useEffect(() => {
    if (!isAuthenticated) {
      void telemetryService.clearTelemetryUser();
    }
  }, [isAuthenticated]);

  return isAuthenticated ? <TelemetryUserObserver /> : null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();

      setupNotificationHandler();
      void telemetryService.initTelemetry();
      requestNotificationPermissions().then((granted: boolean) => {
        if (granted) {
          scheduleSmartDailyReminders();
        }
      });

      registerBackgroundSync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <View style={{ flex: 1 }}>
        <TelemetryBridge />
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
        <ThemedToaster />
      </View>
    </AppProviders>
  );
}
