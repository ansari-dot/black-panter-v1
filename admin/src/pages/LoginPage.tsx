/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, CheckCircle2, KeyRound, RefreshCw } from 'lucide-react';

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
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [companyTitle, setCompanyTitle] = useState('Black Panther');
  const [avatarUrl, setAvatarUrl] = useState('');

  // 2-Step OTP Security States
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpNotice, setOtpNotice] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  // Restore OTP state if user reloads tab while OTP verification is active
  useEffect(() => {
    const savedOtpEmail = sessionStorage.getItem('bp_otp_pending_email');
    if (savedOtpEmail) {
      setEmail(savedOtpEmail);
      setRequiresOtp(true);
      setOtpNotice('Security Check: 2-step OTP verification active. Enter the 6-digit code sent to your email.');
    }

    const load = () => {
      const t = localStorage.getItem('bp_settings_adminTitle');
      const a = localStorage.getItem('bp_settings_avatarUrl');
      if (t) setCompanyTitle(t);
      if (a) setAvatarUrl(a);
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener('localStorageUpdate', load);
    return () => { window.removeEventListener('storage', load); window.removeEventListener('localStorageUpdate', load); };
  }, []);

  // Countdown timer for Resend OTP button
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

      // Handle 2-Step Security OTP Requirement
      if (data?.requiresOtp) {
        setRequiresOtp(true);
        sessionStorage.setItem('bp_otp_pending_email', email.trim());
        setOtpNotice(data.message || 'Security check: 2 failed login attempts detected. Please check your admin email for the OTP verification code.');
        if (otp.trim().length > 0) {
          setErrorMsg(data.message || 'Incorrect OTP verification code');
        }
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      // Clean Login Success -> Remove pending OTP session storage
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
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to resend OTP');
      }

      setResendMessage('A new 6-digit OTP code has been sent to your email.');
      setResendCooldown(60); // 60s cooldown timer
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
    <div className="min-h-screen flex bg-white font-sans select-none">

      {/* LEFT — branding panel with background image */}
      <div
        className="hidden lg:flex lg:w-[42%] relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=900&auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-900/65" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden bg-white/10 border border-white/20">
              {avatarUrl
                ? <img src={avatarUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                : <Zap className="w-4 h-4 text-amber-400" strokeWidth={2.5} />}
            </div>
            <div>
              <div className="font-headings font-bold text-sm text-white">{companyTitle}</div>
              <div className="text-[10px] text-white/50 font-mono tracking-widest uppercase">Admin Portal</div>
            </div>
          </div>

          {/* Center content */}
          <div>
            <h2 className="text-3xl font-headings font-bold text-white leading-snug mb-3">
              Manage your<br />
              <span className="text-amber-400">battery business</span>
            </h2>
            <p className="text-sm text-white/60 leading-relaxed max-w-[260px]">
              Products, services, team, and client inquiries — all in one place.
            </p>

            <div className="flex flex-col gap-4 mt-10">
              {[
                { val: `${productsCount}+`, label: 'Products' },
                { val: `${activeServicesCount}`, label: 'Active Services' },
                { val: `${clientsCount}+`, label: 'Clients Served' },
              ].map(({ val, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="text-lg font-headings font-bold text-white w-12">{val}</div>
                  <div className="text-xs text-white/50">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-white/30 font-mono">© {new Date().getFullYear()} Black Panther Corp.</p>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 border border-amber-200 overflow-hidden">
              {avatarUrl
                ? <img src={avatarUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                : <Zap className="w-4 h-4 text-amber-500" />}
            </div>
            <span className="font-headings font-bold text-sm text-slate-800">{companyTitle}</span>
          </div>

          <h1 className="text-2xl font-headings font-bold text-slate-800 mb-1">
            {requiresOtp ? 'Security Verification' : 'Welcome back'}
          </h1>
          <p className="text-sm text-slate-400 mb-8">
            {requiresOtp ? 'Enter 6-digit OTP code sent to registered email' : 'Sign in to your admin account'}
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-slate-300" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@blackpanther-batteries.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600">Password</label>
                <button
                  type="button"
                  className="text-xs text-amber-500 hover:text-amber-600"
                  onClick={() => alert('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters (e.g., Admin123!@#).')}
                >
                  Password rules?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-slate-300" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your strong password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all placeholder:text-slate-300 font-mono"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-300 hover:text-slate-500">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* OTP VERIFICATION STEP (Triggered on 2 Wrong Attempts) */}
            {requiresOtp && (
              <div className="flex flex-col gap-2 p-4 bg-amber-50/80 border border-amber-200 rounded-xl animate-fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    Enter 6-Digit OTP Code
                  </label>
                  <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">Valid 5 Mins</span>
                </div>
                <input
                  required
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] font-mono text-2xl font-bold py-2 bg-white border border-amber-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <div className="flex items-center justify-between mt-1">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isResending}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP Email'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-xs text-slate-500 hover:underline"
                  >
                    Back to login
                  </button>
                </div>
              </div>
            )}

            {/* OTP Notice Banner */}
            {requiresOtp && otpNotice && (
              <div className="p-3 bg-amber-100/60 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
                {otpNotice}
              </div>
            )}

            {/* Resend Message Banner */}
            {resendMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700">
                {resendMessage}
              </div>
            )}

            {/* Error Message Banner */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-500">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || successAnimation}
              className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20"
              style={successAnimation
                ? { background: '#10b981', color: '#fff' }
                : { background: '#f59e0b', color: '#fff' }}
            >
              {successAnimation ? (
                <><CheckCircle2 className="w-4 h-4" /> Access Granted</>
              ) : isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
              ) : requiresOtp ? (
                <>Verify OTP & Open Dashboard <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

          </form>

          <p className="text-center text-[11px] text-slate-300 mt-8">
            2-Step Security Enforced · Black Panther Corp.
          </p>
        </div>
      </div>

    </div>
  );
}
