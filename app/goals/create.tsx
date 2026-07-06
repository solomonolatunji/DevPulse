import { GoalForm, type GoalSubmissionData } from '@/features/goals/GoalForm';
import { useGoalMutation, useTheme } from '@/hooks';
import { scheduleGoalReminders } from '@/utilities';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function CreateGoalScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { createGoal } = useGoalMutation();

  const handleSubmit = async (data: GoalSubmissionData) => {
    try {
      await createGoal.mutateAsync(data);
      await scheduleGoalReminders(
        data.title,
        data.seconds / 3600,
        data.delta || 'day',
      );
      router.back();
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <GoalForm onSubmit={handleSubmit} isLoading={createGoal.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
