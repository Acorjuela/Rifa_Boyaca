import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import SettingsPage from './pages/admin/SettingsPage';
import WinnersPage from './pages/admin/WinnersPage';
import PackagesPage from './pages/admin/PackagesPage';
import LoginPage from './pages/admin/LoginPage';
import RegisterPage from './pages/admin/RegisterPage';
import PrivateRoute from './components/admin/PrivateRoute';
import LogoPage from './pages/admin/LogoPage';
import NumbersPage from './pages/admin/NumbersPage';
import PrizesPage from './pages/admin/PrizesPage';
import ColorsPage from './pages/admin/ColorsPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import SecurityLayer from './components/SecurityLayer';

function App() {
  return (
    <AppProvider>
      <SecurityLayer>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/registro" element={<RegistrationPage />} />
            
            {/* Admin Auth Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/register" element={<RegisterPage />} />

            {/* Private Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="winners" element={<WinnersPage />} />
              <Route path="packages" element={<PackagesPage />} />
              <Route path="logo" element={<LogoPage />} />
              <Route path="numbers" element={<NumbersPage />} />
              <Route path="prizes" element={<PrizesPage />} />
              <Route path="colors" element={<ColorsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>
          </Routes>
        </Router>
      </SecurityLayer>
      <Toaster position="top-right" reverseOrder={false} />
    </AppProvider>
  );
}

export default App;
