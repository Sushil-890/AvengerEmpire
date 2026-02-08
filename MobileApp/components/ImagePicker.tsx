import { useState } from 'react';
import { View, TouchableOpacity, Image, Alert, ActivityIndicator, TextInput, Modal, Platform } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ExpoImagePicker from 'expo-image-picker';
import api from '@/constants/api';
import { useImperialColors } from '@/hooks/use-imperial-colors';

interface ImagePickerProps {
    onImageSelected: (imageUrl: string) => void;
    currentImage?: string;
}

export default function ImagePicker({ onImageSelected, currentImage }: ImagePickerProps) {
    const [uploading, setUploading] = useState(false);
    const [showUrlModal, setShowUrlModal] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const colors = useImperialColors();

    const pickImage = () => {
        Alert.alert(
            'Select Image',
            'Choose how you want to add an image',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Enter URL', onPress: () => openUrlModal() },
                { text: 'Take Photo', onPress: () => takePhoto() },
                { text: 'Choose from Gallery', onPress: () => pickFromGallery() }
            ]
        );
    };

    const openUrlModal = () => {
        setUrlInput(currentImage || 'https://');
        setShowUrlModal(true);
    };

    const handleUrlSubmit = () => {
        if (urlInput && urlInput.trim() && urlInput.startsWith('http')) {
            onImageSelected(urlInput.trim());
            setShowUrlModal(false);
            setUrlInput('');
        } else {
            Alert.alert('Invalid URL', 'Please enter a valid image URL starting with http:// or https://');
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ExpoImagePicker.requestCameraPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Camera permission is required to take photos.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const result = await ExpoImagePicker.launchCameraAsync({
                mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                await uploadImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    const pickFromGallery = async () => {
        try {
            const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Gallery permission is required to select photos.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const result = await ExpoImagePicker.launchImageLibraryAsync({
                mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                await uploadImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const uploadImage = async (uri: string) => {
        setUploading(true);
        try {
            const formData = new FormData();
            const filename = uri.split('/').pop() || 'image.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('image', {
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                name: filename,
                type,
            } as any);

            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Backend returns the path directly as a string like "/uploads/image-123456.jpg"
            if (response.data) {
                const imagePath = typeof response.data === 'string' ? response.data : response.data.imageUrl;
                onImageSelected(imagePath);
                Alert.alert('Success', 'Image uploaded successfully!');
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            Alert.alert(
                'Upload Failed',
                error.response?.data?.message || 'Failed to upload image. You can use an image URL instead.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Enter URL', onPress: () => openUrlModal() }
                ]
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <View>
            <ThemedText className="mb-2 font-medium" style={{ color: colors.neutral.white }}>
                Product Image *
            </ThemedText>
            
            {currentImage ? (
                <View className="relative">
                    <Image 
                        source={{ uri: currentImage }} 
                        className="w-full h-48 rounded-xl"
                        style={{ backgroundColor: colors.neutral.mediumGray }}
                        resizeMode="cover" 
                    />
                    <TouchableOpacity
                        onPress={() => onImageSelected('')}
                        className="absolute top-2 right-2 rounded-full p-2"
                        style={{ backgroundColor: colors.secondary.crimson }}>
                        <MaterialIcons name="close" size={20} color={colors.neutral.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={pickImage}
                        className="absolute bottom-2 right-2 rounded-full p-2"
                        style={{ backgroundColor: colors.neutral.black + 'CC' }}>
                        <MaterialIcons name="edit" size={20} color={colors.primary.gold} />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={pickImage}
                    disabled={uploading}
                    className="w-full h-48 rounded-xl border-2 border-dashed justify-center items-center"
                    style={{ 
                        backgroundColor: colors.neutral.darkGray,
                        borderColor: colors.primary.gold + '40'
                    }}>
                    {uploading ? (
                        <>
                            <ActivityIndicator size="large" color={colors.primary.gold} />
                            <ThemedText className="mt-2" style={{ color: colors.neutral.silver }}>
                                Uploading...
                            </ThemedText>
                        </>
                    ) : (
                        <>
                            <MaterialIcons name="add-photo-alternate" size={48} color={colors.primary.gold} />
                            <ThemedText className="mt-2 text-center" style={{ color: colors.neutral.white }}>
                                Tap to add product image
                            </ThemedText>
                            <ThemedText className="text-sm mt-1" style={{ color: colors.neutral.silver }}>
                                Camera, Gallery, or URL
                            </ThemedText>
                        </>
                    )}
                </TouchableOpacity>
            )}

            {/* URL Input Modal */}
            <Modal
                visible={showUrlModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowUrlModal(false)}>
                <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <ThemedView 
                        className="w-11/12 rounded-2xl p-6"
                        style={{ backgroundColor: colors.neutral.darkGray }}>
                        <View className="flex-row justify-between items-center mb-4">
                            <ThemedText className="text-xl font-bold" style={{ color: colors.neutral.white }}>
                                Enter Image URL
                            </ThemedText>
                            <TouchableOpacity onPress={() => setShowUrlModal(false)}>
                                <MaterialIcons name="close" size={24} color={colors.neutral.silver} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            value={urlInput}
                            onChangeText={setUrlInput}
                            placeholder="https://example.com/image.jpg"
                            placeholderTextColor={colors.neutral.silver}
                            className="p-4 rounded-xl border mb-4"
                            style={{ 
                                backgroundColor: colors.neutral.black,
                                borderColor: colors.primary.gold + '30',
                                color: colors.neutral.white
                            }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="url"
                        />

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setShowUrlModal(false)}
                                className="flex-1 py-3 rounded-xl border"
                                style={{ borderColor: colors.neutral.silver }}>
                                <ThemedText className="text-center font-bold" style={{ color: colors.neutral.silver }}>
                                    Cancel
                                </ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleUrlSubmit}
                                className="flex-1 py-3 rounded-xl"
                                style={{ backgroundColor: colors.primary.gold }}>
                                <ThemedText className="text-center font-bold" style={{ color: colors.neutral.black }}>
                                    Add Image
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </ThemedView>
                </View>
            </Modal>
        </View>
    );
}