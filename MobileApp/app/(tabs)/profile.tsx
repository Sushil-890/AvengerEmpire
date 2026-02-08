import { View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: async () => await logout() }
            ]
        );
    };

    if (!user) {
        return (
            <ThemedView className="flex-1 justify-center items-center p-6">
                <ThemedText type="title" className="mb-2">Not Logged In</ThemedText>
                <ThemedText className="text-gray-500 text-center mb-8">Please login to view your profile and orders.</ThemedText>
                <TouchableOpacity
                    onPress={() => router.push('/(auth)/login')}
                    className="bg-red-600 py-3 px-8 rounded-full">
                    <ThemedText className="text-white font-semibold">Login / Sign Up</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ThemedView className="flex-1">
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Profile Header */}
                <View className="items-center mb-8">
                    <View className="w-24 h-24 bg-gray-200 rounded-full justify-center items-center mb-4">
                        <MaterialIcons name="person" size={48} color="#9CA3AF" />
                    </View>
                    <ThemedText type="title" className="text-2xl">{user.name}</ThemedText>
                    <ThemedText className="text-gray-500">{user.email}</ThemedText>
                </View>

                {/* Menu Items */}
                <View className="bg-gray-50 dark:bg-zinc-800 rounded-xl overflow-hidden mb-6">
                    <TouchableOpacity
                        onPress={() => router.push('/orders')}
                        className="flex-row items-center p-4 border-b border-gray-200 dark:border-zinc-700">
                        <View className="bg-blue-100 p-2 rounded-lg mr-4">
                            <MaterialIcons name="inventory" size={24} color="#2563EB" />
                        </View>
                        <ThemedText className="flex-1 font-medium text-lg">My Orders</ThemedText>
                        <MaterialIcons name="chevron-right" size={24} color="gray" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200 dark:border-zinc-700">
                        <View className="bg-purple-100 p-2 rounded-lg mr-4">
                            <MaterialIcons name="location-on" size={24} color="#9333EA" />
                        </View>
                        <ThemedText className="flex-1 font-medium text-lg">Shipping Addresses</ThemedText>
                        <MaterialIcons name="chevron-right" size={24} color="gray" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center p-4">
                        <View className="bg-amber-100 p-2 rounded-lg mr-4">
                            <MaterialIcons name="settings" size={24} color="#D97706" />
                        </View>
                        <ThemedText className="flex-1 font-medium text-lg">Settings</ThemedText>
                        <MaterialIcons name="chevron-right" size={24} color="gray" />
                    </TouchableOpacity>
                </View>

                {/* Seller Menu - Only if user is seller (or admin) */}
                {(user.role === 'seller' || user.role === 'admin') && (
                    <View className="bg-gray-50 dark:bg-zinc-800 rounded-xl overflow-hidden mb-6">
                        <View className="p-4 border-b border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900">
                            <ThemedText className="font-bold text-gray-500 text-sm uppercase">Seller Zone</ThemedText>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/seller/dashboard')}
                            className="flex-row items-center p-4">
                            <View className="bg-red-100 p-2 rounded-lg mr-4">
                                <MaterialIcons name="store" size={24} color="#DC2626" />
                            </View>
                            <ThemedText className="flex-1 font-medium text-lg">Seller Dashboard</ThemedText>
                            <MaterialIcons name="chevron-right" size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl justify-center">
                    <MaterialIcons name="logout" size={24} color="#DC2626" style={{ marginRight: 8 }} />
                    <ThemedText className="text-red-600 font-bold text-lg">Logout</ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}
