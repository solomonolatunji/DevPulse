export const calculateDailyAveragePercent = (
  totalSeconds: number,
  dailyAverageSeconds: number,
) => {
  if (dailyAverageSeconds <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((totalSeconds / dailyAverageSeconds) * 100));
};
