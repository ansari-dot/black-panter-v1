import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import Footer from '../components/Footer';
import aboutHeroImage from '../assets/herosections/about.webp';
import { orderApi, resolveImageUrl } from '../utils/api';
import { 
  ShieldCheck, CreditCard, Loader2, Lock, Sparkles, ExternalLink, 
  XCircle, AlertTriangle, RotateCcw, ArrowLeft, Mail, ShoppingBag
} from 'lucide-react';

export const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCanceledParam = searchParams.get('canceled') === 'true';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingStripe, setProcessingStripe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [autoRedirecting, setAutoRedirecting] = useState(true);


  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orders = await orderApi.getMyOrders();
        const currentOrder = orders.find(o => o._id === id);
        if (currentOrder) {
          setOrder(currentOrder);
          if (currentOrder.paymentStatus === 'Paid') {
            navigate(`/order-success?order_id=${currentOrder._id}`);
            return;
          }
          // Auto-redirect to Stripe unless payment was canceled by user
          if (!isCanceledParam) {
            try {
              const response = await orderApi.createCheckoutSession(currentOrder._id);
              if (response.url) {
                window.location.href = response.url;
                return; // don't setLoading(false), page will redirect
              }
            } catch (stripeErr) {
              setErrorMsg(stripeErr.message || 'Failed to connect to Stripe. Please try again.');
            }
          }
        } else {
          setErrorMsg('Order details could not be found.');
        }
      } catch (err) {
        setErrorMsg('Failed to load order details. Please try refreshing.');
      } finally {
        setLoading(false);
        setAutoRedirecting(false);
      }
    };
    loadOrder();
  }, [id, navigate, isCanceledParam]);

  const handleStripePayment = async () => {
    if (!order) return;
    setProcessingStripe(true);
    setErrorMsg('');

    try {
      const response = await orderApi.createCheckoutSession(order._id);
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('Could not generate Stripe Checkout session URL.');
      }
    } catch (err) {
      console.error('Stripe error:', err);
      setErrorMsg(err.message || 'Failed to initiate Stripe payment checkout. Please try again.');
      setProcessingStripe(false);
    }
  };

  if (loading || autoRedirecting) {
    return (
      <PageLayout vectorBackground={aboutHeroImage}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F06123]/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#F06123]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">Redirecting to Secure Payment...</p>
            <p className="text-xs text-muted-foreground mt-1">Please wait, connecting to Stripe</p>
          </div>
        </div>
      </PageLayout>
    );
  }




  return (
    <PageLayout
      heroContent={
        <div style={{ padding: '60px 0', color: '#fff', textAlign: 'center' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-[#F06123]" /> 256-bit Encrypted Checkout
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-3 font-body">
            {isCanceledParam ? 'Payment Cancelled' : 'Complete Secure Payment'}
          </h1>
          <p className="text-base opacity-90 max-w-xl mx-auto font-body font-normal">
            {isCanceledParam 
              ? 'Your payment session was cancelled. You can retry paying securely via Stripe below.' 
              : 'Review your order details and proceed to Stripe Payment Gateway.'}
          </p>
        </div>
      }
      vectorBackground={aboutHeroImage}
    >
      <div className="bg-background min-h-screen font-body py-16 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          
          {/* Canceled Banner Notice if user canceled Stripe checkout */}
          {isCanceledParam && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 text-amber-900 dark:text-amber-200 flex items-start gap-4 shadow-sm animate-fade-in">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-1 text-xs">
                <h3 className="font-extrabold text-sm text-foreground">Stripe Payment Was Not Completed</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your order details for <strong className="text-foreground">#{order?._id?.slice(-8).toUpperCase()}</strong> have been saved safely. You can retry paying via Stripe or choose an alternative payment option.
                </p>
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Header / Amount */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-0.5">Order Reference</span>
                <h2 className="text-xl font-extrabold text-foreground font-mono">
                  #{order?._id?.substring(order._id.length - 8).toUpperCase()}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-0.5">Total Amount</span>
                <div className="text-2xl font-extrabold text-[#F06123]">
                  ${order?.totalAmount?.toFixed(2) || '0.00'} <span className="text-xs font-semibold text-muted-foreground">AUD</span>
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-medium flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Items Summary */}
            {order?.items && order.items.length > 0 && (
              <div className="bg-background/50 rounded-2xl p-4 border border-border space-y-2 text-xs">
                <div className="font-bold text-foreground mb-2 flex items-center justify-between">
                  <span>Purchased Items ({order.items.length})</span>
                  <span className="text-[#F06123] font-semibold text-[11px]">Australia Shipping Included</span>
                </div>
                <div className="divide-y divide-border">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 first:pt-0 flex items-center justify-between text-muted-foreground">
                      <span className="truncate max-w-[240px] font-medium text-foreground">{item.quantity}x {item.name}</span>
                      <span className="font-bold text-[#F06123]">${(item.price * item.quantity).toFixed(2)} AUD</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Action Button: Pay / Retry with Stripe */}
            <button
              onClick={handleStripePayment}
              disabled={!order || processingStripe}
              className="w-full bg-gradient-to-r from-[#F06123] to-[#FF8803] hover:shadow-lg hover:shadow-[#F06123]/25 active:scale-[0.99] text-white font-extrabold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
            >
              {processingStripe ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting to Stripe Hosted Checkout...</span>
                </>
              ) : isCanceledParam ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Stripe Payment (${order?.totalAmount?.toFixed(2)} AUD)</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay ${order?.totalAmount?.toFixed(2)} AUD with Stripe</span>
                  <ExternalLink className="w-4 h-4 opacity-80 ml-1" />
                </>
              )}
            </button>
            
            <div className="text-center flex justify-center items-center gap-2 text-[11px] text-muted-foreground font-medium pt-1">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Secure SSL encrypted card payment powered by Stripe</span>
            </div>
          </div>



          {/* Return Links */}
          <div className="flex items-center justify-between text-xs text-muted-foreground font-bold px-2">
            <Link to="/cart" className="flex items-center gap-1.5 hover:text-[#F06123] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Shopping Cart
            </Link>
            <Link to="/orders" className="flex items-center gap-1.5 hover:text-[#F06123] transition-colors">
              <ShoppingBag className="w-3.5 h-3.5" /> My Orders
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};
