export type EventType = 
  | 'GNSS_LOST' | 'GNSS_RESTORED' | 'GNSS_DEGRADED'
  | 'DR_STARTED' | 'DR_STOPPED'
  | 'HIGH_DRIFT' | 'DRIFT_CORRECTED'
  | 'REFUSION_STARTED' | 'REFUSION_COMPLETED'
  | 'TRIP_STARTED' | 'TRIP_PAUSED' | 'TRIP_COMPLETED'
  | 'VEHICLE_ONLINE' | 'VEHICLE_OFFLINE'
  | 'SENSOR_UNAVAILABLE' | 'SENSOR_RESTORED'
  | 'SYSTEM_WARNING' | 'SYSTEM_ERROR';

export type EventSeverity = 'info' | 'warning' | 'error' | 'critical' | 'success';

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
