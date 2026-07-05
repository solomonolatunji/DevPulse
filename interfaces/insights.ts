export type WakaTimeInsightType =
  | 'stats'
  | 'weekdays'
  | 'days'
  | 'ai_days'
  | 'best_day'
  | 'daily_average'
  | 'projects'
  | 'languages'
  | 'editors'
  | 'categories'
  | 'machines'
  | 'operating_systems';

export interface WakaTimeInsight<T = unknown> {
  data: T;
  range: string;
  human_readable_range: string;
  status: string;
  is_including_today: boolean;
  is_up_to_date: boolean;
  percent_calculated: number;
  start: string;
  end: string;
  timezone: string;
  timeout: number;
  writes_only: boolean;
  user_id: string;
  created_at: string;
  modified_at: string;
}

export interface WakaTimeAIDayInsight {
  day: string;
  ai_percent: number;
  human_percent: number;
  ai_lines: number;
  human_lines: number;
}
