import { asyncStorage } from '@/utilities/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LeaderboardState {
  selectedCountry: string | undefined;
  setSelectedCountry: (country: string | undefined) => void;
  boardType: 'time' | 'ai';
  setBoardType: (type: 'time' | 'ai') => void;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set) => ({
      selectedCountry: undefined,
      setSelectedCountry: (country) => {
        set({ selectedCountry: country });
      },
      boardType: 'time',
      setBoardType: (type) => {
        set({ boardType: type });
      },
    }),
    {
      name: 'leaderboard-storage',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
