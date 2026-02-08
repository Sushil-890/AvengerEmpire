import { View, TouchableOpacity, ImageBackground, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ImperialColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        Alert.alert(
            "Imperial Logout",
            "Are you sure you wish to leave the empire?",
            [
                { text: "Stay", style: "cancel" },
                { text: "Leave", style: "destructive", onPress: async () => await logout() }
            ]
        );
    };

    if (!user) {
        return (
            <ThemedView 
                className="flex-1 justify-center items-center p-6"
                style={{ backgroundColor: ImperialColors.neutral.black }}>
                <View 
                    className="p-8 rounded-full mb-8 border"
                    style={{ 
                        backgroundColor: ImperialColors.neutral.darkGray,
                        borderColor: ImperialColors.primary.gold + '30'
                    }}>
                    <MaterialIcons name="person" size={64} color={ImperialColors.primary.gold} />
                </View>
                <ThemedText 
                    className="text-2xl font-bold mb-4 tracking-wider"
                    style={{ color: ImperialColors.neutral.white }}>
                    NOT IN THE EMPIRE
                </ThemedText>
                <ThemedText 
                    className="text-center mb-8 text-lg"
                    style={{ color: ImperialColors.neutral.silver }}>
                    Join the imperial ranks to access{'\n'}your royal profile and orders.
                </ThemedText>
                <TouchableOpacity
                    onPress={() => router.push('/(auth)/login')}
                    className="py-4 px-8 rounded-full border"
                    style={{ 
                        backgroundColor: ImperialColors.primary.gold,
                        borderColor: ImperialColors.primary.darkGold
                    }}>
                    <ThemedText 
                        className="font-bold text-lg tracking-wider"
                        style={{ color: ImperialColors.neutral.black }}>
                        JOIN THE EMPIRE
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ThemedView 
            className="flex-1"
            style={{ backgroundColor: ImperialColors.neutral.black }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Imperial Profile Header */}
                <ImageBackground
                    source={require('@/assets/images/kohinoor_clean_hero_1768133543715.png')}
                    className="mb-8 rounded-2xl overflow-hidden"
                    style={{ minHeight: 240 }}
                    resizeMode="cover">
                    <LinearGradient
                        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
                        className="flex-1 justify-center items-center p-8">
                        <View 
                            className="w-28 h-28 rounded-full justify-center items-center mb-4 border-2"
                            style={{ 
                                backgroundColor: ImperialColors.neutral.darkGray,
                                borderColor: ImperialColors.primary.gold
                            }}>
                            <MaterialIcons name="person" size={56} color={ImperialColors.primary.gold} />
                        </View>
                        <ThemedText 
                            className="text-2xl font-bold tracking-wider mb-2"
                            style={{ color: ImperialColors.neutral.white }}>
                            {user.name.toUpperCase()}
                        </ThemedText>
                        <ThemedText 
                            className="mb-4 tracking-wide"
                            style={{ color: ImperialColors.neutral.silver }}>
                            {user.email}
                        </ThemedText>
                        <View 
                            className="px-5 py-2 rounded-full border"
                            style={{ 
                                backgroundColor: ImperialColors.primary.gold + '20',
                                borderColor: ImperialColors.primary.gold
                            }}>
                            <ThemedText 
                                className="font-bold text-sm tracking-widest"
                                style={{ color: ImperialColors.primary.gold }}>
                                {user.role.toUpperCase()} RANK
                            </ThemedText>
                        </View>
                    </LinearGradient>
                </ImageBackground>

                {/* Imperial Menu Items */}
                <View 
                    className="rounded-xl overflow-hidden mb-6 border"
                    style={{ 
                        backgroundColor: ImperialColors.neutral.darkGray,
                        borderColor: ImperialColors.primary.gold + '30'
                    }}>
                    <TouchableOpacity
                        onPress={() => router.push('/orders')}
                        className="flex-row items-center p-5 border-b"
                        style={{ borderBottomColor: ImperialColors.neutral.mediumGray }}>
                        <View 
                            className="p-3 rounded-lg mr-4"
                            style={{ backgroundColor: ImperialColors.primary.gold + '20' }}>
                            <MaterialIcons name="inventory" size={24} color={ImperialColors.primary.gold} />
                        </View>
                        <ThemedText 
                            className="flex-1 font-bold text-lg tracking-wide"
                            style={{ color: ImperialColors.neutral.white }}>
                            ROYAL ORDERS
                        </ThemedText>
                        <MaterialIcons name="chevron-right" size={24} color={ImperialColors.primary.gold} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-row items-center p-5 border-b"
                        style={{ borderBottomColor: ImperialColors.neutral.mediumGray }}>
                        <View 
                            className="p-3 rounded-lg mr-4"
                            style={{ backgroundColor: ImperialColors.accent.bronze + '20' }}>
                            <MaterialIcons name="location-on" size={24} color={ImperialColors.accent.bronze} />
                        </View>
                        <ThemedText 
                            className="flex-1 font-bold text-lg tracking-wide"
                            style={{ color: ImperialColors.neutral.white }}>
                            ROYAL ADDRESSES
                        </ThemedText>
                        <MaterialIcons name="chevron-right" size={24} color={ImperialColors.primary.gold} />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center p-5">
                        <View 
                            className="p-3 rounded-lg mr-4"
                            style={{ backgroundColor: ImperialColors.neutral.silver + '20' }}>
                            <MaterialIcons name="settings" size={24} color={ImperialColors.neutral.silver} />
                        </View>
                        <ThemedText 
                            className="flex-1 font-bold text-lg tracking-wide"
                            style={{ color: ImperialColors.neutral.white }}>
                            IMPERIAL SETTINGS
                        </ThemedText>
                        <MaterialIcons name="chevron-right" size={24} color={ImperialColors.primary.gold} />
                    </TouchableOpacity>
                </View>

                {/* Imperial Merchant Zone */}
                {(user.role === 'seller' || user.role === 'admin') && (
                    <View 
                        className="rounded-xl overflow-hidden mb-6 border"
                        style={{ 
                            backgroundColor: ImperialColors.neutral.darkGray,
                            borderColor: ImperialColors.primary.gold
                        }}>
                        <View 
                            className="p-4 border-b"
                            style={{ 
                                backgroundColor: ImperialColors.primary.gold + '10',
                                borderBottomColor: ImperialColors.primary.gold + '30'
                            }}>
                            <ThemedText 
                                className="font-bold text-xs uppercase tracking-[3px]"
                                style={{ color: ImperialColors.primary.gold }}>
                                IMPERIAL MERCHANT ZONE
                            </ThemedText>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/seller/dashboard')}
                            className="flex-row items-center p-5">
                            <View 
                                className="p-3 rounded-lg mr-4"
                                style={{ backgroundColor: ImperialColors.primary.gold + '20' }}>
                                <MaterialIcons name="store" size={24} color={ImperialColors.primary.gold} />
                            </View>
                            <ThemedText 
                                className="flex-1 font-bold text-lg tracking-wide"
                                style={{ color: ImperialColors.neutral.white }}>
                                MERCHANT THRONE
                            </ThemedText>
                            <MaterialIcons name="chevron-right" size={24} color={ImperialColors.primary.gold} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Imperial Logout */}
                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center p-5 rounded-xl justify-center border"
                    style={{ 
                        backgroundColor: ImperialColors.secondary.crimson + '20',
                        borderColor: ImperialColors.secondary.crimson
                    }}>
                    <MaterialIcons name="logout" size={24} color={ImperialColors.secondary.crimson} style={{ marginRight: 8 }} />
                    <ThemedText 
                        className="font-bold text-lg tracking-wider"
                        style={{ color: ImperialColors.secondary.crimson }}>
                        LEAVE EMPIRE
                    </ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}