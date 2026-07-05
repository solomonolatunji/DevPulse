import { useTheme } from '@/theme';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  const { theme } = useTheme();
  const inactiveTabColor = theme.colors.onSurface;

  return (
    <NativeTabs
      backBehavior="history"
      labelVisibilityMode="labeled"
      tintColor={theme.colors.primary}
      backgroundColor={theme.colors.surface}
      iconColor={{
        default: inactiveTabColor,
        selected: theme.colors.primary,
      }}
      labelStyle={{
        default: {
          color: inactiveTabColor,
          fontSize: 11,
          fontWeight: '600',
        },
        selected: {
          color: theme.colors.primary,
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{
            default: 'waveform.path.ecg',
            selected: 'waveform.path.ecg',
          }}
          md="ecg"
        />
        <NativeTabs.Trigger.Label>Pulse</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="projects">
        <NativeTabs.Trigger.Icon
          sf={{
            default: 'briefcase',
            selected: 'briefcase.fill',
          }}
          md="work"
        />
        <NativeTabs.Trigger.Label>Projects</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="goals">
        <NativeTabs.Trigger.Icon
          sf={{
            default: 'target',
            selected: 'target',
          }}
          md="target"
        />
        <NativeTabs.Trigger.Label>Goals</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="leaderboard">
        <NativeTabs.Trigger.Icon
          sf={{
            default: 'trophy',
            selected: 'trophy.fill',
          }}
          md="trophy"
        />
        <NativeTabs.Trigger.Label>Leaders</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
