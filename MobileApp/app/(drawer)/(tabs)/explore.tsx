import { StyleSheet, FlatList, ActivityIndicator, View, Image, TouchableOpacity, RefreshControl, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api, { SERVER_URL } from '@/constants/api';
import { Link, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ImperialColors, LightColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? ImperialColors : LightColors;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Set category from navigation params if provided
    if (params.category && typeof params.category === 'string') {
      setSelectedCategory(params.category.toLowerCase());
      setShowFilters(true); // Show filters when coming from category click
    }
  }, [params.category]);

  const fetchProducts = async () => {
    try {
      if (!refreshing) setLoading(true);
      setError(null);
      const response = await api.get('/products');
      if (response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
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

  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'home', name: 'Home', icon: 'home' },
    { id: 'electronics', name: 'Electronics', icon: 'phone-android' },
    { id: 'fashion', name: 'Fashion', icon: 'checkroom' },
    { id: 'sneakers', name: 'Sneakers', icon: 'sports-basketball' },
    { id: 'sports', name: 'Sports', icon: 'sports-soccer' },
    { id: 'books', name: 'Books', icon: 'menu-book' },
    { id: 'toys', name: 'Toys', icon: 'toys' },
    { id: 'other', name: 'Other', icon: 'category' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (product.category && product.category.toLowerCase() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const renderProduct = ({ item }: { item: Product }) => (
    <View 
      className="rounded-xl shadow-sm mb-4 overflow-hidden border"
      style={{ 
        backgroundColor: colors.neutral.darkGray,
        borderColor: colors.primary.gold + '20'
      }}>
      <View className="relative">
        <Image
          source={{ uri: getImageUrl(item.images?.[0]) }}
          className="w-full h-48"
          style={{ backgroundColor: colors.neutral.mediumGray }}
          resizeMode="cover"
        />
        <View 
          className="absolute top-3 right-3 px-3 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(10,10,10,0.8)' }}>
          <ThemedText 
            className="text-xs font-bold"
            style={{ color: colors.primary.gold }}>
            {item.condition?.toUpperCase() || 'NEW'}
          </ThemedText>
        </View>
      </View>
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-3">
            <ThemedText 
              className="text-base font-bold leading-tight mb-1"
              style={{ color: colors.neutral.white }}>
              {item.name || `${item.brand} ${item.model}`}
            </ThemedText>
            <ThemedText 
              className="text-xs"
              style={{ color: colors.neutral.silver }}>
              {item.brand} • {item.model}
            </ThemedText>
            {item.category && (
              <View 
                className="mt-2 px-2 py-1 rounded self-start"
                style={{ backgroundColor: colors.primary.gold + '20' }}>
                <ThemedText 
                  className="text-xs font-medium"
                  style={{ color: colors.primary.gold }}>
                  {item.category}
                </ThemedText>
              </View>
            )}
          </View>
          <View 
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: colors.primary.gold + '20' }}>
            <ThemedText 
              className="font-bold text-base"
              style={{ color: colors.primary.gold }}>
              ${item.price}
            </ThemedText>
          </View>
        </View>
        <Link href={`/product/${item._id}`} asChild>
          <TouchableOpacity 
            className="py-3 rounded-lg flex-row justify-center items-center"
            style={{ backgroundColor: colors.secondary.crimson }}>
            <MaterialIcons name="visibility" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <ThemedText 
              className="font-bold text-sm"
              style={{ color: '#FFFFFF' }}>
              View Details
            </ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.neutral.black }]}>
      {/* Header */}
      <View 
        className="pt-12 pb-4 px-4"
        style={{ backgroundColor: colors.neutral.darkGray }}>
        <ThemedText 
          className="text-xl font-bold mb-4"
          style={{ color: colors.neutral.white }}>
          Explore Products
        </ThemedText>

        {/* Search Bar */}
        <View 
          className="flex-row items-center px-4 py-3 rounded-lg border"
          style={{ 
            backgroundColor: colorScheme === 'dark' ? colors.neutral.black : colors.neutral.mediumGray,
            borderColor: colors.neutral.lightGray
          }}>
          <MaterialIcons name="search" size={20} color={colors.primary.gold} />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor={colors.neutral.silver}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-base"
            style={{ color: colors.neutral.white }}
          />
          {/* Filter Toggle Button */}
          <TouchableOpacity
            onPress={() => {
              setShowFilters(!showFilters);
              if (showFilters) {
                // When hiding filters, reset to "All"
                setSelectedCategory('all');
              }
            }}
            className="ml-2 p-2 rounded-lg"
            style={{ backgroundColor: showFilters ? colors.primary.gold + '30' : 'transparent' }}>
            <MaterialIcons 
              name={showFilters ? "filter-list-off" : "filter-list"} 
              size={20} 
              color={colors.primary.gold} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories - Collapsible */}
      {showFilters && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="px-4 py-3"
          style={{ backgroundColor: colors.neutral.darkGray, maxHeight: 60 }}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className="mr-3 px-5 py-2 rounded-full flex-row items-center"
              style={{ 
                backgroundColor: selectedCategory === category.id 
                  ? colors.primary.gold 
                  : (colorScheme === 'dark' ? colors.neutral.black : colors.neutral.mediumGray),
                borderWidth: 1,
                borderColor: colors.primary.gold + '40'
              }}>
              <MaterialIcons 
                name={category.icon as any} 
                size={16} 
                color={selectedCategory === category.id 
                  ? '#FFFFFF'
                  : colors.primary.gold} 
                style={{ marginRight: 6 }}
              />
              <ThemedText 
                className="font-bold text-sm"
                style={{ 
                  color: selectedCategory === category.id 
                    ? '#FFFFFF'
                    : colors.primary.gold 
                }}>
                {category.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Products List */}
      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.gold} />
          <ThemedText 
            className="mt-4"
            style={{ color: colors.neutral.silver }}>
            Loading products...
          </ThemedText>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-6">
          <MaterialIcons name="error-outline" size={48} color={colors.secondary.crimson} />
          <ThemedText 
            className="text-center mt-4 mb-6"
            style={{ color: colors.secondary.crimson }}>
            {error}
          </ThemedText>
          <TouchableOpacity 
            onPress={fetchProducts} 
            className="py-3 px-6 rounded-full"
            style={{ backgroundColor: colors.secondary.crimson }}>
            <ThemedText 
              className="font-bold"
              style={{ color: colors.neutral.white }}>
              Try Again
            </ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={[colors.primary.gold]}
              tintColor={colors.primary.gold}
            />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20">
              <MaterialIcons name="search-off" size={64} color={colors.neutral.silver} />
              <ThemedText 
                className="text-lg font-bold mt-4 mb-2"
                style={{ color: colors.neutral.silver }}>
                No Products Found
              </ThemedText>
              <ThemedText 
                className="text-center"
                style={{ color: colors.neutral.silver }}>
                Try adjusting your search or filters
              </ThemedText>
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