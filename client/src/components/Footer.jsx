import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import logo from '../assets/logo.webp';
import { useServiceCatalog } from '../hooks/useServiceCatalog';

const Footer = () => {
  const { activeServices } = useServiceCatalog();
  const footerServices = activeServices.slice(0, 5);

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  // Styles
  const footerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#4a4a4a',
    boxSizing: 'border-box'
  };

  const mainContentStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '60px 80px',
    gap: '60px',
    boxSizing: 'border-box'
  };

  const brandSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '32px',
    flex: '0 0 auto',
    minWidth: '280px'
  };

  const logoContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px'
  };

  const logoStyle = {
    width: '160px',
    height: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  };

  const logoImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  };

  const companyNameStyle = {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: 'Poppins, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    lineHeight: '1.2',
    margin: 0
  };

  const descriptionStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    lineHeight: '1.6',
    maxWidth: '280px',
    fontFamily: 'Inter, sans-serif',
    margin: 0
  };

  const socialContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const socialLinkStyle = {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#F06123',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    textDecoration: 'none',
    border: 'none'
  };

  const socialIconStyle = {
    width: '18px',
    height: '18px',
    color: 'white'
  };

  const navigationSectionStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    flex: 1,
    gap: '80px'
  };

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '20px'
  };

  const columnTitleStyle = {
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: 'Poppins, sans-serif',
    margin: '0 0 4px 0'
  };

  const linksContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const linkStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    textDecoration: 'none',
    fontFamily: 'Inter, sans-serif'
  };

  const bottomBarStyle = {
    width: '100%',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: '#3d3d3d'
  };

  const copyrightContainerStyle = {
    width: '100%',
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '24px 80px',
    boxSizing: 'border-box'
  };

  const copyrightStyle = {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '13px',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
    margin: 0
  };

  // Responsive styles
  const mediaQueryStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
    
    .footer-main-content {
      flex-direction: row;
    }
    
    .footer-navigation {
      flex-direction: row;
    }
    
    @media (max-width: 1024px) {
      .footer-main-content {
        padding: 50px 40px !important;
        gap: 40px !important;
      }
      
      .footer-navigation {
        gap: 50px !important;
      }
      
      .footer-copyright-container {
        padding: 20px 40px !important;
      }
    }
    
    @media (max-width: 768px) {
      .footer-main-content {
        flex-direction: column !important;
        padding: 40px 24px !important;
        gap: 40px !important;
      }
      
      .footer-navigation {
        flex-direction: column !important;
        width: 100% !important;
        gap: 32px !important;
      }
      
      .footer-copyright-container {
        padding: 20px 24px !important;
      }
    }
    
    @media (max-width: 480px) {
      .footer-main-content {
        padding: 32px 16px !important;
      }
      
      .footer-brand-section {
        min-width: 100% !important;
      }
      
      .footer-description {
        max-width: 100% !important;
      }
      
      .footer-copyright-container {
        padding: 16px !important;
      }
    }
    
    .footer-social-link:hover {
      transform: scale(1.1);
      background-color: #FF8803;
    }
    
    .footer-link:hover {
      color: #F06123;
      transform: translateX(4px);
    }
  `;

  return (
    <>
      <style>{mediaQueryStyles}</style>
      
      <motion.div 
        style={footerStyle}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <div className="footer-main-content" style={mainContentStyle}>
          {/* Brand Section */}
          <motion.div 
            className="footer-brand-section"
            style={brandSectionStyle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div style={logoContainerStyle}>
              {/* Company Logo */}
              <div style={logoStyle}>
                <img src={logo} alt="Company Logo" style={logoImageStyle} width="160" height="160" loading="lazy" decoding="async" />
              </div>
            </div>
            
            <p className="footer-description" style={descriptionStyle}>
              Leading industrial battery maintenance facility serving critical infrastructure nationwide.
            </p>
            
            {/* Social Media Icons */}
            <div style={socialContainerStyle}>
              <motion.a 
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                style={socialLinkStyle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Visit Black Panther Batteries on Facebook"
              >
                <FaFacebookF style={socialIconStyle} />
              </motion.a>
              <motion.a 
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                style={socialLinkStyle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Visit Black Panther Batteries on LinkedIn"
              >
                <FaLinkedinIn style={socialIconStyle} />
              </motion.a>
              <motion.a 
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                style={socialLinkStyle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Visit Black Panther Batteries on Instagram"
              >
                <FaInstagram style={socialIconStyle} />
              </motion.a>
            </div>
          </motion.div>

          {/* Footer Navigation */}
          <motion.div 
            className="footer-navigation"
            style={navigationSectionStyle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Quick Links Column */}
            <div style={columnStyle}>
              <h3 style={columnTitleStyle}>Quick Links</h3>
              <div style={linksContainerStyle}>
                <Link to="/" className="footer-link" style={linkStyle}>Home</Link>
                <Link to="/about" className="footer-link" style={linkStyle}>About Us</Link>
                <Link to="/service" className="footer-link" style={linkStyle}>Services</Link>
                <Link to="/contact" className="footer-link" style={linkStyle}>Contact</Link>
              </div>
            </div>

            {/* Services Column */}
            <div style={columnStyle}>
              <h3 style={columnTitleStyle}>Our Services</h3>
              <div style={linksContainerStyle}>
                {footerServices.map((service) => (
                  <Link
                    key={service.slug}
                    to={`/service/${service.slug}`}
                    className="footer-link"
                    style={linkStyle}
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info Column */}
            <div style={columnStyle}>
              <h3 style={columnTitleStyle}>Contact Us</h3>
              <div style={linksContainerStyle}>
                <a href="tel:+61402277723" className="footer-link" style={linkStyle}>
                  <FaPhone style={{ display: 'inline', marginRight: '8px', fontSize: '12px' }} />
                  +61 402 277 723
                </a>
                <a href="mailto:info@blackpnther-batteries.com" className="footer-link" style={linkStyle}>
                  <FaEnvelope style={{ display: 'inline', marginRight: '8px', fontSize: '12px' }} />
                  info@blackpanther-batteris.com
                </a>
                <span className="footer-link" style={{...linkStyle, cursor: 'default'}}>
                  <FaMapMarkerAlt style={{ display: 'inline', marginRight: '8px', fontSize: '12px' }} />
                  6/31 Gov Macquarie Dr, NSW 2170, Australia
                </span>
                <span className="footer-link" style={{...linkStyle, cursor: 'default'}}>
                  <FaClock style={{ display: 'inline', marginRight: '8px', fontSize: '12px' }} />
                  24/7 Emergency Service
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div style={bottomBarStyle}>
          <motion.div 
            className="footer-copyright-container"
            style={copyrightContainerStyle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p style={copyrightStyle}>
              © 2024 Black Panther Batteries. All rights reserved.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Footer;
