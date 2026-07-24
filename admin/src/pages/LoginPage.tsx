import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, CheckCircle2, KeyRound, RefreshCw, Box, Settings, Users, ShieldCheck } from 'lucide-react';
import logoImg from '../../../client/src/assets/logo.webp';

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
    <div className="min-h-screen w-full flex bg-[#070B15] font-sans overflow-hidden select-none relative">
      
      {/* LEFT SECTION - DARK BRANDING PANEL WITH PANTHER & LIGHTNING VISUAL */}
      <div className="hidden lg:flex w-1/2 relative bg-[#070B15] flex-col justify-between p-12 overflow-hidden z-10">
        
        {/* Background Glowing Ambient Orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#F06123]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#FF8803]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header Logo */}
        <div className="flex items-center gap-3 relative z-20">
          <img src={logoImg} alt="Black Panther Batteries" className="w-12 h-12 object-contain" />
          <div>
            <h2 className="font-bold text-white text-base tracking-wider leading-tight uppercase font-headings">
              BLACK PANTHER BATTERIES
            </h2>
            <span className="text-[11px] font-semibold text-[#F06123] tracking-widest uppercase">
              ADMIN PORTAL
            </span>
          </div>
        </div>

        {/* Center Hero Content & Stats Grid */}
        <div className="relative z-20 my-auto py-8">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-3 tracking-tight">
            Manage your <br />
            <span className="text-[#F06123]">battery business</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-sm mb-10 leading-relaxed font-normal">
            Products, services, team, and client inquiries — all in one place.
          </p>

          {/* Left Side Graphic Visuals + Stats Cards Container */}
          <div className="flex items-center gap-8 relative">
            {/* Stats Items */}
            <div className="flex flex-col gap-4 z-20">
              <div className="flex items-center gap-4 bg-[#0F1626]/80 border border-slate-800/80 backdrop-blur-md px-5 py-3.5 rounded-2xl w-56 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-[#F06123]/10 border border-[#F06123]/30 flex items-center justify-center text-[#F06123]">
                  <Box size={20} />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white">{productsCount}+</div>
                  <div className="text-xs text-slate-400 font-medium">Products</div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#0F1626]/80 border border-slate-800/80 backdrop-blur-md px-5 py-3.5 rounded-2xl w-56 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-[#F06123]/10 border border-[#F06123]/30 flex items-center justify-center text-[#F06123]">
                  <Settings size={20} />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white">{activeServicesCount}</div>
                  <div className="text-xs text-slate-400 font-medium">Active Services</div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#0F1626]/80 border border-slate-800/80 backdrop-blur-md px-5 py-3.5 rounded-2xl w-56 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-[#F06123]/10 border border-[#F06123]/30 flex items-center justify-center text-[#F06123]">
                  <Users size={20} />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white">{clientsCount}+</div>
                  <div className="text-xs text-slate-400 font-medium">Clients Served</div>
                </div>
              </div>
            </div>

            {/* Panther Battery Graphic SVG Art */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Subtle Glowing Panther Outline & Lightning */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F06123]/20 via-transparent to-[#FF8803]/10 rounded-full blur-2xl animate-pulse" />
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                <div className="w-48 h-40 bg-[#0B101D] border border-[#F06123]/40 rounded-2xl p-4 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#F06123]/10 rounded-full blur-xl" />
                  <img src={logoImg} alt="Battery Logo" className="w-16 h-16 object-contain mb-2 drop-shadow-[0_0_15px_rgba(240,97,35,0.6)]" />
                  <div className="text-xs font-bold text-white tracking-widest text-center">BLACK PANTHER</div>
                  <div className="text-[10px] text-[#F06123] font-bold tracking-wider text-center">POWER UNLEASHED</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 font-medium relative z-20">
          © {new Date().getFullYear()} Black Panther Corp.
        </div>
      </div>

      {/* ANGLED SEPARATOR CHEVRON LINE */}
      <div 
        className="hidden lg:block absolute inset-y-0 left-1/2 -ml-16 w-32 z-30 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #070B15 50%, #F8F9FA 50%)',
          clipPath: 'polygon(0 0, 100% 0, 40% 50%, 100% 100%, 0 100%, 0% 50%)',
          boxShadow: '10px 0 30px rgba(0,0,0,0.5)'
        }}
      />
      {/* Orange Accent Chevron Stroke */}
      <svg className="hidden lg:block absolute inset-y-0 left-1/2 -ml-2 w-12 h-full z-40 pointer-events-none" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <path d="M 0 0 L 100 500 L 0 1000" fill="none" stroke="#F06123" strokeWidth="8" />
        <path d="M 10 0 L 110 500 L 10 1000" fill="none" stroke="#ffffff" strokeWidth="6" opacity="0.9" />
      </svg>

      {/* RIGHT SECTION - LIGHT FORM PANEL */}
      <div className="w-full lg:w-1/2 bg-[#F8F9FA] flex flex-col justify-between p-6 sm:p-12 md:p-16 relative z-20">
        
        {/* Subtle Dot Matrix Pattern */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

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
        <div className="w-full max-w-md mx-auto my-auto relative z-20">
          
          {/* Main Logo Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <img src={logoImg} alt="Black Panther Logo" className="w-20 h-20 object-contain mb-3 drop-shadow-md" />
            <h2 className="text-xl font-black text-[#0F172A] tracking-wider uppercase">
              BLACK PANTHER
            </h2>
            <h3 className="text-lg font-black text-[#0F172A] tracking-wider uppercase mb-1">
              BATTERIES
            </h3>
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#64748B] uppercase">
              POWER UNLEASHED
            </span>
          </div>

          {/* Form Welcome Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-black text-[#0F172A] tracking-tight mb-1">
              Welcome <span className="text-[#F06123]">back</span>
            </h3>
            <p className="text-sm font-medium text-slate-500">
              {requiresOtp ? 'Enter 6-digit verification code' : 'Sign in to your admin account'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F06123] focus:ring-2 focus:ring-[#F06123]/15 transition-all shadow-sm font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#F06123] hover:underline"
                  onClick={() => alert('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.')}
                >
                  Password rules?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your strong password"
                  className="w-full pl-10 pr-10 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F06123] focus:ring-2 focus:ring-[#F06123]/15 transition-all shadow-sm font-mono placeholder:text-slate-400"
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
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-[#F06123]/25 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              style={{
                background: successAnimation ? '#10B981' : 'linear-gradient(to right, #F06123, #FF8803)'
              }}
            >
              {successAnimation ? (
                <><CheckCircle2 className="w-5 h-5" /> Access Granted</>
              ) : isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
              ) : requiresOtp ? (
                <>Verify OTP & Open Dashboard <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Footer Tagline */}
          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-slate-400 font-medium">
            <ShieldCheck size={15} className="text-emerald-500" />
            <span>2-Step Security Enforced • Black Panther Corp.</span>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div />
      </div>

    </div>
  );
}
