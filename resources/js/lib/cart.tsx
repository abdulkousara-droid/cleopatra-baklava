import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem } from '@/types';

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (product: any, quantity?: number) => void;
    removeFromCart: (id: number | string) => void;
    updateQuantity: (id: number | string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cart');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    return [];
                }
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: any, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [
                ...prev,
                {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    quantity,
                    badge: product.badge,
                    image: product.image,
                    description: product.description,
                }
            ];
        });
    };

    const removeFromCart = (id: number | string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number | string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCartItems(prev =>
            prev.map(item => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                itemCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
