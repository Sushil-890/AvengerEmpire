import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
    product: string; // Product ID
    name: string;
    image: string;
    price: number;
    countInStock: number;
    qty: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    clearCart: () => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        loadCart();
    }, []);

    useEffect(() => {
        saveCart();
    }, [cartItems]);

    const loadCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem('cart');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (e) {
            console.log('Failed to load cart', e);
        }
    };

    const saveCart = async () => {
        try {
            await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
        } catch (e) {
            console.log('Failed to save cart', e);
        }
    };

    const addToCart = (item: CartItem) => {
        const existItem = cartItems.find((x) => x.product === item.product);
        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x.product === existItem.product ? { ...x, qty: x.qty + item.qty } : x
                )
            );
        } else {
            setCartItems([...cartItems, item]);
        }
    };

    const removeFromCart = (id: string) => {
        setCartItems(cartItems.filter((x) => x.product !== id));
    };

    const updateQuantity = (id: string, qty: number) => {
        setCartItems(
            cartItems.map((x) =>
                x.product === id ? { ...x, qty } : x
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
