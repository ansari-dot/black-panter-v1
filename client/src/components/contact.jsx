import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ContactSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const fadeInLeft = {
    hidden: { 
      opacity: 0, 
      x: -50 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const fadeInRight = {
    hidden: { 
      opacity: 0, 
      x: 50 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  // Lighter animation for mobile
  const mobileVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    if (errors.submit) {
      setErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch(`${API}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          service: formData.service.trim(),
          subject: formData.service.trim() || 'Client inquiry',
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send message');

      setSubmitSuccess(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch {
      setErrors((prev) => ({ ...prev, submit: 'Unable to send your message right now. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const sectionStyle = {
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)',
    padding: isMobile ? '60px 15px' : '96px 40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '40px' : '60px'
  };

  const headerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: isMobile ? '28px' : '42px',
    fontWeight: '700',
    color: '#383A3C',
    margin: '0',
    letterSpacing: '-0.5px',
    lineHeight: '1.2'
  };

  const subtitleStyle = {
    fontSize: isMobile ? '16px' : '19px',
    color: '#6b6b6b',
    lineHeight: '1.7',
    margin: '0',
    maxWidth: '680px',
    padding: isMobile ? '0 10px' : '0'
  };

  const accentBarStyle = {
    width: '80px',
    height: '5px',
    background: 'linear-gradient(to right, #F06123, #FF8803)',
    borderRadius: '5px',
    margin: '10px auto 0'
  };

  const contentRowStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '30px' : '40px',
    width: '100%',
    alignItems: 'stretch'
  };

  const mapContainerStyle = {
    width: '100%',
    height: isMobile ? '350px' : '450px',
    borderRadius: isMobile ? '16px' : '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
    position: 'relative'
  };

  const mapOverlayStyle = {
    position: 'absolute',
    top: isMobile ? '15px' : '20px',
    left: isMobile ? '15px' : '20px',
    background: 'white',
    padding: isMobile ? '16px 18px' : '20px 24px',
    borderRadius: isMobile ? '10px' : '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    maxWidth: isMobile ? '250px' : '300px'
  };

  const mapTitleStyle = {
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: '700',
    color: '#383A3C',
    margin: '0 0 8px 0',
    fontFamily: 'Poppins, sans-serif'
  };

  const mapAddressStyle = {
    fontSize: isMobile ? '13px' : '14px',
    color: '#6b6b6b',
    margin: '0',
    lineHeight: '1.6',
    fontFamily: 'Inter, sans-serif'
  };

  const contactDetailsStyle = {
    backgroundColor: 'white',
    flex: '1',
    padding: isMobile ? '30px 20px' : '40px',
    borderRadius: isMobile ? '16px' : '20px',
    boxSizing: 'border-box',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
    transition: 'all 0.3s ease'
  };

  const contactFormStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    flex: '1',
    padding: isMobile ? '30px 20px' : '40px',
    gap: isMobile ? '20px' : '24px',
    borderRadius: isMobile ? '16px' : '20px',
    border: '1px solid #f3f4f6',
    boxSizing: 'border-box',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease'
  };

  const sectionTitleStyle = {
    color: '#383A3C',
    fontSize: isMobile ? '22px' : '28px',
    fontWeight: '700',
    fontFamily: 'Poppins, sans-serif',
    margin: isMobile ? '0 0 20px 0' : '0 0 30px 0'
  };

  const contactItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: isMobile ? '12px' : '16px',
    width: '100%',
    marginBottom: isMobile ? '16px' : '28px',
    padding: isMobile ? '16px' : '20px',
    borderRadius: isMobile ? '10px' : '12px',
    backgroundColor: '#f9fafb',
    transition: 'all 0.3s ease'
  };

  const iconWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isMobile ? '44px' : '48px',
    height: isMobile ? '44px' : '48px',
    borderRadius: isMobile ? '10px' : '12px',
    background: 'linear-gradient(135deg, rgba(255, 136, 3, 0.15), rgba(240, 97, 35, 0.15))',
    flexShrink: 0
  };

  const labelStyle = {
    color: '#383A3C',
    fontSize: isMobile ? '15px' : '16px',
    fontWeight: '700',
    fontFamily: 'Inter, sans-serif',
    marginBottom: '6px'
  };

  const valueStyle = {
    color: '#6b6b6b',
    fontSize: isMobile ? '14px' : '15px',
    fontFamily: 'Inter, sans-serif',
    lineHeight: '1.6'
  };

  const orangeValueStyle = {
    color: '#F06123',
    fontSize: isMobile ? '14px' : '15px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
    lineHeight: '1.6'
  };

  const inputLabelStyle = {
    color: '#383A3C',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '600',
    fontFamily: 'Inter, sans-serif',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    color: '#383A3C',
    backgroundColor: '#f9fafb',
    fontSize: isMobile ? '14px' : '15px',
    padding: isMobile ? '12px 14px' : '14px 16px',
    borderRadius: isMobile ? '8px' : '10px',
    border: '1px solid #e5e7eb',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease'
  };

  const inputErrorStyle = {
    ...inputStyle,
    border: '1px solid #ef4444'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '150px',
    resize: 'vertical'
  };

  const errorTextStyle = {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '4px',
    fontFamily: 'Inter, sans-serif'
  };

  const submitButtonStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    background: 'linear-gradient(135deg, #F06123, #FF8803)',
    padding: isMobile ? '14px' : '16px',
    gap: '10px',
    borderRadius: isMobile ? '10px' : '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0px 8px 20px rgba(240, 97, 35, 0.25)',
    border: 'none',
    fontWeight: '600',
    fontSize: isMobile ? '15px' : '16px'
  };

  const submitButtonDisabledStyle = {
    ...submitButtonStyle,
    opacity: 0.5,
    cursor: 'not-allowed'
  };

  const successMessageStyle = {
    backgroundColor: '#d1fae5',
    border: '1px solid #6ee7b7',
    color: '#065f46',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontFamily: 'Inter, sans-serif'
  };

  // Responsive styles
  const mediaQueryStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
    
    .content-row {
      flex-direction: row;
    }
    
    @media (max-width: 1024px) {
      .content-row {
        flex-direction: column;
        gap: 32px !important;
      }
    }
    
    .submit-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #E55113, #F06123);
      transform: translateY(-2px);
      box-shadow: 0px 12px 24px rgba(240, 97, 35, 0.35);
    }
    
    input:focus, textarea:focus, select:focus {
      border-color: #F06123;
      background-color: #ffffff;
      box-shadow: 0 0 0 3px rgba(240, 97, 35, 0.1);
    }
    
    input::placeholder, textarea::placeholder {
      color: #9ca3af;
    }
    
    .contact-item:hover {
      background-color: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateX(5px);
    }
    
    .contact-details-box:hover, .contact-form-box:hover {
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12) !important;
      transform: translateY(-5px);
    }
  `;

  return (
    <>
      <style>{mediaQueryStyles}</style>
      
      <motion.section 
        style={sectionStyle}
        ref={sectionRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div style={containerStyle}>
          {/* Header Section */}
          <motion.div 
            style={headerStyle}
            variants={fadeInLeft}
          >
            <h2 style={titleStyle}>Get In Touch</h2>
          <motion.div 
            style={accentBarStyle}
            initial={{ width: 0 }}
            animate={isInView ? { width: '80px' } : { width: 0 }}
            transition={{ duration: isMobile ? 0.4 : 0.7, delay: isMobile ? 0 : 0.3 }}
          />
            <p style={subtitleStyle}>
              Have questions or need assistance? Our team is ready to help you with your battery maintenance needs.
            </p>
          </motion.div>

          {/* Content Row - Form and Contact Details Side by Side */}
          <div className="content-row" style={contentRowStyle}>
            {/* Contact Details */}
            <motion.div 
              className="contact-details-box"
              style={contactDetailsStyle}
              variants={isMobile ? mobileVariants : fadeInLeft}
            >
              <h3 style={sectionTitleStyle}>
                Contact Details
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {/* Headquarters */}
                <div className="contact-item" style={contactItemStyle}>
                  <div style={iconWrapperStyle}>
                    <MapPin size={isMobile ? 22 : 24} color="#F06123" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={labelStyle}>Headquarters – Australia</div>
                    <div style={valueStyle}>6/31 Gov Macquarie Dr</div>
                  </div>
                </div>

                {/* Phone */}
                <div className="contact-item" style={contactItemStyle}>
                  <div style={iconWrapperStyle}>
                    <Phone size={isMobile ? 22 : 24} color="#F06123" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={labelStyle}>Phone</div>
                    <div style={orangeValueStyle}>+61 402 277 723</div>
                  </div>
                </div>

                {/* Email */}
                <div className="contact-item" style={contactItemStyle}>
                  <div style={iconWrapperStyle}>
                    <Mail size={isMobile ? 22 : 24} color="#F06123" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={labelStyle}>Email</div>
                    <div style={orangeValueStyle}>info@blackpanther-batteris.com</div>
                  </div>
                </div>

                {/* Hours */}
                <div className="contact-item" style={contactItemStyle}>
                  <div style={iconWrapperStyle}>
                    <Clock size={isMobile ? 22 : 24} color="#F06123" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={labelStyle}>Hours</div>
                    <div style={valueStyle}>Mon–Fri: 8 AM – 6 PM</div>
                    <div style={orangeValueStyle}>Emergency Service: 24/7</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              className="contact-form-box"
              style={contactFormStyle}
              variants={isMobile ? mobileVariants : fadeInRight}
            >
              <h3 style={sectionTitleStyle}>
                Send Us A Message
              </h3>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '24px' }}>
            {/* Name */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={inputLabelStyle}>Name *</label>
              <input
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={errors.name ? inputErrorStyle : inputStyle}
              />
              {errors.name && <span style={errorTextStyle}>{errors.name}</span>}
            </div>

            {/* Company */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={inputLabelStyle}>Company</label>
              <input
                type="text"
                placeholder="Your company name"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={inputLabelStyle}>Email *</label>
              <input
                type="email"
                placeholder="your.email@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={errors.email ? inputErrorStyle : inputStyle}
              />
              {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={inputLabelStyle}>Phone</label>
              <input
                type="tel"
                placeholder="000-000-0000"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Service */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={inputLabelStyle}>Service Needed *</label>
              <select
                value={formData.service}
                onChange={(e) => handleInputChange('service', e.target.value)}
                style={errors.service ? inputErrorStyle : inputStyle}
              >
                <option value="">Select a service...</option>
                <option value="Battery Testing">Battery Testing</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Reconditioning">Reconditioning</option>
                <option value="Emergency Service">Emergency Service</option>
                <option value="Consultation">Consultation</option>
                <option value="Field Services">Field Services</option>
              </select>
              {errors.service && <span style={errorTextStyle}>{errors.service}</span>}
            </div>

            {/* Message */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={inputLabelStyle}>Message *</label>
              <textarea
                placeholder="Tell us about your needs..."
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                style={errors.message ? { ...textareaStyle, border: '1px solid #ef4444' } : textareaStyle}
              />
              {errors.message && <span style={errorTextStyle}>{errors.message}</span>}
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <div style={successMessageStyle}>
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
            {errors.submit && (
              <div style={{ ...successMessageStyle, backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
                {errors.submit}
              </div>
            )}

              {/* Submit Button */}
              <motion.button
                className="submit-button"
                style={isSubmitting ? submitButtonDisabledStyle : submitButtonStyle}
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ color: 'white', fontFamily: 'Poppins, sans-serif' }}>
                  {isSubmitting ? 'Submitting...' : 'Send Message'}
                </span>
              </motion.button>
            </div>
          </motion.div>
          </div>

          {/* Map Section - Second Row */}
          <motion.div
            style={mapContainerStyle}
            initial={{ opacity: 0, y: isMobile ? 20 : 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 20 : 50 }}
            transition={{ duration: isMobile ? 0.4 : 0.7, delay: isMobile ? 0 : 0.4 }}
          >
            {/* Map Overlay Info Card */}
            <motion.div 
              style={mapOverlayStyle}
              initial={{ opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 20 : 0 }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 20 : 0 }}
              transition={{ duration: isMobile ? 0.4 : 0.6, delay: isMobile ? 0 : 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)' }}
            >
              <h4 style={mapTitleStyle}>Our Location</h4>
              <p style={mapAddressStyle}>
                6/31 Gov Macquarie Dr<br />
                NSW 2170<br />
                Australia
              </p>
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                <span style={{ ...orangeValueStyle, fontSize: '13px' }}>📍 Get Directions</span>
              </div>
            </motion.div>

            {/* Google Map Embedded */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7330344749!2d150.96109891521448!3d-33.92502038062986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12be190b9e633f%3A0xfb2bea702ec90128!2s6%2F31+Gov+Macquarie+Dr!5e0!3m2!1sen!2sau!4v1234567890123!5m2!1sen!2sau"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Company Location Map"
            ></iframe>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};

export default ContactSection;
