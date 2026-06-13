import React, { useRef } from 'react';
import { Target } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

export default function OurMissionSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    sectionWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: isMobile ? '0 10px' : '0 16px',
      fontFamily: 'Poppins, sans-serif'
    },
    missionCard: {
      width: '100%',
      maxWidth: '896px',
      backgroundColor: '#ffffff',
      padding: isMobile ? '50px 20px' : '80px 24px',
      marginBottom: isMobile ? '50px' : '80px',
      borderRadius: isMobile ? '10px' : '12px',
      textAlign: 'center',
      transition: 'all 0.5s ease',
      position: 'relative',
      boxShadow: '0px 0px 21px rgba(0, 0, 0, 0.07)'
    },
    topBorder: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    leftLine: {
      width: '50%',
      height: '4px',
      background: 'linear-gradient(to right, transparent, #FF8803)'
    },
    rightLine: {
      width: '50%',
      height: '4px',
      background: 'linear-gradient(to left, transparent, #FF8803)'
    },
    iconContainer: {
      margin: isMobile ? '0 auto 16px' : '0 auto 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '44px' : '48px',
      height: isMobile ? '44px' : '48px',
      borderRadius: '9px',
      backgroundColor: 'rgba(255, 136, 3, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    heading: {
      color: '#383A3C',
      fontSize: isMobile ? '28px' : '36px',
      fontWeight: '700',
      marginBottom: isMobile ? '16px' : '24px',
      margin: isMobile ? '0 0 16px 0' : '0 0 24px 0'
    },
    paragraph: {
      color: '#666666',
      fontSize: isMobile ? '16px' : '19px',
      lineHeight: '1.8',
      maxWidth: '700px',
      margin: '0 auto',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: '400',
      wordSpacing: '0.05em',
      letterSpacing: '0.02em',
      padding: isMobile ? '0 10px' : '0'
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
        type: "spring",
        stiffness: 200
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.5,
        ease: "easeOut"
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

  return (
    <section style={styles.sectionWrapper} ref={sectionRef}>
      <motion.div 
        style={styles.missionCard}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={isMobile ? mobileVariants : cardVariants}
        whileHover={{
          y: -5,
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
      >
        {/* Decorative Top Border */}
        <div style={styles.topBorder}>
          <motion.div 
            style={styles.leftLine}
            initial={{ width: 0 }}
            animate={isInView ? { width: '50%' } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          ></motion.div>
          <motion.div 
            style={styles.rightLine}
            initial={{ width: 0 }}
            animate={isInView ? { width: '50%' } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          ></motion.div>
        </div>

        {/* Icon */}
        <motion.div 
          style={styles.iconContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={isMobile ? mobileVariants : iconVariants}
          whileHover={{
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.3 }
          }}
        >
          <Target size={isMobile ? 28 : 32} color="#FF8803" />
        </motion.div>

        {/* Heading */}
        <motion.h2 
          style={styles.heading}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={isMobile ? mobileVariants : textVariants}
        >
          Our Mission
        </motion.h2>

        {/* Paragraph */}
        <motion.p 
          style={styles.paragraph}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={isMobile ? mobileVariants : {
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                delay: 0.6,
                ease: "easeOut"
              }
            }
          }}
        >
          To ensure every industrial facility has dependable, long-lasting battery
          systems that perform at their peak—especially when reliability matters
          most.
        </motion.p>
      </motion.div>
    </section>
  );
}