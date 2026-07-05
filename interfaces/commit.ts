export interface WakaTimeRepository {
  default_branch?: string;
  description?: string;
  fork_count?: number;
  full_name?: string;
  homepage?: string;
  html_url?: string;
  id: string;
  is_fork?: boolean;
  is_private?: boolean;
  last_synced_at?: string;
  name: string;
  provider?: string;
  star_count?: number;
  url?: string;
  watch_count?: number;
}

export interface WakaTimeCommit {
  id: string;
  hash: string;
  truncated_hash: string;
  message: string;
  author_name: string;
  author_email: string;
  author_username?: string;
  author_avatar_url?: string;
  author_html_url?: string;
  author_url?: string;
  author_date: string;
  committer_name: string;
  committer_email: string;
  committer_username?: string;
  committer_avatar_url?: string;
  committer_html_url?: string;
  committer_url?: string;
  committer_date: string;
  branch: string;
  ref: string;
  total_seconds: number;
  human_readable_total: string;
  human_readable_total_with_seconds: string;
  html_url?: string;
  url?: string;
  created_at: string;
}

export interface WakaTimeCommitsResponse {
  commits: WakaTimeCommit[];
  author: string | null;
  branch: string;
  project: {
    id: string;
    name: string;
    privacy: string;
    repository?: WakaTimeRepository;
  };
  page: number;
  next_page: number | null;
  next_page_url: string | null;
  prev_page: number | null;
  prev_page_url: string | null;
  status: string;
  total: number;
  total_pages: number;
}

export interface WakaTimeCommitResponse {
  commit: WakaTimeCommit;
  branch: string;
  project: {
    id: string;
    name: string;
    privacy: string;
    repository?: WakaTimeRepository;
  };
  status: string;
}
