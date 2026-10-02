import React from 'react';

const services = [
  { name: 'GNSS Service', icon: 'satellite_alt', status: 'ACTIVE', uptime: '99.9%', color: 'status-green' },
  { name: 'IMU Sensors', icon: 'sensors', status: 'ACTIVE', uptime: '99.9%', color: 'status-green' },
  { name: 'AI Model', icon: 'psychology', status: 'ACTIVE', uptime: '100%', color: 'status-green', detail: 'v2.4.1' },
  { name: 'Navigation Engine', icon: 'navigation', status: 'ACTIVE', uptime: '99.9%', color: 'status-green' },
  { name: 'Map Service', icon: 'map', status: 'ACTIVE', uptime: '99.5%', color: 'status-green' },
  { name: 'Map Matching', icon: 'route', status: 'ACTIVE', uptime: '99.8%', color: 'status-green' },
  { name: 'DR Engine', icon: 'speed', status: 'ACTIVE', uptime: '100%', color: 'status-green' },
  { name: 'Backend/API', icon: 'cloud', status: 'ACTIVE', uptime: '99.9%', color: 'status-green' },
  { name: 'Database', icon: 'database', status: 'ACTIVE', uptime: '100%', color: 'status-green' },
];

export const SystemHealth: React.FC = () => {
  return (
    <div className="p-4 md:p-8 w-full h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-display-sm text-on-surface mb-1">System Health</h1>
        <p className="text-body-md text-on-surface-variant">Microservices and infrastructure status</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-xl border border-outline-variant bg-surface">
          <div className="text-label-md text-on-surface-variant uppercase mb-1">Overall Status</div>
          <div className="flex items-center gap-2">
            <span className="status-dot status-green w-3 h-3"></span>
            <span className="text-title-lg font-bold text-on-surface">All Systems Nominal</span>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-outline-variant bg-surface">
          <div className="text-label-md text-on-surface-variant uppercase mb-1">System Uptime</div>
          <div className="text-title-lg font-mono text-on-surface">45d 12h 30m</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-outline-variant bg-surface">
          <div className="text-label-md text-on-surface-variant uppercase mb-1">API Latency</div>
          <div className="text-title-lg font-mono text-secondary">24 ms</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-outline-variant bg-surface">
          <div className="text-label-md text-on-surface-variant uppercase mb-1">Telemetry Rate</div>
          <div className="text-title-lg font-mono text-on-surface">10 Hz</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map(svc => (
          <div key={svc.name} className="glass-panel p-5 rounded-xl border border-outline-variant bg-surface flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined">{svc.icon}</span>
              </div>
              <div>
                <h3 className="text-title-md font-bold text-on-surface">{svc.name}</h3>
                <div className="text-body-sm text-on-surface-variant mt-0.5">Uptime: {svc.uptime} {svc.detail && `• ${svc.detail}`}</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`status-dot ${svc.color}`}></span>
              <span className="text-label-sm font-bold tracking-wider uppercase text-on-surface-variant">{svc.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemHealth;
