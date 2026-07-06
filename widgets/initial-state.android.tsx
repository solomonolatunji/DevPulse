'use no memo';

import type { AndroidWidgetVariants } from 'voltra/android/client';
import { DailyStatsWidgetAndroid } from './DailyStatsWidgetAndroid';

const defaultStats = {
  todayTotalText: '0 mins',
  todayPercent: 0,
  theme: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    border: '#E2E8F0',
    text: '#0F172A',
    textSecondary: '#64748B',
    primary: '#38BDF8',
  },
};

const content = <DailyStatsWidgetAndroid stats={defaultStats} />;

export const WidgetVariants: AndroidWidgetVariants = [
  { size: { width: 170, height: 170 }, content },
  { size: { width: 330, height: 170 }, content },
  { size: { width: 330, height: 330 }, content },
];

export default WidgetVariants;
