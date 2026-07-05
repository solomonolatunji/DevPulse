export interface WakaTimeSummaryItem {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
  color?: string;
}

export interface WakaTimeSummaryGrandTotal {
  digital: string;
  hours: number;
  minutes: number;
  text: string;
  total_seconds: number;
  ai_prompt_length_avg?: number;
  ai_prompt_length_avg_per_session?: number;
  ai_prompt_length_median_per_session?: number;
  ai_prompt_length_sum?: number;
  ai_prompt_events_total?: number;
  ai_prompt_events_avg_per_session?: number;
  ai_prompt_events_median_per_session?: number;
  ai_sessions?: number;
}

export interface WakaTimeSummary {
  grand_total: WakaTimeSummaryGrandTotal;
  range: {
    date: string;
    start: string;
    end: string;
    text: string;
    timezone: string;
  };
  projects: WakaTimeSummaryItem[];
  languages: WakaTimeSummaryItem[];
  categories: WakaTimeSummaryItem[];
  editors: WakaTimeSummaryItem[];
  operating_systems: WakaTimeSummaryItem[];
  machines?: WakaTimeSummaryItem[];
}

export interface WakaTimeSummaries {
  data: WakaTimeSummary[];
  start: string;
  end: string;
  cumulative_total: {
    seconds: number;
    text: string;
  };
}
