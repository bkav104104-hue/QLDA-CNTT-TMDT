import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface CartItemType {
  id: string;
  productId?: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  version: string;
  colorName: string;
  colorHex: string;
  phoneColor: string;
  imageBgColor: string;
}

interface CartContextType {
  cartItems: CartItemType[];
  totalCount: number;
  totalAmount: number;
  addToCart: (item: CartItemType, onRequireLogin?: () => void, onAdminBlocked?: () => void) => boolean;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'nextphone_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [pendingItem, setPendingItem] = useState<CartItemType | null>(null);

  // Sync cart items to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // If there was a pending item and the user just logged in, auto-add it to cart (only if not admin)
  useEffect(() => {
    if (isAuthenticated && pendingItem) {
      if (user?.roleName !== 'Admin' && user?.role !== 'Admin') {
        addItemToCartState(pendingItem);
      }
      setPendingItem(null);
    }
  }, [isAuthenticated, pendingItem, user]);

  const addItemToCartState = (item: CartItemType) => {
    setCartItems(prev => {
      // Find matching item with same name, version and color
      const existingIndex = prev.findIndex(
        i => i.name === item.name && i.version === item.version && i.colorName === item.colorName
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity
        };
        return updated;
      }

      return [item, ...prev];
    });
  };

  /**
   * Add to Cart with STRICT Authentication Check:
   * Returns true if added, false if prevented due to lack of authentication.
   */
  const addToCart = (
    item: CartItemType,
    onRequireLogin?: () => void,
    onAdminBlocked?: () => void
  ): boolean => {
    if (!isAuthenticated) {
      setPendingItem(item);
      if (onRequireLogin) {
        onRequireLogin();
      }
      return false;
    }

    if (user?.roleName === 'Admin' || user?.role === 'Admin') {
      if (onAdminBlocked) {
        onAdminBlocked();
      } else {
        alert('Tài khoản Quản trị viên (Admin) không được phép mua hàng trên sàn. Vui lòng sử dụng tài khoản Khách hàng!');
      }
      return false;
    }

    addItemToCartState(item);
    return true;
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const totalCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

