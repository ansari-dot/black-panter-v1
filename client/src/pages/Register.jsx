import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ShieldAlert, CheckCircle2, User, ShoppingCart, Tag, Headphones, Check } from 'lucide-react';
import logoImg from '../assets/logo.webp';
import bgImg from '../assets/login.png';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await register(name.trim(), email.trim());
      setSuccess(true);
      setIsSubmitting(false);
    } catch (error) {
      const data = error?.response?.data || error;
      setErrorMsg(data?.message || error.message || 'Registration failed');
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
            Join the <br />
            <span className="text-[#F06123]">Panther Family</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xs mb-12 leading-relaxed font-normal drop-shadow">
            Create an account to manage your quotes, access exclusive deals, and checkout faster.
          </p>

          <div className="flex flex-col gap-6 z-20 mt-4">
            <div className="flex items-center gap-4 bg-transparent border-b border-white/10 pb-4 w-64">
              <div className="w-10 h-10 rounded-xl border border-[#F06123]/30 flex items-center justify-center text-[#F06123]">
                <ShoppingCart size={20} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">Seamless</div>
                <div className="text-sm text-gray-400 font-medium">Checkout Experience</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-transparent border-b border-white/10 pb-4 w-64">
              <div className="w-10 h-10 rounded-xl border border-[#F06123]/30 flex items-center justify-center text-[#F06123]">
                <Tag size={20} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">Exclusive</div>
                <div className="text-sm text-gray-400 font-medium">Offers & Discounts</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-transparent border-b border-white/10 pb-4 w-64">
              <div className="w-10 h-10 rounded-xl border border-[#F06123]/30 flex items-center justify-center text-[#F06123]">
                <Headphones size={20} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">24/7</div>
                <div className="text-sm text-gray-400 font-medium">Premium Support</div>
              </div>
            </div>
          </div>
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

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Check Your Email!</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                We've sent a secure setup link to <strong>{email}</strong>. Please check your inbox and click the link to set your password and complete your registration.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="text-sm font-bold text-[#F06123] hover:underline"
              >
                Need to use a different email?
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                  Create an <span className="text-[#F06123]">account</span>
                </h3>
                <p className="text-[15px] font-medium text-slate-500">
                  Enter your details. We'll email you a secure link to set your password.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-800">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F06123] focus:ring-1 focus:ring-[#F06123] transition-all shadow-sm font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>

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

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium mt-4">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 mt-6 rounded-xl text-sm font-bold text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer bg-[#F06123] hover:bg-[#E05214]"
                >
                  {isSubmitting ? 'Sending Link...' : 'Continue'}
                </button>
              </form>

              <div className="mt-8 text-center text-sm font-medium text-slate-500">
                Already have an account? <Link to={`/login?redirect=${redirect}`} className="text-[#F06123] font-bold hover:underline">Sign in here</Link>
              </div>
            </>
          )}

          <div className="flex items-center justify-center gap-1.5 mt-8 text-[11px] text-slate-400 font-medium">
            <CheckCircle2 size={13} className="text-[#F06123]" />
            <span>Secure Registration • Black Panther Corp.</span>
          </div>
        </div>

        <div className="shrink-0" />
      </div>
    </div>
  );
};
