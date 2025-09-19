import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex font-quicksand">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-10 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
