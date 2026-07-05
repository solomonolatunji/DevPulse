import {
  Card,
  ScreenHeader,
  TimeRangeSelector,
  Typography,
} from '@/components';
import { AIProductivityCard } from '@/features/stats';
import { useStats, useTheme } from '@/hooks';
import { WakaTimeProjectStat } from '@/interfaces';
import { RANGE_API_MAP, TimeRange, VALID_TIME_RANGES } from '@/utilities';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const formatCost = (cost: number): string => {
  if (cost < 0.01) return '$0.00';
  return `$${cost.toFixed(2)}`;
};

const formatTokens = (tokens: number): string => {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`;
  return tokens.toLocaleString();
};

export default function AIScreen() {
  const { theme, isDark } = useTheme();
  const params = useLocalSearchParams<{ range?: string }>();
  const [range, setRange] = useState<TimeRange>('last_7_days');

  useEffect(() => {
    if (params.range && VALID_TIME_RANGES.includes(params.range as TimeRange)) {
      setRange(params.range as TimeRange);
    }
  }, [params.range]);

  const {
    data: stats,
    isLoading,
    refetch,
    isRefetching,
  } = useStats(RANGE_API_MAP[range]);

  const d = stats?.data;
  const hasAIData = d?.ai_additions !== undefined;

  const projectsWithAI = (d?.projects || [])
    .filter((p: WakaTimeProjectStat) => p.ai_additions || p.ai_deletions)
    .sort(
      (a: WakaTimeProjectStat, b: WakaTimeProjectStat) =>
        (b.ai_additions || 0) +
        (b.ai_deletions || 0) -
        (a.ai_additions || 0) -
        (a.ai_deletions || 0),
    );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['left', 'right']}
    >
      <ScreenHeader title="AI Insights" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
      >
        <TimeRangeSelector value={range} onChange={setRange} />

        {!isLoading && !hasAIData && (
          <Card style={styles.emptyCard}>
            <Typography
              variant="body"
              color={theme.colors.textSecondary}
              style={styles.emptyText}
            >
              No AI coding activity found for this time range.
            </Typography>
          </Card>
        )}

        {hasAIData && (
          <>
            <AIProductivityCard
              aiAdditions={d!.ai_additions || 0}
              aiDeletions={d!.ai_deletions || 0}
              humanAdditions={d!.human_additions || 0}
              humanDeletions={d!.human_deletions || 0}
              agentBreakdown={d!.ai_agent_breakdown}
              agentTotalCost={d!.ai_agent_total_cost}
              inputTokens={d!.ai_input_tokens}
              outputTokens={d!.ai_output_tokens}
              sessions={d!.ai_sessions}
              promptEvents={d!.ai_prompt_events_total}
              promptLengthAvg={d!.ai_prompt_length_avg}
              lineChangesTotal={d!.ai_line_changes_total}
            />

            <Card style={styles.costCard}>
              <Typography variant="title" style={styles.sectionTitle}>
                AI COST SUMMARY
              </Typography>
              <View style={styles.costRow}>
                <Typography variant="caption" color="gray">
                  Total AI Spend
                </Typography>
                <Typography variant="title" weight="bold" color="#10B981">
                  {d!.ai_agent_total_cost
                    ? formatCost(d!.ai_agent_total_cost)
                    : '$0.00'}
                </Typography>
              </View>
              {(d!.ai_agent_breakdown || []).map((agent, index) => (
                <View key={index} style={styles.agentCostRow}>
                  <View
                    style={[
                      styles.agentDot,
                      {
                        backgroundColor:
                          AGENT_COLORS[index % AGENT_COLORS.length],
                      },
                    ]}
                  />
                  <Typography variant="caption" style={styles.agentCostName}>
                    {agent.name}
                  </Typography>
                  <Typography variant="caption">
                    {formatCost(agent.cost)}
                  </Typography>
                </View>
              ))}
            </Card>

            {projectsWithAI.length > 0 && (
              <Card style={styles.projectsCard}>
                <Typography variant="title" style={styles.sectionTitle}>
                  AI BY PROJECT
                </Typography>
                {projectsWithAI
                  .slice(0, 10)
                  .map((project: WakaTimeProjectStat, index: number) => {
                    const aiLines =
                      (project.ai_additions || 0) + (project.ai_deletions || 0);
                    const totalLines =
                      aiLines +
                      (project.human_additions || 0) +
                      (project.human_deletions || 0);
                    const aiPercent =
                      totalLines > 0 ? (aiLines / totalLines) * 100 : 0;
                    return (
                      <View key={index} style={styles.projectRow}>
                        <View style={styles.projectInfo}>
                          <Typography variant="caption" numberOfLines={1}>
                            {project.name}
                          </Typography>
                          <Typography variant="caption" color="gray">
                            {aiLines} AI lines · {aiPercent.toFixed(0)}% AI
                          </Typography>
                        </View>
                        <View style={styles.projectCost}>
                          <Typography variant="caption" color="#10B981">
                            {project.ai_agent_total_cost
                              ? formatCost(project.ai_agent_total_cost)
                              : '-'}
                          </Typography>
                        </View>
                      </View>
                    );
                  })}
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const AGENT_COLORS = [
  '#4ADE80',
  '#6366F1',
  '#F59E0B',
  '#F43F5E',
  '#14B8A6',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
];

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 40 },
  emptyCard: { padding: 24, alignItems: 'center' },
  emptyText: { textAlign: 'center' },
  sectionTitle: {
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 16,
  },
  costCard: { padding: 20, marginBottom: 16 },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  agentCostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  agentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  agentCostName: {
    flex: 1,
  },
  projectsCard: { padding: 20, marginBottom: 16 },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  projectInfo: {
    flex: 1,
  },
  projectCost: {
    marginLeft: 12,
  },
});
