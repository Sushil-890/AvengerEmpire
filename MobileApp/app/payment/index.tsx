import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import api, { SERVER_URL } from '@/constants/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';

export default function PaymentScreen() {
    const { orderId, amount } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const router = useRouter();
    const { clearCart } = useCart();
    const { user } = useAuth();
    const { requireAuth } = useAuthNavigation();

    useEffect(() => {
        // Check if user is authenticated when component mounts
        if (!requireAuth(undefined, 'Please login to complete your payment')) {
            return;
        }

        // Listen for deep links from payment success
        const subscription = Linking.addEventListener('url', handleDeepLink);
        return () => subscription?.remove();
    }, []);

    const handleDeepLink = (event: { url: string }) => {
        const url = event.url;
        if (url.includes('payment=success')) {
            clearCart();
            Alert.alert(
                'Payment Successful!',
                'Your payment has been processed and order confirmed.',
                [
                    { 
                        text: 'View Orders', 
                        onPress: () => {
                            router.replace('/(drawer)/(tabs)/orders');
                        }
                    }
                ]
            );
        }
    };

    const handlePayment = async () => {
        // Double check auth before payment
        if (!requireAuth(undefined, 'Please login to complete your payment')) {
            return;
        }

        setLoading(true);
        Keyboard.dismiss();
        
        try {
            if (paymentMethod === 'razorpay') {
                // Open Razorpay payment page in browser
                const paymentUrl = `${SERVER_URL}/api/payment/${orderId}`;
                
                const result = await WebBrowser.openBrowserAsync(paymentUrl, {
                    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
                    controlsColor: '#DC2626',
                });

                if (result.type === 'cancel') {
                    Alert.alert('Payment Cancelled', 'You cancelled the payment process.');
                }
                
                setLoading(false);
            } else {
                processPayment();
            }
        } catch (error: any) {
            setLoading(false);
            Alert.alert('Error', error.response?.data?.message || 'Payment failed. Please try again.');
        }
    };

    const processPayment = async () => {
        try {
            // Update order payment status for COD
            await api.put(`/orders/${orderId}/pay`, {
                paymentMethod,
                paymentResult: {
                    id: `cod_${Date.now()}`,
                    status: paymentMethod === 'cod' ? 'pending' : 'completed',
                    update_time: new Date().toISOString(),
                }
            });

            clearCart();
            const message = paymentMethod === 'cod' 
                ? 'Your order has been placed! Pay when you receive the delivery.'
                : 'Your order has been placed and payment confirmed.';
                
            Alert.alert(
                'Order Confirmed!',
                message,
                [
                    { 
                        text: 'View Orders', 
                        onPress: () => {
                            router.replace('/(drawer)/(tabs)/orders');
                        }
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Order processing failed');
        } finally {
            setLoading(false);
        }
    };

    // Show loading or redirect if not authenticated
    if (!user) {
        return (
            <ThemedView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#DC2626" />
                <ThemedText className="mt-4 text-gray-500">Checking authentication...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView className="flex-1">
            <KeyboardAwareScrollView 
                contentContainerStyle={{ padding: 20 }}
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={20}
            >
                <ThemedText type="title" className="mb-6">Payment</ThemedText>

                {/* Order Details */}
                <View className="bg-white dark:bg-zinc-800 p-4 rounded-xl mb-6 border border-gray-100 dark:border-zinc-700">
                    <ThemedText type="subtitle" className="mb-2">Order Details</ThemedText>
                    <View className="flex-row justify-between">
                        <ThemedText className="text-gray-500">Order ID:</ThemedText>
                        <ThemedText className="font-mono text-sm">#{String(orderId).substring(0, 8)}</ThemedText>
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <ThemedText className="text-gray-500">Amount:</ThemedText>
                        <ThemedText className="font-bold text-emerald-600 text-xl">₹{amount}</ThemedText>
                    </View>
                </View>

                {/* Payment Methods */}
                <View className="mb-6">
                    <ThemedText type="subtitle" className="mb-4">Payment Method</ThemedText>
                    
                    <TouchableOpacity
                        onPress={() => setPaymentMethod('razorpay')}
                        className={`flex-row items-center p-4 rounded-xl border mb-3 ${
                            paymentMethod === 'razorpay' 
                                ? 'border-red-600 bg-red-50 dark:bg-red-900/20' 
                                : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                        }`}>
                        <View className="w-12 h-12 bg-blue-100 rounded-lg justify-center items-center mr-4">
                            <MaterialIcons name="payment" size={24} color="#2563EB" />
                        </View>
                        <View className="flex-1">
                            <ThemedText className="font-semibold">Razorpay</ThemedText>
                            <ThemedText className="text-gray-500 text-sm">Credit/Debit Card, UPI, Net Banking</ThemedText>
                        </View>
                        {paymentMethod === 'razorpay' && (
                            <MaterialIcons name="check-circle" size={24} color="#DC2626" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setPaymentMethod('cod')}
                        className={`flex-row items-center p-4 rounded-xl border ${
                            paymentMethod === 'cod' 
                                ? 'border-red-600 bg-red-50 dark:bg-red-900/20' 
                                : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                        }`}>
                        <View className="w-12 h-12 bg-green-100 rounded-lg justify-center items-center mr-4">
                            <MaterialIcons name="local-shipping" size={24} color="#059669" />
                        </View>
                        <View className="flex-1">
                            <ThemedText className="font-semibold">Cash on Delivery</ThemedText>
                            <ThemedText className="text-gray-500 text-sm">Pay when you receive the order</ThemedText>
                        </View>
                        {paymentMethod === 'cod' && (
                            <MaterialIcons name="check-circle" size={24} color="#DC2626" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Payment Info */}
                <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <View className="flex-row items-center mb-2">
                        <MaterialIcons name="security" size={20} color="#2563EB" />
                        <ThemedText className="font-semibold ml-2 text-blue-700 dark:text-blue-300">
                            {paymentMethod === 'razorpay' ? 'Secure Payment Gateway' : 'Cash on Delivery'}
                        </ThemedText>
                    </View>
                    <ThemedText className="text-blue-600 dark:text-blue-400 text-sm">
                        {paymentMethod === 'razorpay' 
                            ? 'You will be redirected to Razorpay\'s secure payment gateway to complete your payment.'
                            : 'Pay in cash when your order is delivered to your doorstep.'
                        }
                    </ThemedText>
                </View>
            </KeyboardAwareScrollView>

            {/* Payment Button */}
            <View className="p-4 bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-800">
                <TouchableOpacity
                    onPress={handlePayment}
                    disabled={loading}
                    className="bg-red-600 py-4 rounded-xl flex-row justify-center items-center">
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <MaterialIcons 
                                name={paymentMethod === 'razorpay' ? 'open-in-browser' : 'local-shipping'} 
                                size={24} 
                                color="white" 
                                style={{ marginRight: 8 }} 
                            />
                            <ThemedText className="text-white font-bold text-lg">
                                {paymentMethod === 'cod' ? 'Confirm Order' : `Pay ₹${amount}`}
                            </ThemedText>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}