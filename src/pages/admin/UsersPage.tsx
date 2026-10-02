import { useState } from 'react';
import { mockUsersData } from '../../data/mockUsers';
import type { User } from '../../types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsersData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as User['role'],
    assignedVehicle: '',
    status: 'active' as User['status'],
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', role: 'user', assignedVehicle: '', status: 'active' });
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingId(u.id);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      assignedVehicle: u.assignedVehicle || '',
      status: u.status,
    });
    setIsModalOpen(true);
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingId ? { ...u, ...formData } : u
        )
      );
    } else {
      const newUser: User = {
        id: (users.length + 1).toString(),
        ...formData,
        lastActive: 'Just now',
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 w-full h-full overflow-y-auto font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">User Management</h1>
          <p className="text-mono-data text-on-surface-variant uppercase tracking-wider">
            Operator Accounts, Roles & Vehicle Assignments
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary text-on-primary hover:bg-primary-container px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors shadow"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add User Account
        </button>
      </div>

      <div className="glass-card border border-outline-variant rounded-xl overflow-hidden bg-surface-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant text-label-caps text-on-surface-variant">
                <th className="p-4">Name / Identifier</th>
                <th className="p-4">Role</th>
                <th className="p-4">Assigned Vehicle</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 text-body-md">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary font-bold text-lg">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-on-surface">{u.name}</div>
                        <div className="text-xs text-on-surface-variant">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-mono-data text-xs font-bold uppercase px-2 py-0.5 rounded border ${
                        u.role === 'admin'
                          ? 'bg-tertiary/10 text-tertiary border-tertiary/30'
                          : 'bg-primary/10 text-primary border-primary/30'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-on-surface">
                    {u.assignedVehicle ? (
                      <span className="px-2 py-0.5 bg-surface-container-highest rounded border border-outline-variant font-bold">
                        {u.assignedVehicle}
                      </span>
                    ) : (
                      <span className="text-on-surface-variant/60 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase border ${
                        u.status === 'active'
                          ? 'bg-secondary/10 text-secondary border-secondary/30'
                          : 'bg-surface-container-highest text-on-surface-variant border-outline-variant'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-secondary' : 'bg-on-surface-variant'}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-on-surface-variant">{u.lastActive || '10m ago'}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Edit User"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`p-1.5 rounded transition-colors ${
                          u.status === 'active' ? 'text-on-surface-variant hover:text-error hover:bg-error/10' : 'text-secondary hover:bg-secondary/10'
                        }`}
                        title={u.status === 'active' ? 'Deactivate User' : 'Activate User'}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {u.status === 'active' ? 'block' : 'check_circle'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h2 className="text-headline-md text-on-surface font-bold">
                {editingId ? 'Edit User Account' : 'Create User Account'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-mono-data text-xs text-on-surface-variant uppercase">Full Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-surface-container-lowest border border-outline-variant p-2.5 rounded text-on-surface focus:border-primary focus:outline-none"
                  placeholder="e.g. Atharva More"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-mono-data text-xs text-on-surface-variant uppercase">Email Address *</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-surface-container-lowest border border-outline-variant p-2.5 rounded text-on-surface focus:border-primary focus:outline-none"
                  placeholder="e.g. user@intellidr.demo"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-mono-data text-xs text-on-surface-variant uppercase">System Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="bg-surface-container-lowest border border-outline-variant p-2.5 rounded text-on-surface focus:border-primary focus:outline-none"
                >
                  <option value="user">USER (Driver / Operator)</option>
                  <option value="admin">ADMIN (Fleet Console)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-mono-data text-xs text-on-surface-variant uppercase">Assigned Vehicle</label>
                <input
                  type="text"
                  value={formData.assignedVehicle}
                  onChange={(e) => setFormData({ ...formData, assignedVehicle: e.target.value })}
                  className="bg-surface-container-lowest border border-outline-variant p-2.5 rounded text-on-surface focus:border-primary focus:outline-none font-mono"
                  placeholder="e.g. V-102"
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
                  {editingId ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
