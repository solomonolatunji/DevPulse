import { Button, Card, Select, TextInput, Typography } from '@/components';
import { DELTA_OPTIONS, WEEKDAY_OPTIONS } from '@/constants/goals';
import { useTheme } from '@/hooks';
import { WakaTimeGoal } from '@/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { StyleSheet, Switch, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { GoalFormData, goalSchema } from './schemas';

interface GoalFormProps {
  initialData?: Partial<WakaTimeGoal>;
  onSubmit: (data: GoalSubmissionData) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export interface GoalSubmissionData {
  title: string;
  seconds: number;
  delta: GoalFormData['delta'];
  is_enabled: boolean;
  is_inverse: boolean;
  ignore_zero_days: boolean;
  ignore_days: string[];
  languages: string[];
  projects: string[];
}

export const GoalForm = ({
  initialData,
  onSubmit,
  isLoading,
  isEdit,
}: GoalFormProps) => {
  const { theme } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema) as Resolver<GoalFormData>,
    defaultValues: {
      title: initialData?.title || '',
      hours: initialData?.seconds
        ? (initialData.seconds / 3600).toString()
        : '1',
      delta: (initialData?.delta as 'day' | 'week') || 'day',
      is_inverse: initialData?.is_inverse || false,
      ignore_zero_days: initialData?.ignore_zero_days || false,
      ignore_days: initialData?.ignore_days || [],
      languages: initialData?.languages || [],
      projects: initialData?.projects || [],
    },
  });

  const onFormSubmit = (data: GoalFormData) => {
    onSubmit({
      title: data.title,
      seconds: parseFloat(data.hours) * 3600,
      delta: data.delta,
      is_enabled: true,
      is_inverse: data.is_inverse,
      ignore_zero_days: data.ignore_zero_days,
      ignore_days: data.ignore_days,
      languages: data.languages,
      projects: data.projects,
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.formContent}>
        <Card style={styles.card}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Title"
                placeholder="e.g. My Coding Goal"
                value={value}
                onChangeText={onChange}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="hours"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Target Hours"
                placeholder="e.g. 5"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                error={errors.hours?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="delta"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Frequency"
                value={value}
                options={DELTA_OPTIONS}
                onSelect={onChange}
                title="Select Frequency"
              />
            )}
          />
        </Card>

        {/* Advanced Options */}
        <Card style={styles.card}>
          <Typography
            variant="caption"
            weight="bold"
            color={theme.colors.textSecondary}
            style={styles.sectionTitle}
          >
            ADVANCED OPTIONS
          </Typography>

          <Controller
            control={control}
            name="is_inverse"
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchRow}>
                <View style={styles.switchLabel}>
                  <Typography variant="body" weight="medium">
                    Inverse Goal
                  </Typography>
                  <Typography
                    variant="caption"
                    color={theme.colors.textSecondary}
                  >
                    Code less, not more
                  </Typography>
                </View>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{
                    false: theme.colors.border,
                    true: theme.colors.primary,
                  }}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="ignore_zero_days"
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchRow}>
                <View style={styles.switchLabel}>
                  <Typography variant="body" weight="medium">
                    Ignore Zero Days
                  </Typography>
                  <Typography
                    variant="caption"
                    color={theme.colors.textSecondary}
                  >
                    Skip days with no coding activity
                  </Typography>
                </View>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{
                    false: theme.colors.border,
                    true: theme.colors.primary,
                  }}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="ignore_days"
            render={({ field: { onChange, value } }) => (
              <View style={styles.chipSection}>
                <Typography
                  variant="body"
                  weight="medium"
                  style={{ marginBottom: 4 }}
                >
                  Ignore Days
                </Typography>
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                  style={{ marginBottom: 8 }}
                >
                  Skip these weekdays from goal tracking
                </Typography>
                <View style={styles.chipContainer}>
                  {WEEKDAY_OPTIONS.map((day) => {
                    const isSelected = value?.includes(day.toLowerCase());
                    return (
                      <View
                        key={day}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: isSelected
                              ? theme.colors.primary
                              : theme.colors.surface,
                            borderColor: isSelected
                              ? theme.colors.primary
                              : theme.colors.border,
                          },
                        ]}
                        onTouchEnd={() => {
                          const lower = day.toLowerCase();
                          onChange(
                            isSelected
                              ? value?.filter((d: string) => d !== lower)
                              : [...(value || []), lower],
                          );
                        }}
                      >
                        <Typography
                          variant="micro"
                          weight={isSelected ? 'bold' : 'medium'}
                          style={{
                            color: isSelected
                              ? '#FFFFFF'
                              : theme.colors.textSecondary,
                          }}
                        >
                          {day.slice(0, 3)}
                        </Typography>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          />
        </Card>

        <Button
          label={isEdit ? 'Update Goal' : 'Create Goal'}
          onPress={handleSubmit(onFormSubmit)}
          loading={isLoading}
          style={styles.button}
          size="lg"
          fullWidth
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  formContent: {
    gap: 16,
  },
  card: {
    padding: 20,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  switchLabel: {
    flex: 1,
    marginRight: 12,
  },
  chipSection: {
    paddingVertical: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  button: {
    marginTop: 8,
  },
});
