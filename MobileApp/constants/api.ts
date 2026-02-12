import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Production API URL
const PRODUCTION_API_URL = 'https://avengerempire.onrender.com';

// Development IP - for local testing only
// const DEVELOPMENT_IP = '192.168.152.220';

const getServerUrl = () => {
    // Use production URL by default
    // Only use local IP in development mode
    // if (__DEV__ && DEVELOPMENT_IP) {
    //     return `http://${DEVELOPMENT_IP}:5000`;
    // }
    return PRODUCTION_API_URL;
};

export const SERVER_URL = getServerUrl();
const API_BASE_URL = `${SERVER_URL}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
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
            console.log('- Check if server is running');
            console.log('- Current server URL:', SERVER_URL);
            if (__DEV__) {
                console.log('- If using local development, check IP address and port');
            }
        }

        return Promise.reject(error);
    }
);

export default api;
