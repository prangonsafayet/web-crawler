import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`;
  return config;
});

export default api;
