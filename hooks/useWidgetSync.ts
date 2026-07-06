import { StatsData, syncDailyStats } from '@/widgets';
import { useEffect, useMemo, useRef } from 'react';

export const useWidgetSync = (
  stats: StatsData | undefined,
  enabled: boolean = true,
) => {
  const lastSignatureRef = useRef<string | null>(null);
  const signature = useMemo(
    () => (stats ? JSON.stringify(stats) : null),
    [stats],
  );

  useEffect(() => {
    if (
      !enabled ||
      !stats ||
      !signature ||
      lastSignatureRef.current === signature
    ) {
      return;
    }

    lastSignatureRef.current = signature;
    void syncDailyStats(stats);
  }, [enabled, signature, stats]);

  useEffect(() => {
    if (!enabled) {
      lastSignatureRef.current = null;
    }
  }, [enabled]);
};
