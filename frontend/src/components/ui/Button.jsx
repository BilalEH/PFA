
// src/components/ui/Button.jsx
import React from 'react';
import '../../styles/authStyles.css';

const Button = ({ children, type, onClick, fullWidth, icon }) => {
  const renderIcon = () => {
    if (icon === 'key') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 10H12.65C11.83 7.67 9.61 6 7 6C3.69 6 1 8.69 1 12C1 15.31 3.69 18 7 18C9.61 18 11.83 16.33 12.65 14H13V16H15V14H17V16H19V14H21V10ZM7 15C5.35 15 4 13.65 4 12C4 10.35 5.35 9 7 9C8.65 9 10 10.35 10 12C10 13.65 8.65 15 7 15Z" fill="currentColor" />
        </svg>
      );
    } else if (icon === 'user') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
        </svg>
      );
    }
    return null;
  };
  
  return (
    <button 
      type={type || 'button'} 
      className={`btn ${fullWidth ? 'btn-full' : ''}`}
      onClick={onClick}
    >
      {icon && <span className="btn-icon">{renderIcon()}</span>}
      {children}
    </button>
  );
};

export default Button;
