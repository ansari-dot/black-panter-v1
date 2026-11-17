import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import Footer from '../components/Footer';
import aboutHeroImage from '../assets/herosections/about.webp';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../utils/api';

export const CheckoutPage = () => {
  const { cartItems, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'Australia'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  React.useEffect(() => {
    if (user) {
      setShippingDetails(prev => ({
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || '',
        zipCode: prev.zipCode || user.zipCode || '',
        country: prev.country || user.country || 'Australia'
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMsg('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const order = await orderApi.createOrder({
        items: cartItems.map(item => ({
          productId: item.id || item.slug,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl || item.image,
          category: item.category
        })),
        totalAmount: cartTotal,
        shippingDetails
      });

      setCreatedOrder(order);

      // Create Stripe Checkout session and redirect directly to Stripe Payment Form
      const sessionRes = await orderApi.createCheckoutSession(order._id);
      if (sessionRes?.url) {
        window.location.href = sessionRes.url;
        return;
      }

      // If no url returned, navigate to pay page
      navigate(`/checkout/pay/${order._id}`);
    } catch (err) {
      console.error('Checkout Stripe redirect error:', err);
      const data = err?.response?.data || err;
      setErrorMsg(data?.message || err?.message || 'Failed to initiate Stripe checkout. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Redirect to cart if empty (handled inside useEffect to prevent React render errors)
  React.useEffect(() => {
    if (cartItems.length === 0 && !createdOrder) {
      navigate('/cart');
    }
  }, [cartItems.length, createdOrder, navigate]);

  if (cartItems.length === 0 && !createdOrder) {
    return (
      <PageLayout vectorBackground={aboutHeroImage}>
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-[#F06123]/20 border-t-[#F06123] rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-muted-foreground">Redirecting to cart...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      heroContent={
        <div style={{ padding: '60px 0', color: '#fff', textAlign: 'center' }}>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-body">Checkout</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto font-body">Enter your shipping details and proceed to secure card payment.</p>
        </div>
      }
      vectorBackground={aboutHeroImage}
    >
      <div className="bg-background min-h-screen font-body relative">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-10 py-16">
          <div className="grid lg:grid-cols-[1fr_400px] gap-10">
            
            {/* Left Column: Shipping Form */}
            <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Shipping Information</h2>
              
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Full Name</label>
                    <input required type="text" name="fullName" value={shippingDetails.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Email Address</label>
                    <input required type="email" name="email" value={shippingDetails.email} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Phone Number</label>
                  <input required type="text" name="phone" value={shippingDetails.phone} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Address</label>
                  <input required type="text" name="address" value={shippingDetails.address} onChange={handleChange} placeholder="Street address, P.O. box, etc." className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">City</label>
                    <input required type="text" name="city" value={shippingDetails.city} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">State/Territory</label>
                    <select required name="state" value={shippingDetails.state} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary appearance-none">
                      <option value="">Select State</option>
                      <option value="NSW">New South Wales</option>
                      <option value="VIC">Victoria</option>
                      <option value="QLD">Queensland</option>
                      <option value="WA">Western Australia</option>
                      <option value="SA">South Australia</option>
                      <option value="TAS">Tasmania</option>
                      <option value="ACT">Australian Capital Territory</option>
                      <option value="NT">Northern Territory</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Postcode</label>
                    <input required type="text" name="zipCode" value={shippingDetails.zipCode} onChange={handleChange} placeholder="e.g. 2000" maxLength={4} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Country</label>
                    <div className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground flex items-center gap-2 cursor-not-allowed opacity-80">
                      <span className="text-base">🇦🇺</span>
                      <span className="font-semibold">Australia</span>
                    </div>
                    <input type="hidden" name="country" value="Australia" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#F06123] hover:bg-[#e05214] text-white font-bold py-4 rounded-xl transition-all duration-300 mt-4 shadow-lg shadow-[#F06123]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      Connecting to Stripe...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </button>

              </form>
            </div>

            {/* Right Column: Order Summary & Payment Method */}
            <div>
              <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 sticky top-32">
                <h3 className="text-xl font-bold text-foreground mb-6">Order Summary</h3>
                <div className="flex flex-col gap-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id || item.slug} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate pr-4">{item.quantity}x {item.name}</span>
                      <span className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border pt-4 mb-6 space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-semibold text-foreground">Calculated at payment</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold text-foreground">Estimated Total</span>
                    <span className="text-2xl font-bold text-[#F06123]">${cartTotal.toFixed(2)} AUD</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-surface rounded-2xl border border-border p-6 mt-4">
                <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#F06123]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  Payment Method
                </h3>
                
                {/* Stripe / Card Option */}
                <div
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 border-[#F06123] bg-[#F06123]/5 mb-4"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-[#F06123] flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#F06123]"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">Credit / Debit Card</p>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex, Google Pay, Apple Pay</p>
                  </div>
                  <svg viewBox="0 0 60 25" className="h-5 w-auto shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.0 10.2c0-.66.54-1.14 1.44-1.14.84 0 1.62.36 2.34.84l.84-1.86C9.6 7.38 8.46 7.02 7.26 7.02c-1.98 0-3.36 1.14-3.36 2.88 0 2.88 3.66 2.4 3.66 3.78 0 .72-.6 1.14-1.5 1.14-1.02 0-1.98-.48-2.7-1.14L2.52 15.6c.84.78 2.04 1.38 3.36 1.38 2.1 0 3.54-1.08 3.54-3 0-2.94-3.42-2.52-3.42-3.78zm8.64-3.12L13.08 7.2H11.1v9.6h2.1v-6.18c.54-.66 1.38-1.02 2.22-1.02.24 0 .48.03.66.06l.24-2.04a3.6 3.6 0 00-.66-.06c-.96 0-1.86.42-2.52 1.02l.06-.06v-.24h-.06zm5.82-.06c-.72 0-1.32.6-1.32 1.32 0 .72.6 1.32 1.32 1.32.72 0 1.32-.6 1.32-1.32 0-.72-.6-1.32-1.32-1.32zm-1.02 9.78h2.1V7.26h-2.1v9.54zm8.94-9.78c-1.14 0-2.16.48-2.88 1.26V7.26h-2.1v13.2h2.1v-4.26c.72.78 1.74 1.26 2.88 1.26 2.34 0 4.02-1.8 4.02-4.74s-1.68-4.74-4.02-4.74zm-.42 7.62c-1.38 0-2.46-1.08-2.46-2.88s1.08-2.88 2.46-2.88 2.46 1.08 2.46 2.88-1.08 2.88-2.46 2.88zm9.36-7.62c-2.58 0-4.32 1.86-4.32 4.8s1.74 4.68 4.5 4.68c1.32 0 2.52-.48 3.36-1.26l-.96-1.44c-.6.54-1.38.84-2.22.84-1.26 0-2.22-.72-2.46-2.04h6.06c.03-.24.06-.54.06-.84 0-2.82-1.56-4.74-4.02-4.74zm-1.98 3.9c.18-1.2.96-2.1 2.04-2.1 1.08 0 1.8.84 1.8 2.1h-3.84zm12.12-3.66l-1.8 5.88-1.86-5.88h-2.16l2.94 9.48-.3.9c-.24.72-.72 1.02-1.38 1.02-.3 0-.6-.06-.84-.18l-.42 1.8c.36.18.9.3 1.44.3 1.62 0 2.76-.84 3.3-2.52l3.36-10.8h-2.28z" fill="#635BFF"/>
                  </svg>
                </div>

                {/* Accepted Cards Row */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Accepted Cards</p>
                  <div className="flex items-center gap-2">
                    {/* Visa */}
                    <div className="h-8 px-2 bg-white border border-border rounded-md flex items-center justify-center shadow-sm">
                      <svg viewBox="0 0 750 471" className="h-4 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="750" height="471" rx="40" fill="white"/>
                        <path d="M278 333L311 138H364L331 333H278Z" fill="#1A1F71"/>
                        <path d="M488 142C478 138 461 134 441 134C389 134 352 160 352 198C352 227 379 243 399 253C419 263 426 270 426 279C426 292 411 298 396 298C375 298 364 295 347 288L340 285L333 334C345 339 368 344 392 344C447 344 483 318 483 278C483 256 469 239 441 225C421 215 409 208 409 198C409 187 421 176 446 176C466 176 481 180 492 185L497 188L488 142Z" fill="#1A1F71"/>
                        <path d="M606 138H564C553 138 545 141 540 152L462 333H517L528 304H594L601 333H650L606 138ZM542 265L563 206L576 265H542Z" fill="#1A1F71"/>
                        <path d="M232 138L181 274L176 248C166 218 140 186 111 169L157 333H213L295 138H232Z" fill="#1A1F71"/>
                        <path d="M141 138H54L53 143C120 160 163 199 176 248L163 153C160 142 152 138 141 138Z" fill="#F9A51A"/>
                      </svg>
                    </div>
                    {/* Mastercard */}
                    <div className="h-8 px-2 bg-white border border-border rounded-md flex items-center justify-center shadow-sm">
                      <svg viewBox="0 0 131.39 86.9" className="h-4 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="131.39" height="86.9" rx="8" fill="white"/>
                        <circle cx="49.59" cy="43.45" r="30" fill="#EB001B"/>
                        <circle cx="81.8" cy="43.45" r="30" fill="#F79E1B"/>
                        <path d="M65.7 19.2a30 30 0 010 48.5 30 30 0 010-48.5z" fill="#FF5F00"/>
                      </svg>
                    </div>
                    {/* Amex */}
                    <div className="h-8 px-2 bg-[#016FD0] border border-[#016FD0] rounded-md flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-xs tracking-tight">AMEX</span>
                    </div>
                    {/* GPay */}
                    <div className="h-8 px-2 bg-white border border-border rounded-md flex items-center justify-center shadow-sm">
                      <span className="text-xs font-bold" style={{color:'#4285F4'}}>G</span>
                      <span className="text-xs font-bold" style={{color:'#EA4335'}}>P</span>
                      <span className="text-xs font-bold" style={{color:'#FBBC05'}}>a</span>
                      <span className="text-xs font-bold" style={{color:'#34A853'}}>y</span>
                    </div>
                    {/* Apple Pay */}
                    <div className="h-8 px-2 bg-black border border-black rounded-md flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-semibold tracking-tight"> Pay</span>
                    </div>
                  </div>
                </div>

                {/* Security note */}
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-100 rounded-xl">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <p className="text-xs text-green-700 font-medium">Your payment is protected by 256-bit SSL encryption. We never store your card details.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};

export default CheckoutPage;
