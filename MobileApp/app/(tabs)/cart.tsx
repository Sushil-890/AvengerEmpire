import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCart, CartItem } from '@/context/CartContext';
import { SERVER_URL } from '@/constants/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';

export default function CartScreen() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const router = useRouter();
    const { requireAuth } = useAuthNavigation();

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return 'https://via.placeholder.com/300';
        if (imagePath.startsWith('http')) return imagePath;
        return `${SERVER_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    const handleCheckout = () => {
        requireAuth(() => {
            router.push('/checkout');
        }, 'Please login to proceed with checkout');
    };

    const renderItem = ({ item }: { item: CartItem }) => (
        <View className="flex-row bg-white dark:bg-zinc-800 p-4 rounded-xl mb-3 shadow-sm items-center border border-gray-100 dark:border-zinc-700">
            <Image
                source={{ uri: getImageUrl(item.image) }}
                className="w-20 h-20 rounded-lg bg-gray-200"
                resizeMode="cover"
            />
            <View className="flex-1 ml-4">
                <ThemedText className="font-semibold text-lg" numberOfLines={1}>{item.name}</ThemedText>
                <ThemedText className="text-emerald-600 font-bold mt-1">${item.price}</ThemedText>
                
                {/* Quantity Controls */}
                <View className="flex-row items-center mt-2">
                    <View className="flex-row items-center bg-gray-100 dark:bg-zinc-700 rounded-full">
                        <TouchableOpacity
                            onPress={() => {
                                if (item.qty > 1) {
                                    updateQuantity && updateQuantity(item.product, item.qty - 1);
                                }
                            }}
                            className="w-8 h-8 justify-center items-center">
                            <MaterialIcons name="remove" size={16} color="#666" />
                        </TouchableOpacity>
                        <View className="px-3">
                            <ThemedText className="font-bold">{item.qty}</ThemedText>
                        </View>
                        <TouchableOpacity
                            onPress={() => updateQuantity && updateQuantity(item.product, item.qty + 1)}
                            className="w-8 h-8 justify-center items-center">
                            <MaterialIcons name="add" size={16} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <ThemedText className="ml-3 text-gray-500">= ${(item.price * item.qty).toFixed(2)}</ThemedText>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => removeFromCart(item.product)}
                className="p-2 ml-2">
                <MaterialIcons name="delete-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
        </View>
    );

    if (cartItems.length === 0) {
        return (
            <ThemedView className="flex-1 justify-center items-center p-6">
                <View className="bg-gray-100 dark:bg-zinc-800 p-6 rounded-full mb-6">
                    <MaterialIcons name="shopping-cart" size={48} color="#9CA3AF" />
                </View>
                <ThemedText type="title" className="mb-2">Your Cart is Empty</ThemedText>
                <ThemedText className="text-gray-500 text-center mb-8">Looks like you haven't added anything to your cart yet.</ThemedText>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/explore')}
                    className="bg-red-600 py-3 px-8 rounded-full">
                    <ThemedText className="text-white font-semibold">Start Shopping</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ThemedView className="flex-1 p-4">
            <ThemedText type="title" className="mb-4">Shopping Cart</ThemedText>

            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.product}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            <View className="absolute bottom-4 left-4 right-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800">
                <View className="flex-row justify-between mb-4">
                    <ThemedText className="text-gray-500">Total Amount</ThemedText>
                    <ThemedText type="subtitle" className="font-bold text-xl">${cartTotal.toFixed(2)}</ThemedText>
                </View>
                <TouchableOpacity
                    onPress={handleCheckout}
                    className="bg-black dark:bg-white py-4 rounded-xl items-center">
                    <ThemedText className="text-white dark:text-black font-bold text-lg">Checkout</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}
