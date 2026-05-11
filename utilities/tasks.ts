import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getAllQuotes } from 'success-motivational-quotes';
import {
  SATURDAY_MESSAGES,
  SUNDAY_MESSAGES,
  WEEKDAY_MESSAGES,
} from '../constants/messages';

function getRandomMessage(messages: { title: string; body: string }[]): {
  title: string;
  body: string;
} {
  if (Math.random() < 0.3) {
    const externalQuotes = getAllQuotes();
    if (externalQuotes && externalQuotes.length > 0) {
      const q =
        externalQuotes[Math.floor(Math.random() * externalQuotes.length)];
      return {
        title: '🌟 Wisdom',
        body: q.quote || q.text || 'Keep pushing forward!',
      };
    }
  }

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

export async function scheduleSmartDailyReminders(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    for (let day = 1; day <= 5; day++) {
      const msg = getRandomMessage(WEEKDAY_MESSAGES);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: msg.title,
          body: msg.body,
          sound: 'default',
          data: { type: 'daily_reminder' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: day + 1,
          hour: 8,
          minute: 0,
        },
      });
    }

    const satMsg = getRandomMessage(SATURDAY_MESSAGES);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: satMsg.title,
        body: satMsg.body,
        sound: 'default',
        data: { type: 'daily_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 7,
        hour: 9,
        minute: 0,
      },
    });

    const sunMsg = getRandomMessage(SUNDAY_MESSAGES);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: sunMsg.title,
        body: sunMsg.body,
        sound: 'default',
        data: { type: 'daily_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 1,
        hour: 10,
        minute: 0,
      },
    });
  } catch (error) {
    console.error('[Notifications] Failed to schedule smart reminders:', error);
  }
}

export async function scheduleGoalReminders(
  goalTitle: string,
  targetHours: number,
  delta: 'day' | 'week' | 'month',
): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Goal Track',
        body: `Don't forget your ${goalTitle} goal today!`,
        sound: 'default',
        data: { type: 'goal_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 18,
        minute: 0,
      },
    });

    if (delta === 'week' || delta === 'month') {
      const content = {
        title: '🗓️ Period Review',
        body: `Time to check your ${delta}ly progress on ${goalTitle}!`,
        sound: 'default' as const,
        data: { type: 'goal_deadline' },
      };

      if (delta === 'week') {
        await Notifications.scheduleNotificationAsync({
          content,
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: 1,
            hour: 9,
            minute: 0,
          },
        });
      } else {
        await Notifications.scheduleNotificationAsync({
          content,
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
            day: 1,
            hour: 9,
            minute: 0,
          },
        });
      }
    }
  } catch (error) {
    console.error('[Notifications] Failed to schedule goal reminders:', error);
  }
}
