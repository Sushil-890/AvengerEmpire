import { View, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import api, { SERVER_URL } from '@/constants/api';
import { ImperialColors, LightColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Product {
  _id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  images: string[];
  condition: string;
  category?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems } = useCart();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? ImperialColors : LightColors;
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products?limit=6');
      if (response.data && Array.isArray(response.data.products)) {
        setFeaturedProducts(response.data.products.slice(0, 6));
      }
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/300';
    if (imagePath.startsWith('http')) return imagePath;
    return `${SERVER_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const categories = [
    { name: 'Sneakers', icon: 'sports-basketball', color: colors.primary.gold },
    { name: 'Electronics', icon: 'phone-android', color: colors.secondary.crimson },
    { name: 'Fashion', icon: 'checkroom', color: colors.accent.bronze },
    { name: 'Home', icon: 'home', color: colors.accent.copper },
  ];

  return (
    <ThemedView style={{ backgroundColor: colors.neutral.black }} className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Banner Section */}
        <View className="relative">
          <ImageBackground
            source={require('@/assets/images/kohinoor_clean_hero_1768133543715.png')}
            style={{ width: width, height: 320 }}
            resizeMode="cover">
            <LinearGradient
              colors={['rgba(10,10,10,0.7)', 'rgba(10,10,10,0.5)', 'rgba(10,10,10,0.9)']}
              className="flex-1">
              
              

              {/* Welcome User - Top Right (Lower Position) */}
              <View className="absolute top-24 right-5 z-10">
                <View 
                  className="px-3 py-1.5 rounded-full border"
                  style={{ 
                    backgroundColor: 'rgba(10,10,10,0.8)',
                    borderColor: colors.primary.gold + '40'
                  }}>
                  <ThemedText 
                    className="text-xs tracking-wide text-center"
                    style={{ color: colors.neutral.silver }}>
                    Welcome, <ThemedText 
                      className="text-xs font-bold"
                      style={{ color: colors.primary.gold }}>
                      {user?.name || 'Guest'}
                    </ThemedText>
                  </ThemedText>
                </View>
              </View>
              
              {/* Imperial Title - Top */}
              <View className="px-6 pt-12">
                <ThemedText 
                  className="text-2xl font-bold tracking-wide"
                  style={{ color: colors.primary.gold }}>
                  Imperial Style for Royalty
                </ThemedText>
              </View>
              

              {/* Hero Content - Center */}
              <View className="flex-1 justify-center px-6">
                <ThemedText 
                  className="text-sm leading-6 mb-6"
                  style={{ color: colors.neutral.silver }}>
                  Discover premium products{'\n'}crafted for excellence
                </ThemedText>
                
                <TouchableOpacity
                  onPress={() => router.push('/(drawer)/(tabs)/explore')}
                  className="self-start px-6 py-3 rounded-lg"
                  style={{ backgroundColor: colors.primary.gold }}>
                  <ThemedText 
                    className="font-bold tracking-wider"
                    style={{ color: colors.neutral.black }}>
                    SHOP NOW
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Categories Section */}
        <View className="px-4 py-6">
          <ThemedText 
            className="text-lg font-bold mb-4 tracking-wide"
            style={{ color: colors.neutral.white }}>
            Shop by Category
          </ThemedText>
          
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push({
                  pathname: '/(drawer)/(tabs)/explore',
                  params: { category: category.name }
                })}
                className="w-[48%] rounded-xl p-4 mb-3 border"
                style={{ 
                  backgroundColor: colors.neutral.darkGray,
                  borderColor: colors.primary.gold + '20'
                }}>
                <View 
                  className="p-3 rounded-full mb-3 self-start"
                  style={{ backgroundColor: category.color + '20' }}>
                  <MaterialIcons name={category.icon as any} size={24} color={category.color} />
                </View>
                <ThemedText 
                  className="font-bold"
                  style={{ color: colors.neutral.white }}>
                  {category.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Products Section */}
        <View className="px-4 pb-6">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText 
              className="text-lg font-bold tracking-wide"
              style={{ color: colors.neutral.white }}>
              Featured Products
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)/explore')}>
              <ThemedText 
                className="font-bold text-sm"
                style={{ color: colors.primary.gold }}>
                View All →
              </ThemedText>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View className="h-48 justify-center items-center">
              <ThemedText style={{ color: colors.neutral.silver }}>
                Loading products...
              </ThemedText>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {featuredProducts.map((product) => (
                <TouchableOpacity
                  key={product._id}
                  onPress={() => router.push(`/product/${product._id}`)}
                  className="w-40 rounded-xl overflow-hidden mr-3 border"
                  style={{ 
                    backgroundColor: colors.neutral.darkGray,
                    borderColor: colors.primary.gold + '20'
                  }}>
                  <Image
                    source={{ uri: getImageUrl(product.images?.[0]) }}
                    className="w-full h-32"
                    style={{ backgroundColor: colors.neutral.mediumGray }}
                    resizeMode="cover"
                  />
                  <View className="p-3">
                    <ThemedText 
                      className="font-bold text-sm mb-1" 
                      numberOfLines={1}
                      style={{ color: colors.neutral.white }}>
                      {product.name || `${product.brand} ${product.model}`}
                    </ThemedText>
                    <ThemedText 
                      className="text-xs mb-2" 
                      numberOfLines={1}
                      style={{ color: colors.neutral.silver }}>
                      {product.brand} • {product.model}
                    </ThemedText>
                    <ThemedText 
                      className="font-bold"
                      style={{ color: colors.primary.gold }}>
                      ${product.price}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Seller Dashboard CTA */}
        {user && (user.role === 'seller' || user.role === 'admin') && (
          <View className="px-4 pb-6">
            <TouchableOpacity
              onPress={() => router.push('/seller/dashboard')}
              className="p-5 rounded-xl flex-row items-center border"
              style={{ 
                backgroundColor: colors.neutral.darkGray,
                borderColor: colors.primary.gold + '40'
              }}>
              <View 
                className="p-3 rounded-full mr-4"
                style={{ backgroundColor: colors.primary.gold + '20' }}>
                <MaterialIcons name="store" size={24} color={colors.primary.gold} />
              </View>
              <View className="flex-1">
                <ThemedText 
                  className="font-bold text-base mb-1"
                  style={{ color: colors.neutral.white }}>
                  Seller Dashboard
                </ThemedText>
                <ThemedText 
                  className="text-sm"
                  style={{ color: colors.neutral.silver }}>
                  Manage products & orders
                </ThemedText>
              </View>
              <MaterialIcons name="arrow-forward" size={20} color={colors.primary.gold} />
            </TouchableOpacity>
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </ThemedView>
  );
}