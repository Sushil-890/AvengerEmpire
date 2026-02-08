import { useEffect, useState } from 'react';
import { View, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api, { SERVER_URL } from '@/constants/api';
import { useCart } from '@/context/CartContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface Product {
    _id: string;
    name: string;
    brand: string;
    model: string;
    category: string;
    price: number;
    images: string[];
    description: string;
    condition: string;
    countInStock?: number;
}

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return 'https://via.placeholder.com/300';
        if (imagePath.startsWith('http')) return imagePath;
        return `${SERVER_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                product: product._id,
                name: product.name || `${product.brand} ${product.model}`,
                image: product.images?.[0],
                price: product.price,
                countInStock: product.countInStock || 10,
                qty: quantity,
            });
            Alert.alert(
                'Added to Cart!', 
                `${quantity} item(s) added to your cart`,
                [
                    { text: 'Continue Shopping', style: 'cancel' },
                    { text: 'View Cart', onPress: () => router.push('/cart') }
                ]
            );
        }
    };

    if (loading) {
        return (
            <ThemedView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#DC2626" />
            </ThemedView>
        );
    }

    if (error || !product) {
        return (
            <ThemedView className="flex-1 justify-center items-center p-6">
                <MaterialIcons name="error-outline" size={48} color="#EF4444" />
                <ThemedText className="text-red-500 text-center mt-4">{error || 'Product not found'}</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView className="flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Product Image */}
                <Image
                    source={{ uri: getImageUrl(product.images?.[0]) }}
                    className="w-full h-80 bg-gray-200"
                    resizeMode="cover"
                />

                <View className="p-6">
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1">
                            <ThemedText type="title" className="text-2xl font-bold">{product.name}</ThemedText>
                            <ThemedText className="text-gray-500 text-base mt-1">{product.brand} • {product.model}</ThemedText>
                            <View className="flex-row items-center mt-2">
                                <View className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full mr-2">
                                    <ThemedText className="text-blue-600 dark:text-blue-300 text-xs font-medium">{product.category}</ThemedText>
                                </View>
                                <View className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                                    <ThemedText className="text-green-600 dark:text-green-300 text-xs font-medium capitalize">{product.condition}</ThemedText>
                                </View>
                            </View>
                        </View>
                        <ThemedText type="subtitle" className="text-emerald-600 text-2xl font-bold">${product.price}</ThemedText>
                    </View>

                    {/* Description */}
                    <View className="mb-6">
                        <ThemedText type="subtitle" className="mb-2">Description</ThemedText>
                        <ThemedText className="text-gray-600 dark:text-gray-300 leading-6">{product.description || 'No description available.'}</ThemedText>
                    </View>

                    {/* Quantity Selector */}
                    <View className="mb-6">
                        <ThemedText type="subtitle" className="mb-3">Quantity</ThemedText>
                        <View className="flex-row items-center bg-gray-50 dark:bg-zinc-800 rounded-xl p-2 w-32">
                            <TouchableOpacity
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 justify-center items-center">
                                <MaterialIcons name="remove" size={20} color="#666" />
                            </TouchableOpacity>
                            <View className="flex-1 items-center">
                                <ThemedText className="font-bold text-lg">{quantity}</ThemedText>
                            </View>
                            <TouchableOpacity
                                onPress={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 justify-center items-center">
                                <MaterialIcons name="add" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Specifications */}
                    <View className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl mb-6">
                        <View className="flex-row justify-between py-2 border-b border-gray-200 dark:border-zinc-700">
                            <ThemedText className="font-semibold">Product Name</ThemedText>
                            <ThemedText>{product.name}</ThemedText>
                        </View>
                        <View className="flex-row justify-between py-2 border-b border-gray-200 dark:border-zinc-700">
                            <ThemedText className="font-semibold">Brand</ThemedText>
                            <ThemedText>{product.brand}</ThemedText>
                        </View>
                        <View className="flex-row justify-between py-2 border-b border-gray-200 dark:border-zinc-700">
                            <ThemedText className="font-semibold">Model</ThemedText>
                            <ThemedText>{product.model}</ThemedText>
                        </View>
                        <View className="flex-row justify-between py-2">
                            <ThemedText className="font-semibold">Category</ThemedText>
                            <ThemedText>{product.category}</ThemedText>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-800 p-4 pb-8 shadow-lg">
                <View className="flex-row justify-between items-center mb-3">
                    <View>
                        <ThemedText className="text-gray-500">Total Price</ThemedText>
                        <ThemedText className="text-2xl font-bold text-emerald-600">${(product.price * quantity).toFixed(2)}</ThemedText>
                    </View>
                    <View className="flex-row items-center bg-gray-100 dark:bg-zinc-800 rounded-full px-3 py-1">
                        <ThemedText className="text-sm text-gray-600 dark:text-gray-400">Qty: {quantity}</ThemedText>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={handleAddToCart}
                    className="bg-red-600 py-4 rounded-full flex-row justify-center items-center space-x-2">
                    <MaterialIcons name="shopping-bag" size={24} color="white" style={{ marginRight: 8 }} />
                    <ThemedText className="text-white font-bold text-lg">Add to Cart</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}
