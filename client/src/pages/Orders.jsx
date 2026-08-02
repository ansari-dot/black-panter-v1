import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi, resolveImageUrl } from '../utils/api';
import { UserPortalLayout } from '../components/UserPortalLayout';
import { FaBoxOpen, FaEye, FaSpinner, FaTimes, FaShippingFast, FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModalOrder, setActiveModalOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderApi.getMyOrders();
      setOrders(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusBadge = (status) => {
    switch(status) {
      case 'Pending': 
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 inline-block">Pending</span>;
      case 'Processing': 
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 inline-block">Processing</span>;
      case 'Shipped': 
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 inline-block">Shipped</span>;
      case 'Delivered': 
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800 border border-green-200 inline-block">Delivered</span>;
      case 'Cancelled': 
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 inline-block">Cancelled</span>;
      default: 
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200 inline-block">{status || 'Pending'}</span>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'Paid') {
      return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">Paid</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 inline-block">{status || 'Unpaid'}</span>;
  };

  const formatPrice = (val) => {
    const num = Number(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  return (
    <UserPortalLayout 
      currentTab="orders" 
      title="My Orders" 
      subtitle="View, track and review your recent product orders"
      icon={FaBoxOpen}
    >
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-[#F06123] text-4xl" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center text-sm font-semibold">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
          <FaBoxOpen className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Orders Placed Yet</h2>
          <p className="text-gray-500 text-xs mb-6 max-w-md mx-auto">Looks like you haven't placed any orders with us yet.</p>
          <Link to="/product" className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#F06123] to-[#FF8803] text-white font-bold rounded-xl shadow-md text-xs">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                  <th className="py-4 px-5">Order ID</th>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5">Items Summary</th>
                  <th className="py-4 px-5">Order Status</th>
                  <th className="py-4 px-5">Payment</th>
                  <th className="py-4 px-5">Total</th>
                  <th className="py-4 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                {orders.map((order) => {
                  const orderCode = `#${order._id.substring(order._id.length - 8).toUpperCase()}`;
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const itemsCount = order.items?.length || 0;
                  const firstItem = order.items?.[0];
                  const itemsSummary = firstItem 
                    ? `${firstItem.name || 'Product'} ${itemsCount > 1 ? `+${itemsCount - 1} more` : ''}`
                    : `${itemsCount} item(s)`;

                  return (
                    <tr key={order._id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="py-4 px-5 font-bold text-[#F06123]">
                        {orderCode}
                      </td>
                      <td className="py-4 px-5 text-gray-500 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-4 px-5 font-bold text-gray-800 max-w-[200px] truncate">
                        {itemsSummary}
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        {getOrderStatusBadge(order.orderStatus)}
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </td>
                      <td className="py-4 px-5 font-extrabold text-gray-900 whitespace-nowrap">
                        ${formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setActiveModalOrder(order)}
                            className="w-8 h-8 rounded-xl bg-orange-50 hover:bg-[#F06123] text-[#F06123] hover:text-white transition-all inline-flex items-center justify-center shadow-2xs"
                            title="View Full Order Details"
                          >
                            <FaEye className="text-xs" />
                          </button>
                          <Link 
                            to={`/track?id=${order._id}`} 
                            className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            Track
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full Order Detail Popup Modal Banner */}
      {activeModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-fade-in border border-gray-100">
            {/* Modal Banner Header */}
            <div className="bg-gradient-to-r from-[#383A3C] to-[#1a1a1a] text-white p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black">
                    Order #{activeModalOrder._id.substring(activeModalOrder._id.length - 8).toUpperCase()}
                  </h3>
                </div>
                <p className="text-xs text-gray-300">
                  Placed on: {new Date(activeModalOrder.createdAt).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {getOrderStatusBadge(activeModalOrder.orderStatus)}
                <button 
                  onClick={() => setActiveModalOrder(null)}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700">
              
              {/* Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Total Amount</span>
                  <span className="font-extrabold text-[#F06123] text-sm">${formatPrice(activeModalOrder.totalAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Payment Status</span>
                  {getPaymentStatusBadge(activeModalOrder.paymentStatus)}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Order Status</span>
                  {getOrderStatusBadge(activeModalOrder.orderStatus)}
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <h4 className="font-bold text-sm text-gray-800 border-b border-gray-100 pb-2 mb-3">
                  Purchased Items ({activeModalOrder.items?.length || 0})
                </h4>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-100 text-[10px] font-extrabold uppercase text-gray-500">
                        <th className="py-2.5 px-4">Item</th>
                        <th className="py-2.5 px-4 text-center">Qty</th>
                        <th className="py-2.5 px-4 text-right">Price</th>
                        <th className="py-2.5 px-4 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activeModalOrder.items?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 flex items-center gap-3">
                            {item.imageUrl && (
                              <img 
                                src={resolveImageUrl(item.imageUrl)} 
                                alt={item.name} 
                                className="w-10 h-10 object-contain rounded-lg border border-gray-100 p-1 bg-slate-50"
                              />
                            )}
                            <span className="font-bold text-gray-800">{item.name}</span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-gray-600">
                            ${formatPrice(item.price)}
                          </td>
                          <td className="py-3 px-4 text-right font-extrabold text-[#F06123]">
                            ${formatPrice((item.price || 0) * (item.quantity || 1))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Shipping Address Details */}
              {activeModalOrder.shippingDetails && (
                <div>
                  <h4 className="font-bold text-sm text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#F06123]" /> Shipping Address
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-gray-100">
                    <div>
                      <span className="font-semibold text-gray-500">Recipient Name:</span> {activeModalOrder.shippingDetails.fullName || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500">Phone:</span> {activeModalOrder.shippingDetails.phone || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500">Street Address:</span> {activeModalOrder.shippingDetails.address || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500">City / State:</span> {activeModalOrder.shippingDetails.city ? `${activeModalOrder.shippingDetails.city}, ${activeModalOrder.shippingDetails.state || ''}` : 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500">ZIP / Postal Code:</span> {activeModalOrder.shippingDetails.zipCode || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500">Country:</span> {activeModalOrder.shippingDetails.country || 'Australia'}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
              <Link 
                to={`/track?id=${activeModalOrder._id}`} 
                className="px-5 py-2 bg-[#F06123] hover:bg-[#FF8803] text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-2"
              >
                <FaShippingFast /> Track Live Shipment
              </Link>
              <button
                onClick={() => setActiveModalOrder(null)}
                className="px-6 py-2 bg-[#383A3C] hover:bg-black text-white font-bold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </UserPortalLayout>
  );
};
