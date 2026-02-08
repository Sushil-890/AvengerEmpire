import { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useImperialColors } from '@/hooks/use-imperial-colors';

interface SellerOrder {
    _id: string;
    user: {
        name: string;
        email: string;
    };
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    status: string;
    createdAt: string;
    orderItems: any[];
}

export default function SellerDashboard() {
    const [orders, setOrders] = useState<SellerOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders'); // orders | products (future)
    const { user } = useAuth();
    const router = useRouter();
    const colors = useImperialColors();

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    const fetchSellerOrders = async () => {
        try {
            const { data } = await api.get('/orders/seller');
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderOrder = ({ item }: { item: SellerOrder }) => (
        <TouchableOpacity
            onPress={() => router.push(`/seller/orders/${item._id}`)}
            className="p-4 rounded-xl mb-3 shadow-sm border"
            style={{ 
                backgroundColor: colors.neutral.darkGray,
                borderColor: colors.neutral.lightGray
            }}>
            <View className="flex-row justify-between mb-2">
                <ThemedText className="font-bold">Order #{item._id.substring(20)}</ThemedText>
                <ThemedText className="text-xs" style={{ color: colors.neutral.silver }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </ThemedText>
            </View>
            <View className="mb-2">
                <ThemedText className="text-sm">Buyer: {item.user?.name}</ThemedText>
            </View>
            <View className="flex-row justify-between items-center">
                <ThemedText className="font-bold" style={{ color: colors.primary.gold }}>
                    ${item.totalPrice}
                </ThemedText>
                <View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.neutral.mediumGray }}>
                    <ThemedText className="text-xs font-medium">{item.status || 'PLACED'}</ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ThemedView className="flex-1" style={{ backgroundColor: colors.neutral.black }}>
            {/* Dashboard Header Section */}
            <View 
                className="px-5 py-4 border-b flex-row justify-between items-center"
                style={{ 
                    backgroundColor: colors.neutral.darkGray,
                    borderBottomColor: colors.primary.gold + '20'
                }}>
                <View>
                    <ThemedText className="text-2xl font-bold tracking-wide" style={{ color: colors.neutral.white }}>
                        Dashboard
                    </ThemedText>
                    <ThemedText className="text-sm mt-1" style={{ color: colors.neutral.silver }}>
                        Welcome, {user?.name}
                    </ThemedText>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/seller/add-product')}
                    className="px-4 py-2 rounded-full flex-row items-center"
                    style={{ backgroundColor: colors.primary.gold }}>
                    <MaterialIcons name="add" size={20} color={colors.neutral.black} />
                    <ThemedText 
                        className="font-medium ml-1"
                        style={{ color: colors.neutral.black }}>
                        Add Product
                    </ThemedText>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={colors.primary.gold} />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center mt-20">
                            <View 
                                className="p-10 rounded-full mb-6"
                                style={{ backgroundColor: colors.neutral.darkGray }}>
                                <MaterialIcons name="shopping-bag" size={72} color={colors.primary.gold} />
                            </View>
                            <ThemedText 
                                className="text-xl font-bold mb-2"
                                style={{ color: colors.neutral.white }}>
                                No Orders Yet
                            </ThemedText>
                            <ThemedText style={{ color: colors.neutral.silver }}>
                                Orders will appear here once customers make purchases
                            </ThemedText>
                        </View>
                    }
                />
            )}
        </ThemedView>
    );
}
