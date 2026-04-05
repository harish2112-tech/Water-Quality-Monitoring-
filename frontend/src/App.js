import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import RoleGuard from "./components/RoleGuard";
import { MapProvider } from "./context/MapContext";
import React, { useState, useCallback } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/ngo/Dashboard";
import BaseMapView from "./pages/BaseMapView";
import Reports from "./pages/Reports";
import Stations from "./pages/Stations";
import StationDetail from "./pages/StationDetail";
import Analytics from "./pages/Analytics";
import PredictiveAnalytics from "./pages/PredictiveAnalytics";
import Alerts from "./pages/Alerts";
import AlertDetails from "./pages/AlertDetails";
import AlertTrends from "./pages/AlertTrends";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import RequireRole from "./components/RequireRole";
import Profile from "./pages/Profile";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { MainBackground } from "./components/Background/MainBackground";
import Collaborations from "./pages/Collaborations";
import UserManagement from "./pages/admin/UserManagement";
import Support from "./pages/Support";
import Settings from "./pages/Settings";



const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-ocean-deep text-white relative">
      <MainBackground />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <Navbar onToggleSidebar={toggleSidebar} />
      <main className="lg:pl-64 pt-16 h-screen overflow-y-auto scrollbar-custom relative z-10">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

// Forbidden access component
const Forbidden = () => (
  <div className="flex flex-col items-center justify-center p-8 sm:p-20 space-y-4">
    <div className="text-3xl sm:text-4xl font-black text-critical uppercase tracking-tighter shadow-lg shadow-critical/20">403 Forbidden</div>
    <div className="text-primary-gray italic text-center max-w-md text-sm sm:text-base">You do not have permission to access this specialized resource. Please contact your coordinator.</div>
    <button 
      onClick={() => window.history.back()}
      className="px-6 sm:px-8 py-3 bg-accent-gold text-background font-black uppercase rounded-xl hover:scale-105 transition-all shadow-xl shadow-accent-gold/20 text-sm"
    >
      Return to Safety
    </button>
  </div>
);

// Wrap a route in both AppLayout + PrivateRoute
const ProtectedPage = ({ children }) => (
  <PrivateRoute>
    <AppLayout>{children}</AppLayout>
  </PrivateRoute>
);


function App() {
  return (
    <AuthProvider>
      <MapProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedPage><BaseMapView /></ProtectedPage>} />
            <Route path="/map" element={<ProtectedPage><BaseMapView /></ProtectedPage>} />
            <Route path="/reports" element={<ProtectedPage><Reports /></ProtectedPage>} />
            <Route path="/stations" element={<ProtectedPage><Stations /></ProtectedPage>} />
            <Route path="/stations/:id" element={<ProtectedPage><StationDetail /></ProtectedPage>} />
            <Route path="/analytics" element={<ProtectedPage><Analytics /></ProtectedPage>} />
            <Route path="/analytics/predictive" element={<ProtectedPage><PredictiveAnalytics /></ProtectedPage>} />
            <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
            <Route path="/alerts" element={<ProtectedPage><Alerts /></ProtectedPage>} />
            <Route path="/alerts/:id" element={<ProtectedPage><AlertDetails /></ProtectedPage>} />
            <Route path="/alert-trends" element={<ProtectedPage><AlertTrends /></ProtectedPage>} />
            
            {/* Authority/Admin Moderation Routes */}
            <Route path="/authority/dashboard" element={
              <ProtectedPage>
                  <RequireRole allowedRoles={['admin', 'authority']}>
                      <AuthorityDashboard />
                  </RequireRole>
              </ProtectedPage>
            } />

            {/* Admin-Only User Management */}
            <Route path="/admin/users" element={
              <ProtectedPage>
                  <RequireRole allowedRoles={['admin']}>
                      <UserManagement />
                  </RequireRole>
              </ProtectedPage>
            } />

            {/* NGO Portal */}
            <Route 
              path="/ngo/dashboard" 
              element={
                <RoleGuard roles={["ngo", "admin"]}>
                  <ProtectedPage><Dashboard /></ProtectedPage>
                </RoleGuard>
              } 
            />
            <Route path="/403" element={<AppLayout><Forbidden /></AppLayout>} />

            <Route path="/collaborations" element={<ProtectedPage><Collaborations /></ProtectedPage>} />
            <Route path="/settings" element={<ProtectedPage><Settings /></ProtectedPage>} />
            <Route path="/support" element={<ProtectedPage><Support /></ProtectedPage>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </MapProvider>
    </AuthProvider>
  );
}

export default App;