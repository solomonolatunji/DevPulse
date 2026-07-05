import { useTheme } from '@/hooks/useTheme';
import { formatDuration } from '@/utilities/formatters';
import {
  Canvas,
  Circle,
  Path,
  Skia,
  Text as SkiaText,
  matchFont,
} from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Card } from './Card';
import { Typography } from './Typography';

export interface ClockSession {
  start: number;
  duration: number;
  color?: string;
  project?: string;
}

interface ActivityRhythmProps {
  sessions?: ClockSession[];
  isLoading?: boolean;
  size?: number;
  title?: string;
  subtitle?: string;
}

const HOURS = [0, 6, 12, 18];
const MARGIN = 40;

export const ActivityRhythm = ({
  sessions = [],
  isLoading = false,
  size = 240,
  title = 'Activity Rhythm',
  subtitle = 'Showing 24-hour coding density',
}: ActivityRhythmProps) => {
  const { theme, isDark } = useTheme();

  const center = size / 2;
  const outerRadius = size / 2 - MARGIN;
  const strokeWidth = 12;
  const innerRadius = outerRadius - strokeWidth;
  const midRadius = (outerRadius + innerRadius) / 2;

  const fontFamily =
    Platform.select({ ios: 'Helvetica', android: 'sans-serif' }) ||
    'sans-serif';
  const font = useMemo(
    () => matchFont({ fontFamily, fontSize: 12 }),
    [fontFamily],
  );

  const arcs = useMemo(() => {
    if (isLoading || !sessions.length) return [];

    return sessions.map((session) => {
      const startAngle =
        (session.start / (24 * 3600)) * 2 * Math.PI - Math.PI / 2;
      const sweepAngle = (session.duration / (24 * 3600)) * 2 * Math.PI;

      const path = Skia.PathBuilder.Make()
        .addArc(
          {
            x: center - midRadius,
            y: center - midRadius,
            width: midRadius * 2,
            height: midRadius * 2,
          },
          (startAngle * 180) / Math.PI,
          (sweepAngle * 180) / Math.PI,
        )
        .build();

      return {
        path,
        color: session.color || theme.colors.primary,
        project: session.project,
      };
    });
  }, [sessions, center, midRadius, theme.colors.primary, isLoading]);

  const projectLegend = useMemo(() => {
    if (!sessions.length) return [];

    const projectMap = new Map<string, { color: string; duration: number }>();

    sessions.forEach((s) => {
      if (s.project) {
        const existing = projectMap.get(s.project) || {
          color: s.color || theme.colors.primary,
          duration: 0,
        };
        existing.duration += s.duration;
        projectMap.set(s.project, existing);
      }
    });

    return Array.from(projectMap.entries())
      .sort((a, b) => b[1].duration - a[1].duration)
      .slice(0, 4) // Top 4 projects
      .map(([name, data]) => ({
        name,
        color: data.color,
        formattedTime: formatDuration(data.duration),
      }));
  }, [sessions, theme.colors.primary]);

  // Calculate total duration for the center
  const totalDuration = useMemo(() => {
    return sessions.reduce((acc, curr) => acc + curr.duration, 0);
  }, [sessions]);

  const formattedTotal = useMemo(() => {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }, [totalDuration]);

  return (
    <Card
      style={[
        styles.card,
        {
          borderColor: theme.colors.border,
          borderWidth: 1,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.header}>
        <Typography
          variant="title"
          weight="bold"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {title}
        </Typography>
      </View>

      <View style={[styles.canvasContainer, { height: size }]}>
        <Canvas style={{ width: size, height: size }}>
          <Circle
            cx={center}
            cy={center}
            r={midRadius}
            color={theme.colors.surfaceHighlight}
            style="stroke"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />

          {HOURS.map((hour) => {
            const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2;
            const x = center + (outerRadius + 20) * Math.cos(angle);
            const y = center + (outerRadius + 20) * Math.sin(angle);
            const label =
              hour === 0
                ? '12AM'
                : hour === 12
                  ? '12PM'
                  : `${hour % 12}${hour < 12 ? 'AM' : 'PM'}`;
            const textWidth = font?.getTextWidth(label) || 0;

            return (
              <SkiaText
                key={hour}
                x={x - textWidth / 2}
                y={y + 5}
                text={label}
                font={font}
                color={theme.colors.textSecondary}
              />
            );
          })}

          {!isLoading &&
            arcs.map((arc, index) => (
              <Path
                key={index}
                path={arc.path}
                color={arc.color}
                style="stroke"
                strokeWidth={strokeWidth}
                strokeCap="round"
              />
            ))}

          {!isLoading && sessions.length === 0 && (
            <SkiaText
              x={center - 35}
              y={center + 5}
              text="No Activity"
              font={font}
              color={theme.colors.textSecondary}
              opacity={0.5}
            />
          )}
        </Canvas>

        <View
          style={[
            StyleSheet.absoluteFill,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <View style={{ width: innerRadius * 2 - 20, alignItems: 'center' }}>
            <Typography
              variant="headline"
              weight="bold"
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ textAlign: 'center' }}
            >
              {formattedTotal}
            </Typography>
            <Typography
              variant="micro"
              color={theme.colors.textSecondary}
              align="center"
            >
              total time
            </Typography>
          </View>
        </View>
      </View>

      {!isLoading && projectLegend.length > 0 && (
        <View
          style={[
            styles.legendContainer,
            {
              backgroundColor: isDark
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.02)',
            },
          ]}
        >
          {projectLegend.map((p, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={styles.legendLeft}>
                <View
                  style={[styles.legendDot, { backgroundColor: p.color }]}
                />
                <Typography
                  variant="body"
                  weight="medium"
                  color={theme.colors.text}
                  numberOfLines={1}
                >
                  {p.name}
                </Typography>
              </View>
              <Typography
                variant="body"
                weight="bold"
                color={theme.colors.text}
              >
                {p.formattedTime}
              </Typography>
            </View>
          ))}
        </View>
      )}

      {(!projectLegend.length || isLoading) && (
        <View style={styles.legend}>
          <Typography
            variant="caption"
            align="center"
            color={theme.colors.textSecondary}
          >
            {subtitle}
          </Typography>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  canvasContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  legend: {
    marginTop: 0,
  },
  legendContainer: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
