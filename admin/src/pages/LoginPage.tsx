import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, CheckCircle2, KeyRound, RefreshCw, Box, Wrench, Settings, Users, ShieldCheck } from 'lucide-react';
import logoImg from '../../../client/src/assets/logo.webp';
import bgImg from '../../assets/admin.png';

interface LoginPageProps {
  onLoginSuccess: (user: { id: string; name: string; email: string; role: string }) => void;
  productsCount: number;
  activeServicesCount: number;
  clientsCount: number;
}

export default function LoginPage({ onLoginSuccess, productsCount, activeServicesCount, clientsCount }: LoginPageProps) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // 2-Step OTP Security States
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpNotice, setOtpNotice] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    const savedOtpEmail = sessionStorage.getItem('bp_otp_pending_email');
    if (savedOtpEmail) {
      setEmail(savedOtpEmail);
      setRequiresOtp(true);
      setOtpNotice('Security Check: 2-step OTP verification active. Enter the 6-digit code sent to your email.');
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setResendMessage('');
    setIsSubmitting(true);

    if (requiresOtp && otp.trim().length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP verification code.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          ...(requiresOtp ? { otp: otp.trim() } : {})
        }),
      });

      const data = await response.json();

      if (data?.requiresOtp) {
        setRequiresOtp(true);
        sessionStorage.setItem('bp_otp_pending_email', email.trim());
        setOtpNotice(data.message || 'Security check: 2-step verification active. Enter the 6-digit code sent to your email.');
        if (otp.trim().length > 0) {
          setErrorMsg(data.message || 'Incorrect OTP verification code');
        }
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      sessionStorage.removeItem('bp_otp_pending_email');
      setSuccessAnimation(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess(data.user);
      }, 800);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Login failed');
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setResendMessage('');
    setErrorMsg('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Failed to resend OTP');

      setResendMessage('A new 6-digit OTP code has been sent to your email.');
      setResendCooldown(60);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    sessionStorage.removeItem('bp_otp_pending_email');
    setRequiresOtp(false);
    setOtp('');
    setErrorMsg('');
    setOtpNotice('');
  };

  return (
    <div
      className="min-h-screen w-full flex font-sans overflow-hidden select-none bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Dark Gradient Overlay for the Lion/Panther Background */}
      <div className="absolute inset-0 w-full lg:w-2/3 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-0" />

      {/* LEFT SECTION - TEXT & STATS OVERLAY */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 z-10">

        {/* Top Header Logo */}
        <div className="flex items-start gap-3 relative z-20">
          <img src={logoImg} alt="Black Panther Batteries" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <h2 className="font-extrabold text-white text-base tracking-widest leading-tight uppercase">
              BLACK PANTHER<br />BATTERIES
            </h2>
            <span className="text-[10px] font-medium text-gray-400 tracking-widest uppercase mt-0.5">
              POWER UNLEASHED
            </span>
          </div>
        </div>

        {/* Center Hero Content & Stats Grid */}
        <div className="relative z-20 my-auto py-8">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-3 tracking-tight drop-shadow-md">
            Manage your <br />
            <span className="text-[#F06123]">battery business</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xs mb-12 leading-relaxed font-normal drop-shadow">
            Products, services, team, and client<br />inquiries, all in one place.
          </p>

          {/* Stats Items */}
          <div className="flex flex-col gap-6 z-20 mt-4">
            <div className="flex items-center gap-4 bg-transparent border-b border-white/10 pb-4 w-64">
              <div className="w-10 h-10 rounded-xl border border-[#F06123]/30 flex items-center justify-center text-[#F06123]">
                <Box size={20} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">0+</div>
                <div className="text-sm text-gray-400 font-medium">Products</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-transparent border-b border-white/10 pb-4 w-64">
              <div className="w-10 h-10 rounded-xl border border-[#F06123]/30 flex items-center justify-center text-[#F06123]">
                <Wrench size={20} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">5</div>
                <div className="text-sm text-gray-400 font-medium">Active Services</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-transparent border-b border-white/10 pb-4 w-64">
              <div className="w-10 h-10 rounded-xl border border-[#F06123]/30 flex items-center justify-center text-[#F06123]">
                <Users size={20} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">500+</div>
                <div className="text-sm text-gray-400 font-medium">Clients Served</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-400 font-medium relative z-20 drop-shadow">
          © {new Date().getFullYear()} Black Panther Corp.
        </div>
      </div>

      {/* RIGHT SECTION - FORM PANEL */}
      {/* On desktop, the background is transparent because the image already has the white angled shape. On mobile, we use a solid white background. */}
      <div className="w-full lg:w-1/2 bg-white lg:bg-transparent flex flex-col justify-between p-6 sm:p-12 md:p-16 relative z-20">

        {/* Top Spacer or Mobile Header */}
        <div className="w-full flex items-center justify-between lg:justify-end mb-8 relative z-20">
          <div className="flex lg:hidden items-center gap-3">
            <img src={logoImg} alt="Logo" className="w-9 h-9 object-contain" />
            <span className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
              BLACK PANTHER
            </span>
          </div>
        </div>

        {/* Center Login Form Container */}
        <div className="w-full max-w-md mx-auto lg:translate-x-10 xl:translate-x-16 my-auto relative z-20">

          {/* Main Logo Header */}
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

          {/* Form Welcome Header */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Welcome <span className="text-[#F06123]">back</span>
            </h3>
            <p className="text-[15px] font-medium text-slate-500">
              {requiresOtp ? 'Enter 6-digit verification code' : 'Sign in to your admin account'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Email</label>
              <div className="relative flex items-center">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F06123] focus:ring-1 focus:ring-[#F06123] transition-all shadow-sm font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-800">Password</label>
                <button
                  type="button"
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => alert('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.')}
                >
                  Forgot rules?
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your strong password"
                  className="w-full pl-4 pr-10 py-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F06123] focus:ring-1 focus:ring-[#F06123] transition-all shadow-sm font-medium placeholder:text-slate-400"
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

            {/* OTP Step */}
            {requiresOtp && (
              <div className="p-4 bg-orange-50/80 border border-[#F06123]/30 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#F06123]" />
                    Enter 6-Digit OTP Code
                  </label>
                  <span className="text-[10px] font-extrabold text-[#F06123] uppercase tracking-wider">Valid 5 Mins</span>
                </div>
                <input
                  required
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] font-mono text-2xl font-bold py-2.5 bg-white border border-orange-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F06123]/20"
                />
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isResending}
                    className="font-semibold text-[#F06123] hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP Email'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-slate-500 hover:underline"
                  >
                    Back to login
                  </button>
                </div>
              </div>
            )}

            {/* OTP Notice Banner */}
            {requiresOtp && otpNotice && (
              <div className="p-3 bg-orange-100/60 border border-orange-200 rounded-xl text-xs text-orange-900 leading-relaxed font-medium">
                {otpNotice}
              </div>
            )}

            {/* Resend Message */}
            {resendMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
                {resendMessage}
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                {errorMsg}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting || successAnimation}
              className="w-full py-4 mt-4 rounded-xl text-sm font-bold text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer bg-[#F06123] hover:bg-[#E05214]"
            >
              {successAnimation ? (
                'Access Granted'
              ) : isSubmitting ? (
                'Verifying...'
              ) : requiresOtp ? (
                'Verify OTP & Open Dashboard'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Tagline */}
          <div className="flex items-center justify-center gap-1.5 mt-8 text-[11px] text-slate-400 font-medium">
            <CheckCircle2 size={13} className="text-[#F06123]" />
            <span>2-Step Security Enforced • Black Panther Corp.</span>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div />
      </div>

    </div>
  );
}
