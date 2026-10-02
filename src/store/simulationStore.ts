import { create } from 'zustand';
import type { Position, NavigationMode, SensorData, SpeedHistoryPoint, ErrorHistoryPoint, SensorHistoryPoint, PerformanceMetrics } from '../types';
import { interpolatePosition, calculateBearing, haversineDistance, generateSensorData, calculateEta, computeRouteDistance } from '../services/simulationEngine';
import { routes } from '../data/routes';

interface SimulationState {
  simulationRunning: boolean;
  simulationPaused: boolean;
  routeIndex: number;
  routeProgress: number;
  vehiclePosition: Position;
  vehicleHeading: number;
  vehicleSpeed: number;
  averageSpeed: number;
  maxSpeed: number;
  distanceCovered: number;
  distanceRemaining: number;
  tripElapsedTime: number;
  eta: number;
  gnssAvailable: boolean;
  navigationMode: NavigationMode;
  drActive: boolean;
  rawDrPosition: Position;
  correctedPosition: Position;
  rawDrError: number;
  correctedDrError: number;
  driftReduction: number;
  sensorData: SensorData;
  gnssOutageDuration: number;
  gnssOutageStart: number | null;
  drDistance: number;
  gnssRestorationPhase: 'none' | 'signal_lost' | 'dr_active' | 'restoring' | 'refusing' | 'synchronized';
  speedHistory: SpeedHistoryPoint[];
  errorHistory: ErrorHistoryPoint[];
  sensorHistory: SensorHistoryPoint[];
  performanceMetrics: PerformanceMetrics;
  simulationSpeed: number;
  selectedRouteId: string;
  driftOffset: { lat: number; lng: number };
  rawDrTrail: Position[];
  correctedDrTrail: Position[];
  lastHistoryPush: number;

  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  toggleGnss: () => void;
  tick: (deltaTime: number) => void;
  setSimulationSpeed: (speed: number) => void;
  setRoute: (routeId: string) => void;
}

const defaultRoute = routes[0];
const defaultPos = defaultRoute.coordinates[0];
const defaultTotalDist = computeRouteDistance(defaultRoute.coordinates);

const initSensor: SensorData = { accelerometer: { x: 0, y: 0, z: -9.81 }, gyroscope: { x: 0, y: 0, z: 0 }, timestamp: Date.now() };
const initMetrics: PerformanceMetrics = { gnssOutageDuration: 0, distanceDuringOutage: 0, rawDrError: 0, correctedDrError: 0, driftReduction: 0, positionUpdateRate: 10, navigationAvailability: 100 };

const initialState = {
  simulationRunning: false,
  simulationPaused: false,
  routeIndex: 0,
  routeProgress: 0,
  vehiclePosition: defaultPos,
  vehicleHeading: 0,
  vehicleSpeed: 0,
  averageSpeed: 0,
  maxSpeed: 0,
  distanceCovered: 0,
  distanceRemaining: defaultTotalDist,
  tripElapsedTime: 0,
  eta: 0,
  gnssAvailable: true,
  navigationMode: 'gnss_ins' as NavigationMode,
  drActive: false,
  rawDrPosition: defaultPos,
  correctedPosition: defaultPos,
  rawDrError: 0,
  correctedDrError: 0,
  driftReduction: 0,
  sensorData: initSensor,
  gnssOutageDuration: 0,
  gnssOutageStart: null as number | null,
  drDistance: 0,
  gnssRestorationPhase: 'none' as const,
  speedHistory: [] as SpeedHistoryPoint[],
  errorHistory: [] as ErrorHistoryPoint[],
  sensorHistory: [] as SensorHistoryPoint[],
  performanceMetrics: initMetrics,
  simulationSpeed: 1,
  selectedRouteId: defaultRoute.id,
  driftOffset: { lat: 0, lng: 0 },
  rawDrTrail: [] as Position[],
  correctedDrTrail: [] as Position[],
  lastHistoryPush: 0,
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  ...initialState,

  startSimulation: () => {
    const route = routes.find(r => r.id === get().selectedRouteId) || defaultRoute;
    const totalDist = computeRouteDistance(route.coordinates);
    set({
      simulationRunning: true,
      simulationPaused: false,
      routeIndex: 0,
      routeProgress: 0,
      vehiclePosition: route.coordinates[0],
      correctedPosition: route.coordinates[0],
      rawDrPosition: route.coordinates[0],
      vehicleHeading: calculateBearing(route.coordinates[0], route.coordinates[1]),
      vehicleSpeed: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      distanceCovered: 0,
      distanceRemaining: totalDist,
      tripElapsedTime: 0,
      eta: 0,
      gnssAvailable: true,
      navigationMode: 'gnss_ins',
      drActive: false,
      rawDrError: 0,
      correctedDrError: 0,
      driftReduction: 0,
      gnssOutageDuration: 0,
      gnssOutageStart: null,
      drDistance: 0,
      gnssRestorationPhase: 'none',
      driftOffset: { lat: 0, lng: 0 },
      rawDrTrail: [],
      correctedDrTrail: [],
      speedHistory: [],
      errorHistory: [],
      sensorHistory: [],
      lastHistoryPush: Date.now(),
    });
  },

  pauseSimulation: () => set(s => ({ simulationPaused: !s.simulationPaused })),

  resetSimulation: () => {
    const route = routes.find(r => r.id === get().selectedRouteId) || defaultRoute;
    const totalDist = computeRouteDistance(route.coordinates);
    set({
      ...initialState,
      selectedRouteId: get().selectedRouteId,
      simulationSpeed: get().simulationSpeed,
      distanceRemaining: totalDist,
      vehiclePosition: route.coordinates[0],
      correctedPosition: route.coordinates[0],
      rawDrPosition: route.coordinates[0],
    });
  },

  toggleGnss: () => {
    const s = get();
    if (s.gnssAvailable) {
      set({ gnssAvailable: false, gnssRestorationPhase: 'signal_lost' });
      setTimeout(() => {
        set({
          gnssRestorationPhase: 'dr_active',
          navigationMode: 'ai_dead_reckoning',
          drActive: true,
          gnssOutageStart: Date.now(),
          driftOffset: { lat: 0, lng: 0 },
          rawDrTrail: [],
          correctedDrTrail: [],
        });
      }, 500);
    } else {
      set({ gnssRestorationPhase: 'restoring' });
      setTimeout(() => {
        set({ gnssRestorationPhase: 'refusing' });
        setTimeout(() => {
          set({ gnssRestorationPhase: 'synchronized' });
          setTimeout(() => {
            const cur = get();
            set({
              gnssAvailable: true,
              navigationMode: 'gnss_ins',
              drActive: false,
              gnssRestorationPhase: 'none',
              gnssOutageStart: null,
              driftOffset: { lat: 0, lng: 0 },
              rawDrError: 0,
              correctedDrError: 0,
              performanceMetrics: {
                ...cur.performanceMetrics,
                gnssOutageDuration: cur.gnssOutageDuration,
                distanceDuringOutage: cur.drDistance,
                rawDrError: cur.rawDrError,
                correctedDrError: cur.correctedDrError,
                driftReduction: cur.driftReduction,
              },
            });
          }, 1000);
        }, 1500);
      }, 1000);
    }
  },

  tick: (deltaTime: number) => {
    const s = get();
    if (!s.simulationRunning || s.simulationPaused) return;

    const route = routes.find(r => r.id === s.selectedRouteId) || defaultRoute;
    const coords = route.coordinates;
    const dtSec = (deltaTime / 1000) * s.simulationSpeed;

    // Smooth speed: sine wave + small noise, range 45-70
    const t = Date.now() / 1000;
    const target = 57 + Math.sin(t * 0.15) * 12 + Math.sin(t * 0.4) * 3;
    const newSpeed = s.vehicleSpeed + (target - s.vehicleSpeed) * Math.min(dtSec * 2, 0.2);

    // Distance increment in km
    const distInc = (newSpeed * dtSec) / 3600;

    // Convert distance to progress along segments
    let idx = s.routeIndex;
    let prog = s.routeProgress;

    if (idx >= coords.length - 1) {
      set({ simulationRunning: false });
      return;
    }

    const segLen = haversineDistance(coords[idx], coords[idx + 1]) / 1000; // km
    prog += segLen > 0 ? distInc / segLen : 0;

    while (prog >= 1 && idx < coords.length - 2) {
      prog -= 1;
      idx++;
      const nextSegLen = haversineDistance(coords[idx], coords[idx + 1]) / 1000;
      if (nextSegLen > 0) {
        prog = prog * (segLen > 0 ? segLen : 0.001) / nextSegLen;
      }
    }

    if (idx >= coords.length - 1) {
      set({ simulationRunning: false });
      return;
    }

    const pos = interpolatePosition(coords[idx], coords[idx + 1], Math.min(prog, 1));
    const heading = calculateBearing(coords[idx], coords[idx + 1]);
    const covered = s.distanceCovered + distInc;
    const totalDist = computeRouteDistance(coords);
    const remaining = Math.max(0, totalDist - covered);
    const elapsed = s.tripElapsedTime + dtSec;
    const avg = elapsed > 0 ? (covered / (elapsed / 3600)) : 0;
    const eta = calculateEta(remaining, newSpeed);

    // DR drift
    let rawPos = pos;
    let corrPos = pos;
    let rawErr = 0;
    let corrErr = 0;
    let reduction = 0;
    let drift = { ...s.driftOffset };
    let drDist = s.drDistance;
    let outDur = s.gnssOutageDuration;
    let rawTrail = s.rawDrTrail;
    let corrTrail = s.correctedDrTrail;

    if (s.drActive) {
      outDur = s.gnssOutageStart ? (Date.now() - s.gnssOutageStart) / 1000 : 0;
      drDist += distInc;

      // Accumulate drift
      drift.lat += (Math.random() - 0.5) * 0.00003 * dtSec;
      drift.lng += (Math.random() - 0.5) * 0.00003 * dtSec;

      rawPos = { lat: pos.lat + drift.lat, lng: pos.lng + drift.lng };
      corrPos = { lat: pos.lat + (Math.random() - 0.5) * 0.000003, lng: pos.lng + (Math.random() - 0.5) * 0.000003 };

      rawErr = haversineDistance(rawPos, pos);
      corrErr = haversineDistance(corrPos, pos);
      reduction = rawErr > 0 ? Math.min(99, ((rawErr - corrErr) / rawErr) * 100) : 0;

      // Trail for visualization (throttle to every ~200ms worth of ticks)
      if (rawTrail.length === 0 || haversineDistance(rawPos, rawTrail[rawTrail.length - 1]) > 5) {
        rawTrail = [...rawTrail, rawPos];
        corrTrail = [...corrTrail, corrPos];
      }
    }

    const sensor = generateSensorData(newSpeed, heading, dtSec, s.sensorData);

    // Push history every ~2s
    let spdHist = s.speedHistory;
    let errHist = s.errorHistory;
    let senHist = s.sensorHistory;
    let lastPush = s.lastHistoryPush;

    if (Date.now() - lastPush > 2000) {
      const label = new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });
      spdHist = [...spdHist.slice(-30), { time: label, speed: Math.round(newSpeed * 10) / 10 }];
      if (s.drActive) {
        errHist = [...errHist.slice(-30), { time: label, rawError: Math.round(rawErr * 10) / 10, correctedError: Math.round(corrErr * 10) / 10 }];
      }
      senHist = [...senHist.slice(-30), { time: label, ax: +sensor.accelerometer.x.toFixed(3), ay: +sensor.accelerometer.y.toFixed(3), az: +(sensor.accelerometer.z + 9.81).toFixed(3), gx: +sensor.gyroscope.x.toFixed(4), gy: +sensor.gyroscope.y.toFixed(4), gz: +sensor.gyroscope.z.toFixed(4) }];
      lastPush = Date.now();
    }

    set({
      routeIndex: idx,
      routeProgress: prog,
      vehiclePosition: pos,
      vehicleHeading: heading,
      vehicleSpeed: newSpeed,
      averageSpeed: avg,
      maxSpeed: Math.max(s.maxSpeed, newSpeed),
      distanceCovered: covered,
      distanceRemaining: remaining,
      tripElapsedTime: elapsed,
      eta,
      rawDrPosition: rawPos,
      correctedPosition: corrPos,
      rawDrError: rawErr,
      correctedDrError: corrErr,
      driftReduction: reduction,
      driftOffset: drift,
      sensorData: sensor,
      speedHistory: spdHist,
      errorHistory: errHist,
      sensorHistory: senHist,
      lastHistoryPush: lastPush,
      drDistance: drDist,
      gnssOutageDuration: outDur,
      rawDrTrail: rawTrail,
      correctedDrTrail: corrTrail,
      performanceMetrics: {
        gnssOutageDuration: outDur,
        distanceDuringOutage: drDist,
        rawDrError: rawErr,
        correctedDrError: corrErr,
        driftReduction: reduction,
        positionUpdateRate: 10,
        navigationAvailability: covered > 0 ? ((covered - drDist) / covered) * 100 : 100,
      },
    });
  },

  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  setRoute: (routeId) => set({ selectedRouteId: routeId }),
}));
