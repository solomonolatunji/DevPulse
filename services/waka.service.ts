import {
  User,
  WakaTimeAllTime,
  WakaTimeCommitsResponse,
  WakaTimeDurationsResponse,
  WakaTimeGoal,
  WakaTimeGoalsResponse,
  WakaTimeHeartbeatsResponse,
  WakaTimeInsight,
  WakaTimeInsightType,
  WakaTimeLeaderboard,
  WakaTimeMachinesResponse,
  WakaTimeMetadataResponse,
  WakaTimeOrganizationsResponse,
  WakaTimeProjectsResponse,
  WakaTimeStats,
  WakaTimeSummaries,
} from '@/interfaces';
import { fetchWithAuth } from '@/utilities/api';

export const wakaService = {
  getStats: (range: string = 'last_7_days'): Promise<WakaTimeStats> =>
    fetchWithAuth<WakaTimeStats>(`/users/current/stats/${range}`),

  getSummaries: (
    start: string,
    end: string,
    project?: string,
  ): Promise<WakaTimeSummaries> => {
    const params = new URLSearchParams({ start, end });
    if (project) params.append('project', project);

    return fetchWithAuth<WakaTimeSummaries>(
      `/users/current/summaries?${params.toString()}`,
    );
  },

  getUser: (): Promise<User> => fetchWithAuth<User>('/users/current'),

  getProjects: (page?: number): Promise<WakaTimeProjectsResponse> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return fetchWithAuth<WakaTimeProjectsResponse>(
      `/users/current/projects${queryString}`,
    );
  },

  getProjectStats: (
    projectName: string,
    range: string = 'last_7_days',
  ): Promise<WakaTimeStats> => {
    const params = new URLSearchParams();
    if (projectName) params.append('project', projectName);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return fetchWithAuth<WakaTimeStats>(
      `/users/current/stats/${range}${queryString}`,
    );
  },

  getGoals: (): Promise<WakaTimeGoalsResponse> =>
    fetchWithAuth<WakaTimeGoalsResponse>('/users/current/goals'),

  createGoal: (data: Partial<WakaTimeGoal>): Promise<WakaTimeGoal> =>
    fetchWithAuth<WakaTimeGoal>('/users/current/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateGoal: (
    id: string,
    data: Partial<WakaTimeGoal>,
  ): Promise<WakaTimeGoal> =>
    fetchWithAuth<WakaTimeGoal>(`/users/current/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteGoal: (id: string): Promise<{ data?: unknown }> =>
    fetchWithAuth<{ data?: unknown }>(`/users/current/goals/${id}`, {
      method: 'DELETE',
    }),

  getLeaderboard: (
    language?: string,
    countryCode?: string,
    page?: number,
  ): Promise<WakaTimeLeaderboard> => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    if (countryCode) params.append('country_code', countryCode);
    if (page) params.append('page', page.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return fetchWithAuth<WakaTimeLeaderboard>(`/leaders${queryString}`);
  },

  getDurations: (date: string): Promise<WakaTimeDurationsResponse> =>
    fetchWithAuth<WakaTimeDurationsResponse>(
      `/users/current/durations?date=${date}`,
    ),

  getProgramLanguages: (): Promise<WakaTimeMetadataResponse> =>
    fetchWithAuth<WakaTimeMetadataResponse>('/program_languages'),

  getEditors: (): Promise<WakaTimeMetadataResponse> =>
    fetchWithAuth<WakaTimeMetadataResponse>('/editors'),

  getMachineNames: (): Promise<WakaTimeMachinesResponse> =>
    fetchWithAuth<WakaTimeMachinesResponse>('/users/current/machine_names'),

  getHeartbeats: (date: string): Promise<WakaTimeHeartbeatsResponse> =>
    fetchWithAuth<WakaTimeHeartbeatsResponse>(
      `/users/current/heartbeats?date=${date}`,
    ),

  getAllTimeSinceToday: (): Promise<WakaTimeAllTime> =>
    fetchWithAuth<WakaTimeAllTime>('/users/current/all_time_since_today'),

  getOrganizations: (): Promise<WakaTimeOrganizationsResponse> =>
    fetchWithAuth<WakaTimeOrganizationsResponse>(
      '/users/current/organizations',
    ),

  getOrgStats: (orgId: string, range: string): Promise<WakaTimeStats> =>
    fetchWithAuth<WakaTimeStats>(
      `/users/current/organizations/${orgId}/stats/${range}`,
    ),

  getInsight: <T = unknown>(
    insightType: WakaTimeInsightType,
    range: string,
  ): Promise<WakaTimeInsight<T>> =>
    fetchWithAuth<WakaTimeInsight<T>>(
      `/users/current/insights/${insightType}/${range}`,
    ),

  getProjectCommits: (
    projectName: string,
    page?: number,
    author?: string,
    branch?: string,
  ): Promise<WakaTimeCommitsResponse> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (author) params.append('author', author);
    if (branch) params.append('branch', branch);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return fetchWithAuth<WakaTimeCommitsResponse>(
      `/users/current/projects/${encodeURIComponent(projectName)}/commits${queryString}`,
    );
  },
};
