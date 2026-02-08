import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { Link, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        
        Keyboard.dismiss();
        
        try {
            setLoading(true);
            await login(email, password);
        } catch (error: any) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView className="flex-1">
            <KeyboardAwareScrollView 
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={20}
            >
                <View className="mb-10">
                    <ThemedText type="title" className="text-3xl font-bold text-center text-red-600 mb-2">Avenger Empire</ThemedText>
                    <ThemedText className="text-center text-gray-500">Welcome Back!</ThemedText>
                </View>

                <View className="space-y-4">
                    <View>
                        <ThemedText className="mb-2 font-medium">Email</ThemedText>
                        <TextInput
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholderTextColor="#9CA3AF"
                            returnKeyType="next"
                            onSubmitEditing={() => {}}
                        />
                    </View>

                    <View>
                        <ThemedText className="mb-2 font-medium">Password</ThemedText>
                        <TextInput
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                            placeholderTextColor="#9CA3AF"
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className="bg-red-600 py-4 rounded-xl mt-6">
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <ThemedText className="text-white text-center font-bold text-lg">Login</ThemedText>
                        )}
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-4">
                        <ThemedText className="text-gray-500">Don't have an account? </ThemedText>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <ThemedText className="text-red-600 font-bold">Sign Up</ThemedText>
                            </TouchableOpacity>
                        </Link>
                    </View>
                    <View className="flex-row justify-center mt-4">
                        <Link href="/(tabs)/explore" asChild>
                            <TouchableOpacity>
                                <ThemedText className="text-gray-400 text-sm">Continue as Guest</ThemedText>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </ThemedView>
    );
}
