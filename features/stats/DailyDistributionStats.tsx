import { SegmentedStatsCard } from '@/components';
import { getCategoryColor, getOSColor, getWorkstationColor } from '@/constants';
import { useActivity, useMetadata } from '@/hooks';
import { WakaTimeSummary } from '@/interfaces';

interface DailyDistributionStatsProps {
  data: WakaTimeSummary | null | undefined;
  date?: string;
}

export const DailyDistributionStats = ({
  data,
  date,
}: DailyDistributionStatsProps) => {
  const { getLanguageColor, getEditorColor } = useMetadata();
  const { stats: aiStats } = useActivity(date || '');

  if (!data) return null;

  return (
    <>
      {aiStats && aiStats.totalLines > 0 && (
        <SegmentedStatsCard
          title="AI VS HUMAN CONTRIBUTIONS"
          segments={[
            {
              label: 'Human',
              percent: aiStats.humanPercent,
              color: '#6366F1',
              valueText: `${aiStats.humanLines.toLocaleString()} lines`,
            },
            {
              label: 'AI',
              percent: aiStats.aiPercent,
              color: '#4ADE80',
              valueText: `${aiStats.aiLines.toLocaleString()} lines`,
            },
          ]}
        />
      )}

      {data.languages && data.languages.length > 0 && (
        <SegmentedStatsCard
          title="LANGUAGES"
          segments={data.languages.slice(0, 4).map((l) => ({
            label: l.name,
            percent: l.percent,
            color: getLanguageColor(l.name),
            valueText: l.text,
          }))}
        />
      )}

      {data.categories && data.categories.length > 0 && (
        <SegmentedStatsCard
          title="CATEGORIES"
          segments={data.categories.slice(0, 3).map((c) => ({
            label: c.name,
            percent: c.percent,
            color: getCategoryColor(c.name),
            valueText: c.text,
          }))}
        />
      )}

      {data.editors && data.editors.length > 0 && (
        <SegmentedStatsCard
          title="EDITORS"
          segments={data.editors.slice(0, 2).map((e) => ({
            label: e.name,
            percent: e.percent,
            color: getEditorColor(e.name),
            valueText: e.text,
          }))}
        />
      )}

      {data.operating_systems && data.operating_systems.length > 0 && (
        <SegmentedStatsCard
          title="OPERATING SYSTEMS"
          segments={data.operating_systems.slice(0, 1).map((os) => ({
            label: os.name,
            percent: os.percent,
            color: getOSColor(os.name),
            valueText: os.text,
          }))}
        />
      )}

      {data.machines && data.machines.length > 0 && (
        <SegmentedStatsCard
          title="WORKSTATIONS"
          segments={data.machines.slice(0, 2).map((m) => ({
            label: m.name,
            percent: m.percent,
            color: getWorkstationColor(m.name),
            valueText: m.text,
          }))}
        />
      )}
    </>
  );
};
