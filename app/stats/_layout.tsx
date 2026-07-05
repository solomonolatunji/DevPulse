import DefaultStackLayout from '@/components/nav/DefaultStackLayout';
import { Stack } from 'expo-router';

export default function StatsLayout() {
  return (
    <DefaultStackLayout screenOptions={{ headerShown: false }}>
      <Stack.Screen name="numbers" />
      <Stack.Screen name="daily" />
      <Stack.Screen name="sessions" />
      <Stack.Screen name="ai" />
    </DefaultStackLayout>
  );
}
