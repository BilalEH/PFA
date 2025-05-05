// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ResetPassword from './components/auth/ResetPassword';
import './styles/authStyles.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Login />} /> {/* fallback vers Login */}
    </Routes>
  );
}

export default App;
