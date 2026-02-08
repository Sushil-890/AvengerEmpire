import { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { ImperialColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface Order {
    _id: string;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
    orderItems: any[];
    status?: string;
}

export default function OrdersScreen() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            if (!refreshing) setLoading(true);
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const getStatusColor = (order: Order) => {
        if (order.isDelivered) return ImperialColors.accent.bronze;
        if (order.isPaid) return ImperialColors.primary.gold;
        return ImperialColors.neutral.silver;
    };

    const getStatusText = (order: Order) => {
        if (order.isDelivered) return 'Delivered';
        if (order.isPaid) return 'Processing';
        return 'Pending Payment';
    };

    const renderItem = ({ item }: { item: Order }) => (
        <TouchableOpacity
            onPress={() => router.push(`/orders/${item._id}`)}
            className="rounded-2xl mb-4 overflow-hidden border"
            style={{ 
                backgroundColor: colorScheme === 'dark' ? ImperialColors.neutral.darkGray : '#FFF',
                borderColor: colorScheme === 'dark' ? ImperialColors.primary.gold + '20' : '#E5E7EB'
            }}>
            <View className="p-4">
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                        <ThemedText 
                            className="font-bold text-base mb-1"
                            style={{ color: colorScheme === 'dark' ? ImperialColors.neutral.white : '#000' }}>
                            Order #{item._id.substring(18)}
                        </ThemedText>
                        <ThemedText 
                            className="text-xs"
                            style={{ color: colorScheme === 'dark' ? ImperialColors.neutral.silver : '#666' }}>
                            {new Date(item.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </ThemedText>
                    </View>
                    <View 
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: getStatusColor(item) + '20' }}>
                        <ThemedText 
                            className="text-xs font-bold"
                            style={{ color: getStatusColor(item) }}>
                            {getStatusText(item)}
                        </ThemedText>
                    </View>
                </View>

                <View 
                    className="h-px mb-3"
                    style={{ backgroundColor: colorScheme === 'dark' ? ImperialColors.neutral.mediumGray : '#E5E7EB' }}
                />

                <View className="flex-row justify-between items-center">
                    <View>
                        <ThemedText 
                            className="text-xs mb-1"
                            style={{ color: colorScheme === 'dark' ? ImperialColors.neutral.silver : '#666' }}>
                            Total Amount
                        </ThemedText>
                        <ThemedText 
                            className="text-2xl font-bold"
                            style={{ color: colorScheme === 'dark' ? ImperialColors.primary.gold : '#000' }}>
                            ${item.totalPrice.toFixed(2)}
                        </ThemedText>
                    </View>
                    <View className="flex-row items-center">
                        <ThemedText 
                            className="text-sm font-medium mr-2"
                            style={{ color: colorScheme === 'dark' ? ImperialColors.neutral.silver : '#666' }}>
                            View Details
                        </ThemedText>
                        <MaterialIcons 
                            name="arrow-forward" 
                            size={20} 
                            color={colorScheme === 'dark' ? ImperialColors.primary.gold : '#666'} 
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return (
            <ThemedView 
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: colorScheme === 'dark' ? ImperialColors.neutral.black : '#F9FAFB' }}>
                <ActivityIndicator 
                    size="large" 
                    color={colorScheme === 'dark' ? ImperialColors.primary.gold : '#000'} 
                />
                <ThemedText 
                    className="mt-4"
                    style={{ color: colorScheme === 'dark' ? ImperialColors.neutral.silver : '#666' }}>
                    Loading your orders...
                </ThemedText>
            </ThemedView>
        );
    }

    if (!user) {
        return (
            <ThemedView 
                className="flex-1 justify-center items-center px-6"
                style={{ backgroundColor: colorScheme === 'dark' ? ImperialColors.neutral.black : '#F9FAFB' }}>
                <View 
                    className="p-10 rounded-full mb-6"
                    style={{ backgroundColor: colorScheme === 'dark' ? ImperialColors.neutral.darkGray : '#FFF' }}>
                    <MaterialIcons 
                        name="login" 
                        size={64} 
                        color={colorScheme === 'dark' ? ImperialColors.primary.gold : '#666'} 
                    />
                </View>
                <ThemedText 
                    className="text-xl font-bold mb-3 text-center"
                    style={{ color: colorScheme === 'dark' ? ImperialColors.neutral.white : '#000' }}>
                    Login Required
                </ThemedText>
                <ThemedText 
                    className="text-center mb-6"
                    style={{ color: colorScheme === 'dark' ? ImperialColors.neutral.silver : '#666' }}>
                    Please log in to view your orders
                </ThemedText>
                <TouchableOpacity
                    onPress={() => router.push('/(auth)/login')}
                    className="py-3 px-8 rounded-full"
                    style={{ backgroundColor: colorScheme === 'dark' ? ImperialColors.primary.gold : '#000' }}>
                    <ThemedText 
                        className="font-bold"
                        style={{ color: colorScheme === 'dark' ? ImperialColors.neutral.black : '#FFF' }}>
                        Login Now
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ThemedView 
            className="flex-1"
            style={{ backgroundColor: colorScheme === 'dark' ? ImperialColors.neutral.black : '#F9FAFB' }}>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh}
                        colors={[colorScheme === 'dark' ? ImperialColors.primary.gold : '#000']}
                        tintColor={colorScheme === 'dark' ? ImperialColors.primary.gold : '#000'}
                    />
                }
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center mt-20">
                        <View 
                            className="p-10 rounded-full mb-6"
                            style={{ backgroundColor: colorScheme === 'dark' ? ImperialColors.neutral.darkGray : '#FFF' }}>
                            <MaterialIcons 
                                name="shopping-bag" 
                                size={64} 
                                color={colorScheme === 'dark' ? ImperialColors.neutral.silver : '#999'} 
                            />
                        </View>
                        <ThemedText 
                            className="text-xl font-bold mb-3"
                            style={{ color: colorScheme === 'dark' ? ImperialColors.neutral.white : '#000' }}>
                            No Orders Yet
                        </ThemedText>
                        <ThemedText 
                            className="text-center mb-6"
                            style={{ color: colorScheme === 'dark' ? ImperialColors.neutral.silver : '#666' }}>
                            Start shopping to see your orders here
                        </ThemedText>
                        <TouchableOpacity
                            onPress={() => router.push('/(drawer)/(tabs)/explore')}
                            className="py-3 px-8 rounded-full"
                            style={{ backgroundColor: colorScheme === 'dark' ? ImperialColors.primary.gold : '#000' }}>
                            <ThemedText 
                                className="font-bold"
                                style={{ color: colorScheme === 'dark' ? ImperialColors.neutral.black : '#FFF' }}>
                                Start Shopping
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                }
            />
        </ThemedView>
    );
}
