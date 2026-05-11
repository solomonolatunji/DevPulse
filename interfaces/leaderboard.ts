export interface LeaderboardUserProfile {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  display_name?: string;
  created_at?: string;
  website?: string;
  human_readable_website?: string;
  is_hireable?: boolean;
  photo?: string;
  is_email_public?: boolean;
  photo_public?: boolean;
  is_photo_public?: boolean;
  city?: {
    country_code: string;
    name: string;
    state: string;
    title: string;
  };
}

export interface LeaderboardUser {
  rank: number | null;
  running_total: {
    total_seconds: number;
    human_readable_total: string;
    daily_average: number;
    human_readable_daily_average: string;
    languages: {
      name: string;
      total_seconds: number;
    }[];
  };
  user: LeaderboardUserProfile;
}

export interface CurrentLeaderboardUser {
  rank: number | null;
  page: number | null;
  user: LeaderboardUserProfile;
}

export interface WakaTimeLeaderboard {
  data: LeaderboardUser[];
  current_user?: CurrentLeaderboardUser;
  page: number;
  total_pages: number;
  range: {
    start_date: string;
    start_text: string;
    end_date: string;
    end_text: string;
  };
}
