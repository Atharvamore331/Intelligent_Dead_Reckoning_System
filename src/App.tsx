import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/auth/LoginPage';
import UserLayout from './pages/user/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import LiveNavigation from './pages/user/LiveNavigation';
import TripDetails from './pages/user/TripDetails';
import SensorInsights from './pages/user/SensorInsights';
import Performance from './pages/user/Performance';
import Profile from './pages/user/Profile';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import FleetPage from './pages/admin/FleetPage';
import VehiclesPage from './pages/admin/VehiclesPage';
import UsersPage from './pages/admin/UsersPage';
import NavigationMonitoring from './pages/admin/NavigationMonitoring';
import Analytics from './pages/admin/Analytics';
import AlertsPage from './pages/admin/AlertsPage';
import SystemHealth from './pages/admin/SystemHealth';
import SettingsPage from './pages/admin/SettingsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ToastContainer from './components/ui/ToastContainer';

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* User Panel */}
        <Route path="/user" element={<ProtectedRoute allowedRole="user"><UserLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="navigation" element={<LiveNavigation />} />
          <Route path="trip" element={<TripDetails />} />
          <Route path="sensors" element={<SensorInsights />} />
          <Route path="performance" element={<Performance />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Panel */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="fleet" element={<FleetPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="navigation-monitoring" element={<NavigationMonitoring />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="system" element={<SystemHealth />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
