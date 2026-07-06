import { Typography } from '@/components/Typography';
import { LoginForm } from '@/features/auth';
import { useTheme } from '@/hooks';
import * as WebBrowser from 'expo-web-browser';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  const isTablet = width > 768;
  const contentMaxWidth = isTablet ? 500 : '100%';
  const paddingHorizontal = isTablet ? 0 : theme.spacing[5];

  const handleOpenLink = (url: string) => {
    WebBrowser.openBrowserAsync(url);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      edges={['top']}
    >
      <KeyboardAwareScrollView
        bottomOffset={62}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingTop: Platform.OS === 'ios' ? 60 : 80,
          paddingHorizontal: paddingHorizontal,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            width: '100%',
            maxWidth: contentMaxWidth,
          }}
        >
          <LoginForm />
        </View>

        <View style={styles.footer}>
          <Typography
            variant="micro"
            color={theme.colors.textSecondary}
            style={styles.footerText}
          >
            By continuing, you agree to WakaTime's{' '}
            <Typography
              variant="micro"
              weight="bold"
              color={theme.colors.primary}
              onPress={() => handleOpenLink('https://wakatime.com/privacy')}
            >
              Privacy Policy
            </Typography>{' '}
            and{' '}
            <Typography
              variant="micro"
              weight="bold"
              color={theme.colors.primary}
              onPress={() =>
                handleOpenLink('https://wakatime.com/legal/terms-of-service')
              }
            >
              Terms of Service
            </Typography>
            .
          </Typography>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 60,
    paddingTop: 40,
    paddingBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    lineHeight: 18,
  },
});
