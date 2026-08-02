import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quotationApi } from '../utils/api';
import { UserPortalLayout } from '../components/UserPortalLayout';
import { FaFileAlt, FaSpinner, FaEye, FaTimes, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBatteryFull, FaCalendarAlt, FaCheckCircle, FaFileInvoiceDollar } from 'react-icons/fa';

export const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModalQuote, setActiveModalQuote] = useState(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const res = await quotationApi.getMyQuotations();
      setQuotations(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch quotations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Submitted Request':
      case 'New':
      case 'Pending': 
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-[#F06123] border border-orange-200 inline-block">Submitted Request</span>;
      case 'Replied':
      case 'Sent': 
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 inline-block">Replied</span>;
      case 'Approved': 
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200 inline-block">Approved</span>;
      case 'Rejected': 
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 inline-block">Rejected</span>;
      case 'Draft':
      default: 
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200 inline-block">Draft</span>;
    }
  };

  return (
    <UserPortalLayout 
      currentTab="quotes" 
      title="My Quotations" 
      subtitle="View, track and review custom quote requests and formal quotations"
      icon={FaFileAlt}
    >
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-[#F06123] text-4xl" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center text-sm font-semibold">
          {error}
        </div>
      ) : quotations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
          <FaFileAlt className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Quotations Found</h2>
          <p className="text-gray-500 text-xs mb-6 max-w-md mx-auto">You haven't submitted any quote requests or received formal quotes yet.</p>
          <Link to="/contact" className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#F06123] to-[#FF8803] text-white font-bold rounded-xl shadow-md text-xs">
            Request a Quote
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          {/* Quotations Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                  <th className="py-4 px-5">Quote ID / Ref</th>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5">Service / Project</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Amount</th>
                  <th className="py-4 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                {quotations.map((quote) => {
                  const quoteId = quote.quoteNo || `REQ-${quote._id?.substring(quote._id.length - 6).toUpperCase()}`;
                  const formattedDate = new Date(quote.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const projectName = quote.projectName || quote.service || 'Battery Quote Request';
                  const amount = quote.grandTotal > 0 ? `$${quote.grandTotal.toFixed(2)}` : (quote.isRequest ? 'Under Review' : 'TBD');

                  return (
                    <tr key={quote._id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="py-4 px-5 font-bold text-[#F06123]">
                        {quoteId}
                      </td>
                      <td className="py-4 px-5 text-gray-500 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-4 px-5 font-bold text-gray-800 max-w-[220px] truncate">
                        {projectName}
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        {getStatusBadge(quote.status)}
                      </td>
                      <td className="py-4 px-5 font-extrabold text-gray-900 whitespace-nowrap">
                        {amount}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => setActiveModalQuote(quote)}
                          className="w-8 h-8 rounded-xl bg-orange-50 hover:bg-[#F06123] text-[#F06123] hover:text-white transition-all inline-flex items-center justify-center shadow-2xs"
                          title="View Full Quotation Details"
                        >
                          <FaEye className="text-xs" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full Quotation Detail Popup Modal Banner */}
      {activeModalQuote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-fade-in border border-gray-100">
            {/* Modal Banner Header */}
            <div className="bg-gradient-to-r from-[#383A3C] to-[#1a1a1a] text-white p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black">
                    Quotation #{activeModalQuote.quoteNo || `REQ-${activeModalQuote._id?.substring(activeModalQuote._id.length - 6).toUpperCase()}`}
                  </h3>
                </div>
                <p className="text-xs text-gray-300">
                  Submitted: {new Date(activeModalQuote.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(activeModalQuote.status)}
                <button 
                  onClick={() => setActiveModalQuote(null)}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700">
              
              {/* Summary Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Project / Service</span>
                  <span className="font-extrabold text-gray-800 text-sm">{activeModalQuote.projectName || 'Battery Quote Request'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Estimate Total</span>
                  <span className="font-extrabold text-[#F06123] text-sm">
                    {activeModalQuote.grandTotal > 0 ? `$${activeModalQuote.grandTotal.toFixed(2)}` : 'Under Review'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Type</span>
                  <span className="font-bold text-gray-700">{activeModalQuote.isRequest ? 'Custom Quote Request' : 'Formal Quotation'}</span>
                </div>
              </div>

              {/* Client & Contact Info */}
              <div>
                <h4 className="font-bold text-sm text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
                  <FaBuilding className="text-[#F06123]" /> Client Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-gray-100">
                  <div>
                    <span className="font-semibold text-gray-500">Contact Person:</span> {activeModalQuote.client?.contactPerson || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">Company:</span> {activeModalQuote.client?.companyName || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">Email:</span> {activeModalQuote.client?.email || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">Phone:</span> {activeModalQuote.client?.phone || 'N/A'}
                  </div>
                  {activeModalQuote.client?.abn && (
                    <div>
                      <span className="font-semibold text-gray-500">ABN:</span> {activeModalQuote.client.abn}
                    </div>
                  )}
                  {activeModalQuote.client?.siteAddress && (
                    <div className="col-span-full">
                      <span className="font-semibold text-gray-500">Site Address:</span> {activeModalQuote.client.siteAddress}
                    </div>
                  )}
                </div>
              </div>

              {/* Battery / Equipment Specifications */}
              {(activeModalQuote.battery?.batteryType || activeModalQuote.battery?.quantity || activeModalQuote.battery?.location) && (
                <div>
                  <h4 className="font-bold text-sm text-gray-800 border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
                    <FaBatteryFull className="text-[#F06123]" /> Battery Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-gray-100">
                    <div>
                      <span className="font-semibold text-gray-500 block mb-0.5">Battery Type</span>
                      <span className="font-bold text-gray-800">{activeModalQuote.battery?.batteryType || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500 block mb-0.5">Quantity</span>
                      <span className="font-bold text-gray-800">{activeModalQuote.battery?.quantity || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500 block mb-0.5">Location</span>
                      <span className="font-bold text-gray-800">{activeModalQuote.battery?.location || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Message / Description */}
              {activeModalQuote.description && (
                <div>
                  <h4 className="font-bold text-sm text-gray-800 border-b border-gray-100 pb-2 mb-3">
                    Description &amp; Requirements
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line text-gray-700 leading-relaxed font-sans">
                    {activeModalQuote.description}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModalQuote(null)}
                className="px-6 py-2.5 bg-[#383A3C] hover:bg-black text-white font-bold text-xs rounded-xl transition-colors"
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
