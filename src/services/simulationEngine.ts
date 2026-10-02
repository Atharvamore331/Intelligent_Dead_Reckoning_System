import type { Position, SensorData } from '../types';

export const interpolatePosition = (p1: Position, p2: Position, t: number): Position => ({
  lat: p1.lat + (p2.lat - p1.lat) * t,
  lng: p1.lng + (p2.lng - p1.lng) * t,
});

export const calculateBearing = (p1: Position, p2: Position): number => {
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const lat1 = (p1.lat * Math.PI) / 180;
  const lat2 = (p2.lat * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
};

export const haversineDistance = (p1: Position, p2: Position): number => {
  const R = 6371e3;
  const φ1 = (p1.lat * Math.PI) / 180;
  const φ2 = (p2.lat * Math.PI) / 180;
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
  const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const generateSensorData = (speed: number, _heading: number, _dt: number, _prev: SensorData): SensorData => {
  const t = Date.now() / 1000;
  const noise = speed > 0 ? 0.5 + speed / 100 : 0.1;
  return {
    accelerometer: {
      x: Math.sin(t * 2) * noise * 0.3 + (Math.random() - 0.5) * noise * 0.2,
      y: (speed > 0 ? speed * 0.01 : 0) + (Math.random() - 0.5) * noise * 0.3,
      z: -9.81 + (Math.random() - 0.5) * noise * 0.1,
    },
    gyroscope: {
      x: (Math.random() - 0.5) * 0.04,
      y: (Math.random() - 0.5) * 0.04,
      z: Math.sin(t) * 0.08 * noise,
    },
    timestamp: Date.now(),
  };
};

export const headingToCompass = (heading: number): string => {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.floor(((heading + 11.25) % 360) / 22.5)];
};

export const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const calculateEta = (distKm: number, speedKmh: number): number => {
  if (speedKmh <= 0) return 999;
  return (distKm / speedKmh) * 60;
};

export const computeRouteDistance = (coords: Position[]): number => {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversineDistance(coords[i - 1], coords[i]);
  }
  return total / 1000;
};
