import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import api from '@/constants/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role?: string, sellerProfile?: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                // Set default header for future requests
                api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            await AsyncStorage.setItem('user', JSON.stringify(data));
            router.replace('/(tabs)/explore');
        } catch (error: any) {
            console.error("Login failed", error.response?.data?.message || error.message);
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string, role: string = 'user', sellerProfile?: any) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role, sellerProfile });
            setUser(data);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            await AsyncStorage.setItem('user', JSON.stringify(data));
            router.replace('/(tabs)/explore');
        } catch (error: any) {
            console.error("Registration failed", error.response?.data?.message || error.message);
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        await AsyncStorage.removeItem('user');
        router.replace('/(auth)/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
