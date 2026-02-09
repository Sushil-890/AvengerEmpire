import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ImagePicker from '@/components/ImagePicker';
import api from '@/constants/api';
import { useRouter } from 'expo-router';
import { useImperialColors } from '@/hooks/use-imperial-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const CATEGORIES = ['Home', 'Electronics', 'Fashion', 'Sneakers', 'Sports', 'Books', 'Toys', 'Other'];

export default function AddProductScreen() {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [category, setCategory] = useState('Home');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [condition, setCondition] = useState('New');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const colors = useImperialColors();

    const handleAddProduct = async () => {
        if (!name || !brand || !model || !price || !imageUrl) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const productData = {
                name,
                brand,
                model,
                category,
                colorway: 'Default', // Simplified for demo
                size: 10, // Default mock size
                condition,
                price: Number(price),
                images: [imageUrl],
                description,
                boxCondition: 'Good'
            };

            await api.post('/products', productData);
            Alert.alert('Success', 'Product added successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={{ backgroundColor: colors.neutral.black }} className="flex-1">
            <KeyboardAwareScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled">
                <View className="mb-6">
                    <ThemedText 
                        className="text-2xl font-bold mb-2"
                        style={{ color: colors.neutral.white }}>
                        Add New Product
                    </ThemedText>
                    <ThemedText 
                        className="text-sm"
                        style={{ color: colors.neutral.silver }}>
                        Fill in the details to list your product
                    </ThemedText>
                </View>

                <View className="space-y-4">
                    {/* Product Name */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            Product Name *
                        </ThemedText>
                        <TextInput
                            placeholder="e.g. Air Jordan 1 Retro High"
                            value={name}
                            onChangeText={setName}
                            className="p-4 rounded-xl border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold + '30',
                                color: colors.neutral.white
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                    </View>

                    {/* Brand */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            Brand *
                        </ThemedText>
                        <TextInput
                            placeholder="e.g. Nike"
                            value={brand}
                            onChangeText={setBrand}
                            className="p-4 rounded-xl border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold + '30',
                                color: colors.neutral.white
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                    </View>

                    {/* Model */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            Model *
                        </ThemedText>
                        <TextInput
                            placeholder="e.g. Jordan 1"
                            value={model}
                            onChangeText={setModel}
                            className="p-4 rounded-xl border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold + '30',
                                color: colors.neutral.white
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                    </View>

                    {/* Category */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            Category
                        </ThemedText>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex-row space-x-2">
                                {CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        onPress={() => setCategory(cat)}
                                        className="px-4 py-2 rounded-full border"
                                        style={{
                                            backgroundColor: category === cat 
                                                ? colors.primary.gold
                                                : 'transparent',
                                            borderColor: category === cat 
                                                ? colors.primary.gold
                                                : colors.primary.gold + '30'
                                        }}>
                                        <ThemedText 
                                            className="font-medium"
                                            style={{ 
                                                color: category === cat 
                                                    ? colors.neutral.black
                                                    : colors.neutral.silver
                                            }}>
                                            {cat}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Price */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            Price ($) *
                        </ThemedText>
                        <TextInput
                            placeholder="0.00"
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                            className="p-4 rounded-xl border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold + '30',
                                color: colors.neutral.white
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                    </View>

                    {/* Image Picker */}
                    <ImagePicker 
                        onImageSelected={setImageUrl}
                        currentImage={imageUrl}
                    />

                    {/* Condition */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            Condition
                        </ThemedText>
                        <View className="flex-row flex-wrap gap-2">
                            {['New', 'Used - Like New', 'Used - Good'].map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    onPress={() => setCondition(c)}
                                    className="px-4 py-2 rounded-full border"
                                    style={{
                                        backgroundColor: condition === c 
                                            ? colors.primary.gold
                                            : 'transparent',
                                        borderColor: condition === c 
                                            ? colors.primary.gold
                                            : colors.primary.gold + '30'
                                    }}>
                                    <ThemedText 
                                        className="font-medium"
                                        style={{ 
                                            color: condition === c 
                                                ? colors.neutral.black
                                                : colors.neutral.silver
                                        }}>
                                        {c}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Description */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            Description
                        </ThemedText>
                        <TextInput
                            placeholder="Product details..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            className="p-4 rounded-xl border h-32"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold + '30',
                                color: colors.neutral.white,
                                textAlignVertical: 'top'
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleAddProduct}
                        disabled={loading}
                        className="py-4 rounded-xl mt-4 flex-row justify-center items-center"
                        style={{ backgroundColor: colors.primary.gold }}>
                        {loading ? (
                            <ActivityIndicator color={colors.neutral.black} />
                        ) : (
                            <>
                                <MaterialIcons 
                                    name="add-circle" 
                                    size={20} 
                                    color={colors.neutral.black} 
                                />
                                <ThemedText 
                                    className="font-bold text-lg ml-2"
                                    style={{ color: colors.neutral.black }}>
                                    Create Listing
                                </ThemedText>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </ThemedView>
    );
}
