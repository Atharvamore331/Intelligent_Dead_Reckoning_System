import { useSimulationStore } from '../../store/simulationStore';

export default function NavigationMonitoring() {
  const {
    gnssAvailable,
    drActive,
    rawDrError,
    correctedDrError,
    vehicleSpeed,
    vehicleHeading,
    vehiclePosition,
    gnssRestorationPhase,
  } = useSimulationStore();

  const isGNSSActive = gnssAvailable;
  const isDROnly = drActive || !gnssAvailable;

  return (
    <div className="p-4 md:p-6 w-full h-full overflow-y-auto font-sans">
      <div className="mb-6">
        <h1 className="text-headline-lg font-bold text-on-surface">Navigation Engine Monitor</h1>
        <p className="text-mono-data text-on-surface-variant uppercase tracking-wider">
          Real-time GNSS Array, Dead Reckoning & AI Map Matching Telemetry
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* GNSS Array */}
        <div className="glass-card bg-surface-container border border-outline-variant rounded-xl p-5 flex flex-col gap-5">
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/60">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">satellite_alt</span>
              <h2 className="text-headline-md font-bold text-on-surface">GNSS Array</h2>
            </div>
            <span className={`status-dot ${isGNSSActive ? 'status-green' : 'status-red'}`} />
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <div className="flex justify-between items-center bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
              <span className="text-label-caps text-on-surface-variant">CEP ACCURACY</span>
              <span className={`text-headline-md font-mono font-bold ${isGNSSActive ? 'text-secondary' : 'text-error'}`}>
                {isGNSSActive ? '0.8 m' : 'DENIED'}
              </span>
            </div>

            <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-label-caps text-on-surface-variant">SATELLITE LOCK</span>
                <span className="text-mono-data font-bold text-on-surface">{isGNSSActive ? '14 / 24' : '0 / 24'}</span>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className={`h-full ${isGNSSActive ? 'bg-secondary' : 'bg-error'} transition-all duration-500`}
                  style={{ width: isGNSSActive ? '58%' : '0%' }}
                />
              </div>
            </div>

            <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 mt-auto font-mono text-xs">
              <span className="text-label-caps text-on-surface-variant block mb-1">LAST VALID FIX</span>
              <div className="text-on-surface">
                {vehiclePosition.lat.toFixed(6)}° N, {vehiclePosition.lng.toFixed(6)}° E
              </div>
              <div className="text-on-surface-variant text-[10px] mt-1">Status: {gnssRestorationPhase !== 'none' ? gnssRestorationPhase.toUpperCase() : isGNSSActive ? 'NORMAL' : 'OUTAGE'}</div>
            </div>
          </div>
        </div>

        {/* Dead Reckoning */}
        <div
          className={`glass-card bg-surface-container border rounded-xl p-5 flex flex-col gap-5 ${
            isDROnly ? 'border-tertiary shadow-[0_0_15px_rgba(255,183,134,0.15)]' : 'border-outline-variant'
          }`}
        >
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/60">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary text-2xl">speed</span>
              <h2 className="text-headline-md font-bold text-on-surface">Dead Reckoning (AI)</h2>
            </div>
            <span className={`status-dot ${isDROnly ? 'status-amber animate-pulse' : 'status-green'}`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
              <span className="text-label-caps text-on-surface-variant">EST SPEED</span>
              <div className="text-headline-md font-mono font-bold text-on-surface mt-1">
                {vehicleSpeed.toFixed(1)} <span className="text-xs text-on-surface-variant font-normal">km/h</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
              <span className="text-label-caps text-on-surface-variant">HEADING</span>
              <div className="text-headline-md font-mono font-bold text-on-surface mt-1">
                {Math.round(vehicleHeading)}°
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 border-l-4 border-l-tertiary">
            <span className="text-label-caps text-tertiary block mb-1">ACCUMULATED DRIFT ERROR</span>
            <div className="text-headline-lg font-mono font-bold text-tertiary">
              {rawDrError.toFixed(2)} <span className="text-sm font-normal text-on-surface-variant">meters</span>
            </div>
          </div>

          <div className="mt-auto">
            <span className="text-label-caps text-on-surface-variant block mb-2">ACTIVE SENSOR FUSION</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-primary/15 border border-primary/30 text-primary text-xs font-mono font-bold rounded">
                GYRO 3D
              </span>
              <span className="px-2.5 py-1 bg-primary/15 border border-primary/30 text-primary text-xs font-mono font-bold rounded">
                ACCEL 3D
              </span>
              <span className="px-2.5 py-1 bg-surface-container-highest text-on-surface-variant/50 text-xs font-mono rounded line-through">
                WHEEL TICK
              </span>
            </div>
          </div>
        </div>

        {/* AI Map Matching */}
        <div className="glass-card bg-surface-container border border-outline-variant rounded-xl p-5 flex flex-col gap-5">
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/60">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-2xl">route</span>
              <h2 className="text-headline-md font-bold text-on-surface">Map Matching AI</h2>
            </div>
            <span className="status-dot status-green" />
          </div>

          <div className="flex justify-between items-center bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
            <span className="text-label-caps text-on-surface-variant">INFERENCE LATENCY</span>
            <span className="text-headline-md font-mono font-bold text-secondary">12.4 ms</span>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 space-y-2">
            <span className="text-label-caps text-on-surface-variant block mb-1">PROBABILITY MATRIX</span>
            <div className="flex justify-between items-center p-2 bg-secondary-container/20 border border-secondary/30 rounded font-mono text-xs">
              <span className="text-on-surface font-semibold">Rajpath / Kartavya Path</span>
              <span className="text-secondary font-bold">98.2%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-surface-container-high/60 rounded font-mono text-xs text-on-surface-variant">
              <span>Janpath Intersection</span>
              <span>1.5%</span>
            </div>
          </div>

          <div className="mt-auto bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
            <span className="text-label-caps text-on-surface-variant block mb-1">CORRECTED DR ERROR</span>
            <div className="text-headline-md font-mono font-bold text-primary">
              {correctedDrError.toFixed(2)} <span className="text-xs text-on-surface-variant font-normal">meters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
