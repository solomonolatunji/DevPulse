import { useTheme } from '@/hooks';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

type NativeTabName = 'index' | 'projects' | 'goals' | 'leaderboard';

type NativeTabConfig = {
  label: string;
  sfDefault: string;
  sfSelected: string;
  mdDefault: string;
  mdSelected: string;
};

const tabIconSize = 24;
const tabIconColor = '#000';

const nativeTabConfig: Record<NativeTabName, NativeTabConfig> = {
  index: {
    label: 'Pulse',
    sfDefault: 'waveform.path.ecg',
    sfSelected: 'waveform.path.ecg',
    mdDefault: 'pulse',
    mdSelected: 'pulse',
  },
  projects: {
    label: 'Projects',
    sfDefault: 'briefcase',
    sfSelected: 'briefcase.fill',
    mdDefault: 'briefcase-outline',
    mdSelected: 'briefcase',
  },
  goals: {
    label: 'Goals',
    sfDefault: 'target',
    sfSelected: 'target',
    mdDefault: 'target',
    mdSelected: 'target',
  },
  leaderboard: {
    label: 'Leaders',
    sfDefault: 'trophy',
    sfSelected: 'trophy.fill',
    mdDefault: 'trophy-outline',
    mdSelected: 'trophy',
  },
};

const tabIconSources: Record<
  NativeTabName,
  {
    default: ReturnType<typeof MaterialDesignIcons.getImageSourceSync>;
    selected: ReturnType<typeof MaterialDesignIcons.getImageSourceSync>;
  }
> = {
  index: {
    default: MaterialDesignIcons.getImageSourceSync(
      nativeTabConfig.index.mdDefault as never,
      tabIconSize,
      tabIconColor,
    ),
    selected: MaterialDesignIcons.getImageSourceSync(
      nativeTabConfig.index.mdSelected as never,
      tabIconSize,
      tabIconColor,
    ),
  },
  projects: {
    default: MaterialDesignIcons.getImageSourceSync(
      nativeTabConfig.projects.mdDefault as never,
      tabIconSize,
      tabIconColor,
    ),
    selected: MaterialDesignIcons.getImageSourceSync(
      nativeTabConfig.projects.mdSelected as never,
      tabIconSize,
      tabIconColor,
    ),
  },
  goals: {
    default: MaterialDesignIcons.getImageSourceSync(
      nativeTabConfig.goals.mdDefault as never,
      tabIconSize,
      tabIconColor,
    ),
    selected: MaterialDesignIcons.getImageSourceSync(
      nativeTabConfig.goals.mdSelected as never,
      tabIconSize,
      tabIconColor,
    ),
  },
  leaderboard: {
    default: MaterialDesignIcons.getImageSourceSync(
      nativeTabConfig.leaderboard.mdDefault as never,
      tabIconSize,
      tabIconColor,
    ),
    selected: MaterialDesignIcons.getImageSourceSync(
      nativeTabConfig.leaderboard.mdSelected as never,
      tabIconSize,
      tabIconColor,
    ),
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
          src={{
            default: tabIconSources.index.default,
            selected: tabIconSources.index.selected,
          }}
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
          src={{
            default: tabIconSources.projects.default,
            selected: tabIconSources.projects.selected,
          }}
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
          src={{
            default: tabIconSources.goals.default,
            selected: tabIconSources.goals.selected,
          }}
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
          src={{
            default: tabIconSources.leaderboard.default,
            selected: tabIconSources.leaderboard.selected,
          }}
        />
        <NativeTabs.Trigger.Label>
          {nativeTabConfig.leaderboard.label}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
