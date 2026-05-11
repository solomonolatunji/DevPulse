import { useTheme } from '@/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

function AnimatedTabIcon({
  name,
  color,
  size,
  focused,
}: {
  name: MaterialIconName;
  color: string;
  size: number;
  focused: boolean;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = focused
      ? withSpring(1.15, { damping: 10, stiffness: 100 })
      : withTiming(1, { duration: 200 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </Animated.View>
  );
}

function IosNativeTabs() {
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

function AndroidCustomTabs() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const safeBottomPadding = Math.max(insets.bottom, 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          height:
            Platform.OS === 'ios'
              ? 88 + insets.bottom / 2
              : 72 + safeBottomPadding,
          paddingBottom: safeBottomPadding,
          paddingTop: 8,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pulse',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="pulse"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="briefcase-outline"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="target"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaders',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="trophy-outline"
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return Platform.OS === 'ios' ? <IosNativeTabs /> : <AndroidCustomTabs />;
}
