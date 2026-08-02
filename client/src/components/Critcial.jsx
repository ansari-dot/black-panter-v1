import React, { useRef } from 'react';
import { ChevronRight, PhoneCall, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useServiceCatalog } from '../hooks/useServiceCatalog';

export default function ServiceDetailSection({ service }) {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const { services: catalogServices } = useServiceCatalog();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Highlights list with robust fallback
  const rawHighlights = Array.isArray(service?.keyHighlights) && service.keyHighlights.length > 0
    ? service.keyHighlights
    : [
        "Full ISO 17025 Lab Testing Capabilities",
        "NERC PRC-005-6 Compliance Documentation",
        "Nationwide 24/7 Field Support Response",
        "Ecologically Responsible Recycling Program",
        "NERC PRC-005-6 Compliance Documentation"
      ];

  // Services list for right sidebar card
  const rawSidebarServices = Array.isArray(service?.services) && service.services.length > 0
    ? service.services
    : catalogServices && catalogServices.length > 0
      ? catalogServices.map(s => ({
          name: s.name || s.title,
          slug: s.slug,
          active: s.slug === service?.slug,
        }))
      : [
          { name: "Ni-Cd & Block Nickel Maintenance", slug: "ni-cd-maintenance", active: true },
          { name: "Preventive Maintenance Programs", slug: "preventive-maintenance", active: false },
          { name: "Battery Recycling & Disposal", slug: "battery-recycling", active: false },
          { name: "UPS Battery Bank Support", slug: "ups-battery-support", active: false },
          { name: "Emergency Response Services", slug: "emergency-response", active: false },
        ];

  const styles = {
    container: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: '100%',
      marginBottom: isMobile ? '50px' : '80px',
      gap: isMobile ? '30px' : '40px',
      padding: isMobile ? '40px 15px' : '60px 40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1400px',
      margin: isMobile ? '0 auto 50px' : '0 auto 80px'
    },
    leftColumn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      flex: '1',
      maxWidth: isMobile ? '100%' : '900px',
      gap: isMobile ? '24px' : '32px',
      width: '100%'
    },
    contentSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
      gap: isMobile ? '16px' : '24px'
    },
    titleWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '14px' : '19px'
    },
    title: {
      color: '#383A3C',
      fontSize: isMobile ? '28px' : '38px',
      fontWeight: '700',
      margin: '0',
      lineHeight: '1.2'
    },
    accentBar: {
      background: 'linear-gradient(to right, #F06123, #FF8803)',
      width: '77px',
      height: isMobile ? '6px' : '8px',
      borderRadius: '5px'
    },
    description: {
      color: '#6b7280',
      fontSize: isMobile ? '16px' : '19px',
      lineHeight: '1.6',
      margin: '0',
      maxWidth: '759px',
      whiteSpace: 'pre-line'
    },
    keyHighlightsTitle: {
      color: '#2D3748',
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '700',
      margin: '8px 0 0 0'
    },
    highlightsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: isMobile ? '14px' : '18px',
      width: '100%'
    },
    highlightItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#ffffff',
      padding: isMobile ? '14px 20px' : '16px 24px',
      borderRadius: '10px',
      border: '1px solid #edf2f7',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    highlightText: {
      color: '#4A5568',
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '500',
      textAlign: 'left',
      lineHeight: '1.4'
    },
    image: {
      width: '100%',
      height: 'auto',
      maxHeight: '480px',
      objectFit: 'cover',
      borderRadius: isMobile ? '12px' : '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.4s ease'
    },
    rightColumn: {
      display: 'flex',
      flexDirection: 'column',
      width: isMobile ? '100%' : '340px',
      gap: isMobile ? '20px' : '24px',
      flexShrink: 0
    },
    servicesCard: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: isMobile ? '12px' : '16px',
      border: '1px solid #E1E8F0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    servicesHeader: {
      background: 'linear-gradient(to right, #F06123, #FF8803)',
      padding: isMobile ? '14px 20px' : '16px 24px'
    },
    servicesHeaderText: {
      color: '#ffffff',
      fontSize: isMobile ? '17px' : '18px',
      fontWeight: '600',
      margin: '0'
    },
    servicesList: {
      padding: '8px'
    },
    serviceItem: {
      display: 'flex',
      alignItems: 'center',
      padding: isMobile ? '12px 14px' : '13px 17px',
      gap: isMobile ? '10px' : '12px',
      borderRadius: isMobile ? '8px' : '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    serviceItemActive: {
      backgroundColor: '#FFF4F0',
      border: '1px solid #F06123'
    },
    serviceText: {
      fontSize: isMobile ? '15px' : '16px',
      flex: '1',
      color: '#000000',
      fontWeight: '500'
    },
    emergencyCard: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: '#FFF5F0',
      padding: isMobile ? '24px 20px' : '28px 26px',
      gap: isMobile ? '12px' : '14px',
      borderRadius: isMobile ? '12px' : '16px',
      border: '2px solid #F06123',
      boxShadow: '0 4px 12px rgba(240, 97, 35, 0.1)',
      transition: 'all 0.3s ease'
    },
    emergencyTitle: {
      color: '#383A3C',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '700',
      margin: '0'
    },
    emergencyText: {
      color: '#000000',
      fontSize: isMobile ? '15px' : '16px',
      margin: '0',
      lineHeight: '1.5'
    },
    emergencyButton: {
      backgroundColor: '#F06123',
      color: '#ffffff',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '500',
      padding: isMobile ? '12px' : '11px',
      borderRadius: isMobile ? '10px' : '14px',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'center',
      boxShadow: '0px 4px 6px rgba(240, 97, 35, 0.25)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    certificationCard: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#ffffff',
      padding: isMobile ? '24px 20px' : '28px',
      borderRadius: isMobile ? '12px' : '16px',
      border: '1px solid #E1E8F0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease'
    },
    certIcon: {
      width: isMobile ? '44px' : '48px',
      height: isMobile ? '44px' : '48px',
      backgroundColor: '#F06123',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      color: '#ffffff'
    },
    certTitle: {
      color: '#383A3C',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '700',
      margin: '0 0 8px 0'
    },
    certText: {
      color: '#000000',
      fontSize: isMobile ? '15px' : '16px',
      textAlign: 'center',
      margin: '0',
      lineHeight: '1.5'
    }
  };

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const rightColumnVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const mobileVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div style={styles.container} ref={sectionRef}>
      {/* Left Column */}
      <motion.div 
        style={styles.leftColumn}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={isMobile ? mobileVariants : leftColumnVariants}
      >
        <div style={styles.contentSection}>
          {/* Title Section */}
          <div style={styles.titleWrapper}>
            <h2 style={styles.title}>
              {service?.criticalPowerTitle || service?.title || "Powering Industry Since 2005"}
            </h2>
            <motion.div 
              style={styles.accentBar}
              initial={{ width: 0 }}
              animate={isInView ? { width: '77px' } : { width: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>

          {/* Description */}
          <motion.p 
            style={styles.description}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: isMobile ? 0.4 : 0.6, delay: isMobile ? 0 : 0.4 }}
          >
            {service?.criticalPowerDescription || service?.description || "We are a full-service industrial battery maintenance facility with 20+ years of experience specializing in preventive care, troubleshooting, and lifecycle management of high-reliability battery systems."}
          </motion.p>

          <motion.h3 
            style={styles.keyHighlightsTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: isMobile ? 0.4 : 0.6, delay: isMobile ? 0 : 0.5 }}
          >
            Key Highlights
          </motion.h3>
        </div>

        {/* Highlights Grid (Clean white pill card grid matching screenshot exactly) */}
        <div style={styles.highlightsGrid}>
          {rawHighlights.map((highlight, index) => (
            <motion.div
              key={`${highlight}-${index}`}
              style={styles.highlightItem}
              whileHover={{
                y: -2,
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                transition: { duration: 0.2 }
              }}
            >
              <span style={styles.highlightText}>{highlight}</span>
            </motion.div>
          ))}
        </div>

        {/* Hero / Detail Image */}
        {(service?.detailImageUrl || service?.imageUrl) && (
          <motion.img
            src={service.detailImageUrl || service.imageUrl}
            alt={service?.title || 'Service image'}
            style={styles.image}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
        )}
      </motion.div>

      {/* Right Column (Always renders all 3 side boxes) */}
      <motion.div 
        style={styles.rightColumn}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={isMobile ? mobileVariants : rightColumnVariants}
      >
        {/* Sidebar Box 1: Our Services */}
        <div style={styles.servicesCard}>
          <div style={styles.servicesHeader}>
            <h3 style={styles.servicesHeaderText}>Our Services</h3>
          </div>
          <div style={styles.servicesList}>
            {rawSidebarServices.map((item, index) => (
              <Link
                key={index}
                to={`/service/${item.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={item.active ? { ...styles.serviceItem, ...styles.serviceItemActive } : styles.serviceItem}
                >
                  <span style={styles.serviceText}>{item.name || item.title}</span>
                  <ChevronRight size={16} color={item.active ? '#F06123' : '#9ca3af'} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Box 2: Emergency Card (Always visible) */}
        <div style={styles.emergencyCard}>
          <h4 style={styles.emergencyTitle}>
            {service?.emergencyTitle || "24/7 Emergency Service"}
          </h4>
          <p style={styles.emergencyText}>
            {service?.emergencyDescription || "Need urgent on-site service or critical battery replacement? Our expert technical team is available 24/7."}
          </p>
          <button 
            style={styles.emergencyButton}
            onClick={() => navigate('/contact')}
          >
            <PhoneCall size={16} />
            Emergency Service
          </button>
        </div>

        {/* Sidebar Box 3: Certification Card (Always visible) */}
        <div style={styles.certificationCard}>
          <div style={styles.certIcon}>
            <ShieldCheck size={26} />
          </div>
          <h4 style={styles.certTitle}>
            {service?.certificationTitle || "Australian Standards Compliant"}
          </h4>
          <p style={styles.certText}>
            {service?.certificationDescription || "All maintenance and testing procedures adhere strictly to Australian industrial safety & reliability standards."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
