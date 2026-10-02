import { useNavigate } from 'react-router-dom';
import { useVehicleStore } from '../../store/vehicleStore';
import { useSimulationStore } from '../../store/simulationStore';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { vehicles } = useVehicleStore();
  const { gnssAvailable, drActive, gnssOutageDuration, performanceMetrics } = useSimulationStore();

  const activeVehicles = vehicles.filter((v) => v.status === 'active').length;
  const drCount = drActive ? 1 : 0;
  const gnssAvailableCount = activeVehicles - drCount;
  const activeOutages = drActive ? 1 : 0;
  const systemHealth = Math.round(performanceMetrics.navigationAvailability || 98);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Fleet Overview</h1>
          <p className="text-mono-data text-on-surface-variant uppercase tracking-wider">
            Live Telemetry, System Health & Fleet Monitoring
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/fleet')}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg font-mono-data text-sm hover:bg-primary/20 transition-colors w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">local_shipping</span>
          View Live Fleet Map
        </button>
      </div>

      {/* Bento Grid HUD Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Active Vehicles */}
        <div className="hud-card rounded-xl p-card_padding flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            <span className="text-label-caps">ACTIVE VEHICLES</span>
          </div>
          <div className="mt-2 text-display-nav font-bold text-on-surface">
            {activeVehicles}
          </div>
        </div>

        {/* GNSS Status */}
        <div className="hud-card rounded-xl p-card_padding flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
            <span className="text-label-caps">GNSS STATUS</span>
          </div>
          <div className="mt-2 flex flex-col text-headline-md font-bold">
            <span className="text-secondary">{gnssAvailableCount} <span className="text-mono-data text-xs text-on-surface-variant font-normal">Available</span></span>
            <span className="text-tertiary">{drCount} <span className="text-mono-data text-xs text-on-surface-variant font-normal">DR Only</span></span>
          </div>
        </div>

        {/* Active Outages */}
        <div className="hud-card rounded-xl p-card_padding flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span className="text-label-caps">ACTIVE OUTAGES</span>
          </div>
          <div className="mt-2 text-display-nav font-bold text-error">
            {activeOutages}
          </div>
        </div>

        {/* System Health */}
        <div className="hud-card rounded-xl p-card_padding flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
            <span className="text-label-caps">SYSTEM HEALTH</span>
          </div>
          <div className="mt-2 text-display-nav font-bold text-secondary">
            {systemHealth}%
          </div>
        </div>
      </div>

      {/* Live Fleet Map Preview Card */}
      <div className="hud-card rounded-xl p-card_padding relative overflow-hidden flex flex-col justify-between min-h-[300px] border border-outline-variant bg-map-bg">
        <div className="flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse-glow" />
            <h3 className="text-body-lg font-bold text-on-surface">Global Fleet Map</h3>
          </div>
          <span className="text-mono-data text-xs text-on-surface-variant">
            {vehicles.length} Vehicles Registered • Real-time Sync
          </span>
        </div>

        <div className="z-10 my-auto text-center flex flex-col items-center gap-3 py-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-4xl">my_location</span>
          </div>
          <p className="text-mono-data text-on-surface-variant max-w-md">
            Click on any vehicle marker to view detailed telemetry, current GNSS outage state, or trigger administrative actions.
          </p>
          <button
            onClick={() => navigate('/admin/fleet')}
            className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg shadow-lg hover:opacity-90 transition-all flex items-center gap-2 text-body-md"
          >
            Open Fleet Map View
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        {/* Live Simulation Sync Notice */}
        <div className="z-10 bg-surface-container/80 backdrop-blur border border-outline-variant/60 p-3 rounded-lg flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px]">sync</span>
            <span>User Simulation Vehicle (V-102): {gnssAvailable ? 'GNSS AVAILABLE' : 'AI DEAD RECKONING'}</span>
          </div>
          <span className="text-on-surface-variant">Outage Time: {Math.round(gnssOutageDuration)}s</span>
        </div>
      </div>
    </div>
  );
}
