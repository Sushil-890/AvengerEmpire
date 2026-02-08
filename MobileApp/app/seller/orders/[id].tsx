import { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api, { SERVER_URL } from '@/constants/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SellerOrderDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

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

    const updateStatus = async (status: string) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            Alert.alert("Success", `Order marked as ${status}`);
            fetchOrderDetails(); // Refresh
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Failed to update status");
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
                <ThemedText type="title" className="mb-4">Manage Order</ThemedText>

                <View className="bg-white dark:bg-zinc-800 p-4 rounded-xl mb-4 border border-gray-100 dark:border-zinc-700">
                    <ThemedText className="font-bold text-lg mb-2">Order ID: {order._id}</ThemedText>
                    <ThemedText className="text-gray-500 mb-2">Buyer: {order.user?.name} ({order.user?.email})</ThemedText>
                    <ThemedText className="text-gray-500 mb-4">{new Date(order.createdAt).toLocaleString()}</ThemedText>

                    <View className="flex-row items-center justify-between bg-gray-50 dark:bg-zinc-700 p-3 rounded-lg mb-3">
                        <ThemedText className="font-medium">Current Status</ThemedText>
                        <ThemedText className="font-bold text-emerald-600">{order.status || 'PLACED'}</ThemedText>
                    </View>

                    <ThemedText className="font-medium mb-2">Update Status:</ThemedText>
                    <View className="flex-row flex-wrap gap-2">
                        {['CONFIRMED', 'PACKED', 'SHIPPED', 'CANCELLED'].map((status) => (
                            <TouchableOpacity
                                key={status}
                                onPress={() => updateStatus(status)}
                                className={`px-3 py-2 rounded-lg ${order.status === status ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-zinc-600'}`}>
                                <ThemedText className={`text-xs ${order.status === status ? 'text-white dark:text-black' : 'text-gray-700 dark:text-gray-300'}`}>{status}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <ThemedText type="subtitle" className="mb-3">Items</ThemedText>
                <View className="bg-white dark:bg-zinc-800 rounded-xl mb-4 overflow-hidden border border-gray-100 dark:border-zinc-700">
                    {order.orderItems.map((item: any, index: number) => (
                        <View key={index} className="flex-row p-4 border-b border-gray-100 dark:border-zinc-700 last:border-0">
                            <Image source={{ uri: getImageUrl(item.image) }} className="w-16 h-16 rounded bg-gray-200" />
                            <View className="flex-1 ml-4 justify-center">
                                <ThemedText className="font-medium">{item.name}</ThemedText>
                                <ThemedText className="text-gray-500">{item.qty} x ${item.price}</ThemedText>
                            </View>
                        </View>
                    ))}
                </View>

                <ThemedText type="subtitle" className="mb-3">Shipping Details</ThemedText>
                <View className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-100 dark:border-zinc-700 mb-20">
                    <ThemedText className="font-bold mb-1">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</ThemedText>
                    <ThemedText>{order.shippingAddress.address}</ThemedText>
                    <ThemedText>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</ThemedText>
                    <ThemedText>{order.shippingAddress.country}</ThemedText>
                    <ThemedText className="mt-2 text-blue-600">{order.shippingAddress.phone}</ThemedText>
                </View>

            </ScrollView>
        </ThemedView>
    );
}
