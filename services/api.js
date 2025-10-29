import axios from 'axios';
import { Platform } from 'react-native';

// ⚠️ REMPLACER 192.168.1.25 par VOTRE IP locale
const LOCAL_IP = '172.22.128.1';

const getApiUrl = () => {
  if (__DEV__) {
    const platform = Platform.OS;
    
    // Pour tous les cas en dev : utiliser l'IP locale
    if (platform === 'android') {
      // Android Emulator peut utiliser l'IP locale
      return `http://${LOCAL_IP}:3000`;
    } else if (platform === 'ios') {
      // iOS Simulator utilise aussi l'IP locale
      return `http://${LOCAL_IP}:3000`;
    }
  }
  
  // Appareil physique : même IP
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

// Intercepteur pour débugger
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