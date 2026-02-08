import { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/constants/api';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function CheckoutScreen() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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
        <ThemedView className="flex-1">
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <ThemedText type="title" className="mb-6">Checkout</ThemedText>

                {/* Shipping Address Section */}
                <View className="mb-6">
                    <ThemedText type="subtitle" className="mb-4">Shipping Address</ThemedText>
                    <View className="space-y-3">
                        <TextInput
                            placeholder="Address"
                            value={address}
                            onChangeText={setAddress}
                            className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                            placeholderTextColor="#9CA3AF"
                        />
                        <TextInput
                            placeholder="City"
                            value={city}
                            onChangeText={setCity}
                            className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                            placeholderTextColor="#9CA3AF"
                        />
                        <View className="flex-row space-x-3">
                            <TextInput
                                placeholder="Postal Code"
                                value={postalCode}
                                onChangeText={setPostalCode}
                                className="flex-1 bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                                placeholderTextColor="#9CA3AF"
                            />
                            <TextInput
                                placeholder="Country"
                                value={country}
                                onChangeText={setCountry}
                                className="flex-1 bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </View>

                {/* Order Summary */}
                <View className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl mb-6 border border-gray-100 dark:border-zinc-700">
                    <ThemedText type="subtitle" className="mb-2">Order Summary</ThemedText>
                    {cartItems.map((item) => (
                        <View key={item.product} className="flex-row justify-between py-1">
                            <ThemedText className="text-gray-600 dark:text-gray-400 flex-1 mr-4" numberOfLines={1}>
                                {item.qty} x {item.name}
                            </ThemedText>
                            <ThemedText className="font-medium">${(item.qty * item.price).toFixed(2)}</ThemedText>
                        </View>
                    ))}
                    <View className="h-[1px] bg-gray-200 dark:bg-zinc-700 my-3" />
                    <View className="flex-row justify-between">
                        <ThemedText type="defaultSemiBold">Total</ThemedText>
                        <ThemedText type="defaultSemiBold" className="text-emerald-600">${cartTotal.toFixed(2)}</ThemedText>
                    </View>
                </View>
            </ScrollView>

            {/* Place Order Button */}
            <View className="p-4 bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-800">
                <TouchableOpacity
                    onPress={handlePlaceOrder}
                    disabled={loading}
                    className="bg-red-600 py-4 rounded-xl flex-row justify-center items-center">
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <MaterialIcons name="arrow-forward" size={24} color="white" style={{ marginRight: 8 }} />
                            <ThemedText className="text-white font-bold text-lg">Continue to Payment</ThemedText>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}
