import { useState, useEffect } from 'react';
import { useVehicleStore } from '../../store/vehicleStore';
import type { Vehicle } from '../../store/vehicleStore';
import { useSimulationStore } from '../../store/simulationStore';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const vehicleIcon = new L.DivIcon({
  className: 'custom-fleet-vehicle-icon',
  html: `<div style="background-color: #adc6ff; width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid #10131a; box-shadow: 0 0 10px #adc6ff;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const simVehicleIcon = new L.DivIcon({
  className: 'custom-sim-vehicle-icon',
  html: `<div style="background-color: #4edea3; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 14px #4edea3;"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export default function FleetPage() {
  const { vehicles, updateVehicle } = useVehicleStore();
  const { vehiclePosition, vehicleSpeed, vehicleHeading, gnssAvailable, navigationMode, simulationRunning, rawDrTrail } = useSimulationStore();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Sync V-102 with live simulation
  useEffect(() => {
    if (simulationRunning && vehiclePosition) {
      updateVehicle('V-102', {
        position: vehiclePosition,
        speed: vehicleSpeed,
        heading: vehicleHeading,
        gnssStatus: gnssAvailable ? 'available' : 'denied',
        navigationMode: navigationMode,
      });
    }
  }, [simulationRunning, vehiclePosition, vehicleSpeed, vehicleHeading, gnssAvailable, navigationMode, updateVehicle]);

  const centerPos: [number, number] = [vehiclePosition.lat, vehiclePosition.lng];

  return (
    <div className="w-full h-full flex flex-col md:flex-row relative bg-background font-sans overflow-hidden">
      {/* Map Area */}
      <div className="flex-1 h-[60vh] md:h-full relative z-0">
        <MapContainer
          center={centerPos}
          zoom={14}
          className="w-full h-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" maxZoom={19} />

          {vehicles.map((v) => (
            v.position && (
              <Marker
                key={v.id}
                position={[v.position.lat, v.position.lng]}
                icon={v.id === 'V-102' ? simVehicleIcon : vehicleIcon}
                eventHandlers={{ click: () => setSelectedVehicle(v) }}
              >
                <Popup className="dark-popup">
                  <div className="bg-surface-container p-2 rounded text-on-surface">
                    <strong className="text-primary block font-mono">{v.id}</strong>
                    <span className="text-xs text-on-surface-variant">Speed: {v.speed?.toFixed(1) || 0} km/h</span>
                    <span className="text-xs text-secondary block">Mode: {v.navigationMode || 'GNSS'}</span>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {rawDrTrail.length > 0 && (
            <Polyline positions={rawDrTrail.map((p) => [p.lat, p.lng])} color="#ffb4ab" weight={3} dashArray="4, 6" />
          )}
        </MapContainer>

        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 z-[400] flex gap-2">
          <div className="hud-card px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse-glow" />
            <span className="text-label-caps text-on-surface">{vehicles.length} Fleet Vehicles Active</span>
          </div>
        </div>
      </div>

      {/* Vehicle List Drawer */}
      <div className="w-full md:w-[360px] bg-surface-container flex flex-col border-l border-outline-variant z-10 h-[40vh] md:h-full overflow-hidden">
        <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-headline-md font-bold text-on-surface">Fleet Roster</h2>
            <p className="text-mono-data text-xs text-on-surface-variant">Live telemetry status</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">directions_car</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
          {vehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              className={`hud-card p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedVehicle?.id === v.id
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-outline-variant/60 hover:bg-surface-container-high'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
                  <span className="text-body-lg font-bold text-on-surface font-mono">{v.id}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                    v.status === 'active'
                      ? 'bg-secondary/10 text-secondary border-secondary/30'
                      : 'bg-surface-container-highest text-on-surface-variant border-outline-variant'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-1.5 text-mono-data text-xs pt-1">
                <div>
                  <span className="text-on-surface-variant block">SPEED</span>
                  <span className="text-on-surface font-semibold">{v.speed?.toFixed(1) || 0} km/h</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">HEADING</span>
                  <span className="text-on-surface font-semibold">{Math.round(v.heading || 0)}°</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">NAV MODE</span>
                  <span
                    className={`font-semibold ${
                      v.navigationMode === 'ai_dead_reckoning' ? 'text-tertiary' : 'text-secondary'
                    }`}
                  >
                    {v.navigationMode === 'ai_dead_reckoning' ? 'AI DR' : 'GNSS'}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">DRIVER</span>
                  <span className="text-on-surface font-semibold truncate block">{v.assignedUserName || 'Unassigned'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
