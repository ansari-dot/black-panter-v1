/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: { id: string; name: string; email: string; role: string }) => void;
  productsCount: number;
  activeServicesCount: number;
  clientsCount: number;
}

export default function LoginPage({ onLoginSuccess, productsCount, activeServicesCount, clientsCount }: LoginPageProps) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('change_me_now');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [companyTitle, setCompanyTitle] = useState('Black Panther');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Login failed');
      }

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
              <div className="text-[10px] text-white/50 font-mono tracking-widest uppercase">Admin Panel</div>
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

          <h1 className="text-2xl font-headings font-bold text-slate-800 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400 mb-8">Sign in to your admin account</p>

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
                  placeholder="admin@blackpanther.com"
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
                  onClick={() => alert('Use your admin email and password from the create-admin script.')}
                  >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-slate-300" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all placeholder:text-slate-300 font-mono"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-300 hover:text-slate-500">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                className="h-3.5 w-3.5 rounded cursor-pointer"
                style={{ accentColor: '#f59e0b' }}
              />
              <span className="text-xs text-slate-500">Keep me signed in for 8 hours</span>
              </label>

            {/* Error */}
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
              className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              style={successAnimation
                ? { background: '#10b981', color: '#fff' }
                : { background: '#f59e0b', color: '#fff' }}
            >
              {successAnimation ? (
                <><CheckCircle2 className="w-4 h-4" /> Access Granted</>
              ) : isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

          </form>

          <p className="text-center text-[11px] text-slate-300 mt-8">
            Secure admin portal · Black Panther Corp.
          </p>
        </div>
      </div>

    </div>
  );
}
