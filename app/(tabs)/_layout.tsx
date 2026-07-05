import { useTheme } from '@/hooks';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

type NativeTabName = 'index' | 'projects' | 'goals' | 'leaderboard';

type NativeTabConfig = {
  label: string;
  sfDefault: string;
  sfSelected: string;
  md: string;
};

const nativeTabConfig: Record<NativeTabName, NativeTabConfig> = {
  index: {
    label: 'Pulse',
    sfDefault: 'waveform.path.ecg',
    sfSelected: 'waveform.path.ecg',
    md: 'pulse',
  },
  projects: {
    label: 'Projects',
    sfDefault: 'briefcase',
    sfSelected: 'briefcase.fill',
    md: 'briefcase-outline',
  },
  goals: {
    label: 'Goals',
    sfDefault: 'target',
    sfSelected: 'target',
    md: 'target',
  },
  leaderboard: {
    label: 'Leaders',
    sfDefault: 'trophy',
    sfSelected: 'trophy.fill',
    md: 'trophy-outline',
  },
};

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <NativeTabs
      backBehavior="history"
      tintColor={theme.colors.primary}
      backgroundColor="transparent"
      iconColor={{
        default: theme.colors.textSecondary,
        selected: theme.colors.primary,
      }}
      labelStyle={{
        default: {
          color: theme.colors.textSecondary,
          fontSize: 10,
          fontWeight: '500',
        },
        selected: {
          color: theme.colors.primary,
          fontSize: 10,
          fontWeight: '700',
        },
      }}
      badgeBackgroundColor={theme.colors.primary}
      disableTransparentOnScrollEdge
      blurEffect="systemChromeMaterial"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{
            default: nativeTabConfig.index.sfDefault as never,
            selected: nativeTabConfig.index.sfSelected as never,
          }}
          md={nativeTabConfig.index.md as never}
        />
        <NativeTabs.Trigger.Label>
          {nativeTabConfig.index.label}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="projects">
        <NativeTabs.Trigger.Icon
          sf={{
            default: nativeTabConfig.projects.sfDefault as never,
            selected: nativeTabConfig.projects.sfSelected as never,
          }}
          md={nativeTabConfig.projects.md as never}
        />
        <NativeTabs.Trigger.Label>
          {nativeTabConfig.projects.label}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="goals">
        <NativeTabs.Trigger.Icon
          sf={{
            default: nativeTabConfig.goals.sfDefault as never,
            selected: nativeTabConfig.goals.sfSelected as never,
          }}
          md={nativeTabConfig.goals.md as never}
        />
        <NativeTabs.Trigger.Label>
          {nativeTabConfig.goals.label}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="leaderboard">
        <NativeTabs.Trigger.Icon
          sf={{
            default: nativeTabConfig.leaderboard.sfDefault as never,
            selected: nativeTabConfig.leaderboard.sfSelected as never,
          }}
          md={nativeTabConfig.leaderboard.md as never}
        />
        <NativeTabs.Trigger.Label>
          {nativeTabConfig.leaderboard.label}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
