import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Home, Ticket, Trophy, LogOut, Package, ImageIcon, Grid3x3, Gift, Palette, Bell } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAppContext();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-16 sm:w-64 bg-gray-800/50 flex flex-col transition-all duration-300">
      <div className="flex items-center justify-center sm:justify-start p-2 sm:p-4 h-20 border-b border-gray-700">
        <Ticket className="text-cyan-400 h-8 w-8" />
        <h1 className="hidden sm:block text-xl font-bold ml-3">Rifa Admin</h1>
      </div>

      <nav className="flex-1 flex flex-col mt-6 space-y-2 px-2 sm:px-4">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${ isActive ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700' }`}>
          <LayoutDashboard className="h-6 w-6" />
          <span className="hidden sm:block ml-4 font-semibold">Dashboard</span>
        </NavLink>
        <NavLink to="/admin/winners" className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${ isActive ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700' }`}>
          <Trophy className="h-6 w-6" />
          <span className="hidden sm:block ml-4 font-semibold">Ganadores</span>
        </NavLink>
        <NavLink to="/admin/packages" className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${ isActive ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700' }`}>
          <Package className="h-6 w-6" />
          <span className="hidden sm:block ml-4 font-semibold">Paquetes</span>
        </NavLink>
        <NavLink to="/admin/numbers" className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${ isActive ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700' }`}>
          <Grid3x3 className="h-6 w-6" />
          <span className="hidden sm:block ml-4 font-semibold">Números</span>
        </NavLink>
        <NavLink to="/admin/prizes" className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${ isActive ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700' }`}>
          <Gift className="h-6 w-6" />
          <span className="hidden sm:block ml-4 font-semibold">Premios</span>
        </NavLink>
        <NavLink to="/admin/logo" className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${ isActive ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700' }`}>
          <ImageIcon className="h-6 w-6" />
          <span className="hidden sm:block ml-4 font-semibold">Logo</span>
        </NavLink>
        <NavLink to="/admin/colors" className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${ isActive ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700' }`}>
          <Palette className="h-6 w-6" />
          <span className="hidden sm:block ml-4 font-semibold">Colores</span>
        </NavLink>
        <NavLink to="/admin/notifications" className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${ isActive ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700' }`}>
          <Bell className="h-6 w-6" />
          <span className="hidden sm:block ml-4 font-semibold">Notificaciones</span>
        </NavLink>
        <NavLink to="/admin/settings" className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${ isActive ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700' }`}>
          <Settings className="h-6 w-6" />
          <span className="hidden sm:block ml-4 font-semibold">Ajustes</span>
        </NavLink>
      </nav>

      <div className="p-2 sm:p-4 mt-auto border-t border-gray-700 space-y-2">
        <button onClick={() => navigate('/')} className="w-full flex items-center p-3 rounded-lg transition-colors hover:bg-gray-700">
          <Home className="h-6 w-6" />
          <span className="hidden sm:block ml-4 font-semibold">Ir a la web</span>
        </button>
        <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg transition-colors text-red-400 hover:bg-red-500/20">
          <LogOut className="h-6 w-6" />
          <span className="hidden sm:block ml-4 font-semibold">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
