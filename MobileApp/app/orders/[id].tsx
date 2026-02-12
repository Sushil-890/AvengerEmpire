import { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api, { SERVER_URL } from '@/constants/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';
import { useCart } from '@/context/CartContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ImperialColors, LightColors } from '@/constants/theme';

export default function OrderDetailsScreen() {
    const { id, payment } = useLocalSearchParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? ImperialColors : LightColors;

    const { clearCart } = useCart();

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }

        // Handle payment success parameter
        if (payment === 'success') {
            console.log('Payment successful for order:', id);
            // Clear cart as payment was successful
            clearCart();
            Alert.alert('Payment Successful', 'Your payment has been processed successfully!');
        }
    }, [id, payment]);

    const fetchOrderDetails = async () => {
        try {
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return 'https://via.placeholder.com/300';
        if (imagePath.startsWith('http')) return imagePath;
        return `${SERVER_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    if (loading) {
        return (
            <ThemedView className="flex-1 justify-center items-center" style={{ backgroundColor: colors.neutral.black }}>
                <ActivityIndicator size="large" color={colors.secondary.crimson} />
            </ThemedView>
        );
    }

    if (!order) {
        return (
            <ThemedView className="flex-1 justify-center items-center" style={{ backgroundColor: colors.neutral.black }}>
                <ThemedText style={{ color: colors.neutral.white }}>Order not found</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView className="flex-1" style={{ backgroundColor: colors.neutral.black }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <ThemedText type="title" className="mb-4" style={{ color: colors.neutral.white }}>
                    Avenger Empire
                </ThemedText>

                <View 
                    className="p-4 rounded-xl mb-4 border" 
                    style={{ 
                        backgroundColor: colors.neutral.darkGray,
                        borderColor: colors.neutral.lightGray
                    }}>
                    <ThemedText className="font-bold text-lg mb-2" style={{ color: colors.neutral.white }}>
                        Order ID: {order._id}
                    </ThemedText>
                    <ThemedText className="mb-4" style={{ color: colors.neutral.silver }}>
                        {new Date(order.createdAt).toLocaleString()}
                    </ThemedText>

                    <View className="space-y-2">
                        <View className="flex-row justify-between">
                            <ThemedText style={{ color: colors.neutral.silver }}>Payment Status</ThemedText>
                            <ThemedText className="font-bold" style={{ color: order.isPaid ? '#10B981' : colors.secondary.crimson }}>
                                {order.isPaid ? 'Paid' : 'Unpaid'}
                            </ThemedText>
                        </View>
                        <View className="flex-row justify-between">
                            <ThemedText style={{ color: colors.neutral.silver }}>Delivery Status</ThemedText>
                            <ThemedText className="font-bold" style={{ color: order.isDelivered ? '#10B981' : '#F59E0B' }}>
                                {order.isDelivered ? 'Delivered' : 'Pending'}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                <ThemedText type="subtitle" className="mb-3" style={{ color: colors.neutral.white }}>Items</ThemedText>
                <View 
                    className="rounded-xl mb-4 overflow-hidden border" 
                    style={{ 
                        backgroundColor: colors.neutral.darkGray,
                        borderColor: colors.neutral.lightGray
                    }}>
                    {order.orderItems.map((item: any, index: number) => (
                        <View 
                            key={index} 
                            className="flex-row p-4 border-b last:border-0"
                            style={{ borderBottomColor: colors.neutral.lightGray }}>
                            <Image 
                                source={{ uri: getImageUrl(item.image) }} 
                                className="w-16 h-16 rounded" 
                                style={{ backgroundColor: colors.neutral.mediumGray }} 
                            />
                            <View className="flex-1 ml-4 justify-center">
                                <ThemedText className="font-medium" style={{ color: colors.neutral.white }}>
                                    {item.name}
                                </ThemedText>
                                <ThemedText style={{ color: colors.neutral.silver }}>
                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                </ThemedText>
                            </View>
                        </View>
                    ))}
                </View>

                <ThemedText type="subtitle" className="mb-3" style={{ color: colors.neutral.white }}>Shipping</ThemedText>
                <View 
                    className="p-4 rounded-xl border" 
                    style={{ 
                        backgroundColor: colors.neutral.darkGray,
                        borderColor: colors.neutral.lightGray
                    }}>
                    <ThemedText style={{ color: colors.neutral.white }}>
                        {order.shippingAddress.address}, {order.shippingAddress.city}
                    </ThemedText>
                    <ThemedText style={{ color: colors.neutral.white }}>
                        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </ThemedText>
                </View>

            </ScrollView>

            <View 
                className="p-4 border-t" 
                style={{ 
                    backgroundColor: colors.neutral.darkGray,
                    borderTopColor: colors.neutral.lightGray
                }}>
                <View className="flex-row justify-between items-center mb-4">
                    <ThemedText className="text-xl font-bold" style={{ color: colors.neutral.white }}>Total</ThemedText>
                    <ThemedText className="text-xl font-bold" style={{ color: colors.primary.gold }}>
                        ${order.totalPrice}
                    </ThemedText>
                </View>
                {!order.isPaid && (
                    <TouchableOpacity
                        onPress={() => router.push(`/payment?orderId=${order._id}&amount=${order.totalPrice}`)}
                        className="py-4 rounded-xl items-center flex-row justify-center"
                        style={{ backgroundColor: colors.secondary.crimson }}>
                        <MaterialIcons name="payment" size={24} color="white" style={{ marginRight: 8 }} />
                        <ThemedText className="text-white font-bold text-lg">Pay Now</ThemedText>
                    </TouchableOpacity>
                )}
                {order.isPaid && (
                    <View 
                        className="py-4 rounded-xl items-center border"
                        style={{ 
                            backgroundColor: colorScheme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5',
                            borderColor: colorScheme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0'
                        }}>
                        <View className="flex-row items-center">
                            <MaterialIcons name="check-circle" size={24} color="#10B981" style={{ marginRight: 8 }} />
                            <ThemedText className="font-bold text-lg" style={{ color: '#10B981' }}>
                                Payment Completed
                            </ThemedText>
                        </View>
                    </View>
                )}
            </View>
        </ThemedView>
    );
}
