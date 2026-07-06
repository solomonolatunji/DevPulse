'use no memo';

import { Voltra } from 'voltra';
import type { StatsData } from './interface';

export const DailyStatsWidgetIOS = ({
  stats,
  isSimple = false,
}: {
  stats: StatsData;
  isSimple?: boolean;
}) => {
  return (
    <Voltra.Link destination="devpulse://">
      <Voltra.VStack
        style={{
          flexDirection: isSimple ? 'row' : 'column',
          justifyContent: isSimple ? 'center' : 'space-between',
          alignItems: isSimple ? 'center' : 'stretch',
          height: '100%',
        }}
      >
        <Voltra.HStack
          style={{
            alignItems: 'center',
            marginBottom: isSimple ? 0 : 12,
            backgroundColor: isSimple
              ? 'transparent'
              : stats.theme.primary + '15',
            paddingHorizontal: isSimple ? 0 : 10,
            paddingVertical: isSimple ? 0 : 6,
            borderRadius: 14,
            alignSelf: 'flex-start',
          }}
        >
          <Voltra.Symbol
            name="chart.bar.fill"
            size={14}
            tintColor={stats.theme.primary}
            style={{ marginRight: 6 }}
          />
          <Voltra.Text
            numberOfLines={1}
            style={{
              color: stats.theme.primary,
              fontSize: 13,
              fontWeight: '800',
              letterSpacing: 0.5,
            }}
          >
            DEVPULSE
          </Voltra.Text>
        </Voltra.HStack>

        <Voltra.VStack
          style={{
            flex: isSimple ? 0 : 1,
            justifyContent: 'center',
            alignItems: isSimple ? 'center' : 'flex-start',
            paddingLeft: isSimple ? 10 : 4,
          }}
        >
          <Voltra.Text
            numberOfLines={1}
            style={{
              color: stats.theme.text,
              fontSize: isSimple ? 20 : 36,
              fontWeight: '900',
              letterSpacing: -1.5,
            }}
          >
            {stats.todayTotalText}
          </Voltra.Text>
          {!isSimple && (
            <Voltra.Text
              numberOfLines={1}
              style={{
                color: stats.theme.textSecondary,
                fontSize: 14,
                fontWeight: '600',
                marginTop: 2,
              }}
            >
              {stats.todayPercent}% daily average
            </Voltra.Text>
          )}
        </Voltra.VStack>

        {!isSimple && (stats.topProject || stats.topLanguage) && (
          <Voltra.VStack
            style={{
              marginTop: 12,
              backgroundColor: stats.theme.surfaceSubtle,
              borderRadius: 18,
              padding: 14,
            }}
          >
            {stats.topProject && (
              <Voltra.HStack
                style={{
                  alignItems: 'center',
                  marginBottom: stats.topLanguage ? 14 : 0,
                }}
              >
                <Voltra.HStack
                  style={{
                    alignItems: 'center',
                    flex: 1,
                    marginRight: 12,
                  }}
                >
                  <Voltra.View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor:
                        stats.topProject.color || stats.theme.primary,
                      marginRight: 10,
                    }}
                  />
                  <Voltra.Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      color: stats.theme.text,
                      fontSize: 14,
                      fontWeight: '700',
                    }}
                  >
                    {stats.topProject.name}
                  </Voltra.Text>
                </Voltra.HStack>
                <Voltra.Text
                  numberOfLines={1}
                  style={{
                    minWidth: 54,
                    color: stats.theme.textSecondary,
                    fontSize: 13,
                    fontWeight: '700',
                    textAlign: 'right',
                  }}
                >
                  {stats.topProject.text}
                </Voltra.Text>
              </Voltra.HStack>
            )}

            {stats.topLanguage && (
              <Voltra.VStack>
                <Voltra.HStack
                  style={{
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Voltra.Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      marginRight: 12,
                      color: stats.theme.text,
                      fontSize: 13,
                      fontWeight: '700',
                    }}
                  >
                    {stats.topLanguage.name}
                  </Voltra.Text>
                  <Voltra.Text
                    numberOfLines={1}
                    style={{
                      minWidth: 40,
                      color: stats.theme.textSecondary,
                      fontSize: 13,
                      fontWeight: '700',
                      textAlign: 'right',
                    }}
                  >
                    {Math.round(stats.topLanguage.percent)}%
                  </Voltra.Text>
                </Voltra.HStack>
                <Voltra.View
                  style={{
                    height: 8,
                    backgroundColor: stats.theme.border,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <Voltra.View
                    style={{
                      width: `${stats.topLanguage.percent}%`,
                      height: '100%',
                      backgroundColor:
                        stats.topLanguage.color || stats.theme.primary,
                      borderRadius: 4,
                    }}
                  />
                </Voltra.View>
              </Voltra.VStack>
            )}
          </Voltra.VStack>
        )}
      </Voltra.VStack>
    </Voltra.Link>
  );
};
