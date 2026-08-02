import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { wishlistApi, authApi } from '../utils/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistIds([]);
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistApi.get();
      const ids = (res || []).map(item => (typeof item === 'object' ? item._id : item));
      setWishlistIds(ids);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistIds.some(id => String(id) === String(productId));
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      alert('Please log in to save items to your wishlist.');
      return false;
    }

    const currentlySaved = isInWishlist(productId);
    try {
      if (currentlySaved) {
        setWishlistIds(prev => prev.filter(id => String(id) !== String(productId)));
        await wishlistApi.remove(productId);
      } else {
        setWishlistIds(prev => [...prev, String(productId)]);
        await wishlistApi.add(productId);
      }
      return true;
    } catch (err) {
      console.error('Wishlist toggle error:', err);
      fetchWishlist();
      return false;
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, isInWishlist, toggleWishlist, fetchWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
