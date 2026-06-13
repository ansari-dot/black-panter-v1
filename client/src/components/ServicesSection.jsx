import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useServiceCatalog } from '../hooks/useServiceCatalog';
import { getServiceCardIcon } from '../utils/serviceCatalog';

export default function ComprehensiveBatterySolutions() {
  const navigate = useNavigate();
  const { activeServices } = useServiceCatalog();
  const services = activeServices.map((service) => ({
    icon: getServiceCardIcon(service.iconName, service.title),
    title: service.title,
    description: service.heroDescription || service.description,
    slug: service.slug,
  }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
    initial: { y: -50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    initial: { y: 60, opacity: 0, scale: 0.9 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Lighter animation for mobile
  const mobileCardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  // Responsive breakpoint hook
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    section: {
      background: 'linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%)',
      padding: isMobile ? '60px 15px' : '96px 20px 101px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundCircle1: {
      position: 'absolute',
      top: '40px',
      right: '40px',
      width: '288px',
      height: '288px',
      backgroundColor: '#F06123',
      borderRadius: '50%',
      opacity: '0.05',
      filter: 'blur(80px)',
      pointerEvents: 'none'
    },
    backgroundCircle2: {
      position: 'absolute',
      bottom: '80px',
      left: '40px',
      width: '384px',
      height: '384px',
      backgroundColor: '#FF8803',
      borderRadius: '50%',
      opacity: '0.05',
      filter: 'blur(80px)',
      pointerEvents: 'none'
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '60px',
      position: 'relative',
      zIndex: '10'
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      textAlign: 'center'
    },
    labelWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    line: {
      height: '2px',
      width: '48px',
      background: 'linear-gradient(to right, transparent, #F06123)'
    },
    lineReverse: {
      height: '2px',
      width: '48px',
      background: 'linear-gradient(to left, transparent, #F06123)'
    },
    label: {
      color: '#F06123',
      fontSize: '14px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1.5px'
    },
    title: {
      fontSize: isMobile ? '28px' : '42px',
      fontWeight: '700',
      color: '#383A3C',
      margin: '0',
      letterSpacing: '-0.5px',
      lineHeight: '1.2'
    },
    subtitle: {
      fontSize: isMobile ? '16px' : '19px',
      color: '#6b6b6b',
      lineHeight: '1.7',
      margin: '0',
      maxWidth: '680px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? '20px' : '32px',
      width: '100%',
      padding: isMobile ? '0 10px' : '0 48px'
    },
    card: {
      backgroundColor: '#ffffff',
      padding: isMobile ? '24px' : '32px',
      borderRadius: isMobile ? '12px' : '16px',
      border: '1px solid #f3f4f6',
      minHeight: isMobile ? 'auto' : '320px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.4s ease'
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '56px' : '64px',
      height: isMobile ? '56px' : '64px',
      borderRadius: isMobile ? '10px' : '12px',
      background: 'linear-gradient(to bottom right, rgba(255, 136, 3, 0.1), rgba(240, 97, 35, 0.1))',
      marginBottom: isMobile ? '16px' : '24px',
      transition: 'all 0.3s ease',
      position: 'relative',
      zIndex: '10'
    },
    icon: {
      transition: 'all 0.3s ease',
      position: 'relative',
      zIndex: '10',
      color: '#F06123'
    },
    cardTitle: {
      fontSize: isMobile ? '18px' : '24px',
      fontWeight: '700',
      color: '#070B15',
      margin: '0 0 12px 0',
      lineHeight: '1.3',
      transition: 'color 0.3s ease',
      position: 'relative',
      zIndex: '10'
    },
    cardDescription: {
      fontSize: isMobile ? '14px' : '17px',
      color: '#6b6b6b',
      lineHeight: '1.65',
      margin: isMobile ? '0 0 16px 0' : '0 0 20px 0',
      flex: '1',
      position: 'relative',
      zIndex: '10'
    },
    learnMore: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#F06123',
      fontSize: '14px',
      fontWeight: '600',
      marginTop: 'auto',
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
      position: 'relative',
      zIndex: '10'
    },
    arrow: {
      width: '20px',
      height: '20px'
    },
    gradientOverlay: {
      position: 'absolute',
      inset: '0',
      background: 'linear-gradient(to bottom right, rgba(240, 97, 35, 0.05), transparent)',
      opacity: '0',
      transition: 'opacity 0.5s ease',
      pointerEvents: 'none'
    },
    cornerElement: {
      position: 'absolute',
      top: '0',
      right: '0',
      width: '128px',
      height: '128px',
      background: 'linear-gradient(to bottom right, rgba(255, 136, 3, 0.1), transparent)',
      borderBottomLeftRadius: '100%',
      opacity: '0',
      transform: 'scale(0) rotate(-45deg)',
      transition: 'all 0.5s ease',
      pointerEvents: 'none'
    }
  };

  return (
    <motion.section 
      style={styles.section}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Circles */}
      <motion.div 
        style={styles.backgroundCircle1}
        variants={floatingVariants}
        animate="animate"
      ></motion.div>
      <motion.div 
        style={styles.backgroundCircle2}
        variants={floatingVariants}
        animate="animate"
      ></motion.div>

      <motion.div style={styles.container}>
        {/* Header */}
        <motion.div 
          style={styles.header}
          variants={isMobile ? mobileCardVariants : headerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.div style={styles.labelWrapper}>
            <motion.div style={styles.line}></motion.div>
            <motion.span style={styles.label}>Our Services</motion.span>
            <motion.div style={styles.lineReverse}></motion.div>
          </motion.div>
          
          <motion.h2 style={styles.title}>Comprehensive Battery Solutions</motion.h2>
          
          <motion.p style={styles.subtitle}>
            From installation to recycling, we manage the entire lifecycle of your industrial power systems with precision and expertise.
          </motion.p>
        </motion.div>

        {/* Service Cards Grid */}
        <motion.div style={styles.grid}>
          {services.map((service, index) => (
             <motion.div 
              key={index}
              style={styles.card}
              variants={isMobile ? mobileCardVariants : cardVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0px 20px 50px rgba(240, 97, 35, 0.15)',
                transition: { duration: 0.3 }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0px 20px 50px rgba(240, 97, 35, 0.15)';
                
                const overlay = e.currentTarget.querySelector('[data-overlay]');
                if (overlay) overlay.style.opacity = '1';
                
                const corner = e.currentTarget.querySelector('[data-corner]');
                if (corner) {
                  corner.style.opacity = '1';
                  corner.style.transform = 'scale(1) rotate(0deg)';
                }
                
                const iconContainer = e.currentTarget.querySelector('[data-icon-container]');
                if (iconContainer) {
                  iconContainer.style.background = 'linear-gradient(to bottom right, #F06123, #FF8803)';
                }
                
                const icon = e.currentTarget.querySelector('[data-icon]');
                if (icon) {
                  icon.style.color = '#ffffff';
                  icon.style.transform = 'scale(1.1)';
                }
                
                const title = e.currentTarget.querySelector('[data-title]');
                if (title) title.style.color = '#F06123';
                
                const learnMore = e.currentTarget.querySelector('[data-learn-more]');
                if (learnMore) learnMore.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                
                const overlay = e.currentTarget.querySelector('[data-overlay]');
                if (overlay) overlay.style.opacity = '0';
                
                const corner = e.currentTarget.querySelector('[data-corner]');
                if (corner) {
                  corner.style.opacity = '0';
                  corner.style.transform = 'scale(0) rotate(-45deg)';
                }
                
                const iconContainer = e.currentTarget.querySelector('[data-icon-container]');
                if (iconContainer) {
                  iconContainer.style.background = 'linear-gradient(to bottom right, rgba(255, 136, 3, 0.1), rgba(240, 97, 35, 0.1))';
                }
                
                const icon = e.currentTarget.querySelector('[data-icon]');
                if (icon) {
                  icon.style.color = '#F06123';
                  icon.style.transform = 'scale(1)';
                }
                
                const title = e.currentTarget.querySelector('[data-title]');
                if (title) title.style.color = '#070B15';
                
                const learnMore = e.currentTarget.querySelector('[data-learn-more]');
                if (learnMore) learnMore.style.transform = 'translateX(0)';
              }}
            >
              {/* Gradient Overlay */}
              <div data-overlay style={styles.gradientOverlay}></div>
              
              {/* Corner Element */}
              <div data-corner style={styles.cornerElement}></div>

              {/* Icon */}
              <motion.div 
                data-icon-container 
                style={styles.iconContainer}
                variants={pulseVariants}
                animate="animate"
              >
                {React.createElement(service.icon, {
                  size: isMobile ? 28 : 32,
                  style: styles.icon,
                  'data-icon': true
                })}
              </motion.div>

              {/* Title */}
              <h3 data-title style={styles.cardTitle}>{service.title}</h3>

              {/* Description */}
              <p style={styles.cardDescription}>{service.description}</p>

              {/* Learn More */}
              <motion.div 
                data-learn-more 
                style={styles.learnMore}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/service/${service.slug}`);
                }}
              >
                <span>Learn More</span>
                <svg style={styles.arrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
