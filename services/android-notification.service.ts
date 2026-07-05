import { StatsData } from '@/widgets/interface';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { telemetryService } from './telemetry.service';

const STICKY_NOTIFICATION_ID = 'devpulse_daily_stats';
const CHANNEL_ID = 'devpulse_live_stats';

/**
 * Service to handle persistent Android notifications for daily stats.
 */
class AndroidNotificationService {
  private isChannelCreated = false;
  private isHandlerConfigured = false;

  /**
   * Creates the notification channel if it doesn't exist.
   */
  private async ensureChannel() {
    if (this.isChannelCreated || Platform.OS !== 'android') return;

    try {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Daily Stats (Live)',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#38BDF8',
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        showBadge: false,
      });

      this.isChannelCreated = true;
    } catch (error) {
      telemetryService.captureException(error, {
        area: 'notification_channel',
      });
      throw error;
    }
  }

  private ensureNotificationHandler() {
    if (this.isHandlerConfigured || Platform.OS !== 'android') return;

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    this.isHandlerConfigured = true;
  }

  /**
   * Updates or creates a sticky notification with the latest stats.
   */
  async updateStickyNotification(stats: StatsData) {
    if (Platform.OS !== 'android') return;

    try {
      await this.ensureChannel();
      this.ensureNotificationHandler();

      const content: Notifications.NotificationContentInput = {
        title: "DevPulse: Today's Coding Time",
        body: `You've coded for ${stats.todayTotalText} so far today.`,
        color: stats.theme.primary,
        autoDismiss: false,
        sticky: true,
        priority: 'max',
        data: { url: 'devpulse://' },
      };

      await Notifications.scheduleNotificationAsync({
        identifier: STICKY_NOTIFICATION_ID,
        content,
        trigger: null,
      });
    } catch (error) {
      telemetryService.captureException(error, {
        area: 'sticky_notification_update',
      });
      throw error;
    }
  }

  /**
   * Removes the sticky notification.
   */
  async dismissNotification() {
    if (Platform.OS !== 'android') return;

    try {
      await Notifications.dismissNotificationAsync(STICKY_NOTIFICATION_ID);
    } catch (error) {
      telemetryService.captureException(error, {
        area: 'sticky_notification_dismiss',
      });
      throw error;
    }
  }
}

export const androidNotificationService = new AndroidNotificationService();
