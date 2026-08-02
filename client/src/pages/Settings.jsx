import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../utils/api';
import { UserPortalLayout } from '../components/UserPortalLayout';
import { FaUser, FaSave, FaEnvelope, FaLock, FaCheckCircle, FaExclamationTriangle, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe, FaHashtag } from 'react-icons/fa';

export const Settings = () => {
  const { user, checkAuth } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [zipCode, setZipCode] = useState(user?.zipCode || '');
  const [country, setCountry] = useState(user?.country || 'Australia');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setState(user.state || '');
      setZipCode(user.zipCode || '');
      setCountry(user.country || 'Australia');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = { name, phone, address, city, state, zipCode, country };
      if (password) payload.password = password;

      const res = await authApi.updateProfile(payload);
      setMessage({ type: 'success', text: res.message || 'Profile & shipping details updated successfully!' });
      setPassword('');
      await checkAuth(); // refresh user data in context
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const cardStyle = { boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)' };
  const inputStyle = "w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 focus:border-[#F06123] focus:ring-1 focus:ring-[#F06123]/15 transition-all outline-none hover:border-gray-300";

  return (
    <UserPortalLayout 
      currentTab="settings" 
      title="Account Settings" 
      subtitle="Manage your profile information, password, and default checkout details"
      icon={FaUser}
    >
      {/* Profile Overview */}
      <div className="bg-white rounded-xl p-4 mb-4" style={cardStyle}>
        <div className="flex items-center gap-3">
          <div className="shrink-0 flex items-center justify-center rounded-xl text-white font-bold"
            style={{ width: '44px', height: '44px', fontSize: '14px', background: 'linear-gradient(135deg, #F06123, #FF8803)', boxShadow: '0 4px 12px rgba(240,97,35,0.2)' }}>
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-800 truncate" style={{ fontSize: '13px' }}>{user?.name || 'User'}</p>
            <p className="text-gray-400 truncate" style={{ fontSize: '11px' }}>{user?.email}</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-100">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-bold text-green-600" style={{ fontSize: '10px' }}>Active</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`flex items-center gap-2.5 p-3 rounded-xl mb-4 border ${
          message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
        }`} style={{ fontSize: '12px' }}>
          {message.type === 'success' ? <FaCheckCircle className="text-green-500 shrink-0" style={{ fontSize: '12px' }} /> : <FaExclamationTriangle className="text-red-500 shrink-0" style={{ fontSize: '12px' }} />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl overflow-hidden" style={cardStyle}>
        <div className="px-5 pt-5 pb-3 border-b border-gray-50">
          <p className="font-bold text-gray-800" style={{ fontSize: '13px' }}>Personal Information & Saved Shipping Address</p>
          <p className="text-gray-400 mt-0.5" style={{ fontSize: '11px' }}>Details saved here will automatically fill your checkout form for faster orders.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Account Details Section */}
          <div className="space-y-4">
            <p className="text-[#F06123] font-bold uppercase tracking-wider text-[10px]">Account Details</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="flex items-center gap-1.5 text-gray-600 font-semibold mb-1.5" style={{ fontSize: '11.5px' }}>
                  <FaEnvelope className="text-gray-400" style={{ fontSize: '10px' }} />
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 cursor-not-allowed outline-none"
                  style={{ fontSize: '12.5px' }}
                />
              </div>

              {/* Name */}
              <div>
                <label className="flex items-center gap-1.5 text-gray-600 font-semibold mb-1.5" style={{ fontSize: '11.5px' }}>
                  <FaUser className="text-gray-400" style={{ fontSize: '10px' }} />
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputStyle}
                  style={{ fontSize: '12.5px' }}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-1.5 text-gray-600 font-semibold mb-1.5" style={{ fontSize: '11.5px' }}>
                <FaPhone className="text-gray-400" style={{ fontSize: '10px' }} />
                Phone Number
              </label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className={inputStyle}
                style={{ fontSize: '12.5px' }}
                placeholder="e.g. +61 400 000 000"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100" />

          {/* Saved Checkout / Shipping Address Section */}
          <div className="space-y-4 pt-1">
            <p className="text-[#F06123] font-bold uppercase tracking-wider text-[10px]">Saved Checkout Shipping Address</p>
            
            {/* Address */}
            <div>
              <label className="flex items-center gap-1.5 text-gray-600 font-semibold mb-1.5" style={{ fontSize: '11.5px' }}>
                <FaMapMarkerAlt className="text-gray-400" style={{ fontSize: '10px' }} />
                Street Address
              </label>
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                className={inputStyle}
                style={{ fontSize: '12.5px' }}
                placeholder="Street address, unit, P.O. box"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label className="flex items-center gap-1.5 text-gray-600 font-semibold mb-1.5" style={{ fontSize: '11.5px' }}>
                  <FaCity className="text-gray-400" style={{ fontSize: '10px' }} />
                  City
                </label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className={inputStyle}
                  style={{ fontSize: '12.5px' }}
                  placeholder="e.g. Sydney"
                />
              </div>

              {/* State */}
              <div>
                <label className="flex items-center gap-1.5 text-gray-600 font-semibold mb-1.5" style={{ fontSize: '11.5px' }}>
                  <FaGlobe className="text-gray-400" style={{ fontSize: '10px' }} />
                  State / Province
                </label>
                <input 
                  type="text" 
                  value={state} 
                  onChange={(e) => setState(e.target.value)}
                  className={inputStyle}
                  style={{ fontSize: '12.5px' }}
                  placeholder="e.g. NSW"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ZIP / Postal Code */}
              <div>
                <label className="flex items-center gap-1.5 text-gray-600 font-semibold mb-1.5" style={{ fontSize: '11.5px' }}>
                  <FaHashtag className="text-gray-400" style={{ fontSize: '10px' }} />
                  ZIP / Postal Code
                </label>
                <input 
                  type="text" 
                  value={zipCode} 
                  onChange={(e) => setZipCode(e.target.value)}
                  className={inputStyle}
                  style={{ fontSize: '12.5px' }}
                  placeholder="e.g. 2000"
                />
              </div>

              {/* Country */}
              <div>
                <label className="flex items-center gap-1.5 text-gray-600 font-semibold mb-1.5" style={{ fontSize: '11.5px' }}>
                  <FaGlobe className="text-gray-400" style={{ fontSize: '10px' }} />
                  Country
                </label>
                <input 
                  type="text" 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)}
                  className={inputStyle}
                  style={{ fontSize: '12.5px' }}
                  placeholder="e.g. Australia"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100" />

          {/* Password Security Section */}
          <div>
            <label className="flex items-center gap-1.5 text-gray-600 font-semibold mb-1.5" style={{ fontSize: '11.5px' }}>
              <FaLock className="text-gray-400" style={{ fontSize: '10px' }} />
              New Password
              <span className="text-gray-400 font-normal" style={{ fontSize: '10px' }}>(leave blank to keep current)</span>
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password if changing"
              className={inputStyle}
              style={{ fontSize: '12.5px' }}
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
            <p className="text-gray-400 font-medium hidden sm:block" style={{ fontSize: '10px' }}>
              Shipping details saved here will auto-fill on Checkout!
            </p>
            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2.5 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-60 shrink-0 hover:shadow-lg"
              style={{ fontSize: '12px', background: 'linear-gradient(135deg, #F06123, #FF8803)', boxShadow: '0 2px 8px rgba(240,97,35,0.2)' }}
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <FaSave style={{ fontSize: '10px' }} /> Save Profile & Address
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </UserPortalLayout>
  );
};
