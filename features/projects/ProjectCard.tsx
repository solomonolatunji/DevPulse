import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { WakaTimeProject } from '@/interfaces/project';
import { commonStyles } from '@/theme';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

interface ProjectCardProps {
  item: WakaTimeProject;
  allTimeText?: string;
}

export const ProjectCard = ({ item, allTimeText }: ProjectCardProps) => {
  const { theme } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    projectCard: {
      marginBottom: theme.spacing[3],
      padding: theme.spacing[3],
      borderWidth: 1,
      borderColor: theme.colors.border + '40',
      borderRadius: theme.tokens.borderRadius.lg,
    },
    projectHeader: {
      ...commonStyles.row,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.tokens.borderRadius.md,
      ...commonStyles.center,
      marginRight: theme.spacing[3],
    },
    projectMainInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    nameRow: {
      ...commonStyles.row,
      marginBottom: 2,
    },
    colorIndicator: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: theme.spacing[2],
    },
    repoInfo: {
      ...commonStyles.row,
    },
    repoText: {
      marginLeft: theme.spacing[1],
      opacity: 0.7,
    },
    projectStats: {
      alignItems: 'flex-end',
      paddingLeft: 8,
    },
    lastActiveText: {
      marginTop: -2,
      marginBottom: theme.spacing[2],
      opacity: 0.8,
    },
  });

  const projectColor = item.color || theme.colors.primary;

  return (
    <Card style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: projectColor + '15' },
          ]}
        >
          <Feather name="code" size={18} color={projectColor} />
        </View>

        <View style={styles.projectMainInfo}>
          <View style={styles.nameRow}>
            <Typography
              variant="body"
              weight="bold"
              numberOfLines={1}
              style={{ flexShrink: 1 }}
            >
              {item.name}
            </Typography>
            <View
              style={[styles.colorIndicator, { backgroundColor: projectColor }]}
            />
          </View>

          <Typography
            variant="micro"
            color={theme.colors.textSecondary}
            style={styles.lastActiveText}
          >
            Last active: {item.human_readable_last_heartbeat_at || 'Never'}
          </Typography>

          {item.repository && (
            <View style={styles.repoInfo}>
              <Feather
                name="github"
                size={12}
                color={theme.colors.textSecondary}
              />
              <Typography
                variant="micro"
                color={theme.colors.textSecondary}
                style={styles.repoText}
                numberOfLines={1}
              >
                {item.repository.html_url.split('/').pop()}
              </Typography>
            </View>
          )}
        </View>

        {allTimeText && (
          <View style={styles.projectStats}>
            <Typography variant="micro" color={theme.colors.textSecondary}>
              TOTAL
            </Typography>
            <Typography variant="body" weight="bold" color={projectColor}>
              {allTimeText}
            </Typography>
          </View>
        )}
      </View>
    </Card>
  );
};
