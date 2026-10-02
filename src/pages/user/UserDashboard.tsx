import { useNavigate } from 'react-router-dom';
import { useSimulationStore } from '../../store/simulationStore';
import { formatTime } from '../../services/simulationEngine';
import { routes } from '../../data/routes';

export default function UserDashboard() {
  const navigate = useNavigate();
  const {
    simulationRunning,
    simulationPaused,
    vehicleSpeed,
    distanceCovered,
    distanceRemaining,
    tripElapsedTime,
    eta,
    gnssAvailable,
    navigationMode,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    selectedRouteId,
  } = useSimulationStore();

  const isGnssActive = gnssAvailable;
  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const totalDistance = distanceCovered + distanceRemaining;
  const progressPercent = totalDistance > 0 ? Math.min(100, (distanceCovered / totalDistance) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-surface-container/60 p-4 rounded-xl border border-outline-variant/60">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Vehicle Telemetry Dashboard</h1>
          <p className="text-mono-data text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">
            Active Unit: V-102 • Route: {activeRoute.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/user/navigation')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary font-bold rounded-lg shadow hover:bg-primary-container transition-all text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">map</span>
            Open Live Map
          </button>
        </div>
      </div>

      {/* Grid of Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Vehicle ID & Status */}
        <div className="hud-card rounded-xl p-4 flex flex-col gap-3 shadow-md">
          <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
            <span className="text-label-caps text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">directions_car</span>
              VEHICLE IDENTIFIER
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-secondary bg-secondary/10 border border-secondary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5 animate-pulse" />
              ONLINE
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-headline-lg font-bold text-on-surface font-mono">V-102</span>
              <span className="text-xs text-on-surface-variant block mt-0.5">Primary Fleet Transponder</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-on-surface-variant block font-mono">DRIVER</span>
              <span className="text-sm font-semibold text-on-surface">Atharva More</span>
            </div>
          </div>
        </div>

        {/* Card 2: Navigation Mode */}
        <div className="hud-card rounded-xl p-4 flex flex-col gap-3 shadow-md">
          <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
            <span className="text-label-caps text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">explore</span>
              NAVIGATION SUBSYSTEM
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                isGnssActive
                  ? 'bg-secondary-container/20 text-secondary border-secondary/30'
                  : 'bg-error-container/30 text-error border-error/30'
              }`}
            >
              {isGnssActive ? 'ACTIVE' : 'OUTAGE'}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className={`w-3.5 h-3.5 rounded-full ${isGnssActive ? 'bg-secondary animate-pulse-glow' : 'bg-error animate-pulse'}`} />
            <div>
              <span className="text-headline-md font-bold text-on-surface block">
                {navigationMode === 'gnss_ins' ? 'GNSS + INS' : 'AI Dead Reckoning'}
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                {isGnssActive ? 'Full Satellite Lock (14 SATS)' : 'Inertial Fusion & Map Snap Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Current Speed */}
        <div className="hud-card rounded-xl p-4 flex flex-col gap-3 shadow-md">
          <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
            <span className="text-label-caps text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-tertiary">speed</span>
              TELEMETRY SPEED
            </span>
            <span className="text-xs font-mono text-tertiary font-bold">
              {vehicleSpeed > 5 ? 'CRUISING' : vehicleSpeed > 0 ? 'ACCELERATING' : 'IDLE'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 pt-1 hud-value">
            <span className="text-display-nav font-bold text-on-surface">{Math.round(vehicleSpeed)}</span>
            <span className="text-mono-data font-bold text-on-surface-variant">km/h</span>
          </div>

          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary transition-all duration-300"
              style={{ width: `${Math.min((vehicleSpeed / 100) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Card 4: Distance Stats */}
        <div className="hud-card rounded-xl p-4 flex flex-col gap-3 shadow-md">
          <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
            <span className="text-label-caps text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">route</span>
              ROUTE PROGRESS
            </span>
            <span className="text-xs font-mono text-primary font-bold">{progressPercent.toFixed(0)}%</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-[10px] text-on-surface-variant font-mono block">COVERED</span>
              <span className="text-headline-md font-bold text-on-surface">{distanceCovered.toFixed(1)}</span>
              <span className="text-xs text-on-surface-variant ml-1 font-mono">km</span>
            </div>
            <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-[10px] text-on-surface-variant font-mono block">REMAINING</span>
              <span className="text-headline-md font-bold text-on-surface">{distanceRemaining.toFixed(1)}</span>
              <span className="text-xs text-on-surface-variant ml-1 font-mono">km</span>
            </div>
          </div>
        </div>

        {/* Card 5: Timing & ETA */}
        <div className="hud-card rounded-xl p-4 flex flex-col gap-3 shadow-md">
          <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
            <span className="text-label-caps text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-tertiary">schedule</span>
              TIME & ESTIMATION
            </span>
            <span className="text-xs font-mono text-on-surface-variant">UTC LIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-[10px] text-on-surface-variant font-mono block">ELAPSED TIME</span>
              <span className="text-headline-md font-bold text-on-surface">{formatTime(tripElapsedTime)}</span>
            </div>
            <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
              <span className="text-[10px] text-on-surface-variant font-mono block">ESTIMATED ETA</span>
              <span className="text-headline-md font-bold text-primary">{Math.round(eta)}</span>
              <span className="text-xs text-on-surface-variant ml-1 font-mono">min</span>
            </div>
          </div>
        </div>

        {/* Card 6: Simulation Control Actions */}
        <div className="hud-card rounded-xl p-4 flex flex-col justify-between gap-3 shadow-md border-primary/40 bg-surface-container">
          <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
            <span className="text-label-caps text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              SIMULATION CONTROL
            </span>
            <span className="text-xs font-mono text-on-surface-variant">
              {simulationRunning ? (simulationPaused ? 'PAUSED' : 'RUNNING') : 'STOPPED'}
            </span>
          </div>

          {!simulationRunning ? (
            <button
              onClick={startSimulation}
              className="w-full h-11 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-lg transition-all shadow flex items-center justify-center gap-2 text-headline-md"
            >
              <span className="material-symbols-outlined">play_arrow</span>
              START SIMULATION
            </button>
          ) : (
            <div className="flex gap-2 w-full">
              <button
                onClick={pauseSimulation}
                className="flex-1 h-11 bg-tertiary-container hover:opacity-90 text-on-tertiary-container font-bold rounded-lg transition-all flex items-center justify-center gap-1 text-mono-data text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {simulationPaused ? 'play_arrow' : 'pause'}
                </span>
                {simulationPaused ? 'RESUME' : 'PAUSE'}
              </button>
              <button
                onClick={resetSimulation}
                className="px-3 h-11 bg-surface-container-high hover:bg-surface-bright text-on-surface border border-outline-variant rounded-lg font-bold transition-all flex items-center justify-center text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Navigation Preview Card */}
      <div className="hud-card rounded-xl p-card_padding relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] bg-map-bg border border-outline-variant">
        <div className="absolute inset-0 bg-surface-lowest/40 pointer-events-none" />
        <div className="relative z-10 text-center flex flex-col items-center gap-3 py-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-lg">
            <span className="material-symbols-outlined text-3xl">navigation</span>
          </div>
          <div>
            <h3 className="text-headline-md font-bold text-on-surface">Interactive Navigation View</h3>
            <p className="text-mono-data text-xs text-on-surface-variant mt-1 max-w-md">
              Full-screen dark map with vehicle trajectory, real-time heading rotation, GNSS outage toggle & map matching.
            </p>
          </div>
          <button
            onClick={() => navigate('/user/navigation')}
            className="mt-1 px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg shadow-lg hover:bg-primary-container transition-all flex items-center gap-2 text-body-md"
          >
            Launch Navigation Screen
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
