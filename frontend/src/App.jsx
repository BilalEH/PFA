// src/App.jsx
import React from 'react';
import {RouterProvider } from 'react-router-dom';
import './styles/authStyles.css';
import { router } from "./routes";
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
