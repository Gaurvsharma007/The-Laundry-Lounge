import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public / User Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verification from './pages/Verification';
import ForgotPassword from './pages/ForgotPassword';
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import TrackOrder from './pages/TrackOrder';
import Complaints from './pages/Complaints';
import BookOrder from './pages/BookOrder';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminSettings from './pages/admin/AdminSettings';

// ─── Full-screen loading spinner ─────────────────────────────────────────
const Spinner = () => (
  <div className="flex h-screen items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Verifying session...</p>
    </div>
  </div>
);

// ─── ProtectedRoute: logged-in users only (non-admin) ────────────────────
// Shows spinner while auth is loading, then redirects accordingly
const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Outlet />;
};

// ─── AdminRoute: admin-only access ───────────────────────────────────────
const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

// ─── GuestRoute: redirect logged-in users away from auth pages ───────────
const GuestRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <Spinner />;
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* ─── Guest Only Routes (redirects logged-in users) ─── */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
          <Route path="/register" element={<UserLayout><Register /></UserLayout>} />
          <Route path="/verify" element={<UserLayout><Verification /></UserLayout>} />
          <Route path="/forgot-password" element={<UserLayout><ForgotPassword /></UserLayout>} />
        </Route>

        {/* ─── Public Routes (accessible by anyone) ─── */}
        <Route path="/" element={<UserLayout><Home /></UserLayout>} />
        <Route path="/services" element={<UserLayout><Services /></UserLayout>} />
        <Route path="/track" element={<UserLayout><TrackOrder /></UserLayout>} />

        {/* ─── Protected User Routes (must be logged in as user) ─── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserLayout><Dashboard /></UserLayout>} />
          <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />
          <Route path="/book" element={<UserLayout><BookOrder /></UserLayout>} />
          <Route path="/complaints" element={<UserLayout><Complaints /></UserLayout>} />
        </Route>

        {/* ─── Protected Admin Routes (must be logged in as admin) ─── */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/analytics" element={<AdminOverview />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/complaints" element={<AdminComplaints />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* ─── 404 ─── */}
        <Route path="*" element={<UserLayout><NotFound /></UserLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
