import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BaseMapView from "./pages/BaseMapView";
import Reports from "./pages/Reports";
import Stations from "./pages/Stations";
import StationDetail from "./pages/StationDetail";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import AlertDetails from "./pages/AlertDetails";
import AlertTrends from "./pages/AlertTrends";
import Profile from "./pages/Profile";
import NgoDashboard from './pages/ngo/Dashboard';
import AuthorityDashboard from './pages/authority/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { MainBackground } from "./components/Background/MainBackground";
import RoleGuard from './components/RoleGuard';

// Placeholder component for missing features
const Placeholder = ({ name }) => (
  <div className="flex items-center justify-center h-full text-primary-gray italic">
    {name} page coming soon...
  </div>
);

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ocean-deep text-white relative flex overflow-hidden">
      <MainBackground />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 pt-16 lg:pl-64 h-screen overflow-y-auto scrollbar-custom relative z-10 transition-all duration-300">
          <div className="p-4 md:p-8 w-full max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

// Wrap a route in both AppLayout + PrivateRoute
const ProtectedPage = ({ children }) => (
  <PrivateRoute>
    <AppLayout>{children}</AppLayout>
  </PrivateRoute>
);

function App() {
  return (
    <AuthProvider>
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
          <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
          <Route path="/alerts" element={<ProtectedPage><Alerts /></ProtectedPage>} />
          <Route path="/alerts/:id" element={<ProtectedPage><AlertDetails /></ProtectedPage>} />
          <Route path="/alert-trends" element={<ProtectedPage><AlertTrends /></ProtectedPage>} />
          
          {/* Milestone 4 Portals */}
          <Route path="/ngo/dashboard" element={
            <ProtectedPage>
              <RoleGuard allowedRoles={['ngo', 'admin']}>
                <NgoDashboard />
              </RoleGuard>
            </ProtectedPage>
          } />
          <Route path="/authority/dashboard" element={
            <ProtectedPage>
              <RoleGuard allowedRoles={['authority', 'admin']}>
                <AuthorityDashboard />
              </RoleGuard>
            </ProtectedPage>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedPage>
              <RoleGuard allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleGuard>
            </ProtectedPage>
          } />
          <Route path="/collaborations" element={<ProtectedPage><Placeholder name="Collaborations" /></ProtectedPage>} />
          <Route path="/settings" element={<ProtectedPage><Placeholder name="Settings" /></ProtectedPage>} />
          <Route path="/support" element={<ProtectedPage><Placeholder name="Support" /></ProtectedPage>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;