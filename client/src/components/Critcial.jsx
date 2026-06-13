import React, { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

export default function ServiceDetailSection({ service }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const highlights = Array.isArray(service?.keyHighlights) ? service.keyHighlights : [];
  const services = Array.isArray(service?.services) ? service.services : [];

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
      gap: isMobile ? '30px' : '40px',
      width: '100%'
    },
    contentSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
      gap: isMobile ? '20px' : '30px'
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
      color: '#F06123',
      fontSize: isMobile ? '17px' : '19px',
      fontWeight: '700',
      margin: '0'
    },
    highlightsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '16px' : '28px',
      width: '100%'
    },
    highlightRow: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '16px' : '28px'
    },
    highlightItem: {
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #FFF4F0, #ffffff)',
      padding: isMobile ? '12px 16px' : '14px 20px',
      borderRadius: isMobile ? '8px' : '10px',
      borderLeft: '4px solid #F06123',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      flex: '1',
      minWidth: isMobile ? 'auto' : '300px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    highlightItemOrange: {
      borderLeft: '4px solid #FF8803'
    },
    highlightDot: {
      width: isMobile ? '7px' : '8px',
      height: isMobile ? '7px' : '8px',
      borderRadius: '50%',
      backgroundColor: '#F06123',
      marginRight: isMobile ? '10px' : '12px',
      flexShrink: '0'
    },
    highlightText: {
      color: '#374151',
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '500',
      flex: '1',
      lineHeight: '1.5'
    },
    image: {
      width: '100%',
      height: 'auto',
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
    serviceItemInactive: {
      backgroundColor: 'transparent',
      border: '1px solid transparent'
    },
    serviceIcon: {
      width: '20px',
      height: '20px',
      borderRadius: '10px',
      objectFit: 'fill'
    },
    serviceText: {
      fontSize: isMobile ? '15px' : '16px',
      flex: '1',
      color: '#000000'
    },
    serviceTextInactive: {
      color: '#000000'
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
      margin: '0'
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
      transition: 'all 0.3s ease'
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
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
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
      margin: '0'
    }
  };

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const rightColumnVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const highlightVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.3 + (i * 0.1),
        ease: "easeOut"
      }
    })
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2 + (i * 0.15),
        ease: "easeOut"
      }
    })
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
            <h2 style={styles.title}>{service?.title || ''}</h2>
            <motion.div 
              style={styles.accentBar}
              initial={{ width: 0 }}
              animate={isInView ? { width: '77px' } : { width: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            ></motion.div>
          </div>

          {/* Description */}
          <motion.p 
            style={styles.description}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: isMobile ? 0.4 : 0.6, delay: isMobile ? 0 : 0.4 }}
          >
            {service?.criticalPowerDescription || ''}
          </motion.p>

          {highlights.length > 0 ? (
            <motion.h3 
              style={styles.keyHighlightsTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: isMobile ? 0.4 : 0.6, delay: isMobile ? 0 : 0.5 }}
            >
              Key Highlights
            </motion.h3>
          ) : null}
        </div>

        {/* Highlights Grid */}
        {highlights.length > 0 ? (
          <div style={styles.highlightsGrid}>
            {highlights.map((highlight, index) => (
              <motion.div
                key={`${highlight}-${index}`}
                style={styles.highlightItem}
                custom={index}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={isMobile ? mobileVariants : highlightVariants}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 8px 20px rgba(240, 97, 35, 0.25)',
                  transition: { duration: 0.3 }
                }}
              >
                <div style={styles.highlightDot}></div>
                <span style={styles.highlightText}>{highlight}</span>
              </motion.div>
            ))}
          </div>
        ) : null}

        {/* Image */}
        {service?.imageUrl ? (
          <motion.img
            src={service.imageUrl}
            alt={service.title || 'Service image'}
            style={styles.image}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={isMobile ? mobileVariants : imageVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
              transition: { duration: 0.3 }
            }}
          />
        ) : null}
      </motion.div>

      {/* Right Column */}
      <motion.div 
        style={styles.rightColumn}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={isMobile ? mobileVariants : rightColumnVariants}
      >
        {/* Services Card */}
        <motion.div 
          style={styles.servicesCard}
          custom={0}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={isMobile ? mobileVariants : cardVariants}
          whileHover={{
            y: -5,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
            transition: { duration: 0.3 }
          }}
        >
          <div style={styles.servicesHeader}>
            <h3 style={styles.servicesHeaderText}>Our Services</h3>
          </div>
          <div style={styles.servicesList}>
            {services.map((service, index) => (
              <Link
                key={index}
                to={`/service/${service.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  style={service.active ? {...styles.serviceItem, ...styles.serviceItemActive} : styles.serviceItem}
                  whileHover={!service.active ? {
                    backgroundColor: '#f9fafb',
                    x: 5,
                    transition: { duration: 0.2 }
                  } : { x: 5, transition: { duration: 0.2 } }}
                >
                  <div style={styles.serviceIcon}></div>
                  <span style={service.active ? {...styles.serviceText, ...styles.serviceTextActive} : styles.serviceText}>
                    {service.name}
                  </span>
                  <ChevronRight size={16} color={service.active ? '#F06123' : '#9ca3af'} />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Emergency Card */}
        {service?.emergencyTitle || service?.emergencyDescription ? (
          <motion.div 
            style={styles.emergencyCard}
            custom={1}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={isMobile ? mobileVariants : cardVariants}
            whileHover={{
              y: -5,
              boxShadow: '0 12px 24px rgba(240, 97, 35, 0.2)',
              transition: { duration: 0.3 }
            }}
          >
            <h4 style={styles.emergencyTitle}>{service.emergencyTitle}</h4>
            <p style={styles.emergencyText}>{service.emergencyDescription}</p>
            <motion.button 
              style={styles.emergencyButton}
              whileHover={{
                backgroundColor: '#E55113',
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              Emergency Service
            </motion.button>
          </motion.div>
        ) : null}

        {/* Certification Card */}
        {service?.certificationTitle || service?.certificationDescription ? (
          <motion.div 
            style={styles.certificationCard}
            custom={2}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={isMobile ? mobileVariants : cardVariants}
            whileHover={{
              y: -5,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
              transition: { duration: 0.3 }
            }}
          >
            <motion.div 
              style={styles.certIcon}
              whileHover={{
                rotate: 360,
                scale: 1.1,
                transition: { duration: 0.6 }
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </motion.div>
            <h4 style={styles.certTitle}>{service.certificationTitle}</h4>
            <p style={styles.certText}>{service.certificationDescription}</p>
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  );
}
