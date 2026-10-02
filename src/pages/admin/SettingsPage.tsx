import { useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { routes } from '../../data/routes';
import { useToastStore } from '../../store/toastStore';

export default function SettingsPage() {
  const {
    simulationRunning,
    simulationPaused,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    simulationSpeed,
    setSimulationSpeed,
    gnssAvailable,
    toggleGnss,
    selectedRouteId,
    setRoute,
  } = useSimulationStore();

  const [logLevel, setLogLevel] = useState('info');
  const { addToast } = useToastStore();

  const handleResetDemoData = () => {
    resetSimulation();
    localStorage.clear();
    addToast({ message: 'Demo data and localStorage reset successfully.', type: 'warning', icon: 'restart_alt' });
  };

  const handleApplyConfig = () => {
    addToast({ message: `System configuration updated (Logging: ${logLevel.toUpperCase()}).`, type: 'success' });
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface">Configuration & Controls</h1>
        <p className="text-mono-data text-on-surface-variant uppercase tracking-wider">
          Manage Prototype Simulation Parameters & Global System State
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prototype Controls Section */}
        <section className="glass-card border border-tertiary/40 rounded-xl p-card_padding space-y-5 bg-surface-container">
          <div className="border-b border-outline-variant/60 pb-3 flex items-center gap-2 text-tertiary">
            <span className="material-symbols-outlined">tune</span>
            <h2 className="text-headline-md font-bold">Prototype Simulation Controls</h2>
          </div>

          {/* Start / Pause / Reset Buttons */}
          <div className="space-y-2">
            <label className="text-label-caps text-on-surface-variant">SIMULATION STATE</label>
            <div className="flex gap-3">
              {!simulationRunning ? (
                <button
                  onClick={startSimulation}
                  className="flex-1 py-3 bg-secondary text-on-secondary font-bold rounded-lg hover:opacity-90 transition-all flex justify-center items-center gap-2 shadow"
                >
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span> Start Simulation
                </button>
              ) : (
                <button
                  onClick={pauseSimulation}
                  className="flex-1 py-3 bg-tertiary-container text-on-tertiary-container font-bold rounded-lg hover:opacity-90 transition-all flex justify-center items-center gap-2 shadow"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {simulationPaused ? 'play_arrow' : 'pause'}
                  </span>
                  {simulationPaused ? 'Resume Simulation' : 'Pause Simulation'}
                </button>
              )}
              <button
                onClick={resetSimulation}
                className="px-4 py-3 bg-surface-container-high border border-outline-variant text-on-surface hover:bg-surface-bright rounded-lg font-bold transition-all flex justify-center items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span> Reset
              </button>
            </div>
          </div>

          {/* Simulation Speed Multiplier */}
          <div className="space-y-2">
            <label className="text-label-caps text-on-surface-variant">VEHICLE PROPAGATION SPEED</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 5, 10].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSimulationSpeed(speed)}
                  className={`py-2 rounded-lg text-mono-data font-bold transition-all ${
                    simulationSpeed === speed
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-bright'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Active Route Selection */}
          <div className="space-y-2">
            <label className="text-label-caps text-on-surface-variant">ACTIVE ROAD SCENARIO</label>
            <select
              value={selectedRouteId}
              onChange={(e) => setRoute(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant p-3 rounded-lg text-on-surface font-mono text-xs focus:border-primary focus:outline-none"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} - ({r.totalDistance} km)
                </option>
              ))}
            </select>
          </div>

          {/* GNSS Simulation Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-lg border border-outline-variant/60">
            <div>
              <span className="block text-body-md font-bold text-on-surface">GNSS Signal Injector</span>
              <span className="block text-xs text-on-surface-variant mt-0.5">Toggle satellite loss to trigger AI Dead Reckoning</span>
            </div>
            <button
              onClick={toggleGnss}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                gnssAvailable ? 'bg-secondary' : 'bg-error'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  gnssAvailable ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-3 border-t border-outline-variant/60">
            <button
              onClick={handleResetDemoData}
              className="w-full py-3 bg-transparent border border-error text-error hover:bg-error-container/20 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors text-body-md"
            >
              <span className="material-symbols-outlined text-[20px]">delete_forever</span>
              Reset Demo Data & Clear Persistence
            </button>
          </div>
        </section>

        {/* System Settings Section */}
        <section className="glass-card border border-secondary/30 rounded-xl p-card_padding space-y-5 bg-surface-container">
          <div className="border-b border-outline-variant/60 pb-3 flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined">memory_alt</span>
            <h2 className="text-headline-md font-bold">System Configuration</h2>
          </div>

          {/* AI Model Status */}
          <div className="space-y-3">
            <span className="text-label-caps text-on-surface-variant">AI PREDICTION MODEL</span>
            <div className="p-3.5 bg-surface-container-lowest rounded-lg border border-outline-variant/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-mono text-xs font-bold text-on-surface">DR_Engine_v2.4.1_stable</span>
              </div>
              <span className="text-xs font-mono font-bold text-secondary bg-secondary-container/20 px-2 py-0.5 rounded border border-secondary/30">
                ONLINE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface-container-lowest border border-outline-variant/40 rounded-lg">
                <span className="text-label-caps text-on-surface-variant block mb-1">INFERENCE LATENCY</span>
                <span className="font-mono text-body-md font-bold text-on-surface">12.4 ms</span>
              </div>
              <div className="p-3 bg-surface-container-lowest border border-outline-variant/40 rounded-lg">
                <span className="text-label-caps text-on-surface-variant block mb-1">SENSOR FUSION RATE</span>
                <span className="font-mono text-body-md font-bold text-on-surface">100 Hz</span>
              </div>
            </div>
          </div>

          {/* Telemetry Logging */}
          <div className="space-y-2">
            <label className="text-label-caps text-on-surface-variant">TELEMETRY LOGGING LEVEL</label>
            <select
              value={logLevel}
              onChange={(e) => setLogLevel(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant p-3 rounded-lg text-on-surface font-mono text-xs focus:border-primary focus:outline-none"
            >
              <option value="info">INFO (Standard telemetry)</option>
              <option value="debug">DEBUG (Verbose sensor dump)</option>
              <option value="warn">WARN (Outages & warnings only)</option>
              <option value="error">ERROR (Critical system faults)</option>
            </select>
          </div>

          {/* Apply Button */}
          <div className="pt-6 border-t border-outline-variant/60 mt-auto">
            <button
              onClick={handleApplyConfig}
              className="w-full py-3.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container transition-all shadow flex items-center justify-center gap-2 text-body-md"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              Apply System Configurations
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
