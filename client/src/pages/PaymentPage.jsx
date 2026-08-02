import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import Footer from '../components/Footer';
import aboutHeroImage from '../assets/herosections/about.webp';
import { orderApi } from '../utils/api';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import { FaWhatsapp, FaPhoneAlt, FaExclamationTriangle, FaTimes, FaShoppingBag } from 'react-icons/fa';

export const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showStripeModal, setShowStripeModal] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orders = await orderApi.getMyOrders();
        const currentOrder = orders.find(o => o._id === id);
        if (currentOrder) {
          setOrder(currentOrder);
        } else {
          setErrorMsg('Order not found.');
        }
      } catch (err) {
        setErrorMsg('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const handlePayment = () => {
    setShowStripeModal(true);
  };

  if (loading) {
    return (
      <PageLayout vectorBackground={aboutHeroImage}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  const whatsappMessage = order
    ? `Hi Black Panther Batteries, I placed order #${order._id?.substring(order._id.length - 8).toUpperCase()} for $${order.totalAmount?.toFixed(2)}. I would like to complete my payment via WhatsApp.`
    : `Hi Black Panther Batteries, I would like to complete my order payment.`;

  return (
    <PageLayout
      heroContent={
        <div style={{ padding: '60px 0', color: '#fff', textAlign: 'center' }}>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-body">Secure Payment</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto font-body font-normal">Complete your order.</p>
        </div>
      }
      vectorBackground={aboutHeroImage}
    >
      <div className="bg-background min-h-screen font-body py-16 px-4 relative">
        <div className="max-w-xl mx-auto">
          
          <div className="bg-surface rounded-3xl border border-border p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Order Total</h2>
                <p className="text-muted-foreground mt-1 font-medium">Order #{id.substring(id.length - 8).toUpperCase()}</p>
              </div>
              <div className="text-3xl font-bold text-[#F06123]">
                ${order?.totalAmount?.toFixed(2) || '0.00'}
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <div className="space-y-6 mb-8">
              <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200/60 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F06123]/10 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-[#F06123]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Card Payment Verification</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed font-medium">
                    Stripe online card processing is currently undergoing verification. You can place your order directly via WhatsApp or Phone now.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!order}
              className="w-full bg-[#F06123] hover:bg-[#e05214] text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#F06123]/25"
            >
              <ShieldCheck className="w-5 h-5" />
              Pay Now / Complete Order
            </button>
            
            <div className="text-center mt-6 flex justify-center items-center gap-2 text-xs text-muted-foreground font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Payments & Order details processed securely.</span>
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
                  navigate('/orders');
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
