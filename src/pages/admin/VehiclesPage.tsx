import { useState } from 'react';
import { useVehicleStore } from '../../store/vehicleStore';
import type { Vehicle } from '../../store/vehicleStore';

export default function VehiclesPage() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useVehicleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    status: 'idle' as Vehicle['status'],
    assignedUserName: '',
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ id: '', name: '', status: 'idle', assignedUserName: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingId(v.id);
    setFormData({
      id: v.id,
      name: v.name || '',
      status: v.status,
      assignedUserName: v.assignedUserName || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateVehicle(editingId, {
        name: formData.name,
        status: formData.status,
        assignedUserName: formData.assignedUserName,
      });
    } else {
      addVehicle({
        id: formData.id || `V-${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name || 'Fleet Vehicle',
        status: formData.status,
        assignedUserName: formData.assignedUserName || 'Unassigned',
        position: { lat: 28.6129, lng: 77.2295 },
        speed: 0,
        heading: 0,
        gnssStatus: 'available',
        navigationMode: 'gnss_ins',
        connectionStatus: 'connected',
        lastUpdate: 'Just now',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 w-full h-full overflow-y-auto font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Vehicle Management</h1>
          <p className="text-mono-data text-on-surface-variant uppercase tracking-wider">
            Fleet Hardware Roster & Driver Assignments
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary text-on-primary hover:bg-primary-container px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors shadow"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Vehicle
        </button>
      </div>

      <div className="glass-card border border-outline-variant rounded-xl overflow-hidden bg-surface-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant text-label-caps text-on-surface-variant">
                <th className="p-4">Vehicle ID / Name</th>
                <th className="p-4">Assigned Driver</th>
                <th className="p-4">Status</th>
                <th className="p-4">Nav Mode</th>
                <th className="p-4">Speed</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 text-body-md">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[20px]">directions_car</span>
                      </div>
                      <div>
                        <div className="font-mono font-bold text-on-surface">{v.id}</div>
                        <div className="text-xs text-on-surface-variant">{v.name || 'Fleet Unit'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-on-surface">
                    {v.assignedUserName || <span className="text-on-surface-variant/60 italic">Unassigned</span>}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase border ${
                        v.status === 'active'
                          ? 'bg-secondary/10 text-secondary border-secondary/30'
                          : v.status === 'idle'
                          ? 'bg-tertiary/10 text-tertiary border-tertiary/30'
                          : 'bg-error/10 text-error border-error/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          v.status === 'active'
                            ? 'bg-secondary'
                            : v.status === 'idle'
                            ? 'bg-tertiary'
                            : 'bg-error'
                        }`}
                      />
                      {v.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs">
                    <span className={v.navigationMode === 'ai_dead_reckoning' ? 'text-tertiary font-bold' : 'text-secondary'}>
                      {v.navigationMode === 'ai_dead_reckoning' ? 'AI DR' : 'GNSS + INS'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-on-surface">{v.speed?.toFixed(1) || 0} km/h</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(v)}
                        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Edit Vehicle"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => deleteVehicle(v.id)}
                        className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors"
                        title="Deactivate Vehicle"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h2 className="text-headline-md text-on-surface font-bold">
                {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              {!editingId && (
                <div className="flex flex-col gap-1">
                  <label className="text-mono-data text-xs text-on-surface-variant uppercase">Vehicle ID *</label>
                  <input
                    required
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="bg-surface-container-lowest border border-outline-variant p-2.5 rounded text-on-surface focus:border-primary focus:outline-none font-mono"
                    placeholder="e.g. V-105"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-mono-data text-xs text-on-surface-variant uppercase">Display Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-surface-container-lowest border border-outline-variant p-2.5 rounded text-on-surface focus:border-primary focus:outline-none"
                  placeholder="e.g. Logistics Van 105"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-mono-data text-xs text-on-surface-variant uppercase">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
                  className="bg-surface-container-lowest border border-outline-variant p-2.5 rounded text-on-surface focus:border-primary focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-mono-data text-xs text-on-surface-variant uppercase">Assigned Driver</label>
                <input
                  type="text"
                  value={formData.assignedUserName}
                  onChange={(e) => setFormData({ ...formData, assignedUserName: e.target.value })}
                  className="bg-surface-container-lowest border border-outline-variant p-2.5 rounded text-on-surface focus:border-primary focus:outline-none"
                  placeholder="e.g. Atharva More"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-bold"
                >
                  {editingId ? 'Save Changes' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
