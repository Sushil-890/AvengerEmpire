import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/constants/api';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ImperialColors, LightColors } from '@/constants/theme';

export default function CheckoutScreen() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? ImperialColors : LightColors;

    // Form State
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    const handlePlaceOrder = async () => {
        if (!address || !city || !postalCode || !country) {
            Alert.alert('Missing Information', 'Please fill in all shipping details');
            return;
        }

        if (cartItems.length === 0) {
            Alert.alert('Empty Cart', 'Your cart is empty');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                orderItems: cartItems,
                shippingAddress: { address, city, postalCode, country },
                paymentMethod: 'Pending', // Will be updated after payment
                itemsPrice: cartTotal,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: cartTotal,
                isPaid: false, // Order created but not paid yet
            };

            const { data } = await api.post('/orders', orderData);

            // Navigate to payment screen instead of showing success
            router.push(`/payment?orderId=${data._id}&amount=${cartTotal.toFixed(2)}`);
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView className="flex-1" style={{ backgroundColor: colors.neutral.black }}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled">
                <ThemedText 
                    className="text-3xl font-bold mb-6 tracking-wide" 
                    style={{ color: colors.neutral.white }}>
                    Checkout
                </ThemedText>

                {/* Shipping Address Section */}
                <View className="mb-6">
                    <ThemedText 
                        className="text-lg font-bold mb-4 tracking-wide" 
                        style={{ color: colors.neutral.white }}>
                        Shipping Address
                    </ThemedText>
                    <View className="space-y-3">
                        <TextInput
                            placeholder="Street Address"
                            value={address}
                            onChangeText={setAddress}
                            className="p-4 rounded-xl border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.neutral.lightGray,
                                color: colors.neutral.white
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                        <TextInput
                            placeholder="City"
                            value={city}
                            onChangeText={setCity}
                            className="p-4 rounded-xl border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.neutral.lightGray,
                                color: colors.neutral.white
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                        <View className="flex-row space-x-3">
                            <TextInput
                                placeholder="Postal Code"
                                value={postalCode}
                                onChangeText={setPostalCode}
                                className="flex-1 p-4 rounded-xl border"
                                style={{ 
                                    backgroundColor: colors.neutral.darkGray,
                                    borderColor: colors.neutral.lightGray,
                                    color: colors.neutral.white
                                }}
                                placeholderTextColor={colors.neutral.silver}
                            />
                            <TextInput
                                placeholder="Country"
                                value={country}
                                onChangeText={setCountry}
                                className="flex-1 p-4 rounded-xl border"
                                style={{ 
                                    backgroundColor: colors.neutral.darkGray,
                                    borderColor: colors.neutral.lightGray,
                                    color: colors.neutral.white
                                }}
                                placeholderTextColor={colors.neutral.silver}
                            />
                        </View>
                    </View>
                </View>

                {/* Order Summary */}
                <View 
                    className="p-5 rounded-xl mb-6 border" 
                    style={{ 
                        backgroundColor: colors.neutral.darkGray,
                        borderColor: colors.neutral.lightGray
                    }}>
                    <ThemedText 
                        className="text-lg font-bold mb-4 tracking-wide" 
                        style={{ color: colors.neutral.white }}>
                        Order Summary
                    </ThemedText>
                    {cartItems.map((item) => (
                        <View key={item.product} className="flex-row justify-between py-2">
                            <ThemedText 
                                className="flex-1 mr-4" 
                                numberOfLines={1}
                                style={{ color: colors.neutral.silver }}>
                                {item.qty} x {item.name}
                            </ThemedText>
                            <ThemedText 
                                className="font-bold" 
                                style={{ color: colors.neutral.white }}>
                                ${(item.qty * item.price).toFixed(2)}
                            </ThemedText>
                        </View>
                    ))}
                    <View 
                        className="h-[1px] my-4" 
                        style={{ backgroundColor: colors.neutral.lightGray }} 
                    />
                    <View className="flex-row justify-between items-center">
                        <ThemedText 
                            className="text-lg font-bold" 
                            style={{ color: colors.neutral.white }}>
                            Total
                        </ThemedText>
                        <ThemedText 
                            className="text-2xl font-bold" 
                            style={{ color: colors.primary.gold }}>
                            ${cartTotal.toFixed(2)}
                        </ThemedText>
                    </View>
                </View>

                {/* Continue to Payment Button */}
                <TouchableOpacity
                    onPress={handlePlaceOrder}
                    disabled={loading}
                    className="py-4 rounded-xl items-center mb-4"
                    style={{ backgroundColor: colors.secondary.crimson }}>
                    {loading ? (
                        <ActivityIndicator color={colors.neutral.white} />
                    ) : (
                        <View className="flex-row items-center">
                            <ThemedText 
                                className="font-bold text-base tracking-wider mr-2" 
                                style={{ color: colors.neutral.white }}>
                                CONTINUE TO PAYMENT
                            </ThemedText>
                            <MaterialIcons name="arrow-forward" size={20} color={colors.neutral.white} />
                        </View>
                    )}
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </ThemedView>
    );
}
