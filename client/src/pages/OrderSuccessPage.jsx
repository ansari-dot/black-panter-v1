import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import Footer from '../components/Footer';
import aboutHeroImage from '../assets/herosections/about.webp';
import { orderApi, resolveImageUrl } from '../utils/api';
import { useCart } from '../context/CartContext';
import { 
  CheckCircle2, ShieldCheck, ShoppingBag, ArrowRight, Truck, Loader2, 
  PackageCheck, MapPin, CreditCard, Clock, FileText, ExternalLink, HelpCircle
} from 'lucide-react';

export const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const isSandbox = searchParams.get('sandbox') === 'true';

  const [verifying, setVerifying] = useState(true);
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId && !orderId) {
        setVerifying(false);
        setErrorMsg('Invalid order session parameters.');
        return;
      }

      try {
        const res = await orderApi.verifyStripeSession(sessionId || 'cs_test', orderId, isSandbox);
        if (res.success && res.order) {
          setVerifiedOrder(res.order);
        } else {
          setErrorMsg(res.message || 'Payment could not be verified.');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setErrorMsg('Failed to verify payment with server.');
      } finally {
        setVerifying(false);
        fetchCart().catch(() => {});
      }
    };

    verifyPayment();
  }, [sessionId, orderId, isSandbox, fetchCart]);

  return (
    <PageLayout
      heroContent={
        <div style={{ padding: '60px 0', color: '#fff', textAlign: 'center' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Payment Verified
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-3 font-body">Order Confirmed!</h1>
          <p className="text-base opacity-90 max-w-xl mx-auto font-body font-normal">
            Thank you for shopping with Black Panther Batteries. Your payment has been received.
          </p>
        </div>
      }
      vectorBackground={aboutHeroImage}
    >
      <div className="bg-background min-h-screen font-body py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {verifying ? (
            <div className="bg-surface rounded-3xl border border-border p-14 text-center shadow-lg flex flex-col items-center justify-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-[#F06123]/20 border-t-[#F06123] animate-spin"></div>
                <ShieldCheck className="w-8 h-8 text-[#F06123] absolute inset-0 m-auto" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground">Verifying Your Stripe Payment...</h2>
              <p className="text-xs text-muted-foreground max-w-md">Please wait a moment while we synchronize your transaction with Australia Post fulfillment.</p>
            </div>
          ) : verifiedOrder ? (
            <div className="space-y-8 animate-fade-in">
              
              {/* Primary Success Header Card */}
              <div className="bg-surface rounded-3xl border border-border p-8 sm:p-10 shadow-xl space-y-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                
                {/* Big Animated Success Icon */}
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25 ring-8 ring-emerald-500/10">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" /> Stripe Payment Successful
                  </span>
                  <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Order #{verifiedOrder._id.slice(-8).toUpperCase()}</h2>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                    A payment confirmation email has been sent to <strong className="text-foreground">{verifiedOrder.shippingDetails?.email || 'your email'}</strong>.
                  </p>
                </div>

                {/* Primary Action Button Cluster */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link
                    to={`/track?id=${verifiedOrder._id}`}
                    className="px-6 py-3.5 bg-gradient-to-r from-[#F06123] to-[#FF8803] hover:shadow-lg hover:shadow-[#F06123]/25 text-white font-extrabold rounded-xl transition-all duration-200 flex items-center gap-2 text-xs"
                  >
                    <PackageCheck className="w-4 h-4" /> Live Australia Post Tracking
                  </Link>
                  <Link
                    to="/orders"
                    className="px-6 py-3.5 bg-muted hover:bg-muted/80 text-foreground font-extrabold border border-border rounded-xl transition-all text-xs flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-muted-foreground" /> View My Orders
                  </Link>
                </div>
              </div>

              {/* Order Receipt Details Card */}
              <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6 text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-[#F06123]" />
                    <span className="font-extrabold text-sm text-foreground">Transaction Receipt</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 font-bold rounded-lg uppercase tracking-wider text-[10px] border border-emerald-500/20">
                    PAID (${verifiedOrder.totalAmount?.toFixed(2)} AUD)
                  </span>
                </div>

                {/* Items Summary List */}
                <div className="space-y-3">
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Purchased Items ({verifiedOrder.items?.length || 0})</span>
                  <div className="divide-y divide-border bg-background/50 rounded-2xl p-4 border border-border space-y-2">
                    {verifiedOrder.items?.map((item, idx) => (
                      <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="w-9 h-9 object-contain bg-white rounded-lg p-1 border border-border" />
                          )}
                          <div>
                            <span className="font-bold text-foreground block">{item.name}</span>
                            <span className="text-muted-foreground text-[10px]">Qty: {item.quantity} × ${item.price?.toFixed(2)} AUD</span>
                          </div>
                        </div>
                        <span className="font-extrabold text-[#F06123]">${((item.price || 0) * (item.quantity || 1)).toFixed(2)} AUD</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Fulfillment Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-background/80 p-4 rounded-2xl border border-border space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#F06123]" /> Shipping Address
                    </span>
                    <p className="font-bold text-foreground text-xs">{verifiedOrder.shippingDetails?.fullName}</p>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      {verifiedOrder.shippingDetails?.address}<br />
                      {verifiedOrder.shippingDetails?.city}, {verifiedOrder.shippingDetails?.state} {verifiedOrder.shippingDetails?.zipCode}<br />
                      <strong>Australia 🇦🇺</strong>
                    </p>
                  </div>

                  <div className="bg-orange-500/5 p-4 rounded-2xl border border-orange-500/20 space-y-1">
                    <span className="text-[10px] font-bold text-[#F06123] uppercase flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" /> Shipping Partner
                    </span>
                    <p className="font-extrabold text-foreground text-xs">Australia Post Parcel Post</p>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Your tracking number will be issued as soon as our warehouse hands over the parcel.
                    </p>
                  </div>
                </div>

              </div>

              {/* What Happens Next Explanation Card */}
              <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/20 rounded-3xl p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#F06123]" />
                  <h3 className="font-extrabold text-foreground text-sm">What Happens Next?</h3>
                </div>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4 font-medium leading-relaxed">
                  <li>Our Sydney warehouse is packing your physical battery order.</li>
                  <li>Our team will create your **Australia Post Shipment** and assign an official tracking number (e.g. <span className="font-mono font-bold text-[#F06123]">AP392817462AU</span>).</li>
                  <li>You will receive a <strong>Shipment Email</strong> with direct Australia Post tracking links as soon as your parcel is lodged.</li>
                </ul>
              </div>

              {/* Footer Continue Action */}
              <div className="text-center pt-4">
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-[#F06123] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" /> Continue Shopping Battery Catalog <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ) : (
            <div className="bg-surface rounded-3xl border border-border p-10 text-center shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Order Verification Pending</h2>
              <p className="text-xs text-red-500 font-medium">{errorMsg || 'Could not verify payment status.'}</p>
              <div className="pt-4 flex justify-center gap-3">
                <Link to="/orders" className="bg-[#F06123] hover:bg-[#e05214] text-white font-bold py-3 px-6 rounded-xl text-xs">
                  View My Orders
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};
