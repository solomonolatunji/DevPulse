import { Card, ScreenHeader, Typography } from '@/components';
import { ACCENT_COLORS } from '@/constants';
import { useTheme } from '@/hooks';
import { Feather } from '@react-native-vector-icons/feather/static';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ThemeSelectionScreen() {
  const { theme, themeMode, setThemeMode, accentColor, setAccentColor } =
    useTheme();

  const ModeOption = ({
    mode,
    label,
    icon,
  }: {
    mode: 'light' | 'dark' | 'system';
    label: string;
    icon: FeatherIconName;
  }) => (
    <TouchableOpacity
      style={[
        styles.optionCard,
        { backgroundColor: theme.colors.surface },
        themeMode === mode && {
          borderColor: theme.colors.primary,
          borderWidth: 2,
        },
      ]}
      onPress={() => setThemeMode(mode)}
    >
      <View
        style={[
          styles.optionIcon,
          { backgroundColor: theme.colors.primary + '15' },
        ]}
      >
        <Feather name={icon} size={20} color={theme.colors.primary} />
      </View>
      <Typography weight="bold" style={styles.optionLabel}>
        {label}
      </Typography>
      {themeMode === mode && (
        <View
          style={[styles.checkBadge, { backgroundColor: theme.colors.primary }]}
        >
          <Feather name="check" size={12} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom', 'left', 'right']}
    >
      <ScreenHeader title="Theme" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Typography
          variant="micro"
          weight="bold"
          color={theme.colors.textSecondary}
          style={[styles.sectionHeader, { marginTop: 0 }]}
        >
          APPEARANCE
        </Typography>
        <View style={styles.optionsGrid}>
          <ModeOption mode="light" label="Light" icon="sun" />
          <ModeOption mode="dark" label="Dark" icon="moon" />
          <ModeOption mode="system" label="System" icon="monitor" />
        </View>

        <Typography
          variant="micro"
          weight="bold"
          color={theme.colors.textSecondary}
          style={styles.sectionHeader}
        >
          ACCENT COLOR
        </Typography>
        <Card style={styles.accentCard}>
          <View style={styles.colorGrid}>
            {ACCENT_COLORS.map((item) => (
              <TouchableOpacity
                key={item.color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: item.color },
                  accentColor === item.color && styles.selectedColorCircle,
                ]}
                onPress={() => setAccentColor(item.color)}
              >
                {accentColor === item.color && (
                  <Feather name="check" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.accentDetail}>
            <Typography variant="caption" color={theme.colors.textSecondary}>
              Selected Accent
            </Typography>
            <Typography weight="bold">
              {ACCENT_COLORS.find((c) => c.color === accentColor)?.name ||
                'Custom'}
            </Typography>
          </View>
        </Card>

        <View style={styles.previewContainer}>
          <Typography
            variant="micro"
            weight="bold"
            color={theme.colors.textSecondary}
            style={[styles.sectionHeader, { marginBottom: 12 }]}
          >
            PREVIEW
          </Typography>
          <Card style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View
                style={[
                  styles.previewDot,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
              <View style={styles.previewLine} />
            </View>
            <View style={styles.previewContent}>
              <View
                style={[
                  styles.previewBar,
                  { backgroundColor: theme.colors.primary, width: '60%' },
                ]}
              />
              <View
                style={[
                  styles.previewBar,
                  { backgroundColor: theme.colors.border, width: '40%' },
                ]}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.previewButton,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Typography weight="bold" style={{ color: '#fff' }}>
                SAMPLE BUTTON
              </Typography>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    marginLeft: 4,
    marginBottom: 12,
    marginTop: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentCard: {
    padding: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    marginBottom: 20,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedColorCircle: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  accentDetail: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 16,
  },
  previewContainer: {
    marginTop: 24,
  },
  previewCard: {
    padding: 24,
    alignItems: 'center',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  previewDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  previewLine: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    flex: 1,
  },
  previewContent: {
    width: '100%',
    gap: 8,
    marginBottom: 24,
  },
  previewBar: {
    height: 12,
    borderRadius: 6,
  },
  previewButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
});
