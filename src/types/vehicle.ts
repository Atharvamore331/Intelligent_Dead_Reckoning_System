import type { Position, NavigationMode, GnssStatus } from './navigation';

export type VehicleStatus = 'active' | 'idle' | 'offline' | 'maintenance';

export interface Vehicle {
  id: string;
  name: string;
  status: VehicleStatus;
  assignedUser?: string;
  assignedUserName?: string;
  position: Position;
  speed: number;
  heading: number;
  gnssStatus: GnssStatus;
  navigationMode: NavigationMode;
  connectionStatus: 'connected' | 'disconnected';
  lastUpdate: string;
  tripId?: string;
}
