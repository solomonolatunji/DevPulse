import { GoalDetailsSkeleton } from '@/components/skeletons';
import { GoalForm, type GoalSubmissionData } from '@/features/goals/GoalForm';
import { useGoalMutation, useGoals, useTheme } from '@/hooks';
import { scheduleGoalReminders } from '@/utilities';
import Feather from '@react-native-vector-icons/feather/static';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function EditGoalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const { data: goalsData, isLoading: goalsLoading } = useGoals();
  const { updateGoal, deleteGoal } = useGoalMutation();

  const goal = goalsData?.data.find((g) => g.id === id);

  const handleSubmit = async (data: GoalSubmissionData) => {
    if (!id) return;
    try {
      await updateGoal.mutateAsync({ id, data });
      await scheduleGoalReminders(
        data.title,
        data.seconds / 3600,
        data.delta || 'day',
      );
      router.back();
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteGoal.mutateAsync(id);
      router.back();
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  if (goalsLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Stack.Screen options={{ headerTitle: '' }} />
        <GoalDetailsSkeleton />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} style={{ marginRight: 8 }}>
              <Feather name="trash-2" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          ),
        }}
      />
      {goal && (
        <GoalForm
          initialData={goal}
          onSubmit={handleSubmit}
          isLoading={updateGoal.isPending || deleteGoal.isPending}
          isEdit
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
