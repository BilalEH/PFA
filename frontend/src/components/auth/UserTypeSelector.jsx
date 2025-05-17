// src/components/auth/UserTypeSelector.jsx 
import React from 'react';
import '../../styles/authStyles.css';

const UserTypeSelector = ({ selectedType, onTypeChange }) => {
  const userTypes = [                                                  
    { id: 'student', label: 'Student', description: 'Join clubs and events' },
    { id: 'club-admin', label: 'Club Admin', description: 'Create and manage clubs' },
    { id: 'system-admin', label: 'System Admin', description: 'Full platform access' }
  ];
  
  return (
    <div className="user-type-selector">
      {userTypes.map((type) => (
        <div 
          key={type.id}
          className={`type-option ${selectedType === type.id ? 'active' : ''}`}
          onClick={() => onTypeChange(type.id)}
        >
          <div className="type-label">{type.label}</div>
          <div className="type-description">{type.description}</div>
        </div>
      ))}
    </div>
  );
};

export default UserTypeSelector;
