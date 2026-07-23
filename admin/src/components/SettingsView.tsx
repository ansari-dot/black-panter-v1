/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, FormEvent, DragEvent, ChangeEvent } from 'react';
import { 
  Sliders, 
  Building2, 
  Upload, 
  Trash2, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Server, 
  Database, 
  HardDrive, 
  Download, 
  RefreshCw, 
  Lock,
} from 'lucide-react';
import { TSystemStatus } from '../types';

interface SettingsViewProps {
  systemStatus: TSystemStatus;
  onUpdateStatusValue: (serviceKey: 'apiServer' | 'database' | 'cdn', state: 'Operational' | 'Degraded' | 'Offline') => void;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e2e2',
  borderRadius: 8,
  padding: 24,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: '#1a1a1a',
  marginBottom: 4,
};

const subTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#8a8a8a',
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#8a8a8a',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 6,
  display: 'block',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 6,
  border: '1px solid #e2e2e2',
  fontSize: 13,
  color: '#1a1a1a',
  backgroundColor: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
};

const primaryBtnStyle: React.CSSProperties = {
  backgroundColor: '#e84b10',
  color: '#ffffff',
  fontWeight: 600,
  fontSize: 13,
  padding: '10px 20px',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

export default function SettingsView({ systemStatus, onUpdateStatusValue }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'system'>('general');

  // Brand title and general config
  const [adminTitle, setAdminTitle] = useState(() => {
    return localStorage.getItem('bp_settings_adminTitle') || 'Black Panther Batteries';
  });
  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    return localStorage.getItem('bp_settings_maintenance') === 'true';
  });

  // Corporate Profile photo state
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('bp_settings_avatarUrl') || '';
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
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Load settings from Backend REST API on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/settings`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          if (data.adminTitle) {
            setAdminTitle(data.adminTitle);
            localStorage.setItem('bp_settings_adminTitle', data.adminTitle);
          }
          if (typeof data.maintenanceMode === 'boolean') {
            setMaintenanceMode(data.maintenanceMode);
            localStorage.setItem('bp_settings_maintenance', String(data.maintenanceMode));
          }
          if (data.avatarUrl !== undefined) {
            setAvatarUrl(data.avatarUrl);
            localStorage.setItem('bp_settings_avatarUrl', data.avatarUrl);
          }
          if (data.socialTwitter) {
            setSocialTwitter(data.socialTwitter);
            localStorage.setItem('bp_settings_twitter', data.socialTwitter);
          }
          if (data.socialLinkedin) {
            setSocialLinkedin(data.socialLinkedin);
            localStorage.setItem('bp_settings_linkedin', data.socialLinkedin);
          }
          if (data.socialFacebook) {
            setSocialFacebook(data.socialFacebook);
            localStorage.setItem('bp_settings_facebook', data.socialFacebook);
          }
          if (data.socialInstagram) {
            setSocialInstagram(data.socialInstagram);
            localStorage.setItem('bp_settings_instagram', data.socialInstagram);
          }
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('localStorageUpdate'));
        }
      } catch {
        // Fallback to localStorage if offline
      }
    };

    fetchSettings();
  }, []);

  // Save general settings via Backend REST API
  const handleSaveProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      adminTitle,
      maintenanceMode,
      avatarUrl,
      socialTwitter,
      socialLinkedin,
      socialFacebook,
      socialInstagram,
      systemStatus,
    };

    // 1. Save to local storage for immediate UI reactivity
    localStorage.setItem('bp_settings_adminTitle', adminTitle);
    localStorage.setItem('bp_settings_maintenance', String(maintenanceMode));
    localStorage.setItem('bp_settings_avatarUrl', avatarUrl);
    localStorage.setItem('bp_settings_twitter', socialTwitter);
    localStorage.setItem('bp_settings_linkedin', socialLinkedin);
    localStorage.setItem('bp_settings_facebook', socialFacebook);
    localStorage.setItem('bp_settings_instagram', socialInstagram);

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('localStorageUpdate'));

    // 2. Persist to RESTful API backend
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save settings to server');
      }

      showToast('Settings saved to database successfully!');
    } catch (err: any) {
      showToast(err.message || 'Saved locally (server update pending)');
    } finally {
      setIsSaving(false);
    }
  };

  // Drag and drop photo logic
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, SVG, or WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        const newUrl = event.target.result;
        setAvatarUrl(newUrl);
        localStorage.setItem('bp_settings_avatarUrl', newUrl);
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('localStorageUpdate'));
        showToast('Logo image uploaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Change password via Backend REST API
  const handlePasswordChangeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordFeedback({ type: 'error', text: 'Current password is required.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    setIsSaving(true);
    setPasswordFeedback({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE}/api/settings/password`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      // Also save to localStorage fallback
      localStorage.setItem('bp_settings_password', newPassword);

      setPasswordFeedback({
        type: 'success',
        text: 'Administrative password updated in database successfully!'
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err: any) {
      setPasswordFeedback({
        type: 'error',
        text: err.message || 'Error updating password'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Password strength helper
  const getPasswordStrength = () => {
    if (!newPassword) return { label: 'None', color: '#e2e2e2', pct: 0 };
    if (newPassword.length < 6) return { label: 'Weak', color: '#ef4444', pct: 30 };
    if (newPassword.length < 9) return { label: 'Good', color: '#f97316', pct: 65 };
    return { label: 'Strong', color: '#22c55e', pct: 100 };
  };

  const strength = getPasswordStrength();

  // Export settings as JSON
  const handleExportConfig = () => {
    const config = {
      adminTitle,
      maintenanceMode,
      socialTwitter,
      socialLinkedin,
      socialFacebook,
      socialInstagram,
      systemStatus,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `system-settings-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Configuration exported as JSON');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'Inter, sans-serif' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <CheckCircle2 size={16} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e2e2e2', paddingBottom: 12 }}>
        {[
          { id: 'general' as const, label: 'General & Branding', icon: Sliders },
          { id: 'security' as const, label: 'Security & Password', icon: Lock },
          { id: 'system' as const, label: 'System & Services', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : '#555555',
                backgroundColor: isActive ? '#e84b10' : '#ffffff',
                border: isActive ? '1px solid #e84b10' : '1px solid #e2e2e2',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GENERAL & BRANDING */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Organization Info & Logo */}
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>Company Branding</div>
            <div style={subTextStyle}>Update company name, logo representation, and application title</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Title Input */}
              <div>
                <label style={labelStyle}>Company Display Name</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} color="#8a8a8a" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input
                    type="text"
                    required
                    value={adminTitle}
                    onChange={(e) => setAdminTitle(e.target.value)}
                    placeholder="e.g. Black Panther Batteries"
                    style={{ ...inputStyle, paddingLeft: 38 }}
                  />
                </div>
              </div>

              {/* Logo Upload Section */}
              <div>
                <label style={labelStyle}>Company Logo</label>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, alignItems: 'center', backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, border: '1px solid #e2e2e2' }}>
                  
                  {/* Current Logo Preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e2e2', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 11, color: '#8a8a8a', fontWeight: 600 }}>DEFAULT</span>
                      )}
                    </div>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarUrl('');
                          localStorage.removeItem('bp_settings_avatarUrl');
                          window.dispatchEvent(new Event('storage'));
                          window.dispatchEvent(new Event('localStorageUpdate'));
                          showToast('Logo reset to default');
                        }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    )}
                  </div>

                  {/* Drag-and-drop upload container */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: dragOver ? '2px dashed #e84b10' : '2px dashed #cccccc',
                      backgroundColor: dragOver ? '#fff5f2' : '#ffffff',
                      borderRadius: 8,
                      padding: 20,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Upload size={20} color="#8a8a8a" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>Click or Drag & Drop logo file here</div>
                    <div style={{ fontSize: 11, color: '#8a8a8a', marginTop: 4 }}>Supports PNG, JPG, SVG, or WebP (Max 3MB)</div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </div>

                </div>
              </div>

              {/* Maintenance Mode Toggle */}
              <div style={{ padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, border: '1px solid #e2e2e2' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    style={{ marginTop: 3, width: 16, height: 16, accentColor: '#e84b10', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>Administrative Maintenance Mode</div>
                    <div style={{ fontSize: 12, color: '#8a8a8a', marginTop: 2 }}>
                      Enable this mode when performing scheduled updates or backend servicing.
                    </div>
                  </div>
                </label>
              </div>

            </div>
          </div>

          {/* Social Media Channels */}
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>Social Media Links</div>
            <div style={subTextStyle}>Manage official corporate social media profiles displayed across public headers & footers</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              
              <div>
                <label style={labelStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Twitter size={14} color="#1DA1F2" /> Twitter / X Handle
                  </span>
                </label>
                <input
                  type="url"
                  value={socialTwitter}
                  onChange={(e) => setSocialTwitter(e.target.value)}
                  placeholder="https://x.com/blackpanther"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Linkedin size={14} color="#0A66C2" /> LinkedIn Profile
                  </span>
                </label>
                <input
                  type="url"
                  value={socialLinkedin}
                  onChange={(e) => setSocialLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/company/blackpanther"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Facebook size={14} color="#1877F2" /> Facebook Page
                  </span>
                </label>
                <input
                  type="url"
                  value={socialFacebook}
                  onChange={(e) => setSocialFacebook(e.target.value)}
                  placeholder="https://facebook.com/blackpanther"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Instagram size={14} color="#E1306C" /> Instagram Page
                  </span>
                </label>
                <input
                  type="url"
                  value={socialInstagram}
                  onChange={(e) => setSocialInstagram(e.target.value)}
                  placeholder="https://instagram.com/blackpanther"
                  style={inputStyle}
                />
              </div>

            </div>

            {/* Social Link Preview */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e2e2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#8a8a8a', fontWeight: 500 }}>Live Link Preview:</span>
              <div style={{ display: 'flex', gap: 10 }}>
                {socialTwitter && (
                  <a href={socialTwitter} target="_blank" rel="noreferrer" title="Twitter" style={{ padding: 6, borderRadius: '50%', border: '1px solid #e2e2e2', color: '#1DA1F2', display: 'flex' }}>
                    <Twitter size={14} />
                  </a>
                )}
                {socialLinkedin && (
                  <a href={socialLinkedin} target="_blank" rel="noreferrer" title="LinkedIn" style={{ padding: 6, borderRadius: '50%', border: '1px solid #e2e2e2', color: '#0A66C2', display: 'flex' }}>
                    <Linkedin size={14} />
                  </a>
                )}
                {socialFacebook && (
                  <a href={socialFacebook} target="_blank" rel="noreferrer" title="Facebook" style={{ padding: 6, borderRadius: '50%', border: '1px solid #e2e2e2', color: '#1877F2', display: 'flex' }}>
                    <Facebook size={14} />
                  </a>
                )}
                {socialInstagram && (
                  <a href={socialInstagram} target="_blank" rel="noreferrer" title="Instagram" style={{ padding: 6, borderRadius: '50%', border: '1px solid #e2e2e2', color: '#E1306C', display: 'flex' }}>
                    <Instagram size={14} />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{ ...primaryBtnStyle, opacity: isSaving ? 0.7 : 1 }}
            >
              {isSaving ? 'Saving...' : 'Save General Settings'}
            </button>
          </div>

        </form>
      )}

      {/* TAB 2: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordChangeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>Admin Security & Credentials</div>
            <div style={subTextStyle}>Update your administrative password for admin portal access</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
              
              {/* Current Password */}
              <div>
                <label style={labelStyle}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: '#8a8a8a', cursor: 'pointer' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label style={labelStyle}>New Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputStyle}
                />
                
                {/* Strength Meter */}
                {newPassword && (
                  <div style={{ marginTop: 8, padding: 8, backgroundColor: '#f9f9f9', borderRadius: 6, border: '1px solid #e2e2e2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: '#8a8a8a' }}>Strength:</span>
                      <span style={{ fontWeight: 700, color: strength.color }}>{strength.label}</span>
                    </div>
                    <div style={{ width: '100%', height: 4, backgroundColor: '#e2e2e2', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${strength.pct}%`, height: '100%', backgroundColor: strength.color, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                />
                {newPassword && confirmPassword && (
                  <div style={{ fontSize: 12, marginTop: 6, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, color: newPassword === confirmPassword ? '#22c55e' : '#ef4444' }}>
                    {newPassword === confirmPassword ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    <span>{newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}</span>
                  </div>
                )}
              </div>

              {/* Feedback Message Banner */}
              {passwordFeedback.text && (
                <div style={{
                  padding: 12,
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: passwordFeedback.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: passwordFeedback.type === 'success' ? '#15803d' : '#b91c1c',
                  border: `1px solid ${passwordFeedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                }}>
                  {passwordFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{passwordFeedback.text}</span>
                </div>
              )}

              <div style={{ marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{ ...primaryBtnStyle, opacity: isSaving ? 0.7 : 1 }}
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>

            </div>
          </div>
        </form>
      )}

      {/* TAB 3: SYSTEM & SERVICES */}
      {activeTab === 'system' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* System Services Controls */}
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>System Services & Infrastructure</div>
            <div style={subTextStyle}>Monitor and control system component operational statuses</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {[
                { key: 'apiServer' as const, label: 'Core API Server', icon: Server, desc: 'REST API backend routes and authentication middleware' },
                { key: 'database' as const, label: 'Database Service', icon: Database, desc: 'MongoDB primary datastore & connection pool' },
                { key: 'cdn' as const, label: 'CDN & Media Storage', icon: HardDrive, desc: 'Static image assets, logos and file uploads server' },
              ].map(({ key, label, icon: Icon, desc }) => {
                const currentStatus = systemStatus[key] || 'Operational';
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 8, border: '1px solid #e2e2e2', backgroundColor: '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ padding: 10, borderRadius: 8, backgroundColor: '#f5f5f5', color: '#1a1a1a' }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{label}</div>
                        <div style={{ fontSize: 12, color: '#8a8a8a' }}>{desc}</div>
                      </div>
                    </div>

                    {/* Status switch buttons */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      {(['Operational', 'Degraded', 'Offline'] as const).map((st) => {
                        const isCurrent = currentStatus === st;
                        let bg = '#f5f5f5';
                        let color = '#555555';
                        let border = '#e2e2e2';

                        if (isCurrent) {
                          if (st === 'Operational') { bg = '#dcfce7'; color = '#15803d'; border = '#86efac'; }
                          if (st === 'Degraded') { bg = '#fef3c7'; color = '#b45309'; border = '#fde68a'; }
                          if (st === 'Offline') { bg = '#fee2e2'; color = '#b91c1c'; border = '#fca5a5'; }
                        }

                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={async () => {
                              onUpdateStatusValue(key, st);
                              showToast(`${label} status set to ${st}`);

                              // Persist updated system status via REST API
                              try {
                                const newStatus = { ...systemStatus, [key]: st };
                                await fetch(`${API_BASE}/api/settings`, {
                                  method: 'PUT',
                                  credentials: 'include',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ systemStatus: newStatus }),
                                });
                              } catch {
                                // Handled gracefully
                              }
                            }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: isCurrent ? 700 : 500,
                              backgroundColor: bg,
                              color: color,
                              border: `1px solid ${border}`,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Configuration Data Utilities */}
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>Data Utilities & Export</div>
            <div style={subTextStyle}>Export configuration files or reset local cache</div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={handleExportConfig}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  borderRadius: 6,
                  border: '1px solid #e2e2e2',
                  backgroundColor: '#ffffff',
                  color: '#1a1a1a',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                <Download size={16} /> Export Settings JSON
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Clear cached local settings? Page will refresh.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  borderRadius: 6,
                  border: '1px solid #fee2e2',
                  backgroundColor: '#fff5f5',
                  color: '#ef4444',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={16} /> Clear Local Cache
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
