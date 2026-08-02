import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import Footer from '../components/Footer';
import aboutHeroImage from '../assets/herosections/about.webp';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../utils/api';
import { FaWhatsapp, FaPhoneAlt, FaExclamationTriangle, FaTimes, FaShoppingBag } from 'react-icons/fa';

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
  const [showStripeModal, setShowStripeModal] = useState(false);
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
      setIsSubmitting(false);
      setShowStripeModal(true);
    } catch (err) {
      const data = err?.response?.data || err;
      setErrorMsg(data?.message || 'Failed to create order. Please try again.');
      setIsSubmitting(false);
    }
  };

  // If cart is empty and no order created, redirect back to cart
  if (cartItems.length === 0 && !createdOrder) {
    navigate('/cart');
    return null;
  }

  const whatsappMessage = createdOrder
    ? `Hi Black Panther Batteries, I placed order #${createdOrder._id?.substring(createdOrder._id.length - 8).toUpperCase()} for $${cartTotal.toFixed(2)}. I would like to confirm my order details.`
    : `Hi Black Panther Batteries, I would like to place an order for $${cartTotal.toFixed(2)}.`;

  return (
    <PageLayout
      heroContent={
        <div style={{ padding: '60px 0', color: '#fff', textAlign: 'center' }}>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-body">Checkout</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto font-body">Enter your shipping details.</p>
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
                    <label className="text-sm font-bold text-foreground">State/Province</label>
                    <input required type="text" name="state" value={shippingDetails.state} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">ZIP / Postal Code</label>
                    <input required type="text" name="zipCode" value={shippingDetails.zipCode} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Country</label>
                    <input required type="text" name="country" value={shippingDetails.country} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#F06123] hover:bg-[#e05214] text-white font-bold py-4 rounded-xl transition-all duration-300 mt-4 shadow-lg shadow-[#F06123]/25"
                >
                  {isSubmitting ? 'Processing Order...' : 'Continue to Payment'}
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary */}
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
                    <span className="text-2xl font-bold text-[#F06123]">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* STRIPE VERIFICATION NOTICE MODAL */}
      {showStripeModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl relative border border-gray-100">
            <button 
              onClick={() => setShowStripeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#F06123] shadow-sm">
              <FaExclamationTriangle className="text-3xl" />
            </div>

            <h3 className="text-xl font-extrabold text-gray-900 mb-2">
              Stripe Verification In Progress
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
              Current Stripe verification is not complete. We are working on that! You can place your order directly via WhatsApp or phone.
            </p>

            <div className="space-y-3">
              <a
                href={`https://wa.me/61402277723?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-green-500/20 text-sm"
              >
                <FaWhatsapp className="text-xl" />
                Order via WhatsApp (+61 402 277 723)
              </a>

              <a
                href="tel:+61402277723"
                className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all text-sm"
              >
                <FaPhoneAlt className="text-sm" />
                Call Us: +61 402 277 723
              </a>

              <button
                onClick={() => {
                  setShowStripeModal(false);
                  if (createdOrder?._id) {
                    navigate('/orders');
                  }
                }}
                className="w-full py-2.5 text-[#F06123] hover:text-[#e05214] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <FaShoppingBag className="text-xs" /> View My Orders
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </PageLayout>
  );
};
