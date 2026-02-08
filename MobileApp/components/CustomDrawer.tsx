import React from 'react';
import { View, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useImperialColors } from '@/hooks/use-imperial-colors';
import { LinearGradient } from 'expo-linear-gradient';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const colors = useImperialColors();

    const handleLogout = async () => {
        Alert.alert(
            "Imperial Logout",
            "Are you sure you wish to leave the empire?",
            [
                { text: "Stay", style: "cancel" },
                { text: "Leave", style: "destructive", onPress: async () => {
                    await logout();
                    props.navigation.closeDrawer();
                }}
            ]
        );
    };

    const navigateAndClose = (route: string) => {
        router.push(route as any);
        props.navigation.closeDrawer();
    };

    if (!user) {
        return (
            <View className="flex-1" style={{ backgroundColor: colors.neutral.black }}>
                <DrawerContentScrollView {...props} className="flex-1">
                    <View className="flex-1 p-6">
                        {/* Imperial Header */}
                        <ImageBackground
                            source={require('@/assets/images/kohinoor_clean_hero_1768133543715.png')}
                            className="mb-8 rounded-2xl overflow-hidden"
                            style={{ minHeight: 200 }}
                            resizeMode="cover">
                            <LinearGradient
                                colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
                                className="flex-1 justify-center items-center p-6">
                                <View 
                                    className="w-20 h-20 rounded-full justify-center items-center mb-4 border-2"
                                    style={{ 
                                        backgroundColor: colors.neutral.darkGray,
                                        borderColor: colors.primary.gold
                                    }}>
                                    <MaterialIcons name="person" size={40} color={colors.primary.gold} />
                                </View>
                                <ThemedText 
                                    className="text-2xl font-bold mb-2 tracking-wider text-center"
                                    style={{ color: colors.neutral.white }}>
                                    WELCOME TO THE{'\n'}EMPIRE
                                </ThemedText>
                                <ThemedText 
                                    className="text-center tracking-wide"
                                    style={{ color: colors.neutral.silver }}>
                                    Join the imperial ranks to access{'\n'}exclusive royal privileges
                                </ThemedText>
                            </LinearGradient>
                        </ImageBackground>

                        {/* Imperial Login Button */}
                        <TouchableOpacity
                            onPress={() => navigateAndClose('/(auth)/login')}
                            className="py-4 rounded-xl flex-row justify-center items-center mb-6 border"
                            style={{ 
                                backgroundColor: colors.primary.gold,
                                borderColor: colors.primary.darkGold
                            }}>
                            <MaterialIcons name="login" size={24} color={colors.neutral.black} style={{ marginRight: 8 }} />
                            <ThemedText 
                                className="font-bold text-lg tracking-wider"
                                style={{ color: colors.neutral.black }}>
                                JOIN THE EMPIRE
                            </ThemedText>
                        </TouchableOpacity>

                        {/* Guest Options */}
                        <View 
                            className="rounded-xl overflow-hidden border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold + '30'
                            }}>
                            <TouchableOpacity
                                onPress={() => navigateAndClose('/(tabs)/explore')}
                                className="flex-row items-center p-4 border-b"
                                style={{ borderBottomColor: colors.neutral.mediumGray }}>
                                <View 
                                    className="p-3 rounded-lg mr-4"
                                    style={{ backgroundColor: colors.primary.gold + '20' }}>
                                    <MaterialIcons name="explore" size={24} color={colors.primary.gold} />
                                </View>
                                <ThemedText 
                                    className="flex-1 font-bold text-lg tracking-wide"
                                    style={{ color: colors.neutral.white }}>
                                    EXPLORE REALM
                                </ThemedText>
                                <MaterialIcons name="chevron-right" size={24} color={colors.primary.gold} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigateAndClose('/cart')}
                                className="flex-row items-center p-4">
                                <View 
                                    className="p-3 rounded-lg mr-4"
                                    style={{ backgroundColor: colors.secondary.crimson + '20' }}>
                                    <MaterialIcons name="shopping-cart" size={24} color={colors.secondary.crimson} />
                                </View>
                                <ThemedText 
                                    className="flex-1 font-bold text-lg tracking-wide"
                                    style={{ color: colors.neutral.white }}>
                                    ROYAL CART
                                </ThemedText>
                                <MaterialIcons name="chevron-right" size={24} color={colors.primary.gold} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </DrawerContentScrollView>
            </View>
        );
    }

    return (
        <View className="flex-1" style={{ backgroundColor: colors.neutral.black }}>
            <DrawerContentScrollView {...props} className="flex-1">
                <View className="flex-1 p-6">
                    {/* Imperial Profile Header */}
                    <ImageBackground
                        source={require('@/assets/images/kohinoor_clean_hero_1768133543715.png')}
                        className="mb-8 rounded-2xl overflow-hidden"
                        style={{ minHeight: 220 }}
                        resizeMode="cover">
                        <LinearGradient
                            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
                            className="flex-1 justify-center items-center p-6">
                            <View 
                                className="w-24 h-24 rounded-full justify-center items-center mb-4 border-2"
                                style={{ 
                                    backgroundColor: colors.neutral.darkGray,
                                    borderColor: colors.primary.gold
                                }}>
                                <MaterialIcons name="person" size={48} color={colors.primary.gold} />
                            </View>
                            <ThemedText 
                                className="text-xl font-bold tracking-wider"
                                style={{ color: colors.neutral.white }}>
                                {user.name.toUpperCase()}
                            </ThemedText>
                            <ThemedText 
                                className="mb-3 tracking-wide"
                                style={{ color: colors.neutral.silver }}>
                                {user.email}
                            </ThemedText>
                            <View 
                                className="px-4 py-2 rounded-full border"
                                style={{ 
                                    backgroundColor: colors.primary.gold + '20',
                                    borderColor: colors.primary.gold
                                }}>
                                <ThemedText 
                                    className="font-bold text-sm tracking-widest"
                                    style={{ color: colors.primary.gold }}>
                                    {user.role.toUpperCase()} RANK
                                </ThemedText>
                            </View>
                        </LinearGradient>
                    </ImageBackground>

                    {/* Imperial Menu Items */}
                    <View 
                        className="rounded-xl overflow-hidden mb-6 border"
                        style={{ 
                            backgroundColor: colors.neutral.darkGray,
                            borderColor: colors.primary.gold + '30'
                        }}>
                        <TouchableOpacity
                            onPress={() => navigateAndClose('/orders')}
                            className="flex-row items-center p-4 border-b"
                            style={{ borderBottomColor: colors.neutral.mediumGray }}>
                            <View 
                                className="p-3 rounded-lg mr-4"
                                style={{ backgroundColor: colors.primary.gold + '20' }}>
                                <MaterialIcons name="inventory" size={24} color={colors.primary.gold} />
                            </View>
                            <ThemedText 
                                className="flex-1 font-bold text-lg tracking-wide"
                                style={{ color: colors.neutral.white }}>
                                ROYAL ORDERS
                            </ThemedText>
                            <MaterialIcons name="chevron-right" size={24} color={colors.primary.gold} />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => navigateAndClose('/(tabs)/explore')}
                            className="flex-row items-center p-4 border-b"
                            style={{ borderBottomColor: colors.neutral.mediumGray }}>
                            <View 
                                className="p-3 rounded-lg mr-4"
                                style={{ backgroundColor: colors.secondary.crimson + '20' }}>
                                <MaterialIcons name="explore" size={24} color={colors.secondary.crimson} />
                            </View>
                            <ThemedText 
                                className="flex-1 font-bold text-lg tracking-wide"
                                style={{ color: colors.neutral.white }}>
                                EXPLORE REALM
                            </ThemedText>
                            <MaterialIcons name="chevron-right" size={24} color={colors.primary.gold} />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => navigateAndClose('/address')}
                            className="flex-row items-center p-4 border-b"
                            style={{ borderBottomColor: colors.neutral.mediumGray }}>
                            <View 
                                className="p-3 rounded-lg mr-4"
                                style={{ backgroundColor: colors.accent.bronze + '20' }}>
                                <MaterialIcons name="location-on" size={24} color={colors.accent.bronze} />
                            </View>
                            <ThemedText 
                                className="flex-1 font-bold text-lg tracking-wide"
                                style={{ color: colors.neutral.white }}>
                                ROYAL ADDRESSES
                            </ThemedText>
                            <MaterialIcons name="chevron-right" size={24} color={colors.primary.gold} />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => navigateAndClose('/settings')}
                            className="flex-row items-center p-4">
                            <View 
                                className="p-3 rounded-lg mr-4"
                                style={{ backgroundColor: colors.neutral.silver + '20' }}>
                                <MaterialIcons name="settings" size={24} color={colors.neutral.silver} />
                            </View>
                            <ThemedText 
                                className="flex-1 font-bold text-lg tracking-wide"
                                style={{ color: colors.neutral.white }}>
                                IMPERIAL SETTINGS
                            </ThemedText>
                            <MaterialIcons name="chevron-right" size={24} color={colors.primary.gold} />
                        </TouchableOpacity>
                    </View>

                    {/* Imperial Merchant Zone */}
                    {(user.role === 'seller' || user.role === 'admin') && (
                        <View 
                            className="rounded-xl overflow-hidden mb-6 border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold
                            }}>
                            <View 
                                className="p-4 border-b"
                                style={{ 
                                    backgroundColor: colors.primary.gold + '10',
                                    borderBottomColor: colors.primary.gold + '30'
                                }}>
                                <ThemedText 
                                    className="font-bold text-xs uppercase tracking-[3px]"
                                    style={{ color: colors.primary.gold }}>
                                    IMPERIAL MERCHANT ZONE
                                </ThemedText>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigateAndClose('/seller/dashboard')}
                                className="flex-row items-center p-4">
                                <View 
                                    className="p-3 rounded-lg mr-4"
                                    style={{ backgroundColor: colors.primary.gold + '20' }}>
                                    <MaterialIcons name="store" size={24} color={colors.primary.gold} />
                                </View>
                                <ThemedText 
                                    className="flex-1 font-bold text-lg tracking-wide"
                                    style={{ color: colors.neutral.white }}>
                                    MERCHANT THRONE
                                </ThemedText>
                                <MaterialIcons name="chevron-right" size={24} color={colors.primary.gold} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Imperial Logout */}
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center p-4 rounded-xl justify-center border"
                        style={{ 
                            backgroundColor: colors.secondary.crimson + '20',
                            borderColor: colors.secondary.crimson
                        }}>
                        <MaterialIcons name="logout" size={24} color={colors.secondary.crimson} style={{ marginRight: 8 }} />
                        <ThemedText 
                            className="font-bold text-lg tracking-wider"
                            style={{ color: colors.secondary.crimson }}>
                            LEAVE EMPIRE
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>
        </View>
    );
}
