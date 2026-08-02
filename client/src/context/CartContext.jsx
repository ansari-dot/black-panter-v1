import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '../utils/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Whenever `user` changes, we need to sync cart
  useEffect(() => {
    const fetchOrSyncCart = async () => {
      if (user) {
        try {
          const localItems = cartItems.map(i => ({ 
            productId: i.id || i._id, 
            quantity: i.quantity 
          })).filter(i => i.productId); // Filter out invalid items
          
          let dbCart;
          if (localItems.length > 0) {
            dbCart = await cartApi.sync(localItems);
            // Clear local storage since it's in DB now
            localStorage.removeItem('cart');
          } else {
            dbCart = await cartApi.get();
          }
          
          // Map backend format back to frontend format
          const formattedItems = dbCart.items.map(i => ({
            ...i.product,
            id: i.product._id,
            quantity: i.quantity
          }));
          setCartItems(formattedItems);
        } catch (error) {
          console.error("Failed to sync cart", error);
        }
      }
    };
    
    fetchOrSyncCart();
  }, [user]);

  // Sync to local storage only if NOT logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity) => {
    const productId = product.id || product._id;
    
    if (user) {
      try {
        const dbCart = await cartApi.update(productId, quantity);
        const formattedItems = dbCart.items.map(i => ({
          ...i.product,
          id: i.product._id,
          quantity: i.quantity
        }));
        setCartItems(formattedItems);
      } catch (err) {
        console.error("Failed to add to backend cart", err);
      }
    } else {
      setCartItems(prev => {
        const existing = prev.find(item => (item.id || item._id) === productId);
        if (existing) {
          return prev.map(item => 
            (item.id || item._id) === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, id: productId, quantity }];
      });
    }
  };

  const removeFromCart = async (identifier) => {
    if (user) {
      try {
        const dbCart = await cartApi.update(identifier, 0); // 0 removes it
        const formattedItems = dbCart.items.map(i => ({
          ...i.product,
          id: i.product._id,
          quantity: i.quantity
        }));
        setCartItems(formattedItems);
      } catch (err) {
        console.error("Failed to remove from backend cart", err);
      }
    } else {
      setCartItems(prev => prev.filter(item => (item.id || item._id) !== identifier && item.slug !== identifier));
    }
  };

  const updateQuantity = async (identifier, newQuantity) => {
    if (newQuantity < 1) return;
    
    if (user) {
      try {
        const dbCart = await cartApi.update(identifier, newQuantity);
        const formattedItems = dbCart.items.map(i => ({
          ...i.product,
          id: i.product._id,
          quantity: i.quantity
        }));
        setCartItems(formattedItems);
      } catch (err) {
        console.error("Failed to update backend cart quantity", err);
      }
    } else {
      setCartItems(prev => 
        prev.map(item => 
          (item.id || item._id) === identifier || item.slug === identifier
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartApi.clear();
        setCartItems([]);
      } catch (err) {
        console.error("Failed to clear backend cart", err);
      }
    } else {
      setCartItems([]);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
