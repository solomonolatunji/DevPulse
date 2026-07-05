import { Avatar, Button, Card, ScreenHeader, Typography } from '@/components';
import { ACCENT_COLORS } from '@/constants';
import {
  LogoutBottomSheet,
  SectionHeader,
  SettingItem,
} from '@/features/settings';
import { useTheme, useUser } from '@/hooks';
import { settingsService, telemetryService } from '@/services';
import { useAuthStore } from '@/stores';
import { settingsStyles as styles } from '@/theme';
import Feather from '@react-native-vector-icons/feather/static';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { theme, themeMode, accentColor } = useTheme();
  const { data: user } = useUser();
  const { logout } = useAuthStore();
  const router = useRouter();
  const logoutBottomSheetRef = useRef<BottomSheetModal>(null);

  const [settingsState, setSettingsState] = React.useState({
    collectCrashes: true,
    collectPerformance: true,
    collectAnalytics: true,
  });

  React.useEffect(() => {
    const loadSettings = async () => {
      const s = await settingsService.getSettings();
      setSettingsState({
        collectCrashes: s.collectCrashes,
        collectPerformance: s.collectPerformance,
        collectAnalytics: s.collectAnalytics,
      });
      await telemetryService.applyTelemetryConsent({
        collectCrashes: s.collectCrashes,
        collectPerformance: s.collectPerformance,
        collectAnalytics: s.collectAnalytics,
      });
    };
    loadSettings();
  }, []);

  const toggleSetting = async (key: keyof typeof settingsState) => {
    const newValue = !settingsState[key];
    const nextSettings = { ...settingsState, [key]: newValue };
    setSettingsState(nextSettings);
    await settingsService.updateSettings({ [key]: newValue });
    await telemetryService.applyTelemetryConsent(nextSettings);
  };

  const currentAccentName =
    ACCENT_COLORS.find((c) => c.color === accentColor)?.name || 'Custom';
  const currentModeLabel =
    themeMode.charAt(0).toUpperCase() + themeMode.slice(1);

  const handleLogout = () => {
    logoutBottomSheetRef.current?.present();
  };

  const confirmLogout = () => {
    logoutBottomSheetRef.current?.dismiss();
    logout();
    router.replace('/');
  };

  const userData = user?.data;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['left', 'right']}
    >
      <ScreenHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Avatar
              source={userData?.photo ? { uri: userData.photo } : undefined}
              initials={userData?.display_name || userData?.username}
              size={70}
            />
            <View style={styles.profileDetails}>
              <Typography variant="title" weight="bold" style={styles.userName}>
                {userData?.display_name || userData?.username || 'Developer'}
              </Typography>
              <View style={styles.usernameRow}>
                <Typography
                  color={theme.colors.textSecondary}
                  style={styles.username}
                >
                  @{userData?.username || 'anonymous'}
                </Typography>
              </View>
              <View style={styles.locationContainer}>
                <Feather
                  name="map-pin"
                  size={12}
                  color={theme.colors.textSecondary}
                />
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                  weight="bold"
                  style={styles.locationText}
                >
                  {userData?.city?.title?.toUpperCase() || 'WORLD'}
                </Typography>
              </View>
            </View>
          </View>
        </Card>

        {/* About Section */}
        <SectionHeader title="About" />
        <Card style={styles.sectionCard}>
          <SettingItem
            icon="star"
            label="Rate The App"
            description="Support development with a review"
          />
          <SettingItem
            icon="coffee"
            label="Buy Me A Coffee"
            description="Every cup fuels more features"
            onPress={() =>
              Linking.openURL('https://buymeacoffee.com/eminisolomon')
            }
          />
          <SettingItem
            icon="help-circle"
            label="Who even made this?"
            description="Meet the developer behind DevPulse"
            onPress={() =>
              Linking.openURL('https://solomon-olatunji.vercel.app/')
            }
          />
        </Card>

        {/* Activity & Stats Section */}
        <SectionHeader title="Activity & Stats" />
        <Card style={styles.sectionCard}>
          <SettingItem
            icon="bar-chart-2"
            label="Coding Stats"
            description="Detailed analytics and charts"
            onPress={() => router.push('/stats/numbers')}
          />
          <SettingItem
            icon="clock"
            label="Session History"
            description="Daily session activity timeline"
            onPress={() => router.push('/stats/sessions')}
          />
        </Card>

        {/* Theming Section */}
        <SectionHeader title="Theming" />
        <Card style={styles.sectionCard}>
          <SettingItem
            icon="edit-2"
            label="Appearance"
            value={`${currentModeLabel} • ${currentAccentName}`}
            onPress={() => router.push('/settings/theme')}
          />
        </Card>

        {/* Insights Section */}
        <SectionHeader title="Insights" />
        <Card style={styles.sectionCard}>
          <SettingItem
            icon="alert-circle"
            label="Crashes"
            description="Collect log information about bugs and crashes."
            isSwitch
            switchValue={settingsState.collectCrashes}
            onSwitchChange={() => toggleSetting('collectCrashes')}
          />
          <SettingItem
            icon="activity"
            label="Performance"
            description="Collect log information about hiccups, load speeds."
            isSwitch
            switchValue={settingsState.collectPerformance}
            onSwitchChange={() => toggleSetting('collectPerformance')}
          />
          <SettingItem
            icon="mouse-pointer"
            label="Analytics"
            description="Anonymously collect info about app usage."
            isSwitch
            switchValue={settingsState.collectAnalytics}
            onSwitchChange={() => toggleSetting('collectAnalytics')}
          />
        </Card>

        <Button
          variant="destructive"
          size="lg"
          label="LOGOUT"
          onPress={handleLogout}
          leftIcon={<Feather name="log-out" size={20} color="#fff" />}
          fullWidth
          style={{ marginTop: 24 }}
        />

        <LogoutBottomSheet
          ref={logoutBottomSheetRef}
          onConfirm={confirmLogout}
          onCancel={() => logoutBottomSheetRef.current?.dismiss()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
