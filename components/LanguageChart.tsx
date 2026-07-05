import { useMetadata, useTheme } from '@/hooks';
import { WakaTimeLanguage } from '@/interfaces';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Typography } from './';

const SIZE = 240;
const RADIUS = SIZE / 2 - 20;

interface LanguageChartProps {
  data: WakaTimeLanguage[];
  showLegend?: boolean;
  footerLabel?: string;
  onFooterPress?: () => void;
  title?: string;
  centerTitle?: string;
  centerSubtitle?: string;
}

export default function LanguageChart({
  data,
  showLegend = false,
  footerLabel,
  onFooterPress,
  title,
  centerTitle,
  centerSubtitle,
}: LanguageChartProps) {
  const { theme, isDark } = useTheme();
  const { getLanguageColor } = useMetadata();

  const chartData = useMemo(() => {
    return data.slice(0, 5).map((lang) => ({
      languageName: lang.name,
      value: lang.total_seconds,
      color: getLanguageColor(lang.name),
    }));
  }, [data, getLanguageColor]);

  const totalSeconds = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.value, 0),
    [chartData],
  );

  const arcs = useMemo(() => {
    if (totalSeconds === 0) return [];

    let currentAngle = -Math.PI / 2;
    const center = SIZE / 2;
    const strokeWidth = 20;
    const gapAngle = 0.05;

    return chartData.map((d) => {
      const sweepAngle = (d.value / totalSeconds) * 2 * Math.PI;
      const drawAngle = Math.max(0, sweepAngle - gapAngle);
      const path = Skia.PathBuilder.Make()
        .addArc(
          {
            x: center - RADIUS,
            y: center - RADIUS,
            width: RADIUS * 2,
            height: RADIUS * 2,
          },
          (currentAngle * 180) / Math.PI,
          (drawAngle * 180) / Math.PI,
        )
        .build();

      currentAngle += sweepAngle;
      return { path, color: d.color };
    });
  }, [chartData, totalSeconds]);

  if (totalSeconds === 0) {
    return (
      <View style={styles.container}>
        <Typography color={theme.colors.textSecondary}>
          No data available
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && (
        <Typography
          variant="title"
          weight="bold"
          align="center"
          style={styles.title}
        >
          {title}
        </Typography>
      )}

      <View style={styles.chartContainer}>
        <Canvas style={{ width: SIZE, height: SIZE }}>
          {arcs.map((arc, index) => (
            <Path
              key={index}
              path={arc.path}
              color={arc.color}
              style="stroke"
              strokeWidth={20}
              strokeCap="round"
            />
          ))}
        </Canvas>
        {(centerTitle || centerSubtitle) && (
          <View style={[styles.centerText, { width: RADIUS * 2 - 40 }]}>
            {centerTitle && (
              <Typography
                variant="headline"
                weight="bold"
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ textAlign: 'center' }}
              >
                {centerTitle}
              </Typography>
            )}
            {centerSubtitle && (
              <Typography
                variant="micro"
                color={theme.colors.textSecondary}
                align="center"
              >
                {centerSubtitle}
              </Typography>
            )}
          </View>
        )}
      </View>

      {showLegend && (
        <View
          style={[
            styles.languageList,
            { backgroundColor: theme.colors.surfaceSubtle },
          ]}
        >
          {data.map((l, index) => (
            <View key={l.name} style={styles.languageRow}>
              <View style={styles.languageInfo}>
                <Typography
                  variant="caption"
                  weight="bold"
                  color={theme.colors.primary}
                  style={styles.percent}
                >
                  {Math.round(l.percent)}%
                </Typography>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: getLanguageColor(l.name) },
                  ]}
                />
                <Typography variant="body" weight="medium">
                  {l.name}
                </Typography>
              </View>
              <Typography variant="body" weight="bold">
                {l.text.toLowerCase()}
              </Typography>
            </View>
          ))}

          {footerLabel && onFooterPress && (
            <Button
              label={footerLabel}
              onPress={onFooterPress}
              variant="soft"
              fullWidth
              style={{ marginTop: 8 }}
              labelStyle={{
                fontSize: 10,
                letterSpacing: 0.5,
                color: isDark ? theme.colors.text : theme.colors.textInverse,
              }}
              size="sm"
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    marginBottom: 12,
  },
  chartContainer: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  centerText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageList: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percent: {
    minWidth: 35,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
