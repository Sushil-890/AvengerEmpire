import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/themed-view';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSeller, setIsSeller] = useState(false);
    const [shopName, setShopName] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (isSeller && !shopName) {
            Alert.alert('Error', 'Please enter your Shop Name');
            return;
        }

        try {
            setLoading(true);
            const role = isSeller ? 'seller' : 'user';
            const sellerProfile = isSeller ? { shopName } : undefined;
            await register(name, email, password, role, sellerProfile);
        } catch (error: any) {
            Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView className="flex-1">
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled">
                <View className="mb-8">
                    <ThemedText type="title" className="text-3xl font-bold text-center text-red-600 mb-2">Join Empire</ThemedText>
                    <ThemedText className="text-center text-gray-500">Create your account to get started</ThemedText>
                </View>

                <View className="space-y-4">
                <View>
                    <ThemedText className="mb-2 font-medium">Full Name</ThemedText>
                    <TextInput
                        placeholder="John Doe"
                        value={name}
                        onChangeText={setName}
                        className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View>
                    <ThemedText className="mb-2 font-medium">Email</ThemedText>
                    <TextInput
                        placeholder="name@example.com"
                        value={email}
                        onChangeText={setEmail}
                        className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View>
                    <ThemedText className="mb-2 font-medium">Password</ThemedText>
                    <TextInput
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View>
                    <ThemedText className="mb-2 font-medium">Confirm Password</ThemedText>
                    <TextInput
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View className="flex-row items-center justify-between bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <ThemedText className="font-medium">Join as Seller</ThemedText>
                    <Switch
                        value={isSeller}
                        onValueChange={setIsSeller}
                        trackColor={{ false: "#767577", true: "#DC2626" }}
                        thumbColor={isSeller ? "#f4f3f4" : "#f4f3f4"}
                    />
                </View>

                {isSeller && (
                    <View>
                        <ThemedText className="mb-2 font-medium">Shop Name</ThemedText>
                        <TextInput
                            placeholder="My Awesome Store"
                            value={shopName}
                            onChangeText={setShopName}
                            className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                )}

                <TouchableOpacity
                    onPress={handleRegister}
                    disabled={loading}
                    className="bg-red-600 py-4 rounded-xl mt-6">
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <ThemedText className="text-white text-center font-bold text-lg">
                            {isSeller ? "Register Shop" : "Sign Up"}
                        </ThemedText>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                    <ThemedText className="text-gray-500">Already have an account? </ThemedText>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <ThemedText className="text-red-600 font-bold">Login</ThemedText>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
            </KeyboardAwareScrollView>
        </ThemedView>
    );
}
