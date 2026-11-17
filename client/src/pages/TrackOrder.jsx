import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { orderApi, resolveImageUrl } from '../utils/api';
import { UserPortalLayout } from '../components/UserPortalLayout';
import { 
  FaMapMarkerAlt, FaSearch, FaSpinner, FaCheckCircle, FaBox, 
  FaTruck, FaHome, FaExternalLinkAlt, FaShippingFast, FaClipboardList, FaClock
} from 'react-icons/fa';

export const TrackOrder = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialId = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(initialId);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTracking = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await orderApi.getAusPostTracking(id);
      setTrackingData(res);
    } catch (err) {
      setError(err.message || 'Order tracking not found or not authorized.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchTracking(initialId);
    }
  }, [initialId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(orderId);
  };

  const statusSteps = [
    { name: 'Order Confirmed', key: 'PENDING', icon: FaCheckCircle, desc: 'Payment verified' },
    { name: 'Packed', key: 'PROCESSING', icon: FaBox, desc: 'Parcel packed' },
    { name: 'Ready to Ship', key: 'READY_TO_SHIP', icon: FaClipboardList, desc: 'Label created' },
    { name: 'Handed Over', key: 'SHIPPED', icon: FaTruck, desc: 'With Australia Post' },
    { name: 'In Transit', key: 'IN_TRANSIT', icon: FaShippingFast, desc: 'On the way' },
    { name: 'Delivered', key: 'DELIVERED', icon: FaHome, desc: 'Delivered to door' }
  ];

  const getStatusIndex = (currentStatus) => {
    switch (currentStatus) {
      case 'DELIVERED': return 5;
      case 'OUT_FOR_DELIVERY': return 4;
      case 'IN_TRANSIT': return 4;
      case 'SHIPPED': return 3;
      case 'SHIPMENT_CREATED':
      case 'READY_TO_SHIP': return 2;
      case 'PROCESSING': return 1;
      default: return 0;
    }
  };

  return (
    <UserPortalLayout 
      currentTab="track" 
      title="Track Australia Post Order" 
      subtitle="Enter your Order ID to monitor live Australia Post parcel tracking"
      icon={FaMapMarkerAlt}
    >
      {/* Search Input Box */}
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100/80 p-6 md:p-8 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input 
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g. 68a2e...)"
              className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#F06123] focus:ring-2 focus:ring-[#F06123]/20 transition-all outline-none text-sm font-semibold"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-[#F06123] to-[#FF8803] hover:shadow-lg hover:shadow-[#F06123]/20 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 text-sm cursor-pointer"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <><FaSearch /> Track Parcel</>}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center mb-8 font-semibold text-sm">
          {error}
        </div>
      )}

      {trackingData && (
        <div className="space-y-6">
          
          {/* Main Tracking Details Banner */}
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100/80 p-6 md:p-8">
            
            {/* Header / Australia Post Badge */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-100 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-1 bg-red-600 text-white font-extrabold text-xs rounded-md uppercase tracking-wider">
                    AUSTRALIA POST
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {trackingData.shipping?.status || 'PROCESSING'}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Order #{trackingData.orderId?.substring(trackingData.orderId.length - 8).toUpperCase()}
                </h2>
              </div>

              {trackingData.shipping?.trackingNumber ? (
                <div className="bg-red-50/60 border border-red-100 p-3.5 rounded-xl flex items-center gap-4 self-stretch md:self-auto">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider block">Tracking Number</span>
                    <span className="font-mono font-black text-red-600 text-base">{trackingData.shipping.trackingNumber}</span>
                  </div>
                  <a 
                    href={trackingData.shipping.trackingUrl || `https://auspost.com.au/mypost/track/#/details/${trackingData.shipping.trackingNumber}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
                  >
                    MyPost <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-800 text-xs font-bold self-stretch md:self-auto flex items-center gap-2">
                  <FaClock className="text-amber-600 text-base shrink-0" />
                  <div>
                    <span>Order Confirmed & Being Processed</span>
                    <span className="block font-normal text-[11px] text-amber-700">Australia Post Tracking ID will be generated upon shipment dispatch.</span>
                  </div>
                </div>
              )}

            </div>

            {/* Tracking Progress Bar */}
            <div className="mt-8 mb-10">
              <div className="relative">
                {/* Desktop Line */}
                <div className="absolute top-6 left-[8%] right-[8%] h-1 bg-gray-100 rounded-full hidden md:block"></div>
                <div 
                  className="absolute top-6 left-[8%] h-1 bg-gradient-to-r from-[#F06123] to-red-600 rounded-full hidden md:block transition-all duration-700"
                  style={{ width: `${(getStatusIndex(trackingData.shipping?.status) / (statusSteps.length - 1)) * 84}%` }}
                ></div>

                {/* Steps List */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-0 relative z-10">
                  {statusSteps.map((step, idx) => {
                    const currentIndex = getStatusIndex(trackingData.shipping?.status);
                    const isCompleted = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    const Icon = step.icon;

                    return (
                      <div key={idx} className="flex md:flex-col items-center md:text-center">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center border-4 border-white mb-2 transition-all shadow-sm shrink-0 ${
                          isCompleted ? 'bg-gradient-to-br from-red-500 to-[#F06123] text-white shadow-red-500/20' : 'bg-gray-100 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-red-500/20 scale-110' : ''}`}>
                          <Icon className="text-base" />
                        </div>
                        <div className="ml-3 md:ml-0">
                          <p className={`text-xs font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step.name}</p>
                          <p className={`text-[10px] ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Australia Post Events Log */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <FaClock className="text-red-600" /> Australia Post Shipment Event Log
              </h3>
              
              <div className="space-y-3">
                {trackingData.shipping?.events && trackingData.shipping.events.length > 0 ? (
                  trackingData.shipping.events.slice().reverse().map((ev, idx) => (
                    <div key={idx} className="flex gap-4 p-3.5 bg-gray-50/80 rounded-xl border border-gray-100/80 text-xs items-start">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-600 mt-1.5 shrink-0"></div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-xs">{ev.description}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-3 mt-1">
                          <span>📍 {ev.location}</span>
                          <span>🕒 {new Date(ev.timestamp).toLocaleString('en-AU')}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-gray-50 text-gray-500 text-xs text-center rounded-xl">
                    Package information registered. Tracking events will update as Australia Post scans the parcel.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Shipping Address & Product Info Footer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Delivery Destination */}
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100/80 p-6 space-y-2 text-xs">
              <h3 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-[#F06123]" /> Delivery Destination
              </h3>
              <div className="text-sm font-bold text-gray-900">{trackingData.shippingDetails?.fullName}</div>
              <div className="text-gray-600 leading-relaxed">
                {trackingData.shippingDetails?.address}<br />
                {trackingData.shippingDetails?.city}, {trackingData.shippingDetails?.state} {trackingData.shippingDetails?.zipCode}<br />
                <span className="font-bold text-gray-900">🇦🇺 Australia</span>
              </div>
            </div>

            {/* Product Summary */}
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100/80 p-6 space-y-3 text-xs">
              <h3 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <FaBox className="text-[#F06123]" /> Parcel Contents ({trackingData.items?.length || 0})
              </h3>
              <div className="space-y-2 divide-y divide-gray-100">
                {trackingData.items?.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between">
                    <span className="font-bold text-gray-800">{item.quantity}x {item.name}</span>
                    <span className="font-extrabold text-[#F06123]">${(item.price * item.quantity).toFixed(2)} AUD</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </UserPortalLayout>
  );
};
