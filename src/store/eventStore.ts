import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { EventSeverity, EventType } from '../types';

export interface AppEvent {
  id: string;
  type: EventType;
  severity: EventSeverity;
  vehicleId?: string;
  title: string;
  description: string;
  timestamp: number;
  acknowledged: boolean;
}

interface EventState {
  events: AppEvent[];
  addEvent: (event: Omit<AppEvent, 'id' | 'timestamp' | 'acknowledged'>) => void;
  acknowledgeEvent: (id: string) => void;
  clearEvents: () => void;
}

const INITIAL_EVENTS: AppEvent[] = [
  {
    id: 'evt-1',
    type: 'GNSS_LOST',
    severity: 'error',
    vehicleId: 'V-102',
    title: 'GNSS SIGNAL LOST',
    description: 'Vehicle V-102 switched to AI Dead Reckoning due to satellite occlusion.',
    timestamp: Date.now() - 120000,
    acknowledged: false,
  },
  {
    id: 'evt-2',
    type: 'DR_STARTED',
    severity: 'warning',
    vehicleId: 'V-102',
    title: 'DEAD RECKONING ACTIVE',
    description: 'Vehicle V-102 continuing navigation via IMU telemetry & map snapping.',
    timestamp: Date.now() - 110000,
    acknowledged: false,
  },
  {
    id: 'evt-3',
    type: 'HIGH_DRIFT',
    severity: 'warning',
    vehicleId: 'V-101',
    title: 'HIGH DRIFT DETECTED',
    description: 'Vehicle V-101 raw DR drift exceeded threshold (14.2m). Map constraint applied.',
    timestamp: Date.now() - 3600000,
    acknowledged: true,
  },
  {
    id: 'evt-4',
    type: 'GNSS_RESTORED',
    severity: 'success',
    vehicleId: 'V-107',
    title: 'GNSS SIGNAL RESTORED',
    description: 'Vehicle V-107 re-fused satellite telemetry successfully.',
    timestamp: Date.now() - 7200000,
    acknowledged: true,
  },
];

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: INITIAL_EVENTS,
      addEvent: (event) => {
        const newEvent: AppEvent = {
          ...event,
          id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          timestamp: Date.now(),
          acknowledged: false,
        };
        set({ events: [newEvent, ...get().events] });
      },
      acknowledgeEvent: (id: string) => {
        set({
          events: get().events.map((e) => (e.id === id ? { ...e, acknowledged: true } : e)),
        });
      },
      clearEvents: () => set({ events: [] }),
    }),
    {
      name: 'intellidr_events_v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
