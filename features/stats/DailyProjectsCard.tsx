import { Card, Typography } from '@/components';
import { StyleSheet, View } from 'react-native';

interface ProjectData {
  name: string;
  time: string;
  color: string;
}

interface DailyProjectsCardProps {
  projects: ProjectData[];
}

export const DailyProjectsCard = ({ projects }: DailyProjectsCardProps) => {
  if (!projects || projects.length === 0) return null;

  return (
    <Card style={styles.projectsCard}>
      {projects.map((project, index) => (
        <View key={index} style={styles.projectItem}>
          <View style={styles.projectLeft}>
            <View
              style={[styles.projectDot, { backgroundColor: project.color }]}
            />
            <Typography variant="body" weight="medium" numberOfLines={1}>
              {project.name}
            </Typography>
          </View>
          <Typography variant="body" weight="bold">
            {project.time}
          </Typography>
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  projectsCard: {
    marginBottom: 16,
    gap: 12,
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  projectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
