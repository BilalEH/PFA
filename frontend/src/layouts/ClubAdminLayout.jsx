import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Bell, UserCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../apiConfig/axios';

const ClubAdminLayout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/user');
        console.log('Authenticated club admin:', response.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check failed:', err.response?.status, err.response?.data || err.message);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.get('/sanctum/csrf-cookie');
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      await axiosInstance.post('/logout', {}, {
        headers: {
          'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
        },
      });
      console.log('Logout successful');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err.response?.status, err.response?.data || err.message);
    }
  };

  const navItems = [
    { to: '/club-admin/dashboard', label: 'Dashboard' },
    { to: '/club-admin/club-info', label: 'Club Info' },
    { to: '/club-admin/members', label: 'Members' },
    { to: '/club-admin/interviews', label: 'Interviews' },
    { to: '/club-admin/events', label: 'Events' },
  ];

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r relative">
        <div className="p-4 text-xl font-bold text-blue-600">Club Admin</div>
        <nav className="mt-4">
          {navItems.map((nav) => (
            <NavLink
              key={nav.to}
              to={nav.to}
              end
              className={({ isActive }) =>
                `block px-4 py-3 text-gray-700 hover:bg-gray-50 ${
                  isActive ? 'bg-blue-100 font-medium text-blue-600' : ''
                }`
              }
            >
              {nav.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
          <h1 className="text-lg font-semibold text-gray-800">Computer Science Club</h1>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="text-sm text-gray-700">
              John Doe <span className="block text-xs text-gray-400">President</span>
            </div>
            <UserCircle2 className="w-8 h-8 text-gray-500" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClubAdminLayout;
