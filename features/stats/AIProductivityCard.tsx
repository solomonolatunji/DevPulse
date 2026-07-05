import { Button, Card, Typography } from '@/components';
import { useTheme } from '@/hooks';
import { WakaTimeAIAgentBreakdown } from '@/interfaces';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface AIProductivityCardProps {
  aiAdditions: number;
  aiDeletions: number;
  humanAdditions: number;
  humanDeletions: number;
  agentBreakdown?: WakaTimeAIAgentBreakdown[];
  agentTotalCost?: number;
  inputTokens?: number;
  outputTokens?: number;
  sessions?: number;
  promptEvents?: number;
  promptLengthAvg?: number;
  lineChangesTotal?: number;
  onViewMore?: () => void;
}

const formatCost = (cost: number): string => {
  if (cost < 0.01) return '$0.00';
  return `$${cost.toFixed(2)}`;
};

const formatTokens = (tokens: number): string => {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}K`;
  return tokens.toLocaleString();
};

export const AIProductivityCard = ({
  aiAdditions,
  aiDeletions,
  humanAdditions,
  humanDeletions,
  agentBreakdown,
  agentTotalCost,
  inputTokens,
  outputTokens,
  sessions,
  promptEvents,
  promptLengthAvg,
  lineChangesTotal,
  onViewMore,
}: AIProductivityCardProps) => {
  const { theme } = useTheme();
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: 20,
          marginBottom: 16,
        },
        title: {
          marginBottom: 16,
          fontSize: 14,
          letterSpacing: 1,
        },
        metricsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        },
        metricItem: {
          flex: 1,
          alignItems: 'center',
        },
        divider: {
          width: 1,
          height: 40,
          backgroundColor: theme.colors.border,
          marginHorizontal: 10,
        },
        progressContainer: {
          height: 12,
          flexDirection: 'row',
          borderRadius: 6,
          overflow: 'hidden',
          backgroundColor: theme.colors.surfaceHighlight,
          marginBottom: 8,
        },
        progressBar: {
          height: '100%',
        },
        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        extendedSection: {
          marginTop: 20,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingTop: 16,
        },
        subsectionTitle: {
          marginBottom: 8,
          fontSize: 11,
          letterSpacing: 1,
        },
        agentSection: {
          marginBottom: 16,
        },
        agentRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 4,
        },
        agentTotalRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 6,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          marginTop: 4,
        },
        metricsGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
        },
        metricTile: {
          flex: 1,
          minWidth: '45%',
          backgroundColor: theme.colors.surfaceHighlight,
          borderRadius: 8,
          padding: 12,
          alignItems: 'center',
        },
      }),
    [theme.colors.border, theme.colors.surfaceHighlight],
  );

  const totalAdditions = aiAdditions + humanAdditions;
  const aiAddPercent =
    totalAdditions > 0 ? (aiAdditions / totalAdditions) * 100 : 0;
  const humanAddPercent =
    totalAdditions > 0 ? (humanAdditions / totalAdditions) * 100 : 100;
  const hasAgentData =
    agentBreakdown && agentBreakdown.length > 0 && agentTotalCost !== undefined;
  const hasTokenData = inputTokens !== undefined || outputTokens !== undefined;
  const hasSessionData = sessions !== undefined || promptEvents !== undefined;

  return (
    <Card style={styles.container}>
      <Typography
        variant="title"
        style={styles.title}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        AI PRODUCTIVITY INDEX
      </Typography>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Typography variant="caption" color={theme.colors.textSecondary}>
            AI CHANGES
          </Typography>
          <Typography
            variant="headline"
            weight="bold"
            color="#4ADE80"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {aiAdditions + aiDeletions}
          </Typography>
          <Typography variant="caption">
            {aiAdditions} + / {aiDeletions} -
          </Typography>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Typography variant="caption" color={theme.colors.textSecondary}>
            HUMAN CHANGES
          </Typography>
          <Typography
            variant="headline"
            weight="bold"
            color="#6366F1"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {humanAdditions + humanDeletions}
          </Typography>
          <Typography variant="caption">
            {humanAdditions} + / {humanDeletions} -
          </Typography>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${aiAddPercent}%`, backgroundColor: '#4ADE80' },
          ]}
        />
        <View
          style={[
            styles.progressBar,
            { width: `${humanAddPercent}%`, backgroundColor: '#6366F1' },
          ]}
        />
      </View>

      <View style={styles.row}>
        <Typography variant="caption">
          AI Assistant: {aiAddPercent.toFixed(1)}%
        </Typography>
        <Typography variant="caption">
          Manual Typing: {humanAddPercent.toFixed(1)}%
        </Typography>
      </View>

      {(hasAgentData || hasTokenData || hasSessionData) && (
        <View style={styles.extendedSection}>
          {hasAgentData && (
            <View style={styles.agentSection}>
              <Typography
                variant="caption"
                color={theme.colors.textSecondary}
                style={styles.subsectionTitle}
              >
                AI AGENT BREAKDOWN
              </Typography>
              {agentBreakdown.map((agent, index) => (
                <View key={index} style={styles.agentRow}>
                  <Typography variant="caption" numberOfLines={1}>
                    {agent.name}
                  </Typography>
                  <Typography variant="caption">
                    {agent.lines} lines · {formatCost(agent.cost)}
                  </Typography>
                </View>
              ))}
              <View style={styles.agentTotalRow}>
                <Typography variant="caption" weight="bold">
                  Total
                </Typography>
                <Typography variant="caption" weight="bold">
                  {lineChangesTotal !== undefined
                    ? `${lineChangesTotal} lines · `
                    : ''}
                  {formatCost(agentTotalCost!)}
                </Typography>
              </View>
            </View>
          )}

          <View style={styles.metricsGrid}>
            {hasTokenData && (
              <View style={styles.metricTile}>
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                >
                  INPUT TOKENS
                </Typography>
                <Typography
                  variant="title"
                  weight="bold"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {formatTokens(inputTokens || 0)}
                </Typography>
              </View>
            )}
            {hasTokenData && (
              <View style={styles.metricTile}>
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                >
                  OUTPUT TOKENS
                </Typography>
                <Typography
                  variant="title"
                  weight="bold"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {formatTokens(outputTokens || 0)}
                </Typography>
              </View>
            )}
            {sessions !== undefined && (
              <View style={styles.metricTile}>
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                >
                  AI SESSIONS
                </Typography>
                <Typography
                  variant="title"
                  weight="bold"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {sessions}
                </Typography>
              </View>
            )}
            {promptEvents !== undefined && (
              <View style={styles.metricTile}>
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                >
                  PROMPTS
                </Typography>
                <Typography
                  variant="title"
                  weight="bold"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {promptEvents}
                </Typography>
              </View>
            )}
            {promptLengthAvg !== undefined && (
              <View style={styles.metricTile}>
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                >
                  AVG PROMPT LENGTH
                </Typography>
                <Typography
                  variant="title"
                  weight="bold"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {promptLengthAvg}
                </Typography>
              </View>
            )}
          </View>
        </View>
      )}

      {onViewMore && (
        <Button
          label="VIEW AI INSIGHTS"
          onPress={onViewMore}
          variant="soft"
          fullWidth
          style={{ marginTop: 16 }}
          labelStyle={{ fontSize: 10, letterSpacing: 0.5 }}
          size="sm"
        />
      )}
    </Card>
  );
};
