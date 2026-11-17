import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistApi, resolveImageUrl } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { UserPortalLayout } from '../components/UserPortalLayout';
import { FaHeart, FaTrash, FaShoppingCart, FaSpinner, FaArrowRight } from 'react-icons/fa';

export const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, fetchWishlist: refreshWishlistIds } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistApi.get();
      setWishlistItems(Array.isArray(res) ? res.filter(Boolean) : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setWishlistItems(prev => prev.filter(item => String(item._id || item.id) !== String(productId)));
      await toggleWishlist(productId);
    } catch (err) {
      alert(err.message || 'Failed to remove item');
      fetchWishlist();
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear your wishlist?')) return;
    try {
      setWishlistItems([]);
      await wishlistApi.clear();
      refreshWishlistIds();
    } catch (err) {
      alert(err.message || 'Failed to clear wishlist');
      fetchWishlist();
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    handleRemove(product._id || product.id);
  };

  const formatPrice = (val) => {
    const num = Number(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const cardStyle = { boxShadow: '0 2px 10px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' };

  return (
    <UserPortalLayout
      currentTab="wishlist"
      title="My Wishlist"
      subtitle="View, manage, and shop items saved to your personal collection"
      icon={FaHeart}
    >
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-[#F06123] text-3xl" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-center font-semibold text-sm">
          {error}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center" style={cardStyle}>
          <div className="w-16 h-16 bg-orange-50 text-[#F06123] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHeart className="text-2xl" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-500 text-xs mb-6 max-w-sm mx-auto leading-relaxed">
            Explore our industrial battery collection and save your favorite products here for quick access anytime!
          </p>
          <Link
            to="/product"
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-xs"
            style={{ background: 'linear-gradient(135deg, #F06123, #FF8803)', boxShadow: '0 4px 14px rgba(240,97,35,0.25)' }}
          >
            Explore Products <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top Bar info */}
          <div className="bg-white rounded-xl px-5 py-3.5 border border-gray-100 flex items-center justify-between shadow-xs">
            <p className="text-xs font-semibold text-gray-600">
              Total Saved Items: <span className="text-[#F06123] font-bold ml-1">{wishlistItems.length}</span>
            </p>
            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5"
            >
              <FaTrash className="text-[11px]" /> Clear Wishlist
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistItems.map((item) => {
              const itemId = item._id || item.id;
              const itemPrice = item.price ?? item.salePrice ?? item.regularPrice ?? 0;
              const itemOldPrice = item.oldPrice ?? (item.salePrice ? item.regularPrice : null);
              const itemImg = item.imageUrl || item.mainImage || item.image;
              const itemTitle = item.name || item.title || 'Industrial Battery';
              const itemCategory = item.category || 'Battery';

              return (
                <div
                  key={itemId}
                  className="bg-white rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 relative"
                  style={cardStyle}
                >
                  {/* Image Header */}
                  <Link to={`/product/${item.slug || itemId}`} className="relative h-44 bg-[#fbfaf8] overflow-hidden block">
                    <img
                      src={resolveImageUrl(itemImg)}
                      alt={itemTitle}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#F06123] text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full border border-orange-100 uppercase tracking-wider shadow-2xs">
                      {itemCategory}
                    </span>
                  </Link>

                  {/* Body Info */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <Link to={`/product/${item.slug || itemId}`}>
                        <h3 className="font-bold text-gray-800 text-sm leading-snug hover:text-[#F06123] transition-colors line-clamp-2 mb-2">
                          {itemTitle}
                        </h3>
                      </Link>

                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-[#F06123]">
                          ${formatPrice(itemPrice)}
                        </span>
                        {itemOldPrice && (
                          <span className="text-xs text-gray-400 line-through font-medium">
                            ${formatPrice(itemOldPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 py-2.5 px-3 text-white font-bold rounded-xl transition-all duration-300 flex justify-center items-center gap-1.5 text-xs shadow-md hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #F06123, #FF8803)', boxShadow: '0 2px 8px rgba(240,97,35,0.2)' }}
                      >
                        <FaShoppingCart className="text-[11px]" /> Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(itemId)}
                        className="w-9 h-9 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl flex justify-center items-center transition-colors shrink-0"
                        title="Remove from Wishlist"
                      >
                        <FaTrash className="text-[11px]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </UserPortalLayout>
  );
};
