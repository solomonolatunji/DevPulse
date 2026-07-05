export interface WakaTimeAICosts {
  [agentName: string]: number;
}

export interface WakaTimeDuration {
  project: string;
  duration: number;
  time: number | string;
  id: string;
  start?: number;
  color?: string;
  ai_additions?: number;
  ai_deletions?: number;
  human_additions?: number;
  human_deletions?: number;
  ai_agent_costs?: WakaTimeAICosts;
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

export interface WakaTimeDurationsResponse {
  data: WakaTimeDuration[];
  start: string;
  end: string;
  timezone: string;
}
