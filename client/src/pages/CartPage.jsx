import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageLayout } from "../components/PageLayout";
import Footer from "../components/Footer";
import aboutHeroImage from "../assets/herosections/about.webp";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { resolveImageUrl, orderApi } from "../utils/api";
import { FaTrash } from "react-icons/fa";

export const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const handleDirectCheckout = async () => {
    if (!user) {
      navigate('/register?redirect=/cart');
      return;
    }
    setIsCheckingOut(true);
    setCheckoutError('');
    try {
      // Build shipping from user profile
      const shippingDetails = {
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'Australia',
      };

      // Create order
      const order = await orderApi.createOrder({
        items: cartItems.map(item => ({
          productId: item.id || item.slug,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl || item.image,
          category: item.category,
        })),
        totalAmount: cartTotal,
        shippingDetails,
      });

      // Create Stripe session and redirect directly
      const sessionRes = await orderApi.createCheckoutSession(order._id);
      if (sessionRes?.url) {
        window.location.href = sessionRes.url;
        return;
      }
      // Fallback to payment page
      navigate(`/checkout/pay/${order._id}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err?.message || 'Checkout failed. Please try again.');
      setIsCheckingOut(false);
    }
  };



  return (
    <PageLayout
      heroContent={
        <div style={{ padding: "60px 0", color: "#fff", textAlign: "center" }}>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-body">Your Cart</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto font-body">Review your items before checkout.</p>
        </div>
      }
      vectorBackground={aboutHeroImage}
    >
      <div className="bg-background min-h-screen font-body">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-10 py-16">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-2xl border border-border">
              <div className="w-24 h-24 bg-input rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.2 4h12M9 20a1 1 0 11-2 0 1 1 0 012 0zm11 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Looks like you haven't added any products to your cart yet.</p>
              <Link to="/product" className="inline-block bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_400px] gap-10">
              {/* Cart Items List */}
              <div className="flex flex-col gap-6">
                {cartItems.map((item) => (
                  <div key={item.id || item.slug} className="flex flex-col sm:flex-row gap-6 bg-surface p-4 sm:p-6 rounded-2xl border border-border relative">
                    <div className="w-full sm:w-32 h-32 bg-background rounded-xl border border-border p-2 flex items-center justify-center shrink-0">
                      <img 
                        src={resolveImageUrl(item.imageUrl || item.image)} 
                        alt={item.name} 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-lg font-bold text-foreground leading-tight">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id || item.slug)}
                            className="text-muted-foreground hover:text-red-500 p-2 -mr-2 -mt-2 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background">
                          <button 
                            onClick={() => updateQuantity(item.id || item.slug, item.quantity - 1)}
                            className="px-3 py-1.5 text-foreground font-bold hover:bg-input transition-colors"
                          >
                            −
                          </button>
                          <span className="px-3 py-1.5 text-sm font-semibold font-body border-x border-border min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id || item.slug, item.quantity + 1)}
                            className="px-3 py-1.5 text-foreground font-bold hover:bg-input transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-lg font-bold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 sticky top-32">
                  <h3 className="text-xl font-bold text-foreground mb-6">Order Summary</h3>
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-semibold text-foreground">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span className="font-semibold text-foreground">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax</span>
                      <span className="font-semibold text-foreground">Calculated at checkout</span>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="text-base font-bold text-foreground">Estimated Total</span>
                      <span className="text-2xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {checkoutError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                      {checkoutError}
                    </div>
                  )}

                  <button 
                    onClick={handleDirectCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:opacity-90 transition-opacity mb-3 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Redirecting to Stripe...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        Pay with Stripe
                      </>
                    )}
                  </button>

                  <Link to="/product" className="block text-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};
