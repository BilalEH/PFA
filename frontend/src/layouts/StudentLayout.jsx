import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../apiConfig/axios';
import LoadingScreen from '../components/ui/LoadingScreen';

const StudentLayout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication for /api/user...');
        const response = await axiosInstance.get('/api/user');
        console.log('Authenticated user:', response.data);
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

  if (isAuthenticated === null) {
    console.log('Rendering loading state...');
    return <LoadingScreen/>;
  }

  if (!isAuthenticated) {
    console.log('Redirecting to login due to unauthenticated state');
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <nav style={{ padding: '10px', background: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <a href="/student/dashboard" style={{ marginRight: '10px' }}>Dashboard</a>
          <a href="/student/profile" style={{ marginRight: '10px' }}>Profile</a>
          <a href="/student/applications">Applications</a>
          <a href="/student/events">Events</a>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '5px 10px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </nav>
      <Outlet />
    </div>
  );
};

export default StudentLayout;