import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAdminContext } from '../../context/AdminContext';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { label: 'Users', path: '/admin/users', icon: '👤' },
  { label: 'Owners', path: '/admin/owners', icon: '🧑‍💼' },
  { label: 'Cars', path: '/admin/cars', icon: '🚗' },
  { label: 'Bookings', path: '/admin/bookings', icon: '📋' },
];

const Layout = () => {
  const { admin, logoutAdmin } = useAdminContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-white shadow-md transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {sidebarOpen && <span className="font-bold text-blue-600 text-lg">CarRental</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-blue-600">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition
                ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={logoutAdmin}
            className={`flex items-center gap-3 text-sm text-red-500 hover:text-red-700 font-medium w-full`}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>
          <span className="text-sm text-gray-500">👋 {admin?.name}</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;