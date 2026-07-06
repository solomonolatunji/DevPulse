import { Card, Typography } from '@/components';
import { getLanguageColor } from '@/constants';
import { useTheme } from '@/hooks';
import { formatDuration } from '@/utilities';
import { StyleSheet, View } from 'react-native';

interface UserLanguagesProps {
  languages: {
    name: string;
    total_seconds: number;
  }[];
}

export default function UserLanguages({ languages }: UserLanguagesProps) {
  const { theme } = useTheme();

  return (
    <>
      <Typography
        variant="micro"
        weight="bold"
        color={theme.colors.textSecondary}
        style={styles.sectionHeader}
      >
        TOP LANGUAGES
      </Typography>

      <Card style={styles.languagesCard}>
        {(languages || []).map((lang, index) => (
          <View
            key={lang.name}
            style={[
              styles.langItem,
              {
                borderBottomWidth: index === languages.length - 1 ? 0 : 1,
                borderBottomColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.langLeft}>
              <View
                style={[
                  styles.langDot,
                  { backgroundColor: getLanguageColor(lang.name) },
                ]}
              />
              <Typography weight="medium" numberOfLines={1}>
                {lang.name}
              </Typography>
            </View>
            <Typography color={theme.colors.textSecondary}>
              {formatDuration(lang.total_seconds)}
            </Typography>
          </View>
        ))}
        {languages.length === 0 && (
          <Typography
            color={theme.colors.textSecondary}
            style={{ textAlign: 'center', padding: 16 }}
          >
            No language data available
          </Typography>
        )}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginLeft: 4,
    marginBottom: 12,
  },
  languagesCard: {
    padding: 4,
    marginBottom: 24,
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  langDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});
