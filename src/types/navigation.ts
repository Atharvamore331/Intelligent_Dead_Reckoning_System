export type NavigationMode = 'gnss_ins' | 'ai_dead_reckoning' | 'gnss_restoring';
export type GnssStatus = 'available' | 'denied' | 'restoring' | 'degraded';
export type DrState = 'inactive' | 'active' | 'restoring';
export type MotionState = 'stationary' | 'accelerating' | 'cruising' | 'decelerating' | 'turning';

export interface Position {
  lat: number;
  lng: number;
}

export interface RouteCoordinate extends Position {
  roadName?: string;
}

export interface RoadSegment {
  start: Position;
  end: Position;
  roadName?: string;
  bearing: number;
  length: number;
}

export interface RouteData {
  id: string;
  name: string;
  description: string;
  coordinates: RouteCoordinate[];
  totalDistance: number; // km
}
