import { useEffect, useState } from 'react';
import { View, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api, { SERVER_URL } from '@/constants/api';
import { useCart } from '@/context/CartContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ImperialColors, LightColors } from '@/constants/theme';

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
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? ImperialColors : LightColors;

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
            <ThemedView className="flex-1 justify-center items-center" style={{ backgroundColor: colors.neutral.black }}>
                <ActivityIndicator size="large" color={colors.primary.gold} />
            </ThemedView>
        );
    }

    if (error || !product) {
        return (
            <ThemedView className="flex-1 justify-center items-center p-6" style={{ backgroundColor: colors.neutral.black }}>
                <MaterialIcons name="error-outline" size={48} color={colors.secondary.crimson} />
                <ThemedText className="text-center mt-4" style={{ color: colors.secondary.crimson }}>{error || 'Product not found'}</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView className="flex-1" style={{ backgroundColor: colors.neutral.black }}>
            <ScrollView 
                contentContainerStyle={{ paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <Image
                    source={{ uri: getImageUrl(product.images?.[0]) }}
                    className="w-full h-80"
                    style={{ backgroundColor: colors.neutral.mediumGray }}
                    resizeMode="cover"
                />

                <View className="p-6">
                    {/* Product Header */}
                    <View className="mb-6">
                        <View className="flex-row justify-between items-start mb-3">
                            <View className="flex-1 mr-4">
                                <ThemedText 
                                    className="text-2xl font-bold mb-2 tracking-wide" 
                                    style={{ color: colors.neutral.white }}>
                                    {product.name}
                                </ThemedText>
                                <ThemedText 
                                    className="text-base mb-3" 
                                    style={{ color: colors.neutral.silver }}>
                                    {product.brand} • {product.model}
                                </ThemedText>
                            </View>
                            <ThemedText 
                                className="text-2xl font-bold" 
                                style={{ color: colors.primary.gold }}>
                                ${product.price}
                            </ThemedText>
                        </View>
                        
                        {/* Category & Condition Tags */}
                        <View className="flex-row items-center">
                            <View 
                                className="px-3 py-1.5 rounded-full mr-2 border" 
                                style={{ 
                                    backgroundColor: colors.primary.gold + '20',
                                    borderColor: colors.primary.gold + '40'
                                }}>
                                <ThemedText 
                                    className="text-xs font-bold tracking-wide" 
                                    style={{ color: colors.primary.gold }}>
                                    {product.category.toUpperCase()}
                                </ThemedText>
                            </View>
                            <View 
                                className="px-3 py-1.5 rounded-full border" 
                                style={{ 
                                    backgroundColor: colors.accent.bronze + '20',
                                    borderColor: colors.accent.bronze + '40'
                                }}>
                                <ThemedText 
                                    className="text-xs font-bold tracking-wide capitalize" 
                                    style={{ color: colors.accent.bronze }}>
                                    {product.condition}
                                </ThemedText>
                            </View>
                        </View>
                    </View>

                    {/* Description */}
                    <View className="mb-6">
                        <ThemedText 
                            className="text-lg font-bold mb-3 tracking-wide" 
                            style={{ color: colors.neutral.white }}>
                            Description
                        </ThemedText>
                        <ThemedText 
                            className="leading-6" 
                            style={{ color: colors.neutral.silver }}>
                            {product.description || 'No description available.'}
                        </ThemedText>
                    </View>

                    {/* Quantity Selector */}
                    <View className="mb-6">
                        <ThemedText 
                            className="text-lg font-bold mb-3 tracking-wide" 
                            style={{ color: colors.neutral.white }}>
                            Quantity
                        </ThemedText>
                        <View 
                            className="flex-row items-center rounded-xl p-2 w-36 border" 
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.neutral.lightGray
                            }}>
                            <TouchableOpacity
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 justify-center items-center rounded-lg"
                                style={{ backgroundColor: colors.neutral.mediumGray }}>
                                <MaterialIcons name="remove" size={20} color={colors.neutral.white} />
                            </TouchableOpacity>
                            <View className="flex-1 items-center">
                                <ThemedText 
                                    className="font-bold text-xl" 
                                    style={{ color: colors.neutral.white }}>
                                    {quantity}
                                </ThemedText>
                            </View>
                            <TouchableOpacity
                                onPress={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 justify-center items-center rounded-lg"
                                style={{ backgroundColor: colors.neutral.mediumGray }}>
                                <MaterialIcons name="add" size={20} color={colors.neutral.white} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Specifications */}
                    <View className="mb-6">
                        <ThemedText 
                            className="text-lg font-bold mb-3 tracking-wide" 
                            style={{ color: colors.neutral.white }}>
                            Specifications
                        </ThemedText>
                        <View 
                            className="rounded-xl border overflow-hidden" 
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.neutral.lightGray
                            }}>
                            <View 
                                className="flex-row justify-between p-4 border-b" 
                                style={{ borderBottomColor: colors.neutral.lightGray }}>
                                <ThemedText 
                                    className="font-bold" 
                                    style={{ color: colors.neutral.silver }}>
                                    Product Name
                                </ThemedText>
                                <ThemedText 
                                    className="flex-1 text-right ml-4" 
                                    numberOfLines={1}
                                    style={{ color: colors.neutral.white }}>
                                    {product.name}
                                </ThemedText>
                            </View>
                            <View 
                                className="flex-row justify-between p-4 border-b" 
                                style={{ borderBottomColor: colors.neutral.lightGray }}>
                                <ThemedText 
                                    className="font-bold" 
                                    style={{ color: colors.neutral.silver }}>
                                    Brand
                                </ThemedText>
                                <ThemedText style={{ color: colors.neutral.white }}>
                                    {product.brand}
                                </ThemedText>
                            </View>
                            <View 
                                className="flex-row justify-between p-4 border-b" 
                                style={{ borderBottomColor: colors.neutral.lightGray }}>
                                <ThemedText 
                                    className="font-bold" 
                                    style={{ color: colors.neutral.silver }}>
                                    Model
                                </ThemedText>
                                <ThemedText style={{ color: colors.neutral.white }}>
                                    {product.model}
                                </ThemedText>
                            </View>
                            <View className="flex-row justify-between p-4">
                                <ThemedText 
                                    className="font-bold" 
                                    style={{ color: colors.neutral.silver }}>
                                    Category
                                </ThemedText>
                                <ThemedText style={{ color: colors.neutral.white }}>
                                    {product.category}
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View 
                className="absolute bottom-0 left-0 right-0 p-4 pb-8 border-t" 
                style={{ 
                    backgroundColor: colors.neutral.darkGray,
                    borderTopColor: colors.neutral.lightGray,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5
                }}>
                <View className="flex-row justify-between items-center mb-3">
                    <View>
                        <ThemedText 
                            className="text-sm mb-1" 
                            style={{ color: colors.neutral.silver }}>
                            Total Price
                        </ThemedText>
                        <ThemedText 
                            className="text-3xl font-bold" 
                            style={{ color: colors.primary.gold }}>
                            ${(product.price * quantity).toFixed(2)}
                        </ThemedText>
                    </View>
                    <View 
                        className="flex-row items-center rounded-full px-4 py-2 border" 
                        style={{ 
                            backgroundColor: colors.neutral.mediumGray,
                            borderColor: colors.neutral.lightGray
                        }}>
                        <MaterialIcons name="shopping-cart" size={16} color={colors.neutral.silver} style={{ marginRight: 6 }} />
                        <ThemedText 
                            className="font-bold" 
                            style={{ color: colors.neutral.white }}>
                            Qty: {quantity}
                        </ThemedText>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={handleAddToCart}
                    className="py-4 rounded-xl items-center"
                    style={{ backgroundColor: colors.secondary.crimson }}>
                    <View className="flex-row items-center">
                        <MaterialIcons name="shopping-bag" size={20} color={colors.neutral.white} style={{ marginRight: 8 }} />
                        <ThemedText 
                            className="font-bold text-base tracking-wider" 
                            style={{ color: colors.neutral.white }}>
                            ADD TO CART
                        </ThemedText>
                    </View>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}
