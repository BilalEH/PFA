// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserTypeSelector from './UserTypeSelector';
import Input from '../ui/Input';
import PasswordInput from '../ui/PasswordInput';
import Button from '../ui/Button';
import { axiosInstance } from '../../apiConfig/axios';
import '../../styles/authStyles.css';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [selectedType, setSelectedType] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate=useNavigate();
  const handleTypeChange = (type) => {
    setSelectedType(type);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Helper function to get cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      // Step 1: Get CSRF token first
      await axiosInstance.get('/sanctum/csrf-cookie');

      setMessage('CSRF token fetched, attempting login...');

      setTimeout(async () => {
        try {
          // Get the CSRF token from cookies
          const token = getCookie('XSRF-TOKEN');
          const headers = {};
          if (token) {
            headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
          }

          // Make the login request with explicit headers
          const response = await axiosInstance.post('/login', 
            { 
              email: formData.email, 
              password: formData.password,
              user_type: selectedType 
            },
            { headers }
          );
          setMessage('Login successful!');
          toast.success('Login successful!');
          navigate('/student/dashboard');
        } catch (err) {
          setError(err.response?.data?.message || 'Login failed');
          setMessage(`Login failed: ${err.message}`);
          toast.error(err.response?.data?.message || 'Login failed');
        } finally {
          setLoading(false);
        }
      }, 500);
    } catch (err) {
      setError('Failed to set CSRF token');
      setMessage(`CSRF error: ${err.message}`);
      toast.error('Failed to set CSRF token');
      setLoading(false);
    }
  };
  
  return (
    <>
      {/* Toast container (should be in your App.js, but safe here for demo) */}
      {/* <Toaster position="top-right" /> */}
      <div className="auth-container">
        <div className="auth-sidebar">
          <div className="logo-container">
            <div className="icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white" />
              </svg>
            </div>
          </div>
          <h1>EMSI Club Management</h1>
          <p>A centralized platform to connect with university clubs, apply for membership, and participate in exciting events.</p>
        </div>
        
        <div className="auth-content">
          <div className="auth-form-container">
            <h2>Welcome Back</h2>
            <p className="subtitle">Sign in to access your club dashboard</p>
            
            <UserTypeSelector 
              selectedType={selectedType} 
              onTypeChange={handleTypeChange} 
            />
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <Input
                  label="Institutional Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@emsi-edu.ma"
                  required
                />
              </div>
              
              <div className="form-group">
                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <div className="form-row space-between">
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <Link to="/reset-password" className="link">Forgot your password?</Link>
              </div>
              
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              <p className="auth-footer">
                Don't have an account? <Link to="/register" className="link">Register now</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;