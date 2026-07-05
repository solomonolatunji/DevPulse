export interface WakaTimeLanguage {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
  color?: string;
}

export interface WakaTimeMachineStat extends WakaTimeLanguage {
  machine_name_id: string;
}

export interface WakaTimeAIAgentBreakdown {
  name: string;
  lines: number;
  cost: number;
}

export interface WakaTimeAIAgentStats {
  ai_additions?: number;
  ai_deletions?: number;
  human_additions?: number;
  human_deletions?: number;
  ai_agent_line_changes?: { [agentName: string]: number };
  ai_agent_costs?: { [agentName: string]: number };
  ai_agent_breakdown?: WakaTimeAIAgentBreakdown[];
  ai_agent_total_cost?: number;
  ai_input_tokens?: number;
  ai_output_tokens?: number;
  ai_prompt_length_avg?: number;
  ai_prompt_length_avg_per_session?: number;
  ai_prompt_length_median_per_session?: number;
  ai_prompt_length_sum?: number;
  ai_prompt_events_total?: number;
  ai_prompt_events_avg_per_session?: number;
  ai_prompt_events_median_per_session?: number;
  ai_sessions?: number;
}

export interface WakaTimeProjectStat
  extends WakaTimeLanguage, WakaTimeAIAgentStats {}
export interface WakaTimeEditorStat
  extends WakaTimeLanguage, WakaTimeAIAgentStats {}

export interface WakaTimeStats {
  data: {
    languages: WakaTimeLanguage[];
    editors: WakaTimeEditorStat[];
    operating_systems: WakaTimeLanguage[];
    categories: WakaTimeLanguage[];
    machines: WakaTimeMachineStat[];
    projects: WakaTimeProjectStat[];
    best_day?: {
      date: string;
      text: string;
      total_seconds: number;
    };
    daily_average: number;
    daily_average_including_other_language: number;
    human_readable_daily_average: string;
    total_seconds: number;
    human_readable_total: string;
    ai_additions?: number;
    ai_deletions?: number;
    human_additions?: number;
    human_deletions?: number;
    ai_agent_line_changes?: { [agentName: string]: number };
    ai_line_changes_total?: number;
    ai_agent_costs?: { [agentName: string]: number };
    ai_agent_breakdown?: WakaTimeAIAgentBreakdown[];
    ai_agent_total_cost?: number;
    ai_input_tokens?: number;
    ai_output_tokens?: number;
    ai_prompt_length_avg?: number;
    ai_prompt_length_avg_per_session?: number;
    ai_prompt_length_median_per_session?: number;
    ai_prompt_length_sum?: number;
    ai_prompt_events_total?: number;
    ai_prompt_events_avg_per_session?: number;
    ai_prompt_events_median_per_session?: number;
    ai_sessions?: number;
    dependencies?: {
      name: string;
      total_seconds: number;
      percent: number;
      digital: string;
      text: string;
    }[];
    is_up_to_date: boolean;
    start: string;
    end: string;
    timezone: string;
  };
}
export interface WakaTimeAllTime {
  data: {
    total_seconds: number;
    text: string;
    digital: string;
    is_up_to_date: boolean;
    percent_calculated: number;
  };
}
