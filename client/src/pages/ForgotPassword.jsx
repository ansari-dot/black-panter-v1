import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../utils/api';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, CheckCircle2, KeyRound } from 'lucide-react';
import logoImg from '../assets/logo.webp';
import bgImg from '../assets/login.png';

export const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    
    try {
      await authApi.forgotPassword({ email: email.trim() });
      setSuccessMsg('A 6-digit OTP has been sent to your email.');
      setStep(2);
    } catch (error) {
      const data = error?.response?.data || error;
      setErrorMsg(data?.message || 'Failed to send reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (otp.trim().length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP verification code.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await authApi.verifyResetOtp({ email: email.trim(), otp: otp.trim() });
      setSuccessMsg('OTP verified! Please set a new password.');
      setStep(3);
    } catch (error) {
      const data = error?.response?.data || error;
      setErrorMsg(data?.message || 'Invalid or expired OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await authApi.resetPassword({ email: email.trim(), otp: otp.trim(), password });
      setSuccessMsg('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const data = error?.response?.data || error;
      setErrorMsg(data?.message || 'Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex font-sans overflow-hidden select-none bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 w-full lg:w-2/3 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-0" />

      {/* LEFT SECTION */}
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
            Reset your <br />
            <span className="text-[#F06123]">password</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xs mb-12 leading-relaxed font-normal drop-shadow">
            Regain access to your account with our secure, 3-step verification process.
          </p>
        </div>

        <div className="text-xs text-gray-400 font-medium relative z-20 drop-shadow">
          © {new Date().getFullYear()} Black Panther Corp.
        </div>
      </div>

      {/* RIGHT SECTION */}
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
              Forgot <span className="text-[#F06123]">Password</span>
            </h3>
            <p className="text-[15px] font-medium text-slate-500">
              {step === 1 && "Enter your email to receive a reset code."}
              {step === 2 && "Enter the 6-digit code sent to your email."}
              {step === 3 && "Set your new secure password."}
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
              {successMsg}
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              {errorMsg}
            </div>
          )}

          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full pl-10 pr-4 py-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F06123] focus:ring-1 focus:ring-[#F06123] transition-all shadow-sm font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-6 rounded-xl text-sm font-bold text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer bg-[#F06123] hover:bg-[#E05214]"
              >
                {isSubmitting ? 'Sending Code...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-4 bg-orange-50/80 border border-[#F06123]/30 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#F06123]" />
                    Enter 6-Digit Code
                  </label>
                  <span className="text-[10px] font-extrabold text-[#F06123] uppercase tracking-wider">Valid 10 Mins</span>
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
              </div>
              
              <div className="flex justify-between items-center text-xs px-1">
                <button 
                  type="button" 
                  onClick={() => {
                    setStep(1);
                    setSuccessMsg('');
                    setErrorMsg('');
                    setOtp('');
                  }}
                  className="text-slate-500 hover:underline"
                >
                  Change Email
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-6 rounded-xl text-sm font-bold text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer bg-[#F06123] hover:bg-[#E05214]"
              >
                {isSubmitting ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-6 rounded-xl text-sm font-bold text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer bg-[#F06123] hover:bg-[#E05214]"
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {step === 1 && (
            <div className="mt-8 text-center text-sm font-medium text-slate-500">
              Remember your password? <Link to="/login" className="text-[#F06123] font-bold hover:underline">Sign in</Link>
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 mt-8 text-[11px] text-slate-400 font-medium">
            <CheckCircle2 size={13} className="text-[#F06123]" />
            <span>Secure Password Reset • Black Panther Corp.</span>
          </div>
        </div>

        <div className="shrink-0" />
      </div>
    </div>
  );
};
