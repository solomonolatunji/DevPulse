'use no memo';

import { androidNotificationService } from '@/services/android-notification.service';
import { Platform } from 'react-native';
import { Voltra } from 'voltra';
import { updateAndroidWidget } from 'voltra/android/client';
import {
  endAllLiveActivities,
  startLiveActivity,
  updateWidget,
} from 'voltra/client';
import { DailyStatsWidgetAndroid } from './DailyStatsWidgetAndroid';
import { DailyStatsWidgetIOS } from './DailyStatsWidgetIOS';
import { StatsData } from './interface';

export { DailyStatsWidgetAndroid, DailyStatsWidgetIOS };
export type { StatsData };

const ACTIVITY_NAME = 'devpulse_stats';
const WIDGET_ID = 'devpulse_widget';
const DEEP_LINK = 'devpulse://';

export const syncDailyStats = async (stats: StatsData) => {
  try {
    if (Platform.OS === 'android') {
      await updateAndroidWidget(WIDGET_ID, [
        {
          size: { width: 170, height: 170 },
          content: <DailyStatsWidgetAndroid stats={stats} />,
        },
        {
          size: { width: 330, height: 170 },
          content: <DailyStatsWidgetAndroid stats={stats} />,
        },
        {
          size: { width: 330, height: 330 },
          content: <DailyStatsWidgetAndroid stats={stats} />,
        },
      ]);
      await androidNotificationService.updateStickyNotification(stats);
    } else {
      await updateWidget(
        WIDGET_ID,
        {
          systemSmall: <DailyStatsWidgetIOS stats={stats} />,
          systemMedium: <DailyStatsWidgetIOS stats={stats} />,
          systemLarge: <DailyStatsWidgetIOS stats={stats} />,
        },
        { deepLinkUrl: DEEP_LINK },
      );

      try {
        await endAllLiveActivities();
      } catch (e) {}

      const variants = {
        lockScreen: <DailyStatsWidgetIOS stats={stats} isSimple={true} />,
        island: {
          minimal: (
            <Voltra.Symbol
              name="chart.bar.fill"
              size={14}
              tintColor={stats.theme.primary}
            />
          ),
          compact: {
            leading: (
              <Voltra.Symbol
                name="chart.bar.fill"
                size={14}
                tintColor={stats.theme.primary}
              />
            ),
            trailing: (
              <Voltra.Text style={{ fontSize: 10, color: '#FFFFFF' }}>
                {stats.todayTotalText}
              </Voltra.Text>
            ),
          },
          expanded: {
            center: <DailyStatsWidgetIOS stats={stats} isSimple={true} />,
          },
        },
      };

      await startLiveActivity(variants, {
        activityName: ACTIVITY_NAME,
        deepLinkUrl: DEEP_LINK,
      });
    }
  } catch (error) {
    console.warn('Failed to sync daily stats to widgets:', error);
  }
};
