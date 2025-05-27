// src/api/axios.js
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Your Laravel backend
  withCredentials: true, // Important for sending cookies (including XSRF-TOKEN)
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  },
});

