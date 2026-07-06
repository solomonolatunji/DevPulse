import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { commonStyles } from '@/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

interface ProjectTime {
  name: string;
  text: string;
  color?: string;
}

interface TotalTimeCardProps {
  totalTime: string;
  totalProjectsCount: number;
  recentProjects: ProjectTime[];
}

export const TotalTimeCard = ({
  totalTime,
  totalProjectsCount,
  recentProjects,
}: TotalTimeCardProps) => {
  const { theme } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    card: {
      marginBottom: theme.spacing[4],
      padding: theme.spacing[4],
    },
    header: {
      marginBottom: theme.spacing[5],
      ...commonStyles.center,
    },
    projectsContainer: {
      borderRadius: theme.tokens.borderRadius.md,
      padding: theme.spacing[4],
    },
    projectsTitle: {
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: theme.spacing[3],
    },
    projectRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
    },
    projectInfo: {
      ...commonStyles.row,
      gap: theme.spacing[2],
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });

  return (
    <Card
      style={[
        styles.card,
        {
          borderColor: theme.colors.border,
          borderWidth: 1,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.header}>
        <Typography
          variant="title"
          weight="bold"
          align="center"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {totalTime}
        </Typography>
        <Typography
          variant="caption"
          color={theme.colors.textSecondary}
          align="center"
          style={{ marginTop: 4 }}
        >
          worked in total over {totalProjectsCount} projects
        </Typography>
      </View>

      <View
        style={[
          styles.projectsContainer,
          {
            backgroundColor: theme.colors.surfaceSubtle,
          },
        ]}
      >
        <Typography
          variant="micro"
          weight="bold"
          color={theme.colors.textSecondary}
          style={styles.projectsTitle}
        >
          LAST PROJECTS WORKED ON
        </Typography>

        {recentProjects.map((project, index) => (
          <View key={index} style={styles.projectRow}>
            <View style={styles.projectInfo}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: project.color || theme.colors.primary },
                ]}
              />
              <Typography variant="body" weight="medium">
                {project.name}
              </Typography>
            </View>
            <Typography variant="body" weight="bold">
              {project.text}
            </Typography>
          </View>
        ))}

        <Button
          label="VIEW ALL PROJECTS"
          onPress={() => router.push('/projects')}
          variant="soft"
          fullWidth
          style={{ marginTop: 8 }}
          labelStyle={{
            fontSize: 10,
            letterSpacing: 0.5,
          }}
          size="sm"
        />
      </View>
    </Card>
  );
};
