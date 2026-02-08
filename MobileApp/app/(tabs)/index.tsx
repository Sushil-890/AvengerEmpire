import { View, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import api, { SERVER_URL } from '@/constants/api';

interface Product {
  _id: string;
  brand: string;
  model: string;
  price: number;
  images: string[];
  condition: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products?limit=4');
      if (response.data && Array.isArray(response.data.products)) {
        setFeaturedProducts(response.data.products.slice(0, 4));
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
    { name: 'Sneakers', icon: 'sports-basketball', color: '#EF4444' },
    { name: 'Electronics', icon: 'phone-android', color: '#3B82F6' },
    { name: 'Fashion', icon: 'checkroom', color: '#8B5CF6' },
    { name: 'Home', icon: 'home', color: '#10B981' },
  ];

  return (
    <ThemedView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-14 pb-6 px-4 bg-gradient-to-br from-red-600 to-red-700">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <ThemedText className="text-white/80 text-sm">Welcome back,</ThemedText>
              <ThemedText className="text-white text-xl font-bold">
                {user?.name || 'Guest'}
              </ThemedText>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/cart')}
              className="relative bg-white/20 p-3 rounded-full">
              <MaterialIcons name="shopping-cart" size={24} color="white" />
              {cartItems.length > 0 && (
                <View className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-5 h-5 justify-center items-center">
                  <ThemedText className="text-black text-xs font-bold">{cartItems.length}</ThemedText>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          <ThemedText className="text-white text-3xl font-bold mb-2">Avenger Empire</ThemedText>
          <ThemedText className="text-white/90">Discover amazing products at great prices</ThemedText>
        </View>

        {/* Quick Actions */}
        <View className="px-4 -mt-6">
          <View className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-zinc-700">
            <View className="flex-row justify-between">
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/explore')}
                className="flex-1 items-center py-3">
                <View className="bg-blue-100 p-3 rounded-full mb-2">
                  <MaterialIcons name="explore" size={24} color="#3B82F6" />
                </View>
                <ThemedText className="font-medium">Explore</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => router.push('/orders')}
                className="flex-1 items-center py-3">
                <View className="bg-green-100 p-3 rounded-full mb-2">
                  <MaterialIcons name="inventory" size={24} color="#10B981" />
                </View>
                <ThemedText className="font-medium">Orders</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/profile')}
                className="flex-1 items-center py-3">
                <View className="bg-purple-100 p-3 rounded-full mb-2">
                  <MaterialIcons name="person" size={24} color="#8B5CF6" />
                </View>
                <ThemedText className="font-medium">Profile</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Categories */}
        <View className="px-4 mt-6">
          <ThemedText type="subtitle" className="mb-4">Shop by Category</ThemedText>
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push('/(tabs)/explore')}
                className="w-[48%] bg-white dark:bg-zinc-800 rounded-xl p-4 mb-3 border border-gray-100 dark:border-zinc-700">
                <View className="items-center">
                  <View className="p-3 rounded-full mb-2" style={{ backgroundColor: `${category.color}20` }}>
                    <MaterialIcons name={category.icon as any} size={28} color={category.color} />
                  </View>
                  <ThemedText className="font-medium">{category.name}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View className="px-4 mt-6 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText type="subtitle">Featured Products</ThemedText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <ThemedText className="text-red-600 font-medium">View All</ThemedText>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View className="h-48 justify-center items-center">
              <ThemedText className="text-gray-500">Loading products...</ThemedText>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-4">
              {featuredProducts.map((product) => (
                <TouchableOpacity
                  key={product._id}
                  onPress={() => router.push(`/product/${product._id}`)}
                  className="w-40 bg-white dark:bg-zinc-800 rounded-xl overflow-hidden mr-3 border border-gray-100 dark:border-zinc-700">
                  <Image
                    source={{ uri: getImageUrl(product.images?.[0]) }}
                    className="w-full h-32 bg-gray-200"
                    resizeMode="cover"
                  />
                  <View className="p-3">
                    <ThemedText className="font-semibold text-sm" numberOfLines={1}>
                      {product.brand}
                    </ThemedText>
                    <ThemedText className="text-gray-500 text-xs mt-1" numberOfLines={1}>
                      {product.model}
                    </ThemedText>
                    <ThemedText className="text-emerald-600 font-bold mt-2">
                      ${product.price}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Seller CTA */}
        {user && (user.role === 'seller' || user.role === 'admin') && (
          <View className="px-4 mb-8">
            <TouchableOpacity
              onPress={() => router.push('/seller/dashboard')}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 rounded-xl flex-row items-center">
              <View className="bg-white/20 p-3 rounded-full mr-4">
                <MaterialIcons name="store" size={24} color="white" />
              </View>
              <View className="flex-1">
                <ThemedText className="text-white font-bold text-lg">Seller Dashboard</ThemedText>
                <ThemedText className="text-white/90 text-sm">Manage your products and orders</ThemedText>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
