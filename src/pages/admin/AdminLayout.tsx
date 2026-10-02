import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Live Fleet', path: '/admin/fleet', icon: 'local_shipping' },
    { name: 'Vehicles', path: '/admin/vehicles', icon: 'directions_car' },
    { name: 'Users', path: '/admin/users', icon: 'group' },
    { name: 'Monitoring', path: '/admin/navigation-monitoring', icon: 'monitor_heart' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'analytics' },
    { name: 'Alerts', path: '/admin/alerts', icon: 'notifications_active' },
    { name: 'System Health', path: '/admin/system', icon: 'health_and_safety' },
  ];

  const mobileNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Fleet', path: '/admin/fleet', icon: 'local_shipping' },
    { name: 'Monitoring', path: '/admin/navigation-monitoring', icon: 'monitor_heart' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'analytics' },
    { name: 'Settings', path: '/admin/settings', icon: 'settings' },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-on-surface font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-container-low border-r border-outline-variant pt-6 shrink-0 h-full fixed left-0 top-0 z-40">
        <div className="px-6 mb-6">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl">memory</span>
            <span className="font-bold text-headline-md">IntelliDR</span>
          </div>
          <p className="text-mono-data text-on-surface-variant uppercase text-xs tracking-widest mt-1">Admin Console</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-r-full transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold shadow'
                    : 'text-on-surface-variant hover:bg-surface-container-highest'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined text-[22px] ${isActive ? 'filled' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-body-md font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="mt-auto pt-4 pb-6 flex flex-col gap-1 border-t border-outline-variant/40">
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-r-full transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold shadow'
                    : 'text-on-surface-variant hover:bg-surface-container-highest'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined text-[22px] ${isActive ? 'filled' : ''}`}>
                    settings
                  </span>
                  <span className="text-body-md font-medium">Settings</span>
                </>
              )}
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-r-full text-error hover:bg-error-container/20 transition-colors text-left font-medium"
            >
              <span className="material-symbols-outlined text-[22px]">logout</span>
              <span className="text-body-md">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-surface-container border-b border-outline-variant flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">memory</span>
          <span className="font-bold text-headline-md">IntelliDR</span>
          <span className="text-xs bg-tertiary/10 border border-tertiary/30 text-tertiary px-2 py-0.5 rounded font-mono">ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-on-surface-variant truncate max-w-[120px]">{user?.name}</span>
          <button onClick={handleLogout} className="text-error p-1">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 w-full pt-14 md:pt-0 pb-[72px] md:pb-0 overflow-y-auto h-full relative">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-surface-container-highest border-t border-outline-variant flex justify-around items-center px-2 z-50">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 h-12 transition-all ${
                isActive ? 'bg-secondary-container text-on-secondary-container rounded-xl px-2' : 'text-on-surface-variant'
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
