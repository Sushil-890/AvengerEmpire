import { View, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCart, CartItem } from '@/context/CartContext';
import { SERVER_URL } from '@/constants/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import { useImperialColors } from '@/hooks/use-imperial-colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CartScreen() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const router = useRouter();
    const { requireAuth } = useAuthNavigation();
    const colors = useImperialColors();

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
        <View 
            className="flex-row rounded-2xl mb-4 overflow-hidden border"
            style={{ 
                backgroundColor: colors.neutral.darkGray,
                borderColor: colors.primary.gold + '20'
            }}>
            {/* Product Image */}
            <View className="relative">
                <Image
                    source={{ uri: getImageUrl(item.image) }}
                    className="w-28 h-full"
                    style={{ backgroundColor: colors.neutral.mediumGray }}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(10,10,10,0.3)']}
                    className="absolute inset-0"
                />
            </View>

            {/* Product Details */}
            <View className="flex-1 p-4 justify-between">
                <View>
                    <ThemedText 
                        className="font-bold text-base mb-1" 
                        numberOfLines={1}
                        style={{ color: colors.neutral.white }}>
                        {item.name}
                    </ThemedText>
                    <ThemedText 
                        className="font-bold text-xl mb-3"
                        style={{ color: colors.primary.gold }}>
                        ${item.price.toFixed(2)}
                    </ThemedText>
                </View>
                
                {/* Quantity Controls */}
                <View className="flex-row items-center justify-between">
                    <View 
                        className="flex-row items-center rounded-full border"
                        style={{ 
                            backgroundColor: colors.neutral.black,
                            borderColor: colors.primary.gold + '30'
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (item.qty > 1) {
                                    updateQuantity && updateQuantity(item.product, item.qty - 1);
                                }
                            }}
                            className="w-9 h-9 justify-center items-center"
                            disabled={item.qty <= 1}>
                            <MaterialIcons 
                                name="remove" 
                                size={16} 
                                color={item.qty <= 1 ? colors.neutral.silver : colors.primary.gold} 
                            />
                        </TouchableOpacity>
                        <View className="px-3">
                            <ThemedText 
                                className="font-bold text-sm"
                                style={{ color: colors.neutral.white }}>
                                {item.qty}
                            </ThemedText>
                        </View>
                        <TouchableOpacity
                            onPress={() => updateQuantity && updateQuantity(item.product, item.qty + 1)}
                            className="w-9 h-9 justify-center items-center">
                            <MaterialIcons name="add" size={16} color={colors.primary.gold} />
                        </TouchableOpacity>
                    </View>
                    
                    <ThemedText 
                        className="font-bold text-sm"
                        style={{ color: colors.neutral.silver }}>
                        ${(item.price * item.qty).toFixed(2)}
                    </ThemedText>
                </View>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
                onPress={() => removeFromCart(item.product)}
                className="absolute top-2 right-2 p-2 rounded-full"
                style={{ backgroundColor: colors.neutral.black + 'CC' }}>
                <MaterialIcons name="close" size={18} color={colors.secondary.crimson} />
            </TouchableOpacity>
        </View>
    );

    if (cartItems.length === 0) {
        return (
            <ThemedView 
                className="flex-1 justify-center items-center px-6"
                style={{ backgroundColor: colors.neutral.black }}>
                <View 
                    className="p-10 rounded-full mb-6"
                    style={{ backgroundColor: colors.neutral.darkGray }}>
                    <MaterialIcons name="shopping-cart" size={72} color={colors.primary.gold} />
                </View>
                <ThemedText 
                    className="text-2xl font-bold mb-3 tracking-wider text-center"
                    style={{ color: colors.neutral.white }}>
                    YOUR CART IS EMPTY
                </ThemedText>
                <ThemedText 
                    className="text-center mb-8 text-base leading-6"
                    style={{ color: colors.neutral.silver }}>
                    Discover premium products{'\n'}crafted for excellence
                </ThemedText>
                <TouchableOpacity
                    onPress={() => router.push('/(drawer)/(tabs)/explore')}
                    className="py-4 px-10 rounded-full"
                    style={{ backgroundColor: colors.primary.gold }}>
                    <ThemedText 
                        className="font-bold text-base tracking-wider"
                        style={{ color: colors.neutral.black }}>
                        START SHOPPING
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ThemedView 
            className="flex-1"
            style={{ backgroundColor: colors.neutral.black }}>
            {/* Header */}
            <View 
                className="pt-12 pb-4 px-5 border-b"
                style={{ borderBottomColor: colors.primary.gold + '20' }}>
                <ThemedText 
                    className="text-2xl font-bold tracking-wide"
                    style={{ color: colors.neutral.white }}>
                    Shopping Cart
                </ThemedText>
                <ThemedText 
                    className="text-sm mt-1"
                    style={{ color: colors.neutral.silver }}>
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </ThemedText>
            </View>

            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.product}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 200 }}
            />

            {/* Checkout Footer */}
            <View 
                className="absolute bottom-0 left-0 right-0 border-t"
                style={{ 
                    backgroundColor: colors.neutral.darkGray,
                    borderTopColor: colors.primary.gold + '30'
                }}>
                <LinearGradient
                    colors={[colors.neutral.darkGray, colors.neutral.black]}
                    className="p-5">
                    {/* Subtotal */}
                    <View className="flex-row justify-between mb-2">
                        <ThemedText 
                            className="text-base"
                            style={{ color: colors.neutral.silver }}>
                            Subtotal
                        </ThemedText>
                        <ThemedText 
                            className="font-bold text-base"
                            style={{ color: colors.neutral.white }}>
                            ${cartTotal.toFixed(2)}
                        </ThemedText>
                    </View>

                    {/* Shipping */}
                    <View className="flex-row justify-between mb-4">
                        <ThemedText 
                            className="text-base"
                            style={{ color: colors.neutral.silver }}>
                            Shipping
                        </ThemedText>
                        <ThemedText 
                            className="font-bold text-base"
                            style={{ color: colors.primary.gold }}>
                            FREE
                        </ThemedText>
                    </View>

                    {/* Divider */}
                    <View 
                        className="h-px mb-4"
                        style={{ backgroundColor: colors.primary.gold + '30' }} 
                    />

                    {/* Total */}
                    <View className="flex-row justify-between mb-5">
                        <ThemedText 
                            className="text-lg font-bold tracking-wide"
                            style={{ color: colors.neutral.white }}>
                            Total
                        </ThemedText>
                        <ThemedText 
                            className="font-bold text-2xl"
                            style={{ color: colors.primary.gold }}>
                            ${cartTotal.toFixed(2)}
                        </ThemedText>
                    </View>

                    {/* Checkout Button */}
                    <TouchableOpacity
                        onPress={handleCheckout}
                        className="py-4 rounded-xl items-center"
                        style={{ backgroundColor: colors.primary.gold }}>
                        <View className="flex-row items-center">
                            <ThemedText 
                                className="font-bold text-base tracking-wider mr-2"
                                style={{ color: colors.neutral.black }}>
                                PROCEED TO CHECKOUT
                            </ThemedText>
                            <MaterialIcons 
                                name="arrow-forward" 
                                size={20} 
                                color={colors.neutral.black} 
                            />
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </ThemedView>
    );
}
