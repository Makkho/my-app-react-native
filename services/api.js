import axios from 'axios';
import { Platform } from 'react-native';

// ⚠️ REMPLACER par VOTRE IP locale
const LOCAL_IP = '172.23.128.1';

const getApiUrl = () => {
  if (__DEV__) {
    const platform = Platform.OS;
    
    if (platform === 'android') {
      return `http://${LOCAL_IP}:3000`;
    } else if (platform === 'ios') {
      return `http://${LOCAL_IP}:3000`;
    }
  }
  
  return `http://${LOCAL_IP}:3000`;
};

export const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    console.log('📡 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('❌ API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Check if API is running.');
    }
    return Promise.reject(error);
  }
);

export default api;