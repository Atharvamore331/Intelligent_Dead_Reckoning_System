import type { NavigationMode } from './navigation';

export interface SensorData {
  accelerometer: { x: number; y: number; z: number };
  gyroscope: { x: number; y: number; z: number };
  timestamp: number;
}

export interface TripData {
  id: string;
  vehicleId: string;
  startLocation: string;
  destination: string;
  startTime: number;
  elapsedTime: number;
  distanceCovered: number;
  distanceRemaining: number;
  averageSpeed: number;
  maxSpeed: number;
  eta: number;
  gnssOutageDuration: number;
  drDistance: number;
  navigationMode: NavigationMode;
}

export interface PerformanceMetrics {
  gnssOutageDuration: number;
  distanceDuringOutage: number;
  rawDrError: number;
  correctedDrError: number;
  driftReduction: number;
  positionUpdateRate: number;
  navigationAvailability: number;
}

export interface SimulationConfig {
  speed: number;
  routeId: string;
  gnssEnabled: boolean;
  mapMatchingEnabled: boolean;
  aiModelEnabled: boolean;
}

export interface SpeedHistoryPoint {
  time: string;
  speed: number;
}

export interface ErrorHistoryPoint {
  time: string;
  rawError: number;
  correctedError: number;
}

export interface SensorHistoryPoint {
  time: string;
  ax: number; ay: number; az: number;
  gx: number; gy: number; gz: number;
}
