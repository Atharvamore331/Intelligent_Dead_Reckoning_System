import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSimulationStore } from '../../store/simulationStore';
import { useAuthStore } from '../../store/authStore';

export default function UserLayout() {
  const { gnssAvailable, gnssRestorationPhase } = useSimulationStore();
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard', path: '/user/dashboard', icon: 'space_dashboard' },
    { name: 'Navigation', path: '/user/navigation', icon: 'navigation' },
    { name: 'Trip', path: '/user/trip', icon: 'route' },
    { name: 'Sensors', path: '/user/sensors', icon: 'sensors' },
    { name: 'Performance', path: '/user/performance', icon: 'speed' },
    { name: 'Profile', path: '/user/profile', icon: 'person' },
  ];

  const bottomNavItems = navItems.filter((item) => item.name !== 'Dashboard');

  return (
    <div className="flex h-screen bg-background text-on-surface font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-container-low border-r border-outline-variant h-full fixed left-0 top-0 z-40">
        <div className="p-6 flex items-center gap-3 text-primary">
          <span className="material-symbols-outlined text-3xl">memory</span>
          <span className="font-bold text-headline-md">IntelliDR</span>
        </div>

        <nav className="flex-1 mt-2 pr-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-r-full transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined mr-3 text-[22px] ${isActive ? 'filled' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-body-md font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant/50">
          <div className="flex items-center gap-3 px-3 py-2 mb-3 bg-surface-container/60 rounded-lg">
            <span className="material-symbols-outlined text-primary">account_circle</span>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-on-surface truncate">{user?.name || 'User Operator'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 text-error hover:bg-error-container/20 rounded-lg transition-colors text-body-md font-medium"
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top App Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-surface-container border-b border-outline-variant flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">memory</span>
          <span className="font-bold text-headline-md">IntelliDR</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container-high rounded-full px-2.5 py-1 border border-outline-variant">
            <span
              className={`w-2 h-2 rounded-full mr-1.5 ${
                gnssAvailable ? 'bg-secondary animate-pulse-glow' : 'bg-error animate-pulse'
              }`}
            />
            <span className="text-[10px] font-bold tracking-wider uppercase text-on-surface">
              {gnssRestorationPhase !== 'none'
                ? gnssRestorationPhase.replace('_', ' ')
                : gnssAvailable
                ? 'GNSS + INS'
                : 'AI DEAD RECKONING'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 pb-[72px] md:pb-0 overflow-y-auto h-full relative">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-highest border-t border-outline-variant z-50 px-2 py-1.5 flex justify-around items-center">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-12 transition-all ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container rounded-xl px-2'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'filled' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-semibold mt-0.5">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
