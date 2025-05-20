import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import PasswordInput from '../ui/PasswordInput';
import Button from '../ui/Button';
import { axiosInstance } from '../../apiConfig/axios';
import '../../styles/authStyles.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    yearOfStudy: '',
    branch: '',      
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching CSRF token...');
      await axiosInstance.get('/sanctum/csrf-cookie');
      console.log('CSRF token fetched!');
      setMessage('CSRF token fetched, attempting registration...');

      setTimeout(async () => {
        try {
          console.log('Attempting registration...');
          const token = getCookie('XSRF-TOKEN');
          console.log('Found CSRF token in cookie:', token ? 'Yes' : 'No');

          const headers = {};
          if (token) {
            headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
          }

          const response = await axiosInstance.post(
            '/register',
            {
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              student_id: formData.studentId,
              year_of_study: formData.yearOfStudy,
              branch: formData.branch,
              password: formData.password,
              password_confirmation: formData.confirmPassword,
              user_type: 'student',
            },
            { headers }
          );

          console.log('Registration successful:', response.data);
          setMessage('Registration successful! Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/student/dashboard');
          }, 2000);
        } catch (err) {
          console.error('Registration error:', err);
          setError(err.response?.data?.message || 'Registration failed');
          setMessage(`Registration failed: ${err.message}`);
        } finally {
          setLoading(false);
        }
      }, 500);
    } catch (err) {
      console.error('CSRF token error:', err);
      setError('Failed to set CSRF token');
      setMessage(`CSRF error: ${err.message}`);
      setLoading(false);
    }
  };

  const branches = [
    'Computer Science',
    'Business Intelligence',
    'Electronics',
    'Civil Engineering',
    'Management',
    'Marketing',
  ];

  const yearsOfStudy = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

  return (
    <div className="auth-container">
      <div className="auth-sidebar">
        <div className="logo-container">
          <div className="icon-circle">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        <h1>EMSI Club Management</h1>
        <p>
          A centralized platform to connect with university clubs, apply for membership, and
          participate in exciting events.
        </p>
      </div>

      <div className="auth-content">
        <div className="auth-form-container">
          <h2>Create Your Account</h2>
          <p className="subtitle">Join our platform to access and manage university clubs</p>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="status-message">{message}</div>}

          <div className="user-type-selector" style={{ justifyContent: 'center', marginBottom: '20px' }}>
            <div className="type-option active">
              <div className="type-label">Student</div>
              <div className="type-description">Join clubs and events</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group half">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group half">
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <Input
                label="Institutional Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@emsi-edu.ma"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group third">
                <Input
                  label="Student ID"
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group third">
                <label>
                  Year of Study<span className="required">*</span>
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an option</option>
                  {yearsOfStudy.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group third">
                <label>
                  Branch<span className="required">*</span>
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an option</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <PasswordInput
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="agreeToTerms">
                I agree to the{' '}
                <a href="/terms" className="link">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="link">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <p className="auth-footer">
              Already have an account?{' '}
              <Link to="/login" className="link">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;