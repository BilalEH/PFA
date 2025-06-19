import { NavLink, Navigate, Outlet, useNavigate, Link } from 'react-router-dom';
import { Bell, UserCircle2, Menu } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { axiosInstance } from '../apiConfig/axios';

const ClubAdminLayout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get('/api/user');
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.get('/sanctum/csrf-cookie');
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];
      await axiosInstance.post('/logout', {}, {
        headers: {
          'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
        },
      });
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
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
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 transform bg-white border-r transition-transform duration-200 w-64 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 text-xl font-bold text-blue-600">Club Admin</div>
        <nav className="mt-4">
          {navItems.map((nav) => (
            <NavLink
              key={nav.to}
              to={nav.to}
              end
              className={({ isActive }) =>
                `block px-4 py-3 text-gray-700 hover:bg-gray-50 ${isActive ? 'bg-blue-100 font-medium text-blue-600' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {nav.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b">
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden text-gray-600"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Computer Science Club</h1>
          </div>
          <div className="flex items-center space-x-4 relative" ref={profileRef}>
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="hidden sm:block text-sm text-gray-700">
              John Doe <span className="block text-xs text-gray-400">President</span>
            </div>
            <button onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
              <UserCircle2 className="w-8 h-8 text-gray-500" />
            </button>

            {/* Profile dropdown */}
            {profileMenuOpen && (
              <div className="absolute right-0 top-12 mt-2 w-40 bg-white shadow-md rounded z-50 border">
                <Link
                  to="/club-admin/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  Paramètres
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClubAdminLayout;
