'use no memo';

import { VoltraAndroid } from 'voltra/android';
import type { StatsData } from './interface';

export const DailyStatsWidgetAndroid = ({ stats }: { stats: StatsData }) => {
  return (
    <VoltraAndroid.Column
      deepLinkUrl="devpulse://"
      style={{
        padding: 16,
        borderRadius: 24,
        backgroundColor: stats.theme.surface,
        borderColor: stats.theme.border,
        borderWidth: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <VoltraAndroid.Row
        style={{
          alignItems: 'center',
          marginBottom: 12,
          backgroundColor: stats.theme.primary + '15',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 14,
        }}
      >
        <VoltraAndroid.Box
          style={{
            width: 14,
            height: 14,
            borderRadius: 4,
            backgroundColor: stats.theme.primary,
            marginRight: 8,
          }}
        />
        <VoltraAndroid.Text
          maxLines={1}
          style={{
            color: stats.theme.primary,
            fontSize: 13,
            fontWeight: '800',
          }}
        >
          DEVPULSE
        </VoltraAndroid.Text>
      </VoltraAndroid.Row>

      <VoltraAndroid.Column
        style={{
          flex: 1,
          justifyContent: 'center',
          width: '100%',
          paddingLeft: 4,
        }}
      >
        <VoltraAndroid.Text
          maxLines={1}
          style={{
            color: stats.theme.text,
            fontSize: 36,
            fontWeight: 'bold',
            letterSpacing: -1.5,
          }}
        >
          {stats.todayTotalText}
        </VoltraAndroid.Text>
        <VoltraAndroid.Text
          maxLines={1}
          style={{
            color: stats.theme.textSecondary,
            fontSize: 14,
            fontWeight: '600',
            marginTop: 2,
          }}
        >
          {stats.todayPercent}% daily average
        </VoltraAndroid.Text>
      </VoltraAndroid.Column>

      {(stats.topProject || stats.topLanguage) && (
        <VoltraAndroid.Column
          style={{
            width: '100%',
            marginTop: 12,
            backgroundColor: stats.theme.surfaceSubtle,
            borderRadius: 18,
            padding: 14,
          }}
        >
          {stats.topProject && (
            <VoltraAndroid.Row
              style={{
                alignItems: 'center',
                marginBottom: stats.topLanguage ? 14 : 0,
                width: '100%',
              }}
            >
              <VoltraAndroid.Row
                style={{
                  alignItems: 'center',
                  flex: 1,
                  marginRight: 12,
                }}
              >
                <VoltraAndroid.Box
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor:
                      stats.topProject.color || stats.theme.primary,
                    marginRight: 10,
                  }}
                />
                <VoltraAndroid.Text
                  maxLines={1}
                  style={{
                    flex: 1,
                    color: stats.theme.text,
                    fontSize: 14,
                    fontWeight: '700',
                  }}
                >
                  {stats.topProject.name}
                </VoltraAndroid.Text>
              </VoltraAndroid.Row>
              <VoltraAndroid.Text
                maxLines={1}
                style={{
                  minWidth: 54,
                  color: stats.theme.textSecondary,
                  fontSize: 13,
                  fontWeight: '700',
                  textAlign: 'right',
                }}
              >
                {stats.topProject.text}
              </VoltraAndroid.Text>
            </VoltraAndroid.Row>
          )}

          {stats.topLanguage && (
            <VoltraAndroid.Column style={{ width: '100%' }}>
              <VoltraAndroid.Row
                style={{
                  alignItems: 'center',
                  marginBottom: 8,
                  width: '100%',
                }}
              >
                <VoltraAndroid.Text
                  maxLines={1}
                  style={{
                    flex: 1,
                    marginRight: 12,
                    color: stats.theme.text,
                    fontSize: 13,
                    fontWeight: '700',
                  }}
                >
                  {stats.topLanguage.name}
                </VoltraAndroid.Text>
                <VoltraAndroid.Text
                  maxLines={1}
                  style={{
                    minWidth: 40,
                    color: stats.theme.textSecondary,
                    fontSize: 13,
                    fontWeight: '700',
                    textAlign: 'right',
                  }}
                >
                  {Math.round(stats.topLanguage.percent)}%
                </VoltraAndroid.Text>
              </VoltraAndroid.Row>
              <VoltraAndroid.LinearProgressIndicator
                progress={stats.topLanguage.percent / 100}
                color={stats.topLanguage.color || stats.theme.primary}
                backgroundColor={stats.theme.border}
                style={{
                  borderRadius: 4,
                  height: 8,
                  width: '100%',
                }}
              />
            </VoltraAndroid.Column>
          )}
        </VoltraAndroid.Column>
      )}
    </VoltraAndroid.Column>
  );
};
