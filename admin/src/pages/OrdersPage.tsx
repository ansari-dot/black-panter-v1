import React, { useState } from 'react';
import { TOrder } from '../types';
import { 
  ShoppingBag, Search, Filter, RefreshCw, Eye, Trash2, CheckCircle2, 
  Clock, Truck, Package, XCircle, DollarSign, Calendar, Mail, Phone, 
  MapPin, CreditCard, ShieldCheck, X, ExternalLink, ArrowUpDown, ChevronRight, User, AlertCircle
} from 'lucide-react';

interface OrdersPageProps {
  orders: TOrder[];
  onUpdateStatus: (id: string, statusData: { orderStatus?: string; paymentStatus?: string }) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
  onMarkReadyToShip?: (id: string, parcelData?: { parcelWeightKg?: number; lengthCm?: number; widthCm?: number; heightCm?: number }) => Promise<void>;
  onCreateShipment?: (id: string, parcelData?: { parcelWeightKg?: number; lengthCm?: number; widthCm?: number; heightCm?: number }) => Promise<any>;
  onMarkHandedOver?: (id: string) => Promise<void>;
  onRefresh?: () => void;
}

export default function OrdersPage({ 
  orders, 
  onUpdateStatus, 
  onDeleteOrder, 
  onMarkReadyToShip,
  onCreateShipment,
  onMarkHandedOver,
  onRefresh 
}: OrdersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');
  
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isShippingLoading, setIsShippingLoading] = useState(false);
  const [shipmentMessage, setShipmentMessage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Parcel inputs state
  const [parcelWeightKg, setParcelWeightKg] = useState<number>(1.5);
  const [lengthCm, setLengthCm] = useState<number>(25);
  const [widthCm, setWidthCm] = useState<number>(20);
  const [heightCm, setHeightCm] = useState<number>(15);


  // Compute metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending' || o.paymentStatus === 'Pending').length;
  const processingCount = orders.filter(o => o.orderStatus === 'Processing').length;
  const shippedCount = orders.filter(o => o.orderStatus === 'Shipped' || o.orderStatus === 'Delivered').length;

  // Filtering & Sorting
  const filteredOrders = orders.filter(order => {
    const customerName = (typeof order.user === 'object' ? order.user?.name : order.shippingDetails?.fullName) || '';
    const customerEmail = (typeof order.user === 'object' ? order.user?.email : order.shippingDetails?.email) || '';
    const customerPhone = order.shippingDetails?.phone || '';
    const orderId = order._id || '';

    const matchesSearch = 
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'amount_high') return b.totalAmount - a.totalAmount;
    if (sortBy === 'amount_low') return a.totalAmount - b.totalAmount;
    return 0;
  });

  const handleStatusChange = async (orderId: string, newOrderStatus: string) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(orderId, { orderStatus: newOrderStatus });
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, orderStatus: newOrderStatus as any } : null);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: string) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(orderId, { paymentStatus: newPaymentStatus });
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, paymentStatus: newPaymentStatus as any } : null);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    await onDeleteOrder(id);
    setDeleteConfirmId(null);
    if (selectedOrder?._id === id) {
      setSelectedOrder(null);
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'Shipped':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 flex items-center gap-1"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'Processing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20 flex items-center gap-1"><Package className="w-3 h-3" /> Processing</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> PAID</span>;
      case 'Failed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-500/15 text-red-700 border border-red-500/30 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-red-600" /> FAILED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-700 border border-amber-500/30 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-600" /> PENDING</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#F06123] flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">E-Commerce Orders</h1>
              <p className="text-xs text-gray-500 font-medium">Manage customer product orders, shipping status, and Stripe payments.</p>
            </div>
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
          </button>
        )}
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{totalOrders}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-2 font-medium">All registered orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
              <h3 className="text-2xl font-extrabold text-[#F06123] mt-1">${totalRevenue.toFixed(2)} <span className="text-xs font-semibold text-gray-400">AUD</span></h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F06123] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-2 font-medium">From completed paid orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Action</span>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{pendingOrdersCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-2 font-medium">Pending payment or dispatch</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fulfilled / Shipped</span>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{shippedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-2 font-medium">Shipped & Delivered</p>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID, customer, email, phone, or product name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#F06123] font-medium"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500 font-bold">Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
              <CreditCard className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500 font-bold">Payment:</span>
              <select
                value={paymentFilter}
                onChange={e => setPaymentFilter(e.target.value)}
                className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Total: High to Low</option>
                <option value="amount_low">Total: Low to High</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No Orders Found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'All' || paymentFilter !== 'All' 
                ? 'Try adjusting your filters or search terms.' 
                : 'No customer orders have been placed yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Items / Products</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-center">Payment</th>
                  <th className="py-3.5 px-4 text-center">Order Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredOrders.map(order => {
                  const customerName = order.shippingDetails?.fullName || (typeof order.user === 'object' ? order.user?.name : 'Customer');
                  const customerEmail = order.shippingDetails?.email || (typeof order.user === 'object' ? order.user?.email : '');
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={order._id} className="hover:bg-orange-50/30 transition-colors">
                      
                      {/* Order ID */}
                      <td className="py-4 px-4 font-mono font-bold text-[#F06123]">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{customerName}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{customerEmail}</span>
                        </div>
                        {order.shippingDetails?.phone && (
                          <div className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5" /> {order.shippingDetails.phone}
                          </div>
                        )}
                      </td>

                      {/* Products */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {order.items[0]?.imageUrl && (
                            <img 
                              src={order.items[0].imageUrl} 
                              alt={order.items[0].name} 
                              className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0" 
                            />
                          )}
                          <div>
                            <div className="font-semibold text-gray-900 truncate max-w-[200px]">
                              {order.items[0]?.quantity}x {order.items[0]?.name}
                            </div>
                            {order.items.length > 1 && (
                              <div className="text-[10px] font-bold text-[#F06123]">
                                + {order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-gray-500 whitespace-nowrap text-[11px]">
                        {orderDate}
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4 text-right font-extrabold text-gray-900 whitespace-nowrap">
                        ${order.totalAmount?.toFixed(2)} <span className="text-[10px] font-semibold text-gray-400">AUD</span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </td>

                      {/* Order Status Select */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <select
                          value={order.orderStatus}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          disabled={isUpdating}
                          className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#F06123] cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 bg-gray-100 hover:bg-[#F06123] text-gray-600 hover:text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(order._id)}
                          className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULL ORDER DETAILS DRAWER / MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto p-6 sm:p-8 shadow-2xl flex flex-col justify-between border-l border-gray-200 animate-slide-left">
            
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-gray-900">Order Details</h2>
                    <span className="font-mono text-sm font-bold text-[#F06123]">
                      #{selectedOrder._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-AU')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Controls */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Fulfillment Status
                  </label>
                  <div className="flex items-center gap-2">
                    {getOrderStatusBadge(selectedOrder.orderStatus)}
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={e => handleStatusChange(selectedOrder._id, e.target.value)}
                      disabled={isUpdating}
                      className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Set Pending</option>
                      <option value="Processing">Set Processing</option>
                      <option value="Shipped">Set Shipped</option>
                      <option value="Delivered">Set Delivered</option>
                      <option value="Cancelled">Set Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Payment Status
                  </label>
                  <div className="flex items-center gap-2">
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={e => handlePaymentStatusChange(selectedOrder._id, e.target.value)}
                      disabled={isUpdating}
                      className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Paid">Set Paid</option>
                      <option value="Pending">Set Pending</option>
                      <option value="Failed">Set Failed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Shipping & Customer Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#F06123]" /> Customer Info
                  </h3>
                  <div className="text-xs font-bold text-gray-900">
                    {selectedOrder.shippingDetails?.fullName || (typeof selectedOrder.user === 'object' ? selectedOrder.user?.name : 'Customer')}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {selectedOrder.shippingDetails?.email || (typeof selectedOrder.user === 'object' ? selectedOrder.user?.email : 'N/A')}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {selectedOrder.shippingDetails?.phone || 'N/A'}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F06123]" /> Shipping Address
                  </h3>
                  <div className="text-xs text-gray-800 font-medium leading-relaxed">
                    {selectedOrder.shippingDetails?.address}<br />
                    {selectedOrder.shippingDetails?.city}, {selectedOrder.shippingDetails?.state} {selectedOrder.shippingDetails?.zipCode}<br />
                    <span className="font-bold text-gray-900">🇦🇺 {selectedOrder.shippingDetails?.country || 'Australia'}</span>
                  </div>
                </div>
              </div>

              {/* AUSTRALIA POST SHIPPING FULFILLMENT CARD */}
              <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200/80 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-red-600 text-white font-extrabold text-xs rounded-lg flex items-center justify-center">
                      AP
                    </div>
                    <div>
                      <h3 className="font-extrabold text-red-950 text-sm">Australia Post Shipping Workflow</h3>
                      <p className="text-[11px] text-red-700 font-medium">Create parcel shipment, generate label, and notify customer.</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 font-extrabold text-[10px] rounded-md uppercase tracking-wider">
                    {selectedOrder.shipping?.status || 'PENDING'}
                  </span>
                </div>

                {shipmentMessage && (
                  <div className="p-3 bg-white border border-red-200 rounded-xl font-semibold text-red-900 text-xs">
                    {shipmentMessage}
                  </div>
                )}

                {/* Parcel Input Config */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-red-100">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={parcelWeightKg} 
                      onChange={e => setParcelWeightKg(parseFloat(e.target.value) || 1)}
                      className="w-full mt-0.5 p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-red-500" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Length (cm)</label>
                    <input 
                      type="number" 
                      value={lengthCm} 
                      onChange={e => setLengthCm(parseInt(e.target.value) || 25)}
                      className="w-full mt-0.5 p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-red-500" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Width (cm)</label>
                    <input 
                      type="number" 
                      value={widthCm} 
                      onChange={e => setWidthCm(parseInt(e.target.value) || 20)}
                      className="w-full mt-0.5 p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-red-500" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Height (cm)</label>
                    <input 
                      type="number" 
                      value={heightCm} 
                      onChange={e => setHeightCm(parseInt(e.target.value) || 15)}
                      className="w-full mt-0.5 p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-red-500" 
                    />
                  </div>
                </div>

                {/* Workflow Step Actions */}
                <div className="space-y-2 pt-1">
                  
                  {/* Tracking Badge if exists */}
                  {selectedOrder.shipping?.trackingNumber && (
                    <div className="p-3 bg-white border border-red-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Australia Post Tracking #</span>
                        <span className="font-mono font-black text-red-600 text-sm">{selectedOrder.shipping.trackingNumber}</span>
                      </div>
                      <a 
                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/orders/admin/${selectedOrder._id}/shipping-label`}
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Print Label
                      </a>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.paymentStatus !== 'Paid' ? (
                      <div className="text-xs text-amber-700 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200 w-full">
                        ⚠️ Order must be PAID via Stripe before creating Australia Post shipment.
                      </div>
                    ) : (
                      <>
                        {/* Ready to Ship */}
                        {selectedOrder.shipping?.status !== 'SHIPMENT_CREATED' && selectedOrder.shipping?.status !== 'SHIPPED' && selectedOrder.shipping?.status !== 'DELIVERED' && (
                          <button
                            onClick={async () => {
                              setIsShippingLoading(true);
                              try {
                                if (onMarkReadyToShip) await onMarkReadyToShip(selectedOrder._id, { parcelWeightKg, lengthCm, widthCm, heightCm });
                                setSelectedOrder(prev => prev ? { ...prev, shipping: { ...(prev.shipping || {}), status: 'READY_TO_SHIP' } } : null);
                                setShipmentMessage('Marked as Ready to Ship!');
                              } catch (e: any) { setShipmentMessage(e.message); }
                              finally { setIsShippingLoading(false); }
                            }}
                            disabled={isShippingLoading}
                            className="px-3.5 py-2 bg-gray-800 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Package className="w-3.5 h-3.5" /> Mark Ready to Ship
                          </button>
                        )}

                        {/* Create AusPost Shipment */}
                        {(!selectedOrder.shipping?.trackingNumber) && (
                          <button
                            onClick={async () => {
                              setIsShippingLoading(true);
                              try {
                                if (onCreateShipment) {
                                  const res = await onCreateShipment(selectedOrder._id, { parcelWeightKg, lengthCm, widthCm, heightCm });
                                  setShipmentMessage(`Shipment Created! Tracking #: ${res.shipment?.trackingNumber || res.trackingNumber}`);
                                }
                              } catch (e: any) { setShipmentMessage(e.message); }
                              finally { setIsShippingLoading(false); }
                            }}
                            disabled={isShippingLoading}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-red-600/20 transition-colors cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" /> Ship with Australia Post
                          </button>
                        )}

                        {/* Hand Over Parcel to AusPost */}
                        {selectedOrder.shipping?.trackingNumber && selectedOrder.shipping?.status !== 'SHIPPED' && selectedOrder.shipping?.status !== 'DELIVERED' && (
                          <button
                            onClick={async () => {
                              setIsShippingLoading(true);
                              try {
                                if (onMarkHandedOver) await onMarkHandedOver(selectedOrder._id);
                                setSelectedOrder(prev => prev ? { ...prev, orderStatus: 'Shipped', shipping: { ...(prev.shipping || {}), status: 'SHIPPED' } } : null);
                                setShipmentMessage('Order marked as Handed Over to Australia Post & customer notified!');
                              } catch (e: any) { setShipmentMessage(e.message); }
                              finally { setIsShippingLoading(false); }
                            }}
                            disabled={isShippingLoading}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Handed Over to AusPost (Notify Customer)
                          </button>
                        )}
                      </>
                    )}
                  </div>

                </div>

              </div>


              {/* Payment Details */}
              <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-200/60 space-y-2 text-xs">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#F06123]" /> Payment Gateway Information
                </h3>
                <div className="grid grid-cols-2 gap-2 text-gray-700 font-medium">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Payment Method:</span>
                    <span className="font-bold text-gray-900">{selectedOrder.paymentMethod || 'Credit Card (Stripe)'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Stripe Transaction ID:</span>
                    <span className="font-mono text-[11px] font-bold text-gray-900 truncate block">
                      {selectedOrder.paymentResult?.id || selectedOrder.stripeSessionId || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ordered Products Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  Ordered Products ({selectedOrder.items?.length || 0})
                </h3>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 text-xs">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0" 
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900">{item.name}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Quantity: <span className="font-bold text-gray-800">{item.quantity}</span> × ${item.price?.toFixed(2)} AUD
                          </div>
                        </div>
                      </div>
                      <div className="font-extrabold text-gray-900 text-sm">
                        ${(item.price * item.quantity).toFixed(2)} AUD
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Financial Summary */}
              <div className="bg-gray-900 text-white p-5 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-gray-400 font-medium">
                  <span>Subtotal</span>
                  <span>${selectedOrder.totalAmount?.toFixed(2)} AUD</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-medium">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-400 font-bold">FREE (Included)</span>
                </div>
                <div className="pt-2 border-t border-gray-800 flex justify-between items-end">
                  <span className="font-bold text-sm">Total Paid</span>
                  <span className="text-2xl font-extrabold text-[#F06123]">${selectedOrder.totalAmount?.toFixed(2)} AUD</span>
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-[#F06123] hover:bg-[#e05214] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete Order?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete order <span className="font-mono font-bold text-gray-800">#{deleteConfirmId.slice(-8).toUpperCase()}</span>? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
