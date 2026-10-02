import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const mockDriftData = [
  { time: '00:00', rawError: 0, correctedError: 0 },
  { time: '00:05', rawError: 15, correctedError: 2 },
  { time: '00:10', rawError: 35, correctedError: 4 },
  { time: '00:15', rawError: 65, correctedError: 6 },
  { time: '00:20', rawError: 105, correctedError: 8 },
  { time: '00:25', rawError: 150, correctedError: 12 },
  { time: '00:30', rawError: 210, correctedError: 15 },
];

const mockOutageData = [
  { region: 'Downtown', count: 45 },
  { region: 'Tunnel A', count: 120 },
  { region: 'Highway', count: 12 },
  { region: 'Suburbs', count: 5 },
];

export const Analytics: React.FC = () => {
  return (
    <div className="p-4 md:p-8 w-full h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-display-sm text-on-surface mb-1">Performance Analytics</h1>
        <p className="text-body-md text-on-surface-variant">Fleet-wide navigation performance and metrics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-xl border border-outline-variant bg-surface">
          <div className="text-label-md text-on-surface-variant uppercase mb-2">Total Trips</div>
          <div className="flex items-end gap-2">
            <span className="text-display-nav text-on-surface">1,248</span>
            <span className="text-body-sm text-secondary mb-1 flex items-center">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 12%
            </span>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-outline-variant bg-surface">
          <div className="text-label-md text-on-surface-variant uppercase mb-2">Total Distance</div>
          <div className="text-display-nav text-on-surface">45.2K<span className="text-title-md ml-1 text-on-surface-variant">km</span></div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-primary/30 bg-primary/5">
          <div className="text-label-md text-primary uppercase mb-2">Avg Drift Reduction</div>
          <div className="text-display-nav text-primary">92.4%</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-outline-variant bg-surface">
          <div className="text-label-md text-on-surface-variant uppercase mb-2">Active Sensors</div>
          <div className="text-display-nav text-on-surface">12,402</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-outline-variant bg-surface">
          <h3 className="text-title-md font-bold text-on-surface mb-6">Corrected vs Raw DR Error (30 min outage)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDriftData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#272a31" vertical={false} />
                <XAxis dataKey="time" stroke="#797e8a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#797e8a" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Error (m)', angle: -90, position: 'insideLeft', fill: '#797e8a', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#10131a', border: '1px solid #424754', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                <Line type="monotone" dataKey="rawError" name="Raw DR Error" stroke="#ffb4ab" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="correctedError" name="AI Corrected Error" stroke="#4edea3" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Charts */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-surface flex-1">
            <h3 className="text-title-md font-bold text-on-surface mb-4">GNSS Outage Frequency</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockOutageData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#272a31" vertical={false} />
                  <XAxis dataKey="region" stroke="#797e8a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#797e8a" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#272a31', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#10131a', border: '1px solid #424754', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#adc6ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-outline-variant bg-surface">
            <h3 className="text-title-md font-bold text-on-surface mb-2">Avg Outage Duration</h3>
            <div className="text-display-md text-tertiary">4m 12s</div>
            <p className="text-body-sm text-on-surface-variant mt-2">Across all recorded loss-of-signal events in the last 30 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
