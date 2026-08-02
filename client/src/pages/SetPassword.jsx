import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, CheckCircle2 } from 'lucide-react';
import logoImg from '../assets/logo.webp';
import bgImg from '../assets/login.png';

export const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const { setupAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setErrorMsg('Invalid setup link. Please make sure you clicked the exact link from your email.');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token || !email) {
      setErrorMsg('Missing setup token or email.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await setupAccount(email, token, password);
      
      setSuccessAnimation(true);
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/'); // Redirect to homepage or dashboard after setup
      }, 1000);
    } catch (error) {
      const data = error?.response?.data || error;
      setErrorMsg(data?.message || error.message || 'Failed to setup account');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex font-sans overflow-hidden select-none bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 w-full lg:w-2/3 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-0" />

      {/* LEFT SECTION - TEXT & STATS OVERLAY */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 z-10">
        <Link to="/" className="flex items-start gap-3 relative z-20">
          <img src={logoImg} alt="Black Panther Batteries" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <h2 className="font-extrabold text-white text-base tracking-widest leading-tight uppercase">
              BLACK PANTHER<br />BATTERIES
            </h2>
            <span className="text-[10px] font-medium text-gray-400 tracking-widest uppercase mt-0.5">
              POWER UNLEASHED
            </span>
          </div>
        </Link>

        <div className="relative z-20 my-auto py-8">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-3 tracking-tight drop-shadow-md">
            Secure your <br />
            <span className="text-[#F06123]">new account</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xs mb-12 leading-relaxed font-normal drop-shadow">
            Set a strong password to complete your account registration and unlock full access.
          </p>
        </div>

        <div className="text-xs text-gray-400 font-medium relative z-20 drop-shadow">
          © {new Date().getFullYear()} Black Panther Corp.
        </div>
      </div>

      {/* RIGHT SECTION - FORM PANEL */}
      <div className="w-full lg:w-1/2 bg-white lg:bg-transparent flex flex-col justify-between p-6 sm:p-12 md:p-16 relative z-20 overflow-y-auto">
        <div className="w-full flex items-center justify-between lg:justify-end mb-8 relative z-20 shrink-0">
          <Link to="/" className="flex lg:hidden items-center gap-3">
            <img src={logoImg} alt="Logo" className="w-9 h-9 object-contain" />
            <span className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
              BLACK PANTHER
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto lg:translate-x-10 xl:translate-x-16 my-auto relative z-20 shrink-0 py-8">
          <div className="flex flex-col items-center text-center mb-10">
            <img src={logoImg} alt="Black Panther Logo" className="w-24 h-24 object-contain mb-4 drop-shadow-md" />
            <h2 className="text-[22px] leading-tight font-black text-slate-600 tracking-wider uppercase">
              BLACK PANTHER
            </h2>
            <h3 className="text-[22px] leading-tight font-black text-slate-600 tracking-wider uppercase mb-1">
              BATTERIES
            </h3>
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mt-1">
              POWER UNLEASHED
            </span>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Set <span className="text-[#F06123]">Password</span>
            </h3>
            <p className="text-[15px] font-medium text-slate-500">
              Almost there! Set a strong password for {email ? <span className="font-bold text-slate-700">{email}</span> : 'your account'}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Password Field */}
            <div className="space-y-2 mt-2">
              <label className="block text-sm font-bold text-slate-800">New Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 num, 1 special"
                  className="w-full pl-10 pr-10 py-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F06123] focus:ring-1 focus:ring-[#F06123] transition-all shadow-sm font-medium placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2 mt-2">
              <label className="block text-sm font-bold text-slate-800">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-10 py-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F06123] focus:ring-1 focus:ring-[#F06123] transition-all shadow-sm font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium mt-4">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || successAnimation || !token || !email}
              className="w-full py-4 mt-6 rounded-xl text-sm font-bold text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer bg-[#F06123] hover:bg-[#E05214]"
            >
              {successAnimation ? 'Setup Complete!' : isSubmitting ? 'Setting up...' : 'Set Password & Login'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 mt-8 text-[11px] text-slate-400 font-medium">
            <CheckCircle2 size={13} className="text-[#F06123]" />
            <span>Secure Setup • Black Panther Corp.</span>
          </div>
        </div>

        <div className="shrink-0" />
      </div>
    </div>
  );
};
