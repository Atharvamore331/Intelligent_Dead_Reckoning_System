import { useSimulationStore } from '../../store/simulationStore';
import { formatTime } from '../../services/simulationEngine';
import { routes } from '../../data/routes';

export default function TripDetails() {
  const {
    distanceCovered,
    distanceRemaining,
    averageSpeed,
    maxSpeed,
    eta,
    tripElapsedTime,
    gnssOutageDuration,
    drDistance,
    navigationMode,
    selectedRouteId,
  } = useSimulationStore();

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const totalDistance = distanceCovered + distanceRemaining;
  const progressPercent = totalDistance > 0 ? Math.min(100, (distanceCovered / totalDistance) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface">Trip Details</h1>
        <p className="text-mono-data text-on-surface-variant uppercase tracking-wider">
          Telemetry & Path Summary • Trip ID: TRP- Delhi-2026
        </p>
      </div>

      {/* Hero Route Card */}
      <section className="hud-card rounded-xl p-card_padding flex flex-col gap-4 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center border-b border-outline-variant/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-secondary shadow-[0_0_8px_#4edea3]" />
            <h2 className="text-headline-md font-bold text-on-surface">In Progress</h2>
          </div>
          <div className="bg-secondary-container/20 text-secondary px-3 py-1 rounded-full text-label-caps border border-secondary/30">
            {navigationMode === 'gnss_ins' ? 'NORMAL NAVIGATION' : 'DEAD RECKONING ACTIVE'}
          </div>
        </div>

        {/* Route Line Visualization */}
        <div className="grid grid-cols-[32px_1fr] gap-x-3 gap-y-1 relative my-2">
          <div className="absolute left-[15px] top-[24px] bottom-[24px] w-[2px] bg-outline-variant z-0" />

          {/* Start */}
          <div className="flex justify-center items-center h-8 z-10">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-primary bg-background" />
          </div>
          <div className="flex flex-col justify-center h-8">
            <span className="text-label-caps text-on-surface-variant">ORIGIN</span>
            <span className="text-body-lg font-semibold text-on-surface">{activeRoute.coordinates[0]?.roadName || 'India Gate, New Delhi'}</span>
          </div>

          <div className="col-span-2 h-2" />

          {/* Destination */}
          <div className="flex justify-center items-center h-8 z-10">
            <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              location_on
            </span>
          </div>
          <div className="flex flex-col justify-center h-8">
            <span className="text-label-caps text-on-surface-variant">DESTINATION</span>
            <span className="text-body-lg font-semibold text-on-surface">
              {activeRoute.coordinates[activeRoute.coordinates.length - 1]?.roadName || 'SIH Hub'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-on-surface-variant font-mono">
            <span>{distanceCovered.toFixed(1)} km completed</span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </section>

      {/* Telemetry Bento Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="hud-card rounded-xl p-card_padding flex flex-col justify-between min-h-[110px]">
          <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">timer</span> TIME ELAPSED
          </span>
          <div className="mt-2">
            <span className="text-headline-lg font-bold text-on-surface">{formatTime(tripElapsedTime)}</span>
          </div>
        </div>

        <div className="hud-card rounded-xl p-card_padding flex flex-col justify-between min-h-[110px]">
          <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">schedule</span> ETA
          </span>
          <div className="mt-2">
            <span className="text-headline-lg font-bold text-primary">{Math.round(eta)}</span>
            <span className="text-xs text-on-surface-variant ml-1 font-mono">min remaining</span>
          </div>
        </div>

        <div className="hud-card rounded-xl p-card_padding flex flex-col justify-between min-h-[110px]">
          <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">speed</span> AVG SPEED
          </span>
          <div className="mt-2">
            <span className="text-headline-lg font-bold text-on-surface">{averageSpeed.toFixed(0)}</span>
            <span className="text-xs text-on-surface-variant ml-1 font-mono">km/h</span>
          </div>
        </div>

        <div className="hud-card rounded-xl p-card_padding flex flex-col justify-between min-h-[110px]">
          <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">bolt</span> MAX SPEED
          </span>
          <div className="mt-2">
            <span className="text-headline-lg font-bold text-on-surface">{maxSpeed.toFixed(0)}</span>
            <span className="text-xs text-on-surface-variant ml-1 font-mono">km/h</span>
          </div>
        </div>
      </section>

      {/* GNSS Outage Diagnostics Cards */}
      <section className="space-y-3">
        <h3 className="text-label-caps text-on-surface-variant uppercase tracking-wider pl-1">Signal Diagnostics</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="hud-card rounded-xl p-card_padding flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-error-container/30 border border-error/30 flex items-center justify-center text-error">
              <span className="material-symbols-outlined">satellite_alt</span>
            </div>
            <div className="flex-1">
              <p className="text-body-md font-semibold text-on-surface">GNSS Outage Duration</p>
              <p className="text-mono-data text-on-surface-variant">Total time without satellite fix</p>
            </div>
            <div className="text-headline-md font-bold text-error">{formatTime(gnssOutageDuration)}</div>
          </div>

          <div className="hud-card rounded-xl p-card_padding flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container/30 border border-secondary/30 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">settings_backup_restore</span>
            </div>
            <div className="flex-1">
              <p className="text-body-md font-semibold text-on-surface">DR Nav Distance</p>
              <p className="text-mono-data text-on-surface-variant">Distance navigated under AI DR</p>
            </div>
            <div className="text-headline-md font-bold text-secondary">{drDistance.toFixed(2)} km</div>
          </div>
        </div>
      </section>
    </div>
  );
}
