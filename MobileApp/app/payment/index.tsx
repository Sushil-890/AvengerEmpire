import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import api, { SERVER_URL } from '@/constants/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ImperialColors, LightColors } from '@/constants/theme';

export default function PaymentScreen() {
    const { orderId, amount } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const router = useRouter();
    const { clearCart } = useCart();
    const { user } = useAuth();
    const { requireAuth } = useAuthNavigation();
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? ImperialColors : LightColors;

    useEffect(() => {
        // Check if user is authenticated when component mounts
        if (!requireAuth(undefined, 'Please login to complete your payment')) {
            return;
        }

        // Listen for deep links from payment success
        const subscription = Linking.addEventListener('url', handleDeepLink);
        return () => subscription?.remove();
    }, []);

    // Check payment status when screen comes into focus (when user returns from browser)
    useFocusEffect(
        useCallback(() => {
            console.log('🔄 Payment screen focused - checking payment status...');
            checkPaymentStatus();
        }, [orderId])
    );

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

    const checkPaymentStatus = async () => {
        try {
            console.log('🔍 Checking payment status for order:', orderId);
            const response = await api.get(`/orders/${orderId}`);
            console.log('📋 Order status:', {
                isPaid: response.data.isPaid,
                paymentMethod: response.data.paymentMethod,
                status: response.data.status
            });
            
            if (response.data.isPaid) {
                // Payment was successful
                console.log('✅ Payment confirmed! Clearing cart and redirecting...');
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
            } else {
                console.log('⏳ Payment still pending...');
            }
        } catch (error) {
            console.log('❌ Error checking payment status:', error);
            Alert.alert('Error', 'Could not check payment status. Please try again.');
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
                // Open Razorpay payment page in browser with client type
                const paymentUrl = `${SERVER_URL}/api/payment/${orderId}?client=mobile`;
                
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
        <ThemedView className="flex-1" style={{ backgroundColor: colors.neutral.black }}>
            <KeyboardAwareScrollView 
                contentContainerStyle={{ padding: 20 }}
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={20}
            >
                <ThemedText type="title" className="mb-6" style={{ color: colors.neutral.white }}>
                    Avenger Empire
                </ThemedText>

                {/* Order Details */}
                <View 
                    className="p-4 rounded-xl mb-6 border" 
                    style={{ 
                        backgroundColor: colors.neutral.darkGray,
                        borderColor: colors.neutral.lightGray
                    }}>
                    <ThemedText type="subtitle" className="mb-2" style={{ color: colors.neutral.white }}>
                        Order Details
                    </ThemedText>
                    <View className="flex-row justify-between">
                        <ThemedText style={{ color: colors.neutral.silver }}>Order ID:</ThemedText>
                        <ThemedText className="font-mono text-sm" style={{ color: colors.neutral.white }}>
                            #{String(orderId).substring(0, 8)}
                        </ThemedText>
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <ThemedText style={{ color: colors.neutral.silver }}>Amount:</ThemedText>
                        <ThemedText className="font-bold text-xl" style={{ color: colors.primary.gold }}>
                            ₹{amount}
                        </ThemedText>
                    </View>
                </View>

                {/* Payment Methods */}
                <View className="mb-6">
                    <ThemedText type="subtitle" className="mb-4" style={{ color: colors.neutral.white }}>
                        Payment Method
                    </ThemedText>
                    
                    <TouchableOpacity
                        onPress={() => setPaymentMethod('razorpay')}
                        className="flex-row items-center p-4 rounded-xl border mb-3"
                        style={{ 
                            backgroundColor: paymentMethod === 'razorpay' 
                                ? (colorScheme === 'dark' ? 'rgba(139, 0, 0, 0.2)' : '#FEE2E2')
                                : colors.neutral.darkGray,
                            borderColor: paymentMethod === 'razorpay' 
                                ? colors.secondary.crimson 
                                : colors.neutral.lightGray
                        }}>
                        <View 
                            className="w-12 h-12 rounded-lg justify-center items-center mr-4"
                            style={{ backgroundColor: colorScheme === 'dark' ? '#1E3A8A' : '#DBEAFE' }}>
                            <MaterialIcons name="payment" size={24} color="#2563EB" />
                        </View>
                        <View className="flex-1">
                            <ThemedText className="font-semibold" style={{ color: colors.neutral.white }}>
                                Razorpay
                            </ThemedText>
                            <ThemedText className="text-sm" style={{ color: colors.neutral.silver }}>
                                Credit/Debit Card, UPI, Net Banking
                            </ThemedText>
                        </View>
                        {paymentMethod === 'razorpay' && (
                            <MaterialIcons name="check-circle" size={24} color={colors.secondary.crimson} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setPaymentMethod('cod')}
                        className="flex-row items-center p-4 rounded-xl border"
                        style={{ 
                            backgroundColor: paymentMethod === 'cod' 
                                ? (colorScheme === 'dark' ? 'rgba(139, 0, 0, 0.2)' : '#FEE2E2')
                                : colors.neutral.darkGray,
                            borderColor: paymentMethod === 'cod' 
                                ? colors.secondary.crimson 
                                : colors.neutral.lightGray
                        }}>
                        <View 
                            className="w-12 h-12 rounded-lg justify-center items-center mr-4"
                            style={{ backgroundColor: colorScheme === 'dark' ? '#065F46' : '#D1FAE5' }}>
                            <MaterialIcons name="local-shipping" size={24} color="#059669" />
                        </View>
                        <View className="flex-1">
                            <ThemedText className="font-semibold" style={{ color: colors.neutral.white }}>
                                Cash on Delivery
                            </ThemedText>
                            <ThemedText className="text-sm" style={{ color: colors.neutral.silver }}>
                                Pay when you receive the order
                            </ThemedText>
                        </View>
                        {paymentMethod === 'cod' && (
                            <MaterialIcons name="check-circle" size={24} color={colors.secondary.crimson} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Payment Info */}
                <View 
                    className="p-4 rounded-xl border" 
                    style={{ 
                        backgroundColor: colorScheme === 'dark' ? 'rgba(37, 99, 235, 0.1)' : '#EFF6FF',
                        borderColor: colorScheme === 'dark' ? 'rgba(37, 99, 235, 0.3)' : '#BFDBFE'
                    }}>
                    <View className="flex-row items-center mb-2">
                        <MaterialIcons name="security" size={20} color="#2563EB" />
                        <ThemedText 
                            className="font-semibold ml-2" 
                            style={{ color: colorScheme === 'dark' ? '#93C5FD' : '#1E40AF' }}>
                            {paymentMethod === 'razorpay' ? 'Secure Payment Gateway' : 'Cash on Delivery'}
                        </ThemedText>
                    </View>
                    <ThemedText 
                        className="text-sm" 
                        style={{ color: colorScheme === 'dark' ? '#60A5FA' : '#2563EB' }}>
                        {paymentMethod === 'razorpay' 
                            ? 'You will be redirected to Razorpay\'s secure payment gateway to complete your payment.'
                            : 'Pay in cash when your order is delivered to your doorstep.'
                        }
                    </ThemedText>
                </View>
            </KeyboardAwareScrollView>

            {/* Payment Button */}
            <View 
                className="p-4 border-t" 
                style={{ 
                    backgroundColor: colors.neutral.darkGray,
                    borderTopColor: colors.neutral.lightGray
                }}>
                <TouchableOpacity
                    onPress={handlePayment}
                    disabled={loading}
                    className="py-4 rounded-xl flex-row justify-center items-center"
                    style={{ backgroundColor: colors.secondary.crimson }}>
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