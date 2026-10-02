import { useSimulationStore } from '../../store/simulationStore';
import { headingToCompass } from '../../services/simulationEngine';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function SensorInsights() {
  const {
    vehicleSpeed,
    vehicleHeading,
    gnssAvailable,
    sensorData,
    sensorHistory,
  } = useSimulationStore();

  const compass = headingToCompass(vehicleHeading);

  // Map sensor history for Recharts if available, otherwise generate smooth fallback points
  const chartData = sensorHistory.length > 0
    ? sensorHistory
    : Array.from({ length: 20 }).map((_, i) => ({
        time: `${i}s`,
        ax: +sensorData.accelerometer.x.toFixed(2),
        ay: +sensorData.accelerometer.y.toFixed(2),
        az: +(sensorData.accelerometer.z + 9.81).toFixed(2),
        gx: +sensorData.gyroscope.x.toFixed(3),
        gy: +sensorData.gyroscope.y.toFixed(3),
        gz: +sensorData.gyroscope.z.toFixed(3),
      }));

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface">Sensor Insights</h1>
        <p className="text-mono-data text-on-surface-variant uppercase tracking-wider">
          IMU Telemetry & Subsystem Diagnostics
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-card_padding flex flex-col justify-between">
          <span className="text-label-caps text-on-surface-variant">EST. SPEED</span>
          <div className="text-headline-lg font-bold text-on-surface mt-2">
            {vehicleSpeed.toFixed(1)} <span className="text-body-md text-on-surface-variant font-normal">km/h</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-card_padding flex flex-col justify-between">
          <span className="text-label-caps text-on-surface-variant">HEADING</span>
          <div className="text-headline-lg font-bold text-on-surface mt-2 flex items-baseline gap-2">
            <span>{Math.round(vehicleHeading)}°</span>
            <span className="text-body-md text-primary font-mono">{compass}</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-card_padding flex flex-col justify-between">
          <span className="text-label-caps text-on-surface-variant">MOTION STATE</span>
          <div className="text-headline-lg font-bold text-secondary mt-2">
            {vehicleSpeed > 5 ? 'Cruising' : vehicleSpeed > 0 ? 'Accelerating' : 'Stationary'}
          </div>
        </div>

        <div className="glass-card rounded-xl p-card_padding flex flex-col justify-between">
          <span className="text-label-caps text-on-surface-variant">SAMPLE RATE</span>
          <div className="text-headline-lg font-bold text-tertiary mt-2">100 Hz</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* IMU Telemetry Graphs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Accelerometer Card */}
          <div className="glass-card rounded-xl p-card_padding space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-body-lg font-semibold text-on-surface">Accelerometer (m/s²)</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-mono-data text-primary text-xs">Live 100Hz</span>
              </div>
            </div>

            <div className="h-44 w-full bg-surface-container-low rounded-lg p-2 border border-surface-container-highest">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="ax" stroke="#adc6ff" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="ay" stroke="#4edea3" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="az" stroke="#ffb786" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex gap-6 text-mono-data text-xs justify-end pt-1">
              <span className="text-primary font-medium">X: {sensorData.accelerometer.x.toFixed(2)}</span>
              <span className="text-secondary font-medium">Y: {sensorData.accelerometer.y.toFixed(2)}</span>
              <span className="text-tertiary font-medium">Z: {sensorData.accelerometer.z.toFixed(2)}</span>
            </div>
          </div>

          {/* Gyroscope Card */}
          <div className="glass-card rounded-xl p-card_padding space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-body-lg font-semibold text-on-surface">Gyroscope (rad/s)</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-mono-data text-secondary text-xs">Live 100Hz</span>
              </div>
            </div>

            <div className="h-44 w-full bg-surface-container-low rounded-lg p-2 border border-surface-container-highest">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="gx" stroke="#adc6ff" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="gy" stroke="#4edea3" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="gz" stroke="#ffb786" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex gap-6 text-mono-data text-xs justify-end pt-1">
              <span className="text-primary font-medium">X: {sensorData.gyroscope.x.toFixed(3)}</span>
              <span className="text-secondary font-medium">Y: {sensorData.gyroscope.y.toFixed(3)}</span>
              <span className="text-tertiary font-medium">Z: {sensorData.gyroscope.z.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Subsystem Status List */}
        <div className="glass-card rounded-xl p-card_padding flex flex-col justify-between h-fit">
          <div>
            <div className="pb-3 border-b border-surface-container-highest mb-3">
              <h3 className="text-body-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">sensors</span>
                Subsystem Health
              </h3>
            </div>

            <ul className="space-y-3 text-body-md">
              {[
                { name: 'Accelerometer', status: 'Active', active: true },
                { name: 'Gyroscope', status: 'Active', active: true },
                { name: 'GNSS Array', status: gnssAvailable ? 'Active' : 'Denied / Outage', active: gnssAvailable },
                { name: 'AI Prediction Model', status: 'Active', active: true },
                { name: 'Map Matching Engine', status: 'Active', active: true },
              ].map((sys) => (
                <li key={sys.name} className="flex justify-between items-center py-2 border-b border-surface-container-highest/60 last:border-b-0">
                  <span className="text-on-surface">{sys.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-mono-data text-xs font-bold ${sys.active ? 'text-secondary' : 'text-error'}`}>
                      {sys.status}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${sys.active ? 'bg-secondary' : 'bg-error animate-pulse'}`} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
