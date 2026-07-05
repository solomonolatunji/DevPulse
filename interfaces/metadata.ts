export interface WakaTimeMetadata {
  id: string;
  name: string;
  color: string;
}

export interface WakaTimeMetadataResponse {
  data: WakaTimeMetadata[];
}

export interface WakaTimeMachine {
  id: string;
  name: string;
  ip: string;
  last_seen_at: string;
  timezone: string;
  created_at: string;
}

export interface WakaTimeMachinesResponse {
  data: WakaTimeMachine[];
}

export interface WakaTimeHeartbeat {
  id: string;
  entity: string;
  type: string;
  project: string;
  language: string | null;
  is_ai: boolean;
  ai_line_changes?: number | null;
  human_line_changes?: number | null;
  ai_input_tokens?: number;
  ai_output_tokens?: number;
  ai_prompt_length?: number;
  ai_session?: string;
  ai_subscription_plan?: string | null;
  time: number;
  lines?: number;
  lineno?: number;
  cursorpos?: number;
  is_write?: boolean;
}

export interface WakaTimeHeartbeatsResponse {
  data: WakaTimeHeartbeat[];
}
