import { calculateDailyAveragePercent } from '@/utilities/widgetStats';

describe('calculateDailyAveragePercent', () => {
  it('returns 0 when the daily average is zero or below', () => {
    expect(calculateDailyAveragePercent(3600, 0)).toBe(0);
    expect(calculateDailyAveragePercent(3600, -10)).toBe(0);
  });

  it('rounds and caps the percentage at 100', () => {
    expect(calculateDailyAveragePercent(1800, 3600)).toBe(50);
    expect(calculateDailyAveragePercent(5400, 3600)).toBe(100);
  });
});
