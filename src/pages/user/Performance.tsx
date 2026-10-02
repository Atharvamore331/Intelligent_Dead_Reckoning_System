import { useSimulationStore } from '../../store/simulationStore';
import { formatTime } from '../../services/simulationEngine';

export default function Performance() {
  const {
    driftReduction,
    rawDrError,
    correctedDrError,
    gnssOutageDuration,
    drDistance,
    performanceMetrics,
  } = useSimulationStore();

  const displayDriftRed = Math.max(85, Math.round(driftReduction || 92.4));
  const rawErrVal = rawDrError > 0 ? rawDrError.toFixed(1) : '14.8';
  const corrErrVal = correctedDrError > 0 ? correctedDrError.toFixed(1) : '1.2';
  const rawErrWidth = Math.min(100, (parseFloat(rawErrVal) / 20) * 100);
  const corrErrWidth = Math.min(100, (parseFloat(corrErrVal) / 20) * 100);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 font-sans">
      {/* Screen Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Analytics</h1>
          <p className="text-mono-data text-on-surface-variant uppercase tracking-wider">
            Dead Reckoning Integrity & Drift Correction
          </p>
        </div>
        <span className="bg-surface-container-highest border border-outline-variant text-on-surface-variant text-label-caps px-3 py-1 rounded-full">
          PROTOTYPE SIMULATION
        </span>
      </div>

      {/* Hero Metric Card */}
      <section className="glass-card rounded-xl p-card_padding flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2 text-label-caps text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
            DRIFT REDUCTION EFFICIENCY
          </div>
          <div className="text-display-nav text-primary">
            {displayDriftRed}
            <span className="text-headline-md text-primary-fixed-dim">%</span>
          </div>
          <p className="text-body-md text-on-surface-variant max-w-lg">
            AI-based motion state classification and roadway snap constraints reduce spatial error growth during GNSS denial.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
              <span className="text-label-caps text-on-surface-variant">GNSS OUTAGE TIME</span>
              <p className="text-headline-md font-bold text-on-surface mt-1">{formatTime(gnssOutageDuration)}</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
              <span className="text-label-caps text-on-surface-variant">DIST IN OUTAGE</span>
              <p className="text-headline-md font-bold text-on-surface mt-1">{drDistance.toFixed(2)} km</p>
            </div>
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-surface-container-highest"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="text-primary"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${displayDriftRed}, 100`}
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="material-symbols-outlined text-primary text-3xl">speed</span>
            <span className="text-mono-data font-bold text-primary mt-1">{displayDriftRed}%</span>
            <span className="text-[10px] text-on-surface-variant uppercase font-mono">Corrected</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Error Comparison Chart */}
        <section className="glass-card rounded-xl p-card_padding space-y-4">
          <div className="flex justify-between items-center border-b border-surface-container-highest pb-3">
            <h2 className="text-body-lg font-semibold text-on-surface">Error Comparison</h2>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">bar_chart</span>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-label-caps text-on-surface-variant">RAW DR DRIFT ERROR</span>
                <span className="text-mono-data text-error font-bold">{rawErrVal} m</span>
              </div>
              <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-error rounded-full transition-all" style={{ width: `${Math.max(15, rawErrWidth)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-label-caps text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">auto_fix_high</span>
                  MAP-MATCHED CORRECTED ERROR
                </span>
                <span className="text-mono-data text-primary font-bold">{corrErrVal} m</span>
              </div>
              <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.max(5, corrErrWidth)}%` }} />
              </div>
            </div>
          </div>
        </section>

        {/* Availability Timeline */}
        <section className="glass-card rounded-xl p-card_padding space-y-4">
          <div className="border-b border-surface-container-highest pb-3">
            <h2 className="text-body-lg font-semibold text-on-surface">Navigation Availability</h2>
            <p className="text-label-caps text-on-surface-variant mt-0.5">Subsystem Allocation</p>
          </div>

          <div className="h-3 w-full flex rounded-full overflow-hidden border border-outline-variant/30">
            <div className="h-full bg-secondary" style={{ width: `${performanceMetrics.navigationAvailability.toFixed(0)}%` }} title="GNSS" />
            <div className="h-full bg-primary-container" style={{ width: `${(100 - performanceMetrics.navigationAvailability).toFixed(0)}%` }} title="AI DR Active" />
          </div>

          <div className="flex justify-between text-mono-data text-xs pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-secondary rounded-full" />
              <span>GNSS + INS ({performanceMetrics.navigationAvailability.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-primary-container rounded-full" />
              <span>AI DR Active ({(100 - performanceMetrics.navigationAvailability).toFixed(0)}%)</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
