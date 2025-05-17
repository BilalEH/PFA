
// src/components/auth/ResetPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import '../../styles/authStyles.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reset password for:', email);
    // API call to send reset password link would go here
  };
  
  return (
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
          <h2>Reset Password</h2>
          <p className="subtitle">Enter your email and we'll send you instructions to reset your password</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <Input
                label="Institutional Email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="student@emsi-edu.ma"
                required
              />
            </div>
            
            <Button type="submit" fullWidth icon="key">Send Reset Link</Button>
            
            <p className="auth-footer">
              Remember your password? <Link to="/login" className="link">Back to login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
