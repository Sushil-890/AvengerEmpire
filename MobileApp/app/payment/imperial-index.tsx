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
import { ImperialColors } from '@/constants/theme';

export default function PaymentScreen() {
    const { orderId, amount } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const router = useRouter();
    const { clearCart } = useCart();
    const { user } = useAuth();
    const { requireAuth } = useAuthNavigation();

    useEffect(() => {
        if (!requireAuth(undefined, 'Please join the empire to complete your imperial payment')) {
            return;
        }

        const subscription = Linking.addEventListener('url', handleDeepLink);
        return () => subscription?.remove();
    }, []);

    const handleDeepLink = (event: { url: string }) => {
        const url = event.url;
        if (url.includes('payment=success')) {
            clearCart();
            Alert.alert(
                'Imperial Success!',
                'Your imperial payment has been processed and order confirmed.',
                [
                    { text: 'View Royal Order', onPress: () => router.replace(`/orders/${orderId}`) }
                ]
            );
        }
    };

    const handlePayment = async () => {
        if (!requireAuth(undefined, 'Please join the empire to complete your imperial payment')) {
            return;
        }

        setLoading(true);
        Keyboard.dismiss();
        
        try {
            if (paymentMethod === 'razorpay') {
                const paymentUrl = `${SERVER_URL}/api/payment/${orderId}`;
                
                const result = await WebBrowser.openBrowserAsync(paymentUrl, {
                    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
                    controlsColor: ImperialColors.primary.gold,
                });

                if (result.type === 'cancel') {
                    Alert.alert('Payment Cancelled', 'You cancelled the imperial payment process.');
                }
                
                setLoading(false);
            } else {
                processPayment();
            }
        } catch (error: any) {
            setLoading(false);
            Alert.alert('Error', error.response?.data?.message || 'Imperial payment failed. Please try again.');
        }
    };

    const processPayment = async () => {
        try {
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
                ? 'Your royal order has been placed! Pay when you receive the imperial delivery.'
                : 'Your royal order has been placed and payment confirmed.';
                
            Alert.alert(
                'Imperial Order Confirmed!',
                message,
                [
                    { text: 'View Royal Order', onPress: () => router.replace(`/orders/${orderId}`) }
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Order processing failed');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <ThemedView 
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: ImperialColors.neutral.black }}>
                <ActivityIndicator size="large" color={ImperialColors.primary.gold} />
                <ThemedText 
                    className="mt-4"
                    style={{ color: ImperialColors.neutral.silver }}>
                    Verifying imperial credentials...
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView 
            className="flex-1"
            style={{ backgroundColor: ImperialColors.neutral.black }}>
            <KeyboardAwareScrollView 
                contentContainerStyle={{ padding: 20 }}
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={20}
            >
                <View className="pt-8 pb-6">
                    <ThemedText 
                        className="text-2xl font-bold tracking-widest text-center mb-2"
                        style={{ color: ImperialColors.primary.gold }}>
                        IMPERIAL PAYMENT
                    </ThemedText>
                    <View 
                        className="h-px mt-3 mx-8"
                        style={{ backgroundColor: ImperialColors.primary.gold + '40' }} />
                </View>

                {/* Imperial Order Details */}
                <View 
                    className="p-6 rounded-xl mb-6 border"
                    style={{ 
                        backgroundColor: ImperialColors.neutral.darkGray,
                        borderColor: ImperialColors.primary.gold + '30'
                    }}>
                    <ThemedText 
                        className="text-lg font-bold tracking-wider mb-4"
                        style={{ color: ImperialColors.primary.gold }}>
                        ROYAL ORDER DETAILS
                    </ThemedText>
                    <View className="flex-row justify-between mb-3">
                        <ThemedText style={{ color: ImperialColors.neutral.silver }}>
                            Order ID:
                        </ThemedText>
                        <ThemedText 
                            className="font-mono text-sm"
                            style={{ color: ImperialColors.neutral.white }}>
                            #{String(orderId).substring(0, 8)}
                        </ThemedText>
                    </View>
                    <View 
                        className="h-px my-3"
                        style={{ backgroundColor: ImperialColors.neutral.mediumGray }} />
                    <View className="flex-row justify-between">
                        <ThemedText 
                            className="text-lg font-bold tracking-wide"
                            style={{ color: ImperialColors.neutral.white }}>
                            IMPERIAL AMOUNT
                        </ThemedText>
                        <ThemedText 
                            className="font-bold text-2xl"
                            style={{ color: ImperialColors.primary.gold }}>
                            ₹{amount}
                        </ThemedText>
                    </View>
                </View>

                {/* Imperial Payment Methods */}
                <View className="mb-6">
                    <ThemedText 
                        className="text-lg font-bold tracking-wider mb-4"
                        style={{ color: ImperialColors.primary.gold }}>
                        PAYMENT METHOD
                    </ThemedText>
                    
                    <TouchableOpacity
                        onPress={() => setPaymentMethod('razorpay')}
                        className="flex-row items-center p-5 rounded-xl border mb-4"
                        style={{ 
                            backgroundColor: paymentMethod === 'razorpay' 
                                ? ImperialColors.primary.gold + '20' 
                                : ImperialColors.neutral.darkGray,
                            borderColor: paymentMethod === 'razorpay'
                                ? ImperialColors.primary.gold
                                : ImperialColors.neutral.mediumGray
                        }}>
                        <View 
                            className="w-12 h-12 rounded-lg justify-center items-center mr-4"
                            style={{ backgroundColor: ImperialColors.accent.bronze + '30' }}>
                            <MaterialIcons 
                                name="payment" 
                                size={24} 
                                color={ImperialColors.accent.bronze} 
                            />
                        </View>
                        <View className="flex-1">
                            <ThemedText 
                                className="font-bold tracking-wide mb-1"
                                style={{ 
                                    color: paymentMethod === 'razorpay' 
                                        ? ImperialColors.primary.gold 
                                        : ImperialColors.neutral.white 
                                }}>
                                RAZORPAY
                            </ThemedText>
                            <ThemedText 
                                className="text-sm"
                                style={{ color: ImperialColors.neutral.silver }}>
                                Card, UPI, Net Banking
                            </ThemedText>
                        </View>
                        {paymentMethod === 'razorpay' && (
                            <MaterialIcons name="check-circle" size={24} color={ImperialColors.primary.gold} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setPaymentMethod('cod')}
                        className="flex-row items-center p-5 rounded-xl border"
                        style={{ 
                            backgroundColor: paymentMethod === 'cod' 
                                ? ImperialColors.primary.gold + '20' 
                                : ImperialColors.neutral.darkGray,
                            borderColor: paymentMethod === 'cod'
                                ? ImperialColors.primary.gold
                                : ImperialColors.neutral.mediumGray
                        }}>
                        <View 
                            className="w-12 h-12 rounded-lg justify-center items-center mr-4"
                            style={{ backgroundColor: ImperialColors.accent.copper + '30' }}>
                            <MaterialIcons 
                                name="local-shipping" 
                                size={24} 
                                color={ImperialColors.accent.copper} 
                            />
                        </View>
                        <View className="flex-1">
                            <ThemedText 
                                className="font-bold tracking-wide mb-1"
                                style={{ 
                                    color: paymentMethod === 'cod' 
                                        ? ImperialColors.primary.gold 
                                        : ImperialColors.neutral.white 
                                }}>
                                CASH ON DELIVERY
                            </ThemedText>
                            <ThemedText 
                                className="text-sm"
                                style={{ color: ImperialColors.neutral.silver }}>
                                Pay upon imperial delivery
                            </ThemedText>
                        </View>
                        {paymentMethod === 'cod' && (
                            <MaterialIcons name="check-circle" size={24} color={ImperialColors.primary.gold} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Imperial Payment Info */}
                <View 
                    className="p-5 rounded-xl border"
                    style={{ 
                        backgroundColor: ImperialColors.neutral.darkGray,
                        borderColor: ImperialColors.accent.bronze + '40'
                    }}>
                    <View className="flex-row items-center mb-3">
                        <MaterialIcons name="security" size={20} color={ImperialColors.accent.bronze} />
                        <ThemedText 
                            className="font-bold ml-2 tracking-wide"
                            style={{ color: ImperialColors.accent.bronze }}>
                            {paymentMethod === 'razorpay' ? 'SECURE IMPERIAL GATEWAY' : 'IMPERIAL DELIVERY'}
                        </ThemedText>
                    </View>
                    <ThemedText 
                        className="text-sm"
                        style={{ color: ImperialColors.neutral.silver }}>
                        {paymentMethod === 'razorpay' 
                            ? 'You will be redirected to Razorpay\'s secure imperial payment gateway to complete your transaction.'
                            : 'Pay in cash when your imperial order is delivered to your royal doorstep.'
                        }
                    </ThemedText>
                </View>
            </KeyboardAwareScrollView>

            {/* Imperial Payment Button */}
            <View 
                className="p-4 border-t"
                style={{ 
                    backgroundColor: ImperialColors.neutral.darkGray,
                    borderTopColor: ImperialColors.primary.gold + '30'
                }}>
                <TouchableOpacity
                    onPress={handlePayment}
                    disabled={loading}
                    className="py-5 rounded-xl flex-row justify-center items-center border"
                    style={{ 
                        backgroundColor: loading 
                            ? ImperialColors.neutral.mediumGray 
                            : ImperialColors.secondary.crimson,
                        borderColor: loading 
                            ? ImperialColors.neutral.lightGray 
                            : ImperialColors.secondary.darkCrimson
                    }}>
                    {loading ? (
                        <ActivityIndicator color={ImperialColors.neutral.white} />
                    ) : (
                        <>
                            <MaterialIcons 
                                name={paymentMethod === 'razorpay' ? 'open-in-browser' : 'local-shipping'} 
                                size={24} 
                                color={ImperialColors.neutral.white}
                                style={{ marginRight: 8 }} 
                            />
                            <ThemedText 
                                className="font-bold text-lg tracking-widest"
                                style={{ color: ImperialColors.neutral.white }}>
                                {paymentMethod === 'cod' ? 'CONFIRM IMPERIAL ORDER' : `PAY ₹${amount}`}
                            </ThemedText>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}
