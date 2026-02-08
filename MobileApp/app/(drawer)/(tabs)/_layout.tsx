import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, ImperialColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/themed-text';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { currentTheme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: currentTheme === 'dark' ? ImperialColors.neutral.darkGray : '#fff',
          borderTopColor: currentTheme === 'dark' ? ImperialColors.primary.gold + '20' : '#e0e0e0',
        },
        headerStyle: {
          backgroundColor: currentTheme === 'dark' ? ImperialColors.neutral.black : '#fff',
        },
        headerTintColor: currentTheme === 'dark' ? ImperialColors.neutral.white : '#000',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            className="ml-4 p-2">
            <MaterialIcons 
              name="menu" 
              size={24} 
              color={currentTheme === 'dark' ? ImperialColors.primary.gold : Colors[colorScheme ?? 'light'].text} 
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View className="flex-row items-center mr-4">
            {/* Cart Icon */}
            <TouchableOpacity
              onPress={() => router.push('/cart')}
              className="relative p-2 rounded-full mr-2"
              style={{ 
                backgroundColor: currentTheme === 'dark' 
                  ? ImperialColors.primary.gold + '20' 
                  : '#f0f0f0' 
              }}>
              <MaterialIcons 
                name="shopping-cart" 
                size={24} 
                color={currentTheme === 'dark' ? ImperialColors.primary.gold : '#666'} 
              />
              {cartItems.length > 0 && (
                <View 
                  className="absolute -top-1 -right-1 rounded-full w-5 h-5 justify-center items-center"
                  style={{ backgroundColor: ImperialColors.secondary.crimson }}>
                  <ThemedText 
                    className="text-xs font-bold"
                    style={{ color: ImperialColors.neutral.white }}>
                    {cartItems.length}
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>

            {/* Theme Toggle */}
            <TouchableOpacity
              onPress={toggleTheme}
              className="p-2 rounded-full"
              style={{ 
                backgroundColor: currentTheme === 'dark' 
                  ? ImperialColors.primary.gold + '20' 
                  : '#f0f0f0' 
              }}>
              <MaterialIcons 
                name={currentTheme === 'dark' ? 'light-mode' : 'dark-mode'} 
                size={24} 
                color={currentTheme === 'dark' ? ImperialColors.primary.gold : '#666'} 
              />
            </TouchableOpacity>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Avenger Empire',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          headerTitle: 'Avenger Empire',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'My Orders',
          headerTitle: 'Avenger Empire',
          tabBarIcon: ({ color }) => <MaterialIcons name="shopping-bag" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
