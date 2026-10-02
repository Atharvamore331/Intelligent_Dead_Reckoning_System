import { create } from 'zustand';
import type { Vehicle } from '../types';
import { mockVehicles } from '../data/mockVehicles';
import { storageService } from '../services/storageService';

export type { Vehicle };

interface VehicleState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  fetchVehicles: () => void;
  getVehicle: (id: string) => Vehicle | undefined;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
}

const saved = storageService.getVehicles();
const initialList: Vehicle[] = saved && saved.length > 0 ? saved : mockVehicles;

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: initialList,
  isLoading: false,
  error: null,

  fetchVehicles: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({ isLoading: false });
    }, 200);
  },

  getVehicle: (id: string) => get().vehicles.find((v) => v.id.toLowerCase() === id.toLowerCase()),

  addVehicle: (newVehicle: Vehicle) => {
    const updated = [newVehicle, ...get().vehicles];
    set({ vehicles: updated });
    storageService.setVehicles(updated);
  },

  updateVehicle: (id: string, updates: Partial<Vehicle>) => {
    const updated = get().vehicles.map((v) =>
      v.id.toLowerCase() === id.toLowerCase() ? { ...v, ...updates, lastUpdate: 'Just now' } : v
    );
    set({ vehicles: updated });
    storageService.setVehicles(updated);
  },

  deleteVehicle: (id: string) => {
    const updated = get().vehicles.filter((v) => v.id.toLowerCase() !== id.toLowerCase());
    set({ vehicles: updated });
    storageService.setVehicles(updated);
  },
}));
