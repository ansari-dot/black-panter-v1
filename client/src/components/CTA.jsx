import React from 'react';
import { motion } from 'framer-motion';

export default function CTASection() {
  // Responsive state
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const badgeVariants = {
    initial: { y: -30, opacity: 0, scale: 0.9 },
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

  const titleVariants = {
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

  const subtitleVariants = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const buttonVariants = {
    initial: { y: 50, opacity: 0, scale: 0.9 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  // Lighter animation for mobile
  const mobileVariants = {
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
      y: [0, -10, 0],
      transition: {
        duration: 4,
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
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const styles = {
    section: {
      background: 'linear-gradient(135deg, #2a2a2a 0%, #3d3d3d 50%, #8B492C 100%)',
      padding: isMobile ? '60px 15px' : '96px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundCircle1: {
      position: 'absolute',
      top: '40px',
      right: '40px',
      width: '384px',
      height: '384px',
      backgroundColor: '#F06123',
      borderRadius: '50%',
      opacity: '0.1',
      filter: 'blur(80px)',
      pointerEvents: 'none'
    },
    backgroundCircle2: {
      position: 'absolute',
      bottom: '40px',
      left: '40px',
      width: '320px',
      height: '320px',
      backgroundColor: '#FF8803',
      borderRadius: '50%',
      opacity: '0.1',
      filter: 'blur(80px)',
      pointerEvents: 'none'
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative',
      zIndex: '10',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: isMobile ? '32px' : '48px'
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: isMobile ? '24px' : '40px',
      width: '100%'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(to right, rgba(212, 72, 10, 0.9), rgba(240, 97, 35, 0.9))',
      backdropFilter: 'blur(10px)',
      color: '#ffffff',
      padding: isMobile ? '10px 18px' : '12px 24px',
      borderRadius: '50px',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '600',
      border: '1px solid rgba(212, 72, 10, 0.6)'
    },
    dot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#FF8803',
      borderRadius: '50%',
      display: 'inline-block'
    },
    mainContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '32px',
      width: '100%'
    },
    titleWrapper: {
      padding: '0 16px'
    },
    title: {
      fontSize: isMobile ? '32px' : '68px',
      fontWeight: '700',
      margin: '0',
      lineHeight: '1.1',
      letterSpacing: isMobile ? '-0.5px' : '-1px',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE4D6 50%, #F3B38A 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: 'center',
      maxWidth: '700px'
    },
    subtitleWrapper: {
      padding: '0 16px'
    },
    subtitle: {
      fontSize: isMobile ? '16px' : '21px',
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: '1.6',
      margin: '0',
      maxWidth: '600px',
      fontWeight: '500'
    },
    buttonGroup: {
      display: 'flex',
      gap: isMobile ? '12px' : '20px',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      flexDirection: isMobile ? 'column' : 'row',
      width: isMobile ? '100%' : 'auto'
    },
    primaryButton: {
      background: 'linear-gradient(to right, #D4480A, #F06123)',
      color: '#ffffff',
      border: 'none',
      borderRadius: isMobile ? '10px' : '12px',
      padding: isMobile ? '16px 24px' : '20px 32px',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 24px rgba(212, 72, 10, 0.4)',
      position: 'relative',
      overflow: 'hidden',
      width: isMobile ? '100%' : 'auto'
    },
    secondaryButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      color: '#383A3C',
      border: '2px solid #ffffff',
      borderRadius: isMobile ? '10px' : '12px',
      padding: isMobile ? '16px 24px' : '20px 32px',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
      width: isMobile ? '100%' : 'auto'
    },
    arrowSvg: {
      width: '20px',
      height: '20px',
      color: '#ffffff'
    },
    phoneIcon: {
      width: '20px',
      height: '20px',
      fill: '#F06123'
    }
  };

  return (
    <motion.section
      style={styles.section}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Animated Circles */}
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
        {/* Content Wrapper */}
        <motion.div style={styles.contentWrapper}>
          {/* Badge */}
          <motion.div
            style={styles.badge}
            variants={isMobile ? mobileVariants : badgeVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.span
              style={styles.dot}
              variants={pulseVariants}
              animate="animate"
            ></motion.span>
            Nationwide Industrial Battery Services
          </motion.div>

          {/* Main Content */}
          <motion.div style={styles.mainContent}>
            {/* Title with Gradient */}
            <motion.div style={styles.titleWrapper}>
              <motion.h2
                style={styles.title}
                variants={isMobile ? mobileVariants : titleVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, amount: 0.3 }}
              >
                Need Reliable Battery Performance?
              </motion.h2>
            </motion.div>

            {/* Subtitle */}
            <motion.div style={styles.subtitleWrapper}>
              <motion.p
                style={styles.subtitle}
                variants={isMobile ? mobileVariants : subtitleVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, amount: 0.3 }}
              >
                Speak with our certified technicians for a complete system assessment and customized maintenance plan.
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          style={styles.buttonGroup}
          variants={isMobile ? mobileVariants : buttonVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.3 }}
        >
          {/* Primary Button */}
          <motion.button
            style={styles.primaryButton}
            whileHover={{
              scale: 1.08,
              translateY: -3,
              background: 'linear-gradient(to right, #F06123, #D4480A)',
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Request a Consultation')}
          >
            <span>Request a Consultation</span>
            <motion.svg
              style={styles.arrowSvg}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            style={styles.secondaryButton}
            whileHover={{
              scale: 1.08,
              translateY: -3,
              backgroundColor: '#ffffff',
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Call: +61 402 277 723')}
          >
            <motion.svg
              style={styles.phoneIcon}
              viewBox="0 0 20 20"
              whileHover={{ fill: '#F06123' }}
              transition={{ duration: 0.3 }}
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </motion.svg>
            <motion.span
              style={{ transition: 'color 0.3s ease' }}
              whileHover={{ color: '#F06123' }}
            >
              Call: +61 402 277 723
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}