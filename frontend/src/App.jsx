import React from 'react';
import {RouterProvider } from 'react-router-dom';
import './styles/authStyles.css';
import { router } from "./routes";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
