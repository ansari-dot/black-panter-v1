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

const ContactSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
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

  const pageWrapperStyle = { width: '100%', minHeight: '812px', position: 'relative', fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: '#ffffff' };
  const pageLayoutStyle = { minHeight: '812px', width: '100%', background: '#ffffff', color: '#141414', padding: isMobile ? '36px 14px' : '48px 40px 80px' };
  const contentShellStyle = { maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' };
  const topSectionStyle = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px minmax(0, 1fr)', gap: '24px', alignItems: 'start' };
  const bottomSectionStyle = { display: 'flex', flexDirection: 'column', gap: '18px' };
  const sectionKickerStyle = { fontSize: '12px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f97316', margin: 0 };
  const sectionSubtitleStyle = { fontSize: '15px', lineHeight: '1.7', color: '#6b6b6b', margin: 0 };
  const cardTitleStyle = { fontSize: isMobile ? '24px' : '25px', lineHeight: '1.1', letterSpacing: '-0.6px', fontWeight: '800', color: '#141414', margin: 0 };
  const cardCopyStyle = { fontSize: '14px', lineHeight: '1.7', color: '#6b6b6b', margin: 0 };
  const smallLabelStyle = { fontSize: '12px', fontWeight: '700', letterSpacing: '0.04em', color: '#6b6b6b', margin: 0 };
  const contactCardStyle = { background: '#ffffff', border: '1px solid #e8e2db', borderRadius: '12px', padding: isMobile ? '22px' : '24px', display: 'flex', flexDirection: 'column', gap: '18px' };
  const contactCardHeaderStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
  const statusPillStyle = { alignSelf: 'flex-start', padding: '7px 12px', borderRadius: '20px', background: '#fff6ef', color: '#f97316', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', border: 'none' };
  const contactListStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
  const contactItemStyle = { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '13px', background: '#fff6ef', borderRadius: '8px' };
  const contactIconBoxStyle = { width: '38px', height: '38px', borderRadius: '8px', background: '#ffffff', border: '1px solid #e8e2db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
  const contactItemTitleStyle = { fontSize: '12px', fontWeight: '700', color: '#6b6b6b', letterSpacing: '0.04em', textTransform: 'uppercase', margin: '0 0 4px 0' };
  const contactItemValueStyle = { fontSize: '16px', lineHeight: '1.35', fontWeight: '700', color: '#141414', margin: 0 };
  const contactItemMetaStyle = { fontSize: '13px', lineHeight: '1.6', color: '#6b6b6b', margin: '4px 0 0 0' };
  const noteBoxStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: '#fff6ef', borderRadius: '8px' };
  const noteIconStyle = { width: '36px', height: '36px', borderRadius: '999px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
  const noteTextStyle = { fontSize: '14px', lineHeight: '1.6', color: '#6b6b6b', margin: 0 };
  const formPanelStyle = { background: '#ffffff', border: '1px solid #e8e2db', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' };
  const formHeaderStyle = { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '620px' };
  const formRowStyle = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' };
  const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
  const formInputStyle = { width: '100%', background: '#fbf8f5', border: '1px solid #e8e2db', borderRadius: '8px', color: '#6b6b6b', fontSize: '14px', padding: '15px 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', boxSizing: 'border-box' };
  const formSelectStyle = { ...formInputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' };
  const formTextareaStyle = { ...formInputStyle, minHeight: '144px', padding: '16px', lineHeight: '1.6', resize: 'vertical' };
  const quickActionsStyle = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' };
  const actionPillStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 16px', background: '#fff6ef', border: '1px solid #e8e2db', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#141414', whiteSpace: 'nowrap', cursor: 'pointer' };
  const submitBtnStyle = { width: '100%', padding: '17px 20px', background: '#f97316', color: '#ffffff', borderRadius: '8px', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer' };
  const formFootnoteStyle = { fontSize: '12px', lineHeight: '1.5', textAlign: 'center', color: '#6b6b6b', margin: 0 };
  const mapHeaderStyle = { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' };
  const mapTitleWrapStyle = { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '760px' };
  const mapMetaStyle = { fontSize: '14px', fontWeight: '700', color: '#f97316', whiteSpace: 'nowrap' };
  const mapFrameStyle = { position: 'relative', height: isMobile ? '430px' : '380px', overflow: 'hidden', borderRadius: '12px', background: '#fff6ef', border: '1px solid #e8e2db' };
  const mapEmbedStyle = { width: '100%', height: '100%', border: 0, display: 'block' };
  const mapCardStyle = { position: 'absolute', top: isMobile ? 'auto' : '24px', left: isMobile ? '16px' : '24px', right: isMobile ? '16px' : 'auto', bottom: isMobile ? '16px' : 'auto', width: isMobile ? 'auto' : '250px', background: 'rgba(255, 255, 255, 0.96)', borderRadius: '12px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' };
  const mapCardTitleStyle = { fontSize: '16px', fontWeight: '800', color: '#141414', margin: 0 };
  const mapCardCopyStyle = { fontSize: '14px', lineHeight: '1.6', color: '#6b6b6b', margin: 0 };
  const mapButtonStyle = { alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 14px', borderRadius: '4px', background: '#f97316', color: '#ffffff', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer' };

  return (
    <>
      <div style={pageWrapperStyle}>
        <div style={pageLayoutStyle}>
          <div style={contentShellStyle}>
            <div style={topSectionStyle}>
              {/* Contact Card */}
              <motion.div style={contactCardStyle} variants={isMobile ? mobileVariants : fadeInLeft}>
                <div style={contactCardHeaderStyle}>
                  <div style={sectionKickerStyle}>Direct contact</div>
                  <div style={cardTitleStyle}>Talk to our team</div>
                  <div style={cardCopyStyle}>Simple, fast contact for battery support, service, quotes and urgent help.</div>
                  <div style={{ marginTop: '12px' }}>
                    <span style={statusPillStyle}>Online now</span>
                  </div>
                </div>

                <div style={contactListStyle}>
                  <div style={contactItemStyle}>
                    <div style={contactIconBoxStyle}><PhoneCall size={20} color="#f97316" /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={contactItemTitleStyle}>Call us</div>
                      <div style={contactItemValueStyle}>+61 402 277 723</div>
                      <div style={contactItemMetaStyle}>Best for urgent support</div>
                    </div>
                  </div>
                  <div style={contactItemStyle}>
                    <div style={contactIconBoxStyle}><Mail size={20} color="#f97316" /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={contactItemTitleStyle}>Email</div>
                      <div style={contactItemValueStyle}>info@blackpanther-batteries.com</div>
                      <div style={contactItemMetaStyle}>Quotes and service requests</div>
                    </div>
                  </div>
                  <div style={contactItemStyle}>
                    <div style={contactIconBoxStyle}><MapPin size={20} color="#f97316" /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={contactItemTitleStyle}>Workshop</div>
                      <div style={contactItemValueStyle}>6/31 Gov Macquarie Dr</div>
                      <div style={contactItemMetaStyle}>NSW 2170, Australia</div>
                    </div>
                  </div>
                  <div style={contactItemStyle}>
                    <div style={contactIconBoxStyle}><Clock3 size={20} color="#f97316" /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={contactItemTitleStyle}>Hours</div>
                      <div style={contactItemValueStyle}>Mon-Fri · 8 AM - 6 PM</div>
                      <div style={contactItemMetaStyle}>24/7 emergency support available</div>
                    </div>
                  </div>
                </div>

                <div style={noteBoxStyle}>
                  <div style={noteIconStyle}><ShieldCheck size={18} color="#f97316" /></div>
                  <p style={noteTextStyle}>Fast, clear replies for service, replacement and support.</p>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div style={formPanelStyle} variants={isMobile ? mobileVariants : fadeInRight}>
                <div style={formHeaderStyle}>
                  <div style={sectionKickerStyle}>Send a message</div>
                  <h1 style={cardTitleStyle}>Tell us what you need</h1>
                  <div style={sectionSubtitleStyle}>Keep it clear and easy. Send your details and our team will get back to you quickly.</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={formRowStyle}>
                    <div style={formGroupStyle}>
                      <label style={smallLabelStyle}>Full Name *</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        style={errors.name ? { ...formInputStyle, border: '1px solid #ef4444' } : formInputStyle}
                      />
                      {errors.name && <span style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.name}</span>}
                    </div>
                    <div style={formGroupStyle}>
                      <label style={smallLabelStyle}>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="000-000-0000"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        style={formInputStyle}
                      />
                    </div>
                  </div>

                  <div style={formRowStyle}>
                    <div style={formGroupStyle}>
                      <label style={smallLabelStyle}>Email Address *</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        style={errors.email ? { ...formInputStyle, border: '1px solid #ef4444' } : formInputStyle}
                      />
                      {errors.email && <span style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.email}</span>}
                    </div>
                    <div style={formGroupStyle}>
                      <label style={smallLabelStyle}>Service Needed</label>
                      <div style={formSelectStyle}>
                        <span style={{ color: formData.service ? '#141414' : '#6b6b6b' }}>
                          {formData.service || 'Battery service or replacement'}
                        </span>
                        <ChevronDown size={16} color="#6b6b6b" />
                      </div>
                      <select
                        value={formData.service}
                        onChange={(e) => handleInputChange('service', e.target.value)}
                        style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                      >
                        <option value="">Select a service...</option>
                        <option value="Battery Testing">Battery Testing</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Reconditioning">Reconditioning</option>
                        <option value="Emergency Service">Emergency Service</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Field Services">Field Services</option>
                      </select>
                      {errors.service && <span style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.service}</span>}
                    </div>
                  </div>

                  <div style={formGroupStyle}>
                    <label style={smallLabelStyle}>Your Message *</label>
                    <textarea
                      placeholder="Tell us what battery support you need and how soon you need help..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      style={errors.message ? { ...formTextareaStyle, border: '1px solid #ef4444' } : formTextareaStyle}
                    />
                    {errors.message && <span style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.message}</span>}
                  </div>

                  <div style={quickActionsStyle}>
                    <button type="button" style={actionPillStyle} onClick={openDirections}>
                      <Navigation size={16} color="#f97316" />
                      <span>Get directions</span>
                    </button>
                    <button type="button" style={actionPillStyle} onClick={() => handleInputChange('service', 'Consultation')}>
                      <FileText size={16} color="#f97316" />
                      <span>Request quote</span>
                    </button>
                  </div>

                  <motion.button
                    style={isSubmitting ? { ...submitBtnStyle, opacity: 0.5, cursor: 'not-allowed' } : submitBtnStyle}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send size={18} color="#ffffff" />
                    <span>{isSubmitting ? 'Submitting...' : 'Send Message'}</span>
                  </motion.button>

                  {submitSuccess && (
                    <div style={{ backgroundColor: '#d1fae5', border: '1px solid #6ee7b7', color: '#065f46', padding: '12px 16px', borderRadius: '8px', fontSize: '14px' }}>
                      Thank you for your message! We'll get back to you soon.
                    </div>
                  )}
                  {errors.submit && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', fontSize: '14px' }}>
                      {errors.submit}
                    </div>
                  )}

                  <p style={formFootnoteStyle}>We'll get back to you as soon as possible.</p>
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
