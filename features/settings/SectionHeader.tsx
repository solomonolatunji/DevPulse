import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { StyleSheet } from 'react-native';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => {
  const { theme } = useTheme();
  return (
    <Typography
      variant="micro"
      weight="bold"
      color={theme.colors.textSecondary}
      style={styles.sectionHeader}
    >
      {title.toUpperCase()}
    </Typography>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    marginLeft: 4,
    marginBottom: 8,
    marginTop: 16,
  },
});
