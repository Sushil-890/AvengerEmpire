import React from 'react';
import { View, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useImperialColors } from '@/hooks/use-imperial-colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ImperialHeaderProps {
  showBanner?: boolean;
  title?: string;
  subtitle?: string;
}

export function ImperialHeader({ 
  showBanner = true, 
  title = "AVENGER EMPIRE",
  subtitle = "IMPERIAL STYLE FOR ROYALTY" 
}: ImperialHeaderProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { cartItems } = useCart();
  const colors = useImperialColors();

  const HeaderContent = () => (
    <View className="relative">
      {/* Top Navigation Bar */}
      <View 
        className="flex-row justify-between items-center px-4 pt-12 pb-4 z-10"
        style={{ backgroundColor: colors.neutral.black }}>
        <TouchableOpacity 
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          className="p-2 rounded-full"
          style={{ backgroundColor: colors.neutral.darkGray }}>
          <MaterialIcons name="menu" size={24} color={colors.primary.gold} />
        </TouchableOpacity>
        
        <View className="flex-1 items-center">
          <ThemedText 
            className="font-bold text-sm tracking-widest"
            style={{ color: colors.primary.gold }}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText 
              className="text-xs tracking-wide"
              style={{ color: colors.neutral.silver }}>
              {subtitle}
            </ThemedText>
          )}
        </View>
        
        <TouchableOpacity 
          onPress={() => router.push('/cart')}
          className="relative p-2 rounded-full"
          style={{ backgroundColor: colors.neutral.darkGray }}>
          <MaterialIcons name="shopping-cart" size={24} color={colors.primary.gold} />
          {cartItems.length > 0 && (
            <View 
              className="absolute -top-1 -right-1 rounded-full w-5 h-5 justify-center items-center"
              style={{ backgroundColor: colors.secondary.crimson }}>
              <ThemedText 
                className="text-xs font-bold"
                style={{ color: colors.neutral.white }}>
                {cartItems.length}
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {showBanner && (
        <>
          {/* Welcome Section */}
          <View className="px-4 pb-6" style={{ backgroundColor: colors.neutral.black }}>
            <ThemedText 
              className="text-4xl font-bold mb-2 tracking-wide"
              style={{ color: colors.neutral.white }}>
              Welcome
            </ThemedText>
            <ThemedText 
              className="text-base opacity-80"
              style={{ color: colors.neutral.silver }}>
              Discover premium products
            </ThemedText>
          </View>

          {/* Imperial Banner Section */}
          <View className="mx-4 mb-6 rounded-2xl overflow-hidden">
            <LinearGradient
              colors={[colors.neutral.darkGray, colors.neutral.black, colors.neutral.darkGray]}
              className="relative"
              style={{ minHeight: 280 }}>
              
              {/* Content Overlay */}
              <View className="flex-1 justify-center px-6 py-8">
                {/* Imperial Badge */}
                <View className="mb-4">
                  <ThemedText 
                    className="text-xs font-bold tracking-[3px] mb-2"
                    style={{ color: colors.primary.gold }}>
                    FOR THE PRIVILEGED FEW
                  </ThemedText>
                </View>

                {/* Main Title */}
                <View className="mb-4">
                  <ThemedText 
                    className="text-3xl font-bold mb-2 tracking-wide"
                    style={{ 
                      color: colors.neutral.white,
                      textShadowColor: 'rgba(0,0,0,0.8)',
                      textShadowOffset: { width: 2, height: 2 },
                      textShadowRadius: 4
                    }}>
                    {title}
                  </ThemedText>
                  <ThemedText 
                    className="text-xl font-bold tracking-wider"
                    style={{ color: colors.primary.gold }}>
                    {subtitle}
                  </ThemedText>
                </View>

                {/* Description */}
                <ThemedText 
                  className="text-sm leading-6 mb-6 opacity-90"
                  style={{ color: colors.neutral.silver }}>
                  Discover exquisite collection of{'\n'}
                  luxurious products crafted for the{'\n'}
                  discerning elite and imperial taste.
                </ThemedText>

                {/* CTA Button */}
                <TouchableOpacity
                  onPress={() => router.push('/(drawer)/(tabs)/explore')}
                  className="self-start px-8 py-3 rounded-lg"
                  style={{ backgroundColor: colors.neutral.white }}>
                  <ThemedText 
                    className="font-bold tracking-wider"
                    style={{ color: colors.neutral.black }}>
                    SHOP COLLECTION
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </>
      )}
    </View>
  );

  return (
    <View 
      className="relative"
      style={{ backgroundColor: colors.neutral.black }}>
      <HeaderContent />
    </View>
  );
}