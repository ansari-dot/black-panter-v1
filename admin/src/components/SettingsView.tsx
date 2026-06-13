/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, FormEvent, useEffect, DragEvent, ChangeEvent } from 'react';
import { 
  Settings, 
  Shield, 
  Sliders, 
  CheckCircle2, 
  KeyRound, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Eye, 
  EyeOff, 
  Globe, 
  Building2,
  AlertCircle
} from 'lucide-react';
import { TSystemStatus } from '../types';

interface SettingsViewProps {
  systemStatus: TSystemStatus;
  onUpdateStatusValue: (serviceKey: 'apiServer' | 'database' | 'cdn', state: 'Operational' | 'Degraded' | 'Offline') => void;
}

// Preset modern battery branding logos that users can choose as catalog covers
const PRESET_LOGOS = [
  { name: 'Amber Panther Core', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80' },
  { name: 'Traction Cyan', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=120&q=80' },
  { name: 'Dark Sulfur Ion', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&q=80' },
];

export default function SettingsView({ systemStatus, onUpdateStatusValue }: SettingsViewProps) {
  // Brand name and general config
  const [adminTitle, setAdminTitle] = useState(() => {
    return localStorage.getItem('bp_settings_adminTitle') || 'Black Panther Batteries';
  });
  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    return localStorage.getItem('bp_settings_maintenance') === 'true';
  });

  // Corporate Profile photo state
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('bp_settings_avatarUrl') || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80';
  });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Social media integrated channels state
  const [socialTwitter, setSocialTwitter] = useState(() => {
    return localStorage.getItem('bp_settings_twitter') || 'https://twitter.com/blackpanthercells';
  });
  const [socialLinkedin, setSocialLinkedin] = useState(() => {
    return localStorage.getItem('bp_settings_linkedin') || 'https://linkedin.com/company/black-panther-batteries';
  });
  const [socialFacebook, setSocialFacebook] = useState(() => {
    return localStorage.getItem('bp_settings_facebook') || 'https://facebook.com/blackpanthertraction';
  });
  const [socialInstagram, setSocialInstagram] = useState(() => {
    return localStorage.getItem('bp_settings_instagram') || 'https://instagram.com/blackpantherheavy';
  });

  // Password configuration state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' });

  // Save feedback state
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto save text branding details to localstorage
  const handleSaveProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem('bp_settings_adminTitle', adminTitle);
    localStorage.setItem('bp_settings_maintenance', String(maintenanceMode));
    localStorage.setItem('bp_settings_avatarUrl', avatarUrl);
    localStorage.setItem('bp_settings_twitter', socialTwitter);
    localStorage.setItem('bp_settings_linkedin', socialLinkedin);
    localStorage.setItem('bp_settings_facebook', socialFacebook);
    localStorage.setItem('bp_settings_instagram', socialInstagram);

    // Broadcast change
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('localStorageUpdate'));

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  // Drag and drop photo logic
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Operational error: please upload standard raster image files (JPEG/PNG/SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        setAvatarUrl(event.target.result);
        localStorage.setItem('bp_settings_avatarUrl', event.target.result);
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('localStorageUpdate'));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Change password verification logic
  const handlePasswordChangeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordFeedback({ type: 'error', text: 'Current credentials are required to overwrite system keys.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', text: 'Operational key must consist of 6 characters or above.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', text: 'Verification failure. Passwords do not match.' });
      return;
    }

    // Save to localStorage so LoginPage can check it
    localStorage.setItem('bp_settings_password', newPassword);

    // Success simulation
    setPasswordFeedback({
      type: 'success',
      text: 'Security system keys and administrative password replaced successfully!'
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    setTimeout(() => {
      setPasswordFeedback({ type: '', text: '' });
    }, 4500);
  };

  // Simple feedback strength rating
  const getPasswordStrength = () => {
    if (!newPassword) return { label: 'Empty', color: 'bg-muted', text: 'text-muted-foreground', pct: 0 };
    if (newPassword.length < 5) return { label: 'Weak State', color: 'bg-danger', text: 'text-danger', pct: 25 };
    if (newPassword.length < 8) return { label: 'Good Defense', color: 'bg-warning', text: 'text-warning', pct: 60 };
    return { label: 'Imperial Security', color: 'bg-success', text: 'text-success', pct: 100 };
  };

  const strength = getPasswordStrength();

  return (
    <div id="settings-view-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      
      {/* Left panel: General Configuration (width 8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Profile and public info formulation */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between border-b border-border/60 pb-3">
            <div>
              <h2 className="text-base font-bold font-headings text-foreground flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-primary" />
                <span>Branding Configuration Profile</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Control organization primary titles, public cover photos, and deployment states.</p>
            </div>
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono font-semibold text-muted-foreground">ID: SEC-ROOT</span>
          </div>

          <form onSubmit={handleSaveProfileSubmit} className="flex flex-col gap-5 text-xs">
            
            {/* BRAND TITLE INPUT */}
            <div>
              <label className="block font-semibold font-mono uppercase tracking-wider text-muted-foreground mb-1">Company Display Title Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/70" />
                <input
                  type="text"
                  required
                  value={adminTitle}
                  onChange={(e) => setAdminTitle(e.target.value)}
                  placeholder="e.g. Black Panther Traction Industries"
                  className="w-full pl-9 p-2.5 rounded-md border border-border bg-background text-foreground font-semibold focus:outline-none focus:border-primary font-sans text-xs"
                />
              </div>
            </div>

            {/* BRAND PHOTO UPLOAD SELECTION CONTAINER */}
            <div>
              <label className="block font-semibold font-mono uppercase tracking-wider text-muted-foreground mb-2">Corporate Branding Photo / Logo Representation</label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center bg-muted/20 p-4 border border-border/80 rounded-lg">
                
                {/* Visual Avatar preview */}
                <div className="flex flex-col items-center justify-center p-3 border border-border/60 bg-background rounded-md text-center">
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground mb-2 block">CURRENT IMAGE</span>
                  <div className="w-20 h-20 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center shadow-inner">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Company Identity" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80');
                    }}
                    className="mt-2.5 text-[10px] font-semibold text-danger hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Reset Preference</span>
                  </button>
                </div>

                {/* Upload drag-n-drop zone */}
                <div 
                  className={`col-span-2 border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-background'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-2" />
                  <span className="block font-semibold text-foreground text-xs">Drag and Drop Brand Photo</span>
                  <span className="block text-[10px] text-muted-foreground mt-1">Accepts standard PNG, JPG, or SVG formats (Max 3MB). Or click to browse.</span>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>

              </div>

              {/* Photo Presets choice option */}
              <div className="mt-3">
                <span className="block font-semibold text-muted-foreground font-mono text-[9px] uppercase tracking-wider mb-2">OR SELECT FROM HIGH-POWER PRESET CONSTRUCTIONS:</span>
                <div className="flex gap-3">
                  {PRESET_LOGOS.map((logo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatarUrl(logo.url);
                        localStorage.setItem('bp_settings_avatarUrl', logo.url);
                        window.dispatchEvent(new Event('storage'));
                        window.dispatchEvent(new Event('localStorageUpdate'));
                      }}
                      className={`flex items-center gap-2 p-1.5 border rounded-lg text-left hover:border-primary cursor-pointer bg-background transition-all shrink-0 ${
                        avatarUrl === logo.url ? 'border-primary ring-2 ring-primary/10' : 'border-border'
                      }`}
                    >
                      <img src={logo.url} alt={logo.name} className="w-7 h-7 rounded object-cover shrink-0" referrerPolicy="no-referrer" />
                      <span className="font-sans font-medium text-[10px] pr-1.5 truncate max-w-[120px]">{logo.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* MAINTENANCE MODE TOGGLE OVERLAY */}
            <div className="p-4 bg-muted/40 rounded-md border border-border/80">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={() => setMaintenanceMode(!maintenanceMode)}
                  className="mt-1 h-4 w-4 text-primary rounded border-border focus:ring-primary cursor-pointer"
                />
                <div className="text-xs">
                  <span className="block font-semibold text-foreground">Enable Administrative Maintenance Mode</span>
                  <span className="block text-muted-foreground mt-0.5">
                    Locks downstream catalog modifications temporarily. Visitors see a friendly maintenance message.
                  </span>
                </div>
              </label>
            </div>

            {/* SOCIAL MEDIA INTEGRATION MANAGER */}
            <div className="border-t border-border pt-4">
              <span className="block font-bold text-foreground mb-1 font-headings text-xs">Linked Social Media Channels</span>
              <p className="text-xs text-muted-foreground mb-3">Include secure branding reference credentials for automated footer integration modules.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Twitter custom feed */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-muted-foreground font-semibold font-mono text-[10px] uppercase">
                    <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                    <span>Twitter / X Corporate Handle</span>
                  </div>
                  <input
                    type="url"
                    value={socialTwitter}
                    onChange={(e) => setSocialTwitter(e.target.value)}
                    placeholder="https://x.com/blackpanthercells"
                    className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>

                {/* LinkedIn feed */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-muted-foreground font-semibold font-mono text-[10px] uppercase">
                    <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                    <span>LinkedIn Business Listing</span>
                  </div>
                  <input
                    type="url"
                    value={socialLinkedin}
                    onChange={(e) => setSocialLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/company/black-panther"
                    className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>

                {/* Facebook channel */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-muted-foreground font-semibold font-mono text-[10px] uppercase">
                    <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                    <span>Facebook Showroom Page</span>
                  </div>
                  <input
                    type="url"
                    value={socialFacebook}
                    onChange={(e) => setSocialFacebook(e.target.value)}
                    placeholder="https://facebook.com/blackpanthercells"
                    className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>

                {/* Instagram index */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-muted-foreground font-semibold font-mono text-[10px] uppercase">
                    <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                    <span>Instagram Showcase Feed</span>
                  </div>
                  <input
                    type="url"
                    value={socialInstagram}
                    onChange={(e) => setSocialInstagram(e.target.value)}
                    placeholder="https://instagram.com/blackpanther"
                    className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>

              </div>

              {/* Real-time Link Widget preview */}
              <div className="mt-3 p-3 bg-muted/30 rounded border border-border/60 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-mono">Real-time Public Integration Footer Mockup:</span>
                <div className="flex gap-2">
                  {socialTwitter && (
                    <a href={socialTwitter} target="_blank" rel="noreferrer" title="Twitter" className="p-1.5 bg-background rounded-full border border-border hover:border-primary text-foreground transition-all">
                      <Twitter className="w-3 h-3 text-muted-foreground hover:text-[#1DA1F2]" />
                    </a>
                  )}
                  {socialLinkedin && (
                    <a href={socialLinkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="p-1.5 bg-background rounded-full border border-border hover:border-primary text-foreground transition-all">
                      <Linkedin className="w-3 h-3 text-muted-foreground hover:text-[#0A66C2]" />
                    </a>
                  )}
                  {socialFacebook && (
                    <a href={socialFacebook} target="_blank" rel="noreferrer" title="Facebook" className="p-1.5 bg-background rounded-full border border-border hover:border-primary text-foreground transition-all">
                      <Facebook className="w-3 h-3 text-muted-foreground hover:text-[#1877F2]" />
                    </a>
                  )}
                  {socialInstagram && (
                    <a href={socialInstagram} target="_blank" rel="noreferrer" title="Instagram" className="p-1.5 bg-background rounded-full border border-border hover:border-primary text-foreground transition-all">
                      <Instagram className="w-3 h-3 text-muted-foreground hover:text-[#E1306C]" />
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* SAVE BUTTON SUMMARY FOOTER SECTION */}
            <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
              {saveSuccess ? (
                <span className="text-success flex items-center gap-1.5 font-semibold text-xs animate-fade-in bg-success/10 border border-success/20 px-3 py-1.5 rounded-md">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  Internal Brand Profile & Social Media Synced Successfully!
                </span>
              ) : (
                <span className="text-muted-foreground text-[11px] font-mono leading-relaxed">* Recomputes application title overlays & branding instantly.</span>
              )}
              
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded hover:opacity-95 shadow-sm active:scale-95 transition-all text-xs cursor-pointer text-center"
              >
                Commit Changes
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* Right panel: Password & Hardware Governors (width 4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">

        {/* Change Admin Password Option Panel */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-5">
          <div className="border-b border-border/60 pb-3">
            <h2 className="text-base font-bold font-headings text-foreground flex items-center gap-2">
              <KeyRound className="w-4.5 h-4.5 text-primary" />
              <span>Modify Root Key / Password</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Maintain defensive infrastructure access control vectors.</p>
          </div>

          <form onSubmit={handlePasswordChangeSubmit} className="flex flex-col gap-3.5 text-xs text-foreground">
            
            {/* CURRENT PASSWORD */}
            <div>
              <label className="block font-semibold font-mono uppercase tracking-wider text-muted-foreground mb-1">Current Password Key</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary text-foreground font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label className="block font-semibold font-mono uppercase tracking-wider text-muted-foreground mb-1">New Root Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary text-foreground font-mono text-xs"
              />
              
              {/* password meter strength display */}
              {newPassword && (
                <div className="mt-1.5 p-1.5 bg-muted/40 rounded border border-border/60">
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                    <span className="text-muted-foreground uppercase">Password strength safety:</span>
                    <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1 overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-350`} style={{ width: `${strength.pct}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* CONFIRM NEW PASSWORD */}
            <div>
              <label className="block font-semibold font-mono uppercase tracking-wider text-muted-foreground mb-1">Verify New Password Key</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Re-type new cell key"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:border-primary text-foreground font-mono text-xs"
              />
              
              {newPassword && confirmPassword && (
                <div className="mt-1 text-[10px] font-mono">
                  {newPassword === confirmPassword ? (
                    <span className="text-success flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> Keys synchronized correctly.
                    </span>
                  ) : (
                    <span className="text-danger flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3 h-3" /> Warning: Keys mismatch.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Verification Result Feedback */}
            {passwordFeedback.text && (
              <div className={`p-2.5 rounded text-xs border font-medium ${
                passwordFeedback.type === 'success' 
                  ? 'bg-success/10 border-success/20 text-success' 
                  : 'bg-danger/10 border-danger/20 text-danger'
              }`}>
                {passwordFeedback.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-1.5 py-2.5 bg-foreground text-background font-bold rounded hover:opacity-95 transition-all text-xs cursor-pointer text-center font-sans"
            >
              Update Password Key
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
