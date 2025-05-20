import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../apiConfig/axios';
import LoadingScreen from '../components/ui/LoadingScreen'
const AuthRedirect = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/user');
        console.log('Auth check for redirect:', response.data);
        setIsAuthenticated(true);
        setUserRole(response.data.user_type);
      } catch (err) {
        console.error('Auth check failed:', err.response?.status, err.response?.data || err.message);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <LoadingScreen/>;
  }

  if (isAuthenticated) {
    console.log('Redirecting authenticated user to dashboard');
    // Redirect based on user role
    if (userRole === 'club_admin') {
      return <Navigate to="/club-admin/dashboard" replace />;
    } else if (userRole === 'system_admin') {
      return <Navigate to="/system-admin/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default AuthRedirect;