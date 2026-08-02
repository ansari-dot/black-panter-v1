import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { orderApi } from '../utils/api';
import { UserPortalLayout } from '../components/UserPortalLayout';
import { FaMapMarkerAlt, FaSearch, FaSpinner, FaCheckCircle, FaBox, FaTruck, FaHome } from 'react-icons/fa';

export const TrackOrder = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialId = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await orderApi.trackOrder(id);
      setOrder(res);
    } catch (err) {
      setError(err.message || 'Order not found or not authorized.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(orderId);
  };

  const statusSteps = [
    { name: 'Pending', icon: FaCheckCircle, desc: 'Order Placed' },
    { name: 'Processing', icon: FaBox, desc: 'Packing' },
    { name: 'Shipped', icon: FaTruck, desc: 'On the Way' },
    { name: 'Delivered', icon: FaHome, desc: 'Delivered' }
  ];

  const getStatusIndex = (status) => {
    const idx = statusSteps.findIndex(s => s.name === status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <UserPortalLayout 
      currentTab="track" 
      title="Track Order" 
      subtitle="Enter your order ID to see its current status"
      icon={FaMapMarkerAlt}
    >
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100/80 p-6 md:p-8 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input 
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g. 64b3c...)"
              className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#F06123] focus:ring-2 focus:ring-[#F06123]/20 transition-all outline-none"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-[#F06123] to-[#FF8803] hover:shadow-lg hover:shadow-[#F06123]/20 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <><FaSearch /> Track</>}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center mb-8">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100/80 p-6 md:p-10 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between mb-12 pb-6 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Order Number</p>
              <p className="text-xl font-bold text-gray-800">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
            </div>
            <div className="mt-4 md:mt-0 md:text-right">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Order Date</p>
              <p className="text-lg font-bold text-gray-800">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          {order.orderStatus === 'Cancelled' ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold text-lg">
              This order was cancelled.
            </div>
          ) : (
            <div className="relative">
              {/* Progress Bar Background */}
              <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-gray-100 rounded-full hidden md:block"></div>
              
              {/* Active Progress */}
              <div 
                className="absolute top-6 left-[10%] h-1 bg-gradient-to-r from-[#F06123] to-[#FF8803] rounded-full hidden md:block transition-all duration-1000"
                style={{ width: `${(getStatusIndex(order.orderStatus) / (statusSteps.length - 1)) * 80}%` }}
              ></div>

              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative z-10">
                {statusSteps.map((step, index) => {
                  const currentIndex = getStatusIndex(order.orderStatus);
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  const Icon = step.icon;

                  return (
                    <div key={index} className="flex md:flex-col items-center md:w-1/4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white mb-3 transition-all duration-300 shadow-md ${
                        isCompleted ? 'bg-gradient-to-br from-[#F06123] to-[#FF8803] text-white shadow-[#F06123]/20' : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-[#F06123]/20 scale-110' : ''}`}>
                        <Icon className="text-xl" />
                      </div>
                      <div className="ml-4 md:ml-0 md:text-center">
                        <p className={`font-bold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>{step.name}</p>
                        <p className={`text-xs ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100 bg-gray-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 mb-4">Shipping Information</h3>
            <p className="text-gray-600 mb-1"><span className="font-medium text-gray-800">Name:</span> {order.shippingDetails.fullName}</p>
            <p className="text-gray-600 mb-1"><span className="font-medium text-gray-800">Address:</span> {order.shippingDetails.address}</p>
            <p className="text-gray-600 mb-1"><span className="font-medium text-gray-800">City:</span> {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.zipCode}</p>
            <p className="text-gray-600"><span className="font-medium text-gray-800">Country:</span> {order.shippingDetails.country}</p>
          </div>
        </div>
      )}
    </UserPortalLayout>
  );
};
