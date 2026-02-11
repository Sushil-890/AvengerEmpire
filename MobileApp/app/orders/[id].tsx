import { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api, { SERVER_URL } from '@/constants/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';

export default function OrderDetailsScreen() {
    const { id, payment } = useLocalSearchParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrderDetails();
        
        // Handle payment success parameter
        if (payment === 'success') {
            // Show success message or handle payment success
            console.log('Payment successful for order:', id);
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
            <ThemedView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#DC2626" />
            </ThemedView>
        );
    }

    if (!order) {
        return (
            <ThemedView className="flex-1 justify-center items-center">
                <ThemedText>Order not found</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView className="flex-1">
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <ThemedText type="title" className="mb-4">Order Details</ThemedText>

                <View className="bg-white dark:bg-zinc-800 p-4 rounded-xl mb-4 border border-gray-100 dark:border-zinc-700">
                    <ThemedText className="font-bold text-lg mb-2">Order ID: {order._id}</ThemedText>
                    <ThemedText className="text-gray-500 mb-4">{new Date(order.createdAt).toLocaleString()}</ThemedText>

                    <View className="space-y-2">
                        <View className="flex-row justify-between">
                            <ThemedText>Payment Status</ThemedText>
                            <ThemedText className={order.isPaid ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                {order.isPaid ? 'Paid' : 'Unpaid'}
                            </ThemedText>
                        </View>
                        <View className="flex-row justify-between">
                            <ThemedText>Delivery Status</ThemedText>
                            <ThemedText className={order.isDelivered ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold'}>
                                {order.isDelivered ? 'Delivered' : 'Pending'}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                <ThemedText type="subtitle" className="mb-3">Items</ThemedText>
                <View className="bg-white dark:bg-zinc-800 rounded-xl mb-4 overflow-hidden border border-gray-100 dark:border-zinc-700">
                    {order.orderItems.map((item: any, index: number) => (
                        <View key={index} className="flex-row p-4 border-b border-gray-100 dark:border-zinc-700 last:border-0">
                            <Image source={{ uri: getImageUrl(item.image) }} className="w-16 h-16 rounded bg-gray-200" />
                            <View className="flex-1 ml-4 justify-center">
                                <ThemedText className="font-medium">{item.name}</ThemedText>
                                <ThemedText className="text-gray-500">{item.qty} x ${item.price} = ${item.qty * item.price}</ThemedText>
                            </View>
                        </View>
                    ))}
                </View>

                <ThemedText type="subtitle" className="mb-3">Shipping</ThemedText>
                <View className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-100 dark:border-zinc-700">
                    <ThemedText>{order.shippingAddress.address}, {order.shippingAddress.city}</ThemedText>
                    <ThemedText>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</ThemedText>
                </View>

            </ScrollView>

            <View className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                <View className="flex-row justify-between items-center mb-4">
                    <ThemedText className="text-xl font-bold">Total</ThemedText>
                    <ThemedText className="text-xl font-bold text-emerald-600">${order.totalPrice}</ThemedText>
                </View>
                {!order.isPaid && (
                    <TouchableOpacity
                        onPress={() => router.push(`/payment?orderId=${order._id}&amount=${order.totalPrice}`)}
                        className="bg-red-600 py-4 rounded-xl items-center flex-row justify-center">
                        <MaterialIcons name="payment" size={24} color="white" style={{ marginRight: 8 }} />
                        <ThemedText className="text-white font-bold text-lg">Pay Now</ThemedText>
                    </TouchableOpacity>
                )}
                {order.isPaid && (
                    <View className="bg-green-50 dark:bg-green-900/20 py-4 rounded-xl items-center border border-green-200 dark:border-green-800">
                        <View className="flex-row items-center">
                            <MaterialIcons name="check-circle" size={24} color="#059669" style={{ marginRight: 8 }} />
                            <ThemedText className="text-green-700 dark:text-green-400 font-bold text-lg">Payment Completed</ThemedText>
                        </View>
                    </View>
                )}
            </View>
        </ThemedView>
    );
}
