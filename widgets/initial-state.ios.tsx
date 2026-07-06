'use no memo';

import type { WidgetVariants as VoltraWidgetVariants } from 'voltra';
import { DailyStatsWidgetIOS } from './DailyStatsWidgetIOS';

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

const content = <DailyStatsWidgetIOS stats={defaultStats} />;

export const WidgetVariants: VoltraWidgetVariants = {
  systemSmall: content,
  systemMedium: content,
  systemLarge: content,
};

export default WidgetVariants;
