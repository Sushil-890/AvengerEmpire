import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

export const unstable_settings = {
  anchor: '(drawer)',
};

function RootLayoutContent() {
  const { currentTheme } = useTheme();

  return (
    <NavigationThemeProvider value={currentTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="cart" options={{ headerTitle: 'Shopping Cart', headerBackTitle: 'Back' }} />
        <Stack.Screen name="profile" options={{ headerTitle: 'Profile', headerBackTitle: 'Back' }} />
        <Stack.Screen name="product/[id]" options={{ headerTitle: 'Product Details' }} />
        <Stack.Screen name="checkout/index" options={{ headerTitle: 'Checkout' }} />
        <Stack.Screen name="payment/index" options={{ headerTitle: 'Payment' }} />
        <Stack.Screen name="orders/index" options={{ headerTitle: 'My Orders' }} />
        <Stack.Screen name="orders/[id]" options={{ headerTitle: 'Order Details' }} />
        <Stack.Screen name="seller" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <RootLayoutContent />
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}
