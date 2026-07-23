import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Send, X, User, BatteryCharging, FileText } from 'lucide-react';
import { inquiriesApi } from '../utils/api';

const PRIMARY = '#f15a22';

const initialFormData = {
  fullName: '',
  phone: '',
  email: '',
  company: '',
  serviceType: '',
  batteryType: '',
  quantity: '',
  location: '',
  address: '',
  billingAddress: '',
  abn: '',
  urgency: 'Normal',
  message: ''
};

const steps = [
  { title: 'Contact info', text: 'Name, phone, email, and company details.' },
  { title: 'Quote details', text: 'Service type, battery type, and site details.' },
  { title: 'Submit request', text: 'Review and send your formal request.' }
];

export default function QuoteModal({ isOpen, onClose, sourceButton = 'Get a Quote' }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sourcePage = window.location.pathname;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = () => {
    const nextErrors = {};

    if (step === 0) {
      if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required';
      if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required';
    }

    if (step === 1) {
      if (!formData.serviceType) nextErrors.serviceType = 'Service type is required';
      if (!formData.message.trim()) nextErrors.message = 'Message details are required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (step !== 2) {
      goNext();
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const quoteMessage = [
        formData.message.trim(),
        '',
        `ABN: ${formData.abn || 'Not provided'}`,
        `Site Address: ${formData.address || 'Not provided'}`,
        `Billing Address: ${formData.billingAddress || 'Not provided'}`,
        `Battery type: ${formData.batteryType || 'Not provided'}`,
        `Quantity: ${formData.quantity || 'Not provided'}`,
        `Location: ${formData.location || 'Not provided'}`,
        `Urgency: ${formData.urgency}`,
        `Source page: ${sourcePage}`,
        `Source button: ${sourceButton}`,
        `Submitted at: ${new Date().toISOString()}`,
        'Status: new'
      ].join('\n');

      await inquiriesApi.create({
        name: formData.fullName.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.serviceType,
        subject: `Quote request - ${formData.serviceType}`,
        message: quoteMessage,
        type: 'quote',
        quoteDetails: {
          batteryType: formData.batteryType,
          quantity: formData.quantity,
          location: formData.location || formData.address,
          address: formData.address,
          billingAddress: formData.billingAddress,
          abn: formData.abn,
          urgency: formData.urgency,
          sourcePage,
          sourceButton,
          submittedAt: new Date().toISOString()
        }
      });

      setSubmitSuccess(true);
      setFormData(initialFormData);
      setTimeout(() => {
        setSubmitSuccess(false);
        setStep(0);
        onClose();
      }, 1400);
    } catch {
      setErrors({ submit: 'Unable to send your quote request right now. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styled design tokens matching the admin panel
  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(26, 26, 26, 0.75)',
    backdropFilter: 'blur(2px)',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  };

  const modalStyle = {
    width: '100%',
    maxWidth: '840px',
    maxHeight: 'calc(100vh - 48px)',
    background: '#f5f5f5',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e2e2e2'
  };

  const cardStyle = {
    border: '1px solid #e2e2e2',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: '#ffffff'
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: 500,
    color: '#1a1a1a',
    marginBottom: '4px'
  };

  const fieldStyle = {
    width: '100%',
    border: '1px solid #e2e2e2',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const selectStyle = {
    ...fieldStyle,
    appearance: 'none',
    paddingRight: '32px'
  };

  const textareaStyle = {
    ...fieldStyle,
    minHeight: '80px',
    lineHeight: '1.6',
    resize: 'vertical'
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  };

  const sectionTitleStyle = {
    fontSize: '12px',
    fontWeight: 700,
    color: PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const renderError = (field) => errors[field] ? (
    <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '2px' }}>{errors[field]}</span>
  ) : null;

  const fieldGroup = (label, field, input, required = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: PRIMARY }}>*</span>}
      </label>
      {input}
      {renderError(field)}
    </div>
  );

  const renderStepContent = () => {
    if (step === 0) {
      return (
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <User size={15} style={{ color: PRIMARY }} strokeWidth={2.4} />
            <span style={sectionTitleStyle}>Client Details</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {fieldGroup('Full Name', 'fullName', (
              <input style={fieldStyle} value={formData.fullName} onChange={(event) => updateField('fullName', event.target.value)} placeholder="Your full name" />
            ), true)}
            {fieldGroup('Phone Number', 'phone', (
              <input style={fieldStyle} value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="000-000-0000" />
            ), true)}
            {fieldGroup('Email Address', 'email', (
              <input type="email" style={fieldStyle} value={formData.email} onChange={(event) => updateField('email', event.target.value)} placeholder="your@email.com" />
            ))}
            {fieldGroup('Company', 'company', (
              <input style={fieldStyle} value={formData.company} onChange={(event) => updateField('company', event.target.value)} placeholder="Company name" />
            ))}
            {fieldGroup('ABN (Optional)', 'abn', (
              <input style={fieldStyle} value={formData.abn} onChange={(event) => updateField('abn', event.target.value)} placeholder="Company ABN" />
            ))}
            {fieldGroup('Site Address', 'address', (
              <input style={fieldStyle} value={formData.address} onChange={(event) => updateField('address', event.target.value)} placeholder="Physical site address" />
            ))}
            <div style={{ gridColumn: 'span 2' }}>
              {fieldGroup('Billing Address', 'billingAddress', (
                <input style={fieldStyle} value={formData.billingAddress} onChange={(event) => updateField('billingAddress', event.target.value)} placeholder="Billing address (or Same as Site Address)" />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <BatteryCharging size={15} style={{ color: PRIMARY }} strokeWidth={2.4} />
            <span style={sectionTitleStyle}>Service &amp; Battery Details</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {fieldGroup('Service Type', 'serviceType', (
              <div style={{ position: 'relative' }}>
                <select style={selectStyle} value={formData.serviceType} onChange={(event) => updateField('serviceType', event.target.value)}>
                  <option value="">Select service</option>
                  <option value="Battery Testing">Battery Testing</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Reconditioning">Reconditioning</option>
                  <option value="Emergency Service">Emergency Service</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Field Services">Field Services</option>
                </select>
                <ChevronDown size={14} style={{ color: '#888', position: 'absolute', right: 12, top: 11, pointerEvents: 'none' }} strokeWidth={2.5} />
              </div>
            ), true)}
            {fieldGroup('Battery Type', 'batteryType', (
              <div style={{ position: 'relative' }}>
                <select style={selectStyle} value={formData.batteryType} onChange={(event) => updateField('batteryType', event.target.value)}>
                  <option value="">Select battery type</option>
                  <option value="Forklift">Forklift</option>
                  <option value="UPS">UPS</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={14} style={{ color: '#888', position: 'absolute', right: 12, top: 11, pointerEvents: 'none' }} strokeWidth={2.5} />
              </div>
            ))}
            {fieldGroup('Quantity', 'quantity', (
              <input style={fieldStyle} value={formData.quantity} onChange={(event) => updateField('quantity', event.target.value)} placeholder="e.g. 12 cells" />
            ))}
            {fieldGroup('Battery Room Location', 'location', (
              <input style={fieldStyle} value={formData.location} onChange={(event) => updateField('location', event.target.value)} placeholder="e.g. Battery Room 1" />
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
            <label style={labelStyle}>Urgency</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Normal', 'This week', 'Emergency'].map((urgency) => (
                <button
                  key={urgency}
                  type="button"
                  onClick={() => updateField('urgency', urgency)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '20px',
                    background: formData.urgency === urgency ? PRIMARY : '#f0f0f0',
                    color: formData.urgency === urgency ? '#ffffff' : '#1a1a1a',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {urgency}
                </button>
              ))}
            </div>
          </div>

          <div>
            {fieldGroup('Description / Messages', 'message', (
              <textarea style={textareaStyle} value={formData.message} onChange={(event) => updateField('message', event.target.value)} placeholder="Please detail your battery service requirement..." />
            ), true)}
          </div>
        </div>
      );
    }

    return (
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <FileText size={15} style={{ color: PRIMARY }} strokeWidth={2.4} />
          <span style={sectionTitleStyle}>Review Quote Request</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            ['Contact Name', formData.fullName],
            ['Phone Number', formData.phone],
            ['Email Address', formData.email || 'Not provided'],
            ['Company Name', formData.company || 'Not provided'],
            ['ABN Number', formData.abn || 'Not provided'],
            ['Site Address', formData.address || 'Not provided'],
            ['Billing Address', formData.billingAddress || 'Not provided'],
            ['Requested Service', formData.serviceType],
            ['Battery Type', formData.batteryType || 'Not provided'],
            ['Quantity', formData.quantity || 'Not provided'],
            ['Room Location', formData.location || 'Not provided'],
            ['Urgency Level', formData.urgency]
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
              <span style={{ color: '#888', fontWeight: 500 }}>{label}</span>
              <span style={{ fontWeight: 600, color: '#1a1a1a', textAlign: 'right' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div style={modalStyle}>
        
        {/* Stepper matching admin page */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px 24px', borderBottom: '1px solid #e2e2e2', backgroundColor: '#ffffff',
          flexWrap: 'wrap', gap: '16px'
        }}>
          {steps.map((item, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                    backgroundColor: done ? '#1a1a1a' : active ? PRIMARY : '#f0f0f0',
                    color: done || active ? '#ffffff' : '#888888',
                  }}>
                    {done ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </div>
                  <span style={{
                    fontSize: 13, whiteSpace: 'nowrap',
                    fontWeight: active ? 600 : 400,
                    color: done ? '#1a1a1a' : active ? PRIMARY : '#888888',
                  }}>
                    {item.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    width: 60, height: 1, margin: '0 16px', flexShrink: 0,
                    backgroundColor: done ? '#1a1a1a' : '#e2e2e2',
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Scrollable Form Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {renderStepContent()}

          {submitSuccess && (
            <div style={{ marginTop: '16px', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}>
              Quote request submitted successfully. Redirecting...
            </div>
          )}
          {errors.submit && (
            <div style={{ marginTop: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}>
              {errors.submit}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #e2e2e2', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: '11px', color: '#888', maxWidth: '300px' }}>
            Auto captured: sourcePage, sourceButton, and submittedAt details.
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              style={{
                border: '1px solid #e2e2e2', borderRadius: '6px',
                padding: '10px 20px', fontSize: '13px', fontWeight: 600,
                color: '#1a1a1a', backgroundColor: '#fff', cursor: step === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 6, opacity: step === 0 ? 0.45 : 1
              }}
            >
              <ArrowLeft size={14} /> Back
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                border: 'none', borderRadius: '6px',
                padding: '10px 20px', fontSize: '13px', fontWeight: 600,
                color: '#fff', backgroundColor: PRIMARY, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 6, opacity: isSubmitting ? 0.65 : 1
              }}
            >
              <span>{step === 2 ? (isSubmitting ? 'Sending...' : 'Submit Request') : 'Continue'}</span>
              {step === 2 ? <Send size={14} /> : <ArrowRight size={14} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
