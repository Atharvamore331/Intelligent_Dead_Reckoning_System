import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  defaultSimulationSpeed: number;
  loggingLevel: 'debug' | 'info' | 'warn' | 'error';
  enableNotifications: boolean;
  theme: 'dark' | 'light';
  updateSettings: (settings: Partial<Omit<SettingsState, 'updateSettings'>>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultSimulationSpeed: 1,
      loggingLevel: 'info',
      enableNotifications: true,
      theme: 'dark',
      updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings }))
    }),
    {
      name: 'intellidr_settings',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
