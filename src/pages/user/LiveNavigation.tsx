import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { headingToCompass } from '../../services/simulationEngine';
import { routes } from '../../data/routes';

export default function LiveNavigation() {
  const {
    simulationRunning,
    simulationPaused,
    vehiclePosition,
    vehicleHeading,
    vehicleSpeed,
    distanceCovered,
    distanceRemaining,
    eta,
    gnssAvailable,
    navigationMode,
    gnssRestorationPhase,
    drActive,
    startSimulation,
    pauseSimulation,
    toggleGnss,
    tick,
    selectedRouteId,
  } = useSimulationStore();

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const vehicleMarkerRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const rawPolylineRef = useRef<any>(null);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  // Tick loop
  useEffect(() => {
    const loop = (now: number) => {
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      if (dt < 200) {
        tick(dt);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [tick]);

  // Leaflet map initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof window === 'undefined') return;

    let L: any = (window as any).L;

    if (!L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap((window as any).L);
      document.head.appendChild(script);
    } else {
      initMap(L);
    }

    function initMap(LInst: any) {
      if (!mapContainerRef.current || leafletMapRef.current) return;

      const map = LInst.map(mapContainerRef.current, {
        center: [vehiclePosition.lat, vehiclePosition.lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      LInst.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Route Polyline
      const routeCoords = activeRoute.coordinates.map((c) => [c.lat, c.lng]);
      const polyline = LInst.polyline(routeCoords, {
        color: '#3B82F6',
        weight: 6,
        opacity: 0.8,
        lineCap: 'round',
      }).addTo(map);
      routePolylineRef.current = polyline;

      // Raw DR Trajectory line
      const rawPolyline = LInst.polyline([], {
        color: '#EF4444',
        weight: 4,
        dashArray: '6, 8',
        opacity: 0.9,
      }).addTo(map);
      rawPolylineRef.current = rawPolyline;

      // Vehicle Icon
      const carIcon = LInst.divIcon({
        className: 'custom-vehicle-marker',
        html: `
          <div id="veh-icon-inner" style="transform: rotate(${vehicleHeading}deg); transition: transform 0.15s ease-out;">
            <svg width="40" height="40" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 0px 10px rgba(59,130,246,0.8));">
              <path d="M16 2L2 46L16 38L30 46L16 2Z" fill="${drActive ? '#F59E0B' : '#3B82F6'}" stroke="#FFFFFF" stroke-width="2.5" stroke-linejoin="round"/>
              <circle cx="16" cy="24" r="5" fill="#6ffbbe"/>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = LInst.marker([vehiclePosition.lat, vehiclePosition.lng], { icon: carIcon }).addTo(map);
      vehicleMarkerRef.current = marker;
      leafletMapRef.current = map;
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [activeRoute]);

  // Update map marker & pan
  useEffect(() => {
    if (!leafletMapRef.current || !vehicleMarkerRef.current) return;

    const displayPos = vehiclePosition;
    vehicleMarkerRef.current.setLatLng([displayPos.lat, displayPos.lng]);

    // Update rotation
    const inner = document.getElementById('veh-icon-inner');
    if (inner) {
      inner.style.transform = `rotate(${vehicleHeading}deg)`;
    }

    // Auto pan
    if (simulationRunning && !simulationPaused) {
      leafletMapRef.current.panTo([displayPos.lat, displayPos.lng], { animate: true, duration: 0.2 });
    }

    // Update raw DR line
    if (drActive && rawPolylineRef.current) {
      const rawTrail = useSimulationStore.getState().rawDrTrail;
      if (rawTrail.length > 0) {
        rawPolylineRef.current.setLatLngs(rawTrail.map((p) => [p.lat, p.lng]));
      }
    } else if (rawPolylineRef.current) {
      rawPolylineRef.current.setLatLngs([]);
    }
  }, [vehiclePosition, vehicleHeading, drActive, simulationRunning, simulationPaused]);

  const compass = headingToCompass(vehicleHeading);

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-56px)] md:min-h-screen bg-background overflow-hidden font-sans">
      {/* Map Level 0 */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-map-bg" />

      {/* Top HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
        {/* Left Side: GNSS Status & Heading */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          {/* Status Badge */}
          <div
            className={`px-3 py-1.5 rounded-full border backdrop-blur-md shadow-lg flex items-center gap-2 text-label-caps font-bold transition-all ${
              gnssAvailable
                ? 'bg-secondary-container/30 border-secondary/50 text-secondary'
                : 'bg-error-container/40 border-error text-error animate-pulse'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                gnssAvailable ? 'bg-secondary animate-pulse-glow' : 'bg-error'
              }`}
            />
            <span>
              {gnssRestorationPhase !== 'none'
                ? gnssRestorationPhase === 'signal_lost'
                  ? 'SIGNAL LOST'
                  : gnssRestorationPhase === 'restoring'
                  ? 'RE-FUSING DATA...'
                  : gnssRestorationPhase === 'refusing'
                  ? 'REFUSING...'
                  : 'SYNCHRONIZED'
                : navigationMode === 'gnss_ins'
                ? 'GNSS + INS'
                : 'AI DEAD RECKONING'}
            </span>
          </div>

          {/* Heading HUD Card */}
          <div className="hud-card rounded-xl p-3 flex flex-col items-center justify-center w-28 shadow-xl">
            <span className="text-label-caps text-on-surface-variant">HEADING</span>
            <div className="flex items-baseline gap-1 mt-0.5 hud-value">
              <span className="text-headline-lg font-bold text-on-surface">{compass}</span>
              <span className="text-mono-data text-on-surface-variant">{Math.round(vehicleHeading)}°</span>
            </div>
          </div>
        </div>

        {/* Right Side: Simulation & GNSS Controls */}
        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          <div className="flex items-center gap-2">
            {!simulationRunning ? (
              <button
                onClick={startSimulation}
                className="bg-primary hover:bg-primary-container text-on-primary font-mono-data font-bold px-4 py-2 rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                START SIMULATION
              </button>
            ) : (
              <button
                onClick={pauseSimulation}
                className={`font-mono-data font-bold px-4 py-2 rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-1.5 ${
                  simulationPaused
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-tertiary-container text-on-tertiary-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {simulationPaused ? 'play_arrow' : 'pause'}
                </span>
                {simulationPaused ? 'RESUME' : 'PAUSE'}
              </button>
            )}
          </div>

          {/* GNSS Toggle Switch */}
          <button
            onClick={toggleGnss}
            className="hud-card px-4 py-2 rounded-lg flex items-center gap-3 text-mono-data hover:bg-surface-bright active:scale-95 transition-all shadow-lg"
          >
            <span className="text-on-surface font-semibold">GNSS</span>
            <div
              className={`w-10 h-5 rounded-full relative transition-colors ${
                gnssAvailable ? 'bg-secondary' : 'bg-surface-container-highest border border-error'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  gnssAvailable ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Notification Banner when GNSS outage occurs */}
      {!gnssAvailable && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-md w-full px-4">
          <div className="bg-error-container text-on-error-container px-5 py-3 rounded-xl border border-error shadow-2xl flex items-center gap-3 animate-bounce">
            <span className="material-symbols-outlined text-error">warning</span>
            <div className="flex-1">
              <p className="font-bold text-body-md">GNSS Signal Lost - Estimating Position</p>
              <p className="text-xs text-on-error-container/80 font-mono">
                AI Dead Reckoning Active • Map Snapping Enabled
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Telemetry HUD Row */}
      <div className="absolute bottom-20 md:bottom-6 left-4 right-4 z-20 flex flex-col md:flex-row gap-3 items-end pointer-events-none">
        {/* Speed Card */}
        <div className="hud-card rounded-xl p-card_padding w-full md:w-52 flex flex-col justify-between pointer-events-auto relative overflow-hidden shadow-2xl">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container-highest">
            <div
              className="h-full bg-secondary transition-all duration-300"
              style={{ width: `${Math.min((vehicleSpeed / 100) * 100, 100)}%` }}
            />
          </div>
          <span className="text-label-caps text-on-surface-variant">CURRENT SPEED</span>
          <div className="flex items-baseline gap-1 mt-1 hud-value">
            <span className="text-display-nav text-on-surface">{Math.round(vehicleSpeed)}</span>
            <span className="text-mono-data text-on-surface-variant font-bold">km/h</span>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 flex-1 w-full pointer-events-auto">
          <div className="hud-card rounded-xl p-3 flex flex-col justify-center shadow-xl">
            <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span> ETA
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-headline-lg font-bold text-primary">{Math.round(eta)}</span>
              <span className="text-mono-data text-on-surface-variant">min</span>
            </div>
          </div>

          <div className="hud-card rounded-xl p-3 flex flex-col justify-center shadow-xl">
            <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">turn_right</span> REMAINING
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-headline-lg font-bold text-on-surface">{distanceRemaining.toFixed(1)}</span>
              <span className="text-mono-data text-on-surface-variant">km</span>
            </div>
          </div>

          <div className="hud-card rounded-xl p-3 flex flex-col justify-center shadow-xl">
            <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">route</span> COVERED
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-headline-lg font-bold text-on-surface-variant">{distanceCovered.toFixed(1)}</span>
              <span className="text-mono-data text-on-surface-variant">km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
