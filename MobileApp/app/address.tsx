import { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api from '@/constants/api';
import { useRouter } from 'expo-router';
import { useImperialColors } from '@/hooks/use-imperial-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface Address {
    _id?: string;
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export default function AddressScreen() {
    const [address, setAddress] = useState<Address>({
        fullName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasAddress, setHasAddress] = useState(false);
    const router = useRouter();
    const colors = useImperialColors();

    useEffect(() => {
        fetchAddress();
    }, []);

    const fetchAddress = async () => {
        try {
            const { data } = await api.get('/address');
            setAddress(data);
            setHasAddress(true);
        } catch (error: any) {
            if (error.response?.status === 404) {
                // No address found, that's okay - user will create one
                setHasAddress(false);
                console.log('No address found - user can create one');
            } else {
                console.error('Error fetching address:', error);
                Alert.alert('Error', 'Failed to load address. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Validate required fields
        if (!address.fullName || !address.phoneNumber || !address.addressLine1 || 
            !address.city || !address.state || !address.postalCode) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setSaving(true);
        try {
            await api.post('/address', address);
            Alert.alert(
                'Success', 
                hasAddress ? 'Address updated successfully!' : 'Address saved successfully!',
                [{ text: 'OK', onPress: () => router.back() }]
            );
            setHasAddress(true);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to save address');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete your address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete('/address');
                            Alert.alert('Success', 'Address deleted successfully', [
                                { text: 'OK', onPress: () => router.back() }
                            ]);
                        } catch (error: any) {
                            Alert.alert('Error', 'Failed to delete address');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <ThemedView className="flex-1 justify-center items-center" style={{ backgroundColor: colors.neutral.black }}>
                <ActivityIndicator size="large" color={colors.primary.gold} />
            </ThemedView>
        );
    }

    return (
        <ThemedView className="flex-1" style={{ backgroundColor: colors.neutral.black }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View className="mb-6">
                    <ThemedText 
                        className="text-2xl font-bold mb-2 tracking-wide"
                        style={{ color: colors.neutral.white }}>
                        {hasAddress ? 'Edit Address' : 'Add Address'}
                    </ThemedText>
                    <ThemedText 
                        className="text-sm"
                        style={{ color: colors.neutral.silver }}>
                        {hasAddress ? 'Update your delivery address' : 'Add your delivery address'}
                    </ThemedText>
                </View>

                <View className="space-y-4">
                    {/* Full Name */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            Full Name *
                        </ThemedText>
                        <TextInput
                            placeholder="John Doe"
                            value={address.fullName}
                            onChangeText={(text) => setAddress({ ...address, fullName: text })}
                            className="p-4 rounded-xl border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold + '30',
                                color: colors.neutral.white
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                    </View>

                    {/* Phone Number */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            Phone Number *
                        </ThemedText>
                        <TextInput
                            placeholder="+1 (555) 123-4567"
                            value={address.phoneNumber}
                            onChangeText={(text) => setAddress({ ...address, phoneNumber: text })}
                            keyboardType="phone-pad"
                            className="p-4 rounded-xl border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold + '30',
                                color: colors.neutral.white
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                    </View>

                    {/* Address Line 1 */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            Address Line 1 *
                        </ThemedText>
                        <TextInput
                            placeholder="123 Main Street"
                            value={address.addressLine1}
                            onChangeText={(text) => setAddress({ ...address, addressLine1: text })}
                            className="p-4 rounded-xl border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold + '30',
                                color: colors.neutral.white
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                    </View>

                    {/* Address Line 2 */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            Address Line 2 (Optional)
                        </ThemedText>
                        <TextInput
                            placeholder="Apartment, suite, etc."
                            value={address.addressLine2}
                            onChangeText={(text) => setAddress({ ...address, addressLine2: text })}
                            className="p-4 rounded-xl border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold + '30',
                                color: colors.neutral.white
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                    </View>

                    {/* City */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            City *
                        </ThemedText>
                        <TextInput
                            placeholder="New York"
                            value={address.city}
                            onChangeText={(text) => setAddress({ ...address, city: text })}
                            className="p-4 rounded-xl border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold + '30',
                                color: colors.neutral.white
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                    </View>

                    {/* State and Postal Code Row */}
                    <View className="flex-row gap-3">
                        <View className="flex-1">
                            <ThemedText 
                                className="mb-2 font-medium"
                                style={{ color: colors.neutral.white }}>
                                State *
                            </ThemedText>
                            <TextInput
                                placeholder="NY"
                                value={address.state}
                                onChangeText={(text) => setAddress({ ...address, state: text })}
                                className="p-4 rounded-xl border"
                                style={{ 
                                    backgroundColor: colors.neutral.darkGray,
                                    borderColor: colors.primary.gold + '30',
                                    color: colors.neutral.white
                                }}
                                placeholderTextColor={colors.neutral.silver}
                            />
                        </View>
                        <View className="flex-1">
                            <ThemedText 
                                className="mb-2 font-medium"
                                style={{ color: colors.neutral.white }}>
                                Postal Code *
                            </ThemedText>
                            <TextInput
                                placeholder="10001"
                                value={address.postalCode}
                                onChangeText={(text) => setAddress({ ...address, postalCode: text })}
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
                    </View>

                    {/* Country */}
                    <View>
                        <ThemedText 
                            className="mb-2 font-medium"
                            style={{ color: colors.neutral.white }}>
                            Country *
                        </ThemedText>
                        <TextInput
                            placeholder="United States"
                            value={address.country}
                            onChangeText={(text) => setAddress({ ...address, country: text })}
                            className="p-4 rounded-xl border"
                            style={{ 
                                backgroundColor: colors.neutral.darkGray,
                                borderColor: colors.primary.gold + '30',
                                color: colors.neutral.white
                            }}
                            placeholderTextColor={colors.neutral.silver}
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={saving}
                        className="py-4 rounded-xl mt-4 flex-row justify-center items-center"
                        style={{ backgroundColor: colors.primary.gold }}>
                        {saving ? (
                            <ActivityIndicator color={colors.neutral.black} />
                        ) : (
                            <>
                                <MaterialIcons 
                                    name="save" 
                                    size={20} 
                                    color={colors.neutral.black} 
                                />
                                <ThemedText 
                                    className="font-bold text-lg ml-2"
                                    style={{ color: colors.neutral.black }}>
                                    {hasAddress ? 'Update Address' : 'Save Address'}
                                </ThemedText>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Delete Button (only if address exists) */}
                    {hasAddress && (
                        <TouchableOpacity
                            onPress={handleDelete}
                            className="py-4 rounded-xl mt-2 flex-row justify-center items-center border"
                            style={{ borderColor: colors.secondary.crimson }}>
                            <MaterialIcons 
                                name="delete" 
                                size={20} 
                                color={colors.secondary.crimson} 
                            />
                            <ThemedText 
                                className="font-bold text-lg ml-2"
                                style={{ color: colors.secondary.crimson }}>
                                Delete Address
                            </ThemedText>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </ThemedView>
    );
}
