import { Typography } from '@/components';
import { SECONDS_IN_DAY, SECONDS_IN_HOUR } from '@/constants';
import { useTheme } from '@/hooks';
import { Canvas, Rect } from '@shopify/react-native-skia';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

interface Session {
  start: number;
  duration: number;
  color?: string;
}

interface SessionTimelineProps {
  sessions: Session[];
  height?: number;
}

export const SessionTimeline = ({
  sessions,
  height = 100,
}: SessionTimelineProps) => {
  const { theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const containerWidth = windowWidth - 40;

  const scale = containerWidth / SECONDS_IN_DAY;

  const hours = [0, 6, 12, 18, 24];

  return (
    <View style={styles.container}>
      <Typography variant="caption" weight="semibold" style={styles.label}>
        Daily Session Activity
      </Typography>

      <View style={[styles.canvasContainer, { height }]}>
        <Canvas style={{ flex: 1 }}>
          {/* Background Bar */}
          <Rect
            x={0}
            y={height / 4}
            width={containerWidth}
            height={height / 2}
            color={theme.colors.surfaceHighlight}
          />

          {/* Sessions */}
          {sessions.map((session, index) => (
            <Rect
              key={index}
              x={session.start * scale}
              y={height / 4}
              width={session.duration * scale}
              height={height / 2}
              color={session.color || theme.colors.primary}
            />
          ))}

          {/* Hour Markers */}
          {hours.map((hour) => (
            <Rect
              key={`marker-${hour}`}
              x={hour * SECONDS_IN_HOUR * scale}
              y={height / 4 - 5}
              width={1}
              height={height / 2 + 10}
              color={theme.colors.border}
            />
          ))}
        </Canvas>
      </View>

      <View style={styles.hourLabels}>
        {hours.map((hour) => (
          <Typography
            key={`label-${hour}`}
            variant="micro"
            color={theme.colors.textSecondary}
          >
            {hour === 24 ? '00:00' : `${hour.toString().padStart(2, '0')}:00`}
          </Typography>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  label: {
    marginBottom: 12,
  },
  canvasContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  hourLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
