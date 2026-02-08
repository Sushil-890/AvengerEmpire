import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get your computer's IP address for physical device testing
// Replace this with your actual IP address when needed
const COMPUTER_IP = '192.168.152.220'; // Your current IP address

const getServerUrl = () => {
    const { manifest } = Constants;
    
    // For Expo development - this will automatically detect your IP
    if (manifest?.debuggerHost) {
        const debuggerHost = manifest.debuggerHost.split(':').shift();
        return `http://${debuggerHost}:5000`;
    }
    
    // For physical devices, use your computer's IP
    if (__DEV__) {
        return `http://${COMPUTER_IP}:5000`;
    }
    
    // Fallback based on platform
    if (Platform.OS === 'android') {
        // For Android emulator
        return 'http://10.0.2.2:5000';
    } else {
        // For iOS simulator
        return 'http://localhost:5000';
    }
};

export const SERVER_URL = getServerUrl();
const API_BASE_URL = `${SERVER_URL}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

api.interceptors.request.use(request => {
    console.log('🚀 API Request:', {
        method: request.method?.toUpperCase(),
        url: request.url,
        baseURL: request.baseURL,
        fullURL: `${request.baseURL}${request.url}`
    });
    return request;
});

api.interceptors.response.use(
    response => {
        console.log('✅ API Success:', {
            status: response.status,
            url: response.config.url
        });
        return response;
    }, 
    error => {
        console.log('❌ API Error:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            url: error.config?.url,
            baseURL: error.config?.baseURL
        });
        
        if (error.code === 'ERR_NETWORK') {
            console.log('🔍 Network Error Details:');
            console.log('- Check if server is running on port 5000');
            console.log('- Current server URL:', SERVER_URL);
            console.log('- If using physical device, make sure both devices are on same WiFi');
        }
        
        return Promise.reject(error);
    }
);

export default api;
