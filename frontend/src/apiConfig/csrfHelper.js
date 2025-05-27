// csrfHelper.js

import { axiosInstance } from "./axios";


export const csrfPost = async (url, data = {}) => {
  await axiosInstance.get('/sanctum/csrf-cookie');

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  const config = {
    headers: {
      'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
    },
    withCredentials: true,
  };

  return axiosInstance.post(url, data, config);
};


export const csrfRequest = async (method, url, data = {}) => {
  await axiosInstance.get('/sanctum/csrf-cookie');

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  const config = {
    headers: {
      'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
    },
    withCredentials: true,
  };

  return axiosInstance({ method, url, data, ...config });
};




export const securePost = async (url, data = {}) => {
  await axiosInstance.get('/sanctum/csrf-cookie');
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  return axiosInstance.post(url, data, {
    headers: {
      'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
    },
    withCredentials: true,
  });
};
