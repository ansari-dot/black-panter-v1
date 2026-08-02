import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock3,
  ShieldCheck,
  ChevronDown,
  Navigation,
  FileText,
  Send
} from 'lucide-react';
import { useContactForm } from '../hooks/useContactForm';

const systemSansFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif";

const ContactSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const { formData, errors, isSubmitting, submitSuccess, handleInputChange, handleSubmit } = useContactForm();

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const mobileVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  const openDirections = () => {
    window.open(
      'https://www.google.com/maps/search/?api=1&query=6%2F31%20Gov%20Macquarie%20Dr%2C%20Chipping%20Norton%20NSW%202170%2C%20Australia',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const pageWrapperStyle = { width: '100%', minHeight: '812px', position: 'relative', fontFamily: systemSansFont, backgroundColor: '#f4f4f5' };
  const pageLayoutStyle = { minHeight: '812px', width: '100%', background: '#f4f4f5', color: '#141414', padding: isMobile ? '36px 14px' : '48px 40px 80px' };
  const contentShellStyle = { maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' };
  const topSectionStyle = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.3fr', gap: '32px', alignItems: 'stretch' };
  const bottomSectionStyle = { display: 'flex', flexDirection: 'column', gap: '18px' };
  const sectionKickerStyle = { fontSize: '13px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F06123', margin: 0 };
  const sectionSubtitleStyle = { fontSize: '15px', lineHeight: '1.7', color: '#6b6b6b', margin: 0 };
  
  // Card Section Titles: 18px (text-lg), Bold (700), #383A3C (Dark Slate)
  const cardTitleStyle = { fontSize: '18px', lineHeight: '1.4', fontWeight: '700', color: '#383A3C', margin: 0, fontFamily: systemSansFont };
  
  const cardCopyStyle = { fontSize: '14px', lineHeight: '1.7', color: '#6b6b6b', margin: 0 };
  

  const contactListStyle = { display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '12px' };
  const contactItemStyle = { display: 'flex', alignItems: 'flex-start', gap: '16px' };
  const contactIconBoxStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' };
  
  // Contact Detail Label
  const contactItemTitleStyle = { fontSize: '15px', fontWeight: '500', color: '#383A3C', margin: '0 0 4px 0', fontFamily: systemSansFont };
  
  // Standard Values: 18px, Regular (400), #000000
  const contactItemStandardValueStyle = { fontSize: '14px', lineHeight: '1.4', fontWeight: '400', color: '#6b6b6b', margin: 0, fontFamily: systemSansFont };
  
  // Highlighted Values
  const contactItemHighlightValueStyle = { fontSize: '14px', lineHeight: '1.4', fontWeight: '400', color: '#F06123', margin: 0, fontFamily: systemSansFont };
  
  const contactItemMetaStyle = { fontSize: '13px', lineHeight: '1.6', color: '#6b6b6b', margin: '4px 0 0 0' };
  const contactCardStyle = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: isMobile ? '24px' : '32px', display: 'flex', flexDirection: 'column', gap: '20px' };
  const contactCardHeaderStyle = { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' };
  const statusPillStyle = { alignSelf: 'flex-start', padding: '6px 14px', borderRadius: '20px', background: '#fff6ef', color: '#F06123', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', border: 'none' };

  const formLabelStyle = { fontSize: '14px', fontWeight: '600', color: '#383A3C', margin: 0, fontFamily: systemSansFont };
  const formPanelStyle = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: isMobile ? '24px' : '32px', display: 'flex', flexDirection: 'column', gap: '24px' };
  const formHeaderStyle = { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' };
  const formRowStyle = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' };
  const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' };
  
  // Form Inputs & Textarea
  const formInputStyle = { width: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#383A3C', fontSize: '15px', fontWeight: '400', padding: '12px 16px', fontFamily: systemSansFont, outline: 'none', boxSizing: 'border-box' };
  const formSelectStyle = { ...formInputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' };
  const formTextareaStyle = { ...formInputStyle, minHeight: '120px', padding: '16px', lineHeight: '1.6', resize: 'vertical' };
  
  // Form Submit Button
  const submitBtnStyle = { width: '100%', padding: '16px 20px', background: '#ea580c', color: '#ffffff', borderRadius: '6px', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', fontFamily: systemSansFont };
  
  const formFootnoteStyle = { fontSize: '13px', lineHeight: '1.5', textAlign: 'center', color: '#6b6b6b', margin: 0 };
  const mapHeaderStyle = { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' };
  const mapTitleWrapStyle = { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '760px' };
  const mapMetaStyle = { fontSize: '14px', fontWeight: '700', color: '#F06123', whiteSpace: 'nowrap' };
  const mapFrameStyle = { position: 'relative', height: isMobile ? '430px' : '380px', overflow: 'hidden', borderRadius: '16px', background: '#fff6ef', border: '1px solid #e8e2db' };
  const mapEmbedStyle = { width: '100%', height: '100%', border: 0, display: 'block' };
  const mapCardStyle = { position: 'absolute', top: isMobile ? 'auto' : '24px', left: isMobile ? '16px' : '24px', right: isMobile ? '16px' : 'auto', bottom: isMobile ? '16px' : 'auto', width: isMobile ? 'auto' : '270px', background: 'rgba(255, 255, 255, 0.96)', borderRadius: '12px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' };
  const mapCardTitleStyle = { fontSize: '18px', fontWeight: '700', color: '#383A3C', margin: 0, fontFamily: systemSansFont };
  const mapCardCopyStyle = { fontSize: '18px', fontWeight: '400', lineHeight: '1.6', color: '#000000', margin: 0, fontFamily: systemSansFont };
  const mapButtonStyle = { alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '8px', background: '#F06123', color: '#ffffff', fontSize: '15px', fontWeight: '700', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', fontFamily: systemSansFont };

  return (
    <>
      <div style={pageWrapperStyle}>
        <div style={pageLayoutStyle}>
          <div style={contentShellStyle}>
            <div style={topSectionStyle}>
              {/* Contact Details Card */}
              <motion.div style={contactCardStyle} variants={isMobile ? mobileVariants : fadeInLeft}>
                <div style={contactCardHeaderStyle}>
                  <h2 style={cardTitleStyle}>Contact Details</h2>
                </div>

                <div style={contactListStyle}>
                  <div style={contactItemStyle}>
                    <div style={contactIconBoxStyle}><MapPin size={20} color="#F06123" /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={contactItemTitleStyle}>Headquarters – Australia</div>
                      <div style={contactItemMetaStyle}>6/31 Gov Macquarie Dr, NSW 2170</div>
                    </div>
                  </div>

                  <div style={contactItemStyle}>
                    <div style={contactIconBoxStyle}><PhoneCall size={20} color="#F06123" /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={contactItemTitleStyle}>Phone</div>
                      <div style={contactItemHighlightValueStyle}>+61 402 277 723</div>
                    </div>
                  </div>

                  <div style={contactItemStyle}>
                    <div style={contactIconBoxStyle}><Mail size={20} color="#F06123" /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={contactItemTitleStyle}>Email</div>
                      <div style={contactItemHighlightValueStyle}>info@blackpanther-batteries.com</div>
                    </div>
                  </div>

                  <div style={contactItemStyle}>
                    <div style={contactIconBoxStyle}><Clock3 size={20} color="#F06123" /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={contactItemTitleStyle}>Hours</div>
                      <div style={contactItemMetaStyle}>Mon–Fri: 8 AM – 6 PM</div>
                      <div style={contactItemHighlightValueStyle}>Emergency Service: 24/7</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form Card */}
              <motion.div style={formPanelStyle} variants={isMobile ? mobileVariants : fadeInRight}>
                <div style={formHeaderStyle}>
                  <h2 style={cardTitleStyle}>Send Us a Message</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={formGroupStyle}>
                    <label style={formLabelStyle}>Name *</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      style={errors.name ? { ...formInputStyle, border: '1px solid #EF4444' } : formInputStyle}
                    />
                    {errors.name && <span style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px', fontWeight: '400' }}>{errors.name}</span>}
                  </div>
                  
                  <div style={formGroupStyle}>
                    <label style={formLabelStyle}>Company</label>
                    <input
                      type="text"
                      placeholder="Your company name"
                      value={formData.company || ''}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      style={formInputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={formLabelStyle}>Email *</label>
                    <input
                      type="email"
                      placeholder="your.email@company.com"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={errors.email ? { ...formInputStyle, border: '1px solid #EF4444' } : formInputStyle}
                    />
                    {errors.email && <span style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px', fontWeight: '400' }}>{errors.email}</span>}
                  </div>
                  
                  <div style={formGroupStyle}>
                    <label style={formLabelStyle}>Phone</label>
                    <input
                      type="tel"
                      placeholder="000-000-0000"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      style={formInputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={formLabelStyle}>Service Needed *</label>
                    <div style={formSelectStyle}>
                      <span style={{ color: formData.service ? '#383A3C' : '#B8B8B8' }}>
                        {formData.service || ''}
                      </span>
                      <ChevronDown size={18} color="#6b6b6b" />
                    </div>
                    <select
                      value={formData.service || ''}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                      style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', top: 0, left: 0 }}
                    >
                      <option value=""></option>
                      <option value="Battery Testing">Battery Testing</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Reconditioning">Reconditioning</option>
                      <option value="Emergency Service">Emergency Service</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Field Services">Field Services</option>
                    </select>
                    {errors.service && <span style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px', fontWeight: '400' }}>{errors.service}</span>}
                  </div>

                  <div style={formGroupStyle}>
                    <label style={formLabelStyle}>Message *</label>
                    <textarea
                      placeholder="Tell us about your needs..."
                      value={formData.message || ''}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      style={errors.message ? { ...formTextareaStyle, border: '1px solid #EF4444' } : formTextareaStyle}
                    />
                    {errors.message && <span style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px', fontWeight: '400' }}>{errors.message}</span>}
                  </div>

                  <motion.button
                    style={isSubmitting ? { ...submitBtnStyle, opacity: 0.5, cursor: 'not-allowed' } : submitBtnStyle}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02, backgroundColor: '#FF8803' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                    <Navigation size={18} color="#ffffff" style={{ transform: 'rotate(90deg)' }} />
                  </motion.button>

                  {submitSuccess && (
                    <div style={{ backgroundColor: '#d1fae5', border: '1px solid #6ee7b7', color: '#065f46', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontFamily: systemSansFont }}>
                      Thank you for your message! We'll get back to you soon.
                    </div>
                  )}
                  {errors.submit && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#EF4444', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontFamily: systemSansFont }}>
                      {errors.submit}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Map Section */}
            <div style={bottomSectionStyle}>
              <div style={mapHeaderStyle}>
                <div style={mapTitleWrapStyle}>
                  <div style={sectionKickerStyle}>Visit our workshop</div>
                  <h2 style={cardTitleStyle}>Come by our location in Chipping Norton.</h2>
                  <div style={sectionSubtitleStyle}>Perfect if you want direct support, inspection, or a quick conversation with the team before booking service.</div>
                </div>
                <div style={mapMetaStyle}>Open weekdays · Emergency 24/7</div>
              </div>

              <div style={mapFrameStyle}>
                <iframe
                  title="Black Panther Batteries location map"
                  src="https://www.google.com/maps?q=6%2F31%20Gov%20Macquarie%20Dr%2C%20Chipping%20Norton%20NSW%202170%2C%20Australia&output=embed"
                  style={mapEmbedStyle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div style={mapCardStyle}>
                  <div style={mapCardTitleStyle}>Our Location</div>
                  <div style={mapCardCopyStyle}>6/31 Gov Macquarie Dr<br />NSW 2170, Australia</div>
                  <div style={{ marginTop: '12px' }}>
                    <button type="button" style={mapButtonStyle} onClick={openDirections}>
                      <Navigation size={14} color="#ffffff" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ContactSection;
