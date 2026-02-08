import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useImperialColors } from '@/hooks/use-imperial-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SettingsScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const colors = useImperialColors();

    const settingsOptions = [
        {
            icon: 'person',
            title: 'Profile Information',
            subtitle: 'View your account details',
            onPress: () => router.push('/profile'),
            color: colors.primary.gold
        },
        {
            icon: 'location-on',
            title: 'Delivery Address',
            subtitle: 'Manage your shipping address',
            onPress: () => router.push('/address'),
            color: colors.accent.bronze
        },
        {
            icon: 'notifications',
            title: 'Notifications',
            subtitle: 'Manage notification preferences',
            onPress: () => {},
            color: colors.secondary.crimson
        },
        {
            icon: 'security',
            title: 'Privacy & Security',
            subtitle: 'Password and security settings',
            onPress: () => {},
            color: colors.neutral.silver
        },
    ];

    return (
        <ThemedView className="flex-1" style={{ backgroundColor: colors.neutral.black }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Header */}
                <View className="mb-6">
                    <ThemedText 
                        className="text-2xl font-bold mb-2 tracking-wide"
                        style={{ color: colors.neutral.white }}>
                        Imperial Settings
                    </ThemedText>
                    <ThemedText 
                        className="text-sm"
                        style={{ color: colors.neutral.silver }}>
                        Manage your account and preferences
                    </ThemedText>
                </View>

                {/* User Info Card */}
                <View 
                    className="p-5 rounded-xl mb-6 border"
                    style={{ 
                        backgroundColor: colors.neutral.darkGray,
                        borderColor: colors.primary.gold + '30'
                    }}>
                    <View className="flex-row items-center mb-4">
                        <View 
                            className="w-16 h-16 rounded-full justify-center items-center mr-4"
                            style={{ backgroundColor: colors.primary.gold + '20' }}>
                            <MaterialIcons name="person" size={32} color={colors.primary.gold} />
                        </View>
                        <View className="flex-1">
                            <ThemedText 
                                className="text-xl font-bold mb-1"
                                style={{ color: colors.neutral.white }}>
                                {user?.name}
                            </ThemedText>
                            <ThemedText 
                                className="text-sm"
                                style={{ color: colors.neutral.silver }}>
                                {user?.email}
                            </ThemedText>
                        </View>
                    </View>
                    <View 
                        className="px-3 py-2 rounded-full self-start"
                        style={{ backgroundColor: colors.primary.gold + '20' }}>
                        <ThemedText 
                            className="text-xs font-bold tracking-wider"
                            style={{ color: colors.primary.gold }}>
                            {user?.role?.toUpperCase()} RANK
                        </ThemedText>
                    </View>
                </View>

                {/* Settings Options */}
                <View 
                    className="rounded-xl overflow-hidden border"
                    style={{ 
                        backgroundColor: colors.neutral.darkGray,
                        borderColor: colors.primary.gold + '20'
                    }}>
                    {settingsOptions.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={option.onPress}
                            className="flex-row items-center p-4"
                            style={{ 
                                borderBottomWidth: index < settingsOptions.length - 1 ? 1 : 0,
                                borderBottomColor: colors.neutral.mediumGray
                            }}>
                            <View 
                                className="p-3 rounded-lg mr-4"
                                style={{ backgroundColor: option.color + '20' }}>
                                <MaterialIcons name={option.icon as any} size={24} color={option.color} />
                            </View>
                            <View className="flex-1">
                                <ThemedText 
                                    className="font-bold text-base mb-1"
                                    style={{ color: colors.neutral.white }}>
                                    {option.title}
                                </ThemedText>
                                <ThemedText 
                                    className="text-sm"
                                    style={{ color: colors.neutral.silver }}>
                                    {option.subtitle}
                                </ThemedText>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color={colors.primary.gold} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* App Info */}
                <View className="mt-8 items-center">
                    <ThemedText 
                        className="text-sm mb-2"
                        style={{ color: colors.neutral.silver }}>
                        Avenger Empire
                    </ThemedText>
                    <ThemedText 
                        className="text-xs"
                        style={{ color: colors.neutral.silver }}>
                        Version 1.0.0
                    </ThemedText>
                </View>
            </ScrollView>
        </ThemedView>
    );
}
