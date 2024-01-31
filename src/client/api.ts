import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : import.meta.env.VITE_BACKEND_URL,
});
