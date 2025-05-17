import React from 'react';
import '../../styles/authStyles.css';

const Input = ({ label, type, name, value, onChange, placeholder, required }) => {
  return (
    <>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type || 'text'}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </>
  );
};

export default Input;
