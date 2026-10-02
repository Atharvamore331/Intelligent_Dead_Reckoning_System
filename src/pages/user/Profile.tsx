import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSimulationStore } from '../../store/simulationStore';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const { simulationSpeed, setSimulationSpeed } = useSimulationStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 font-sans">
      <h1 className="text-headline-lg font-bold text-on-surface">Profile & System Settings</h1>

      {/* User Info Card */}
      <div className="glass-card rounded-xl p-card_padding flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-2xl font-bold border border-primary/30">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 overflow-hidden">
          <h2 className="text-headline-md font-bold text-on-surface truncate">{user?.name || 'Operator'}</h2>
          <p className="text-body-md text-on-surface-variant truncate">{user?.email || 'user@intellidr.demo'}</p>
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono text-secondary bg-secondary/10 border border-secondary/30">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5" />
            Active Role: {user?.role?.toUpperCase() || 'USER'}
          </div>
        </div>

      </div>

      {/* Simulation Speed Control */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-semibold text-on-surface">Simulation Speed Multiplier</h3>
        <div className="glass-card rounded-xl p-card_padding flex items-center justify-between">
          <div>
            <p className="text-body-md font-semibold text-on-surface">Vehicle Telemetry Speed</p>
            <p className="text-xs text-on-surface-variant">Accelerates road propagation and history sampling</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 5, 10].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-3 py-1.5 rounded-lg text-mono-data font-bold transition-all ${
                  simulationSpeed === spd
                    ? 'bg-primary text-on-primary shadow'
                    : 'bg-surface-container-low border border-outline-variant text-on-surface-variant hover:bg-surface-bright'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-3.5 rounded-xl font-bold border border-error text-error hover:bg-error-container/20 transition-colors flex items-center justify-center gap-2 text-body-md"
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
        Log Out Session
      </button>
    </div>
  );
}
