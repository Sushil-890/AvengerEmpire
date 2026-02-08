import { StyleSheet, FlatList, ActivityIndicator, View, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api, { SERVER_URL } from '@/constants/api';
import { Link, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCart } from '@/context/CartContext';

// Product Interface
interface Product {
  _id: string;
  brand: string;
  model: string;
  price: number;
  images: string[];
  condition: string;
}

export default function TabTwoScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { cartItems } = useCart();
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      if (!refreshing) setLoading(true);
      setError(null);
      const response = await api.get('/products');
      if (response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        // Handle edge case where data might be directly the array
        setProducts(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/300';
    if (imagePath.startsWith('http')) return imagePath;
    return `${SERVER_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm mb-4 overflow-hidden border border-gray-100 dark:border-zinc-700">
      <View className="relative">
        <Image
          source={{ uri: getImageUrl(item.images?.[0]) }}
          className="w-full h-56 bg-gray-200"
          resizeMode="cover"
        />
        <View className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded-full">
          <ThemedText className="text-white text-xs font-medium capitalize">{item.condition}</ThemedText>
        </View>
      </View>
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-3">
            <ThemedText type="defaultSemiBold" className="text-lg leading-tight">{item.brand}</ThemedText>
            <ThemedText className="text-gray-600 dark:text-gray-400 text-base mt-1">{item.model}</ThemedText>
          </View>
          <View className="bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
            <ThemedText className="text-emerald-700 dark:text-emerald-400 font-bold text-lg">${item.price}</ThemedText>
          </View>
        </View>
        <Link href={`/product/${item._id}`} asChild>
          <TouchableOpacity className="bg-gradient-to-r from-red-600 to-red-700 py-3 rounded-xl flex-row justify-center items-center shadow-sm">
            <MaterialIcons name="visibility" size={20} color="white" style={{ marginRight: 6 }} />
            <ThemedText className="text-white font-semibold">View Details</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View className="pt-14 pb-4 px-4 flex-row justify-between items-center bg-white dark:bg-black border-b border-gray-100 dark:border-zinc-800">
        <ThemedText type="title" className="text-2xl font-bold text-red-600">Avenger Empire</ThemedText>
        <TouchableOpacity onPress={() => router.push('/cart')}>
          <View className="relative">
            <MaterialIcons name="shopping-cart" size={24} color={loading ? "gray" : "#DC2626"} />
            {cartItems.length > 0 && (
              <View className="absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 justify-center items-center">
                <ThemedText className="text-white text-xs font-bold">{cartItems.length}</ThemedText>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#DC2626" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-6">
          <MaterialIcons name="error-outline" size={48} color="#EF4444" />
          <ThemedText className="text-red-500 text-center mt-4 mb-6">{error}</ThemedText>
          <TouchableOpacity onPress={fetchProducts} className="bg-red-600 py-3 px-6 rounded-full">
            <ThemedText className="text-white font-semibold">Try Again</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC2626']} />}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20">
              <ThemedText className="text-gray-500">No products found</ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
