import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

export const useAuthNavigation = () => {
    const { user } = useAuth();
    const router = useRouter();

    const requireAuth = (callback?: () => void, message?: string) => {
        if (!user) {
            Alert.alert(
                'Login Required',
                message || 'Please login to continue',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Login', 
                        onPress: () => router.push('/(auth)/login')
                    }
                ]
            );
            return false;
        }
        
        if (callback) callback();
        return true;
    };

    return { requireAuth, isAuthenticated: !!user };
};