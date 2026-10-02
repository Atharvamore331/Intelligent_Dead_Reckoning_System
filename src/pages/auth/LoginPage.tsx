import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      const user = useAuthStore.getState().user;
      if (user?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    }
  };

  const fillDemo = (role: 'user' | 'admin') => {
    if (role === 'user') {
      setEmail('user@intellidr.demo');
      setPassword('user123');
      setIsAdmin(false);
    } else {
      setEmail('admin@intellidr.demo');
      setPassword('admin123');
      setIsAdmin(true);
    }
  };

  return (
    <div className="bg-surface-dim text-on-surface min-h-screen flex items-center justify-center p-4">
      {/* Login Card Container */}
      <main className="w-full max-w-5xl bg-surface-container flex flex-col md:flex-row rounded-xl border border-outline-variant overflow-hidden shadow-[0_0_24px_rgba(0,0,0,0.8)] min-h-[600px] relative z-10">
        {/* Left Side: Technical Visual */}
        <section className="hidden md:flex md:w-1/2 relative bg-surface-container-lowest border-r border-outline-variant overflow-hidden flex-col items-center justify-center p-8">
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />
          {/* Animated rings */}
          <div className="relative z-10 text-center flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full border border-primary/30 bg-surface/50 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-20" />
              <span className="material-symbols-outlined text-primary text-5xl filled">route</span>
            </div>
            <div>
              <h2 className="text-headline-lg text-on-surface tracking-wide">SECURE ACCESS</h2>
              <p className="text-mono-data text-on-surface-variant uppercase tracking-widest mt-2">
                Telemetry & Navigation Core
              </p>
            </div>
          </div>
          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-outline" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-outline" />
        </section>

        {/* Right Side: Login Form */}
        <section className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 bg-surface relative">
          {/* Branding Header */}
          <header className="mb-10 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[32px]">memory</span>
              <h1 className="text-display-nav text-primary tracking-tight">IntelliDR</h1>
            </div>
            <div className="inline-flex">
              <span className={`px-2 py-1 rounded border text-label-caps tracking-widest uppercase ${
                isAdmin 
                  ? 'bg-tertiary/10 border-tertiary/30 text-tertiary' 
                  : 'bg-surface-container-high border-outline-variant text-secondary'
              }`}>
                {isAdmin ? 'ADMIN CONSOLE' : 'USER PORTAL'}
              </span>
            </div>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-sm">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-mono-data text-on-surface-variant uppercase tracking-wide" htmlFor="identifier">
                Operator ID / Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none text-[20px]">badge</span>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-sm focus:border-primary focus:ring-1 focus:ring-primary text-on-surface pl-10 pr-4 py-3 h-12 text-body-md transition-colors placeholder:text-on-surface-variant/50 outline-none"
                  id="identifier"
                  type="text"
                  placeholder="Enter identification"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <label className="text-mono-data text-on-surface-variant uppercase tracking-wide" htmlFor="passcode">
                  Security Key
                </label>
                <button type="button" className="text-label-caps text-primary hover:text-primary-container transition-colors">
                  FORGOT?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none text-[20px]">lock</span>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-sm focus:border-primary focus:ring-1 focus:ring-primary text-on-surface pl-10 pr-12 py-3 h-12 text-body-md transition-colors placeholder:text-on-surface-variant/50 outline-none"
                  id="passcode"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3 mt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-inverse-primary accent-primary cursor-pointer"
              />
              <label className="text-body-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                Maintain encrypted session
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 bg-error-container/20 border border-error/30 rounded text-error text-sm">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-inverse-primary hover:bg-[#00479e] active:bg-[#00367a] text-white text-headline-md h-14 rounded-lg mt-4 transition-all flex justify-center items-center gap-3 shadow-[0_4px_12px_rgba(0,90,194,0.3)] disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
              ) : (
                <>
                  <span>Authenticate</span>
                  <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 flex flex-col gap-2 w-full max-w-sm">
            <p className="text-label-caps text-on-surface-variant/60">DEMO CREDENTIALS</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo('user')}
                className="flex-1 py-2 px-3 bg-surface-container-low border border-outline-variant rounded text-mono-data text-secondary hover:bg-surface-container-high transition-colors"
              >
                User Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="flex-1 py-2 px-3 bg-surface-container-low border border-outline-variant rounded text-mono-data text-tertiary hover:bg-surface-container-high transition-colors"
              >
                Admin Demo
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-auto pt-10 flex border-t border-outline-variant/50 mt-12 w-full max-w-sm">
            <button
              type="button"
              onClick={() => setIsAdmin(!isAdmin)}
              className="flex items-center gap-2 text-mono-data text-on-surface-variant hover:text-primary transition-colors group"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
                {isAdmin ? 'person' : 'admin_panel_settings'}
              </span>
              <span>{isAdmin ? 'User Portal' : 'Admin Access Gateway'}</span>
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}
