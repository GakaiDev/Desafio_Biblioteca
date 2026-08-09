import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config.url || '';
      
      const isLoginRequest = url.endsWith('/login');
      const isAlreadyOnLoginPage = window.location.pathname === '/login' || window.location.pathname === '/';

      if (!isLoginRequest && !isAlreadyOnLoginPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userName');
        localStorage.removeItem('senha_provisoria');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;