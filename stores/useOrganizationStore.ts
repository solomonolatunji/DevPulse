import { WakaTimeOrganization } from '@/interfaces/organization';
import { wakaService } from '@/services/waka.service';
import { asyncStorage } from '@/utilities/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OrganizationState {
  organizations: WakaTimeOrganization[];
  selectedOrganization: WakaTimeOrganization | null;
  isLoading: boolean;
  error: string | null;

  fetchOrganizations: () => Promise<void>;
  selectOrganization: (org: WakaTimeOrganization | null) => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set, get) => ({
      organizations: [],
      selectedOrganization: null,
      isLoading: false,
      error: null,

      fetchOrganizations: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await wakaService.getOrganizations();
          set({
            organizations: response.data,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
        }
      },

      selectOrganization: (org) => {
        set({ selectedOrganization: org });
      },
    }),
    {
      name: 'organization-storage',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
