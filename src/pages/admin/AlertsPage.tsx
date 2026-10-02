import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';

export const AlertsPage: React.FC = () => {
  const { events, acknowledgeEvent } = useEventStore();
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filteredEvents = events
    .filter(e => filter === 'all' || e.severity === filter)
    .sort((a, b) => b.timestamp - a.timestamp);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return { icon: 'error', color: 'text-error', bg: 'bg-error/10' };
      case 'warning': return { icon: 'warning', color: 'text-tertiary', bg: 'bg-tertiary/10' };
      case 'info': return { icon: 'info', color: 'text-primary', bg: 'bg-primary/10' };
      default: return { icon: 'info', color: 'text-on-surface-variant', bg: 'bg-surface-container-high' };
    }
  };

  const getTimeString = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="p-4 md:p-8 w-full h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-display-sm text-on-surface mb-1">Alerts & Events</h1>
        <p className="text-body-md text-on-surface-variant">System logs, warnings, and critical outages</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'critical', 'warning', 'info'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-label-md font-bold capitalize whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-primary-container text-on-primary-container' 
                : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredEvents.length === 0 ? (
          <div className="glass-panel border border-outline-variant rounded-xl p-12 text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-4">check_circle</span>
            <h3 className="text-title-lg font-bold text-on-surface">No alerts found</h3>
            <p className="text-body-md text-on-surface-variant">System is operating normally.</p>
          </div>
        ) : (
          filteredEvents.map(event => {
            const style = getSeverityIcon(event.severity);
            return (
              <div 
                key={event.id} 
                className={`glass-panel border rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center transition-all ${
                  !event.acknowledged ? 'bg-surface border-outline-variant shadow-lg' : 'bg-surface-container-low border-outline-variant/30 opacity-70'
                }`}
              >
                <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${style.bg} ${style.color}`}>
                  <span className="material-symbols-outlined">{style.icon}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`text-title-md font-bold ${!event.acknowledged ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                      {event.title}
                    </h3>
                    <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-label-sm font-mono rounded">
                      {event.vehicleId}
                    </span>
                  </div>
                  <p className="text-body-md text-on-surface-variant">{event.description}</p>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 shrink-0">
                  <span className="text-label-sm text-on-surface-variant font-mono">
                    {getTimeString(event.timestamp)}
                  </span>
                  {!event.acknowledged ? (
                    <button 
                      onClick={() => acknowledgeEvent(event.id)}
                      className="px-4 py-2 border border-outline-variant hover:bg-surface-container-high text-on-surface rounded-full text-label-md font-bold transition-colors"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-label-md text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">done_all</span> Ack'd
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
