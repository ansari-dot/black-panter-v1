import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import about from '../assets/about.webp'
export default function WhoWeAreSection() {
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

  const batteryTypes = [
    "Ni-Cd & Block Nickel Batteries",
    "Lead-Acid & VRLA",
    "UPS Backup Power Banks",
    "Hybrid Solar–Battery Systems",
    "Industrial Motive-Power Batteries",
  ];

  const styles = {
    section: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'stretch' : 'center',
      width: '100%',
      backgroundColor: '#f9fafb',
      padding: isMobile ? '50px 0' : '80px 0',
      gap: isMobile ? '40px' : '0',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      flexWrap: 'wrap'
    },
    leftContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: isMobile ? '100%' : '550px',
      padding: isMobile ? '0 16px' : '0 32px'
    },
    title: {
      color: '#383A3C',
      fontSize: isMobile ? '30px' : '40px',
      fontWeight: '700',
      marginBottom: '20px',
      lineHeight: '1.2',
      margin: '0 0 20px 0'
    },
    accentBar: {
      backgroundColor: '#F06123',
      width: '77px',
      height: isMobile ? '6px' : '8px',
      marginBottom: isMobile ? '20px' : '28px',
      borderRadius: '5px'
    },
    description: {
      fontSize: isMobile ? '16px' : '19px',
      marginBottom: isMobile ? '24px' : '30px',
      lineHeight: '1.8',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: '400',
      color: '#666666',
      wordSpacing: '0.05em',
      letterSpacing: '0.02em'
    },
    cardsContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      gap: isMobile ? '16px' : '24px'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: isMobile ? '12px' : '16px'
    },
    singleRow: {
      display: 'flex',
      justifyContent: 'flex-start'
    },
    card: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: isMobile ? '14px' : '16px',
      borderRadius: isMobile ? '10px' : '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
      transition: 'all 0.3s ease',
      border: '1px solid #f3f4f6',
      cursor: 'pointer'
    },
    dot: {
      width: isMobile ? '10px' : '12px',
      height: isMobile ? '10px' : '12px',
      backgroundColor: '#F06123',
      borderRadius: '50%',
      marginRight: isMobile ? '10px' : '12px',
      flexShrink: '0',
      transition: 'background-color 0.3s ease'
    },
    cardText: {
      color: '#666666',
      fontWeight: '500',
      fontSize: isMobile ? '14px' : '16px',
      transition: 'color 0.3s ease'
    },
    imageContainer: {
      width: '100%',
      maxWidth: isMobile ? '100%' : '622px',
      height: isMobile ? '300px' : '418px',
      margin: isMobile ? '0 auto' : '0 32px',
      padding: isMobile ? '0 16px' : '0'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: isMobile ? '12px' : '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.5s ease'
    }
  };

  const leftContentVariants = {
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

  const imageVariants = {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3 + (i * 0.1),
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
    <section style={styles.section} ref={sectionRef}>
      {/* Left Content */}
      <motion.div 
        style={styles.leftContent}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={isMobile ? mobileVariants : leftContentVariants}
      >
        <h2 style={styles.title}>Who We Are</h2>
        <motion.div 
          style={styles.accentBar}
          initial={isMobile ? false : { width: 0 }}
          animate={isMobile ? false : (isInView ? { width: '77px' } : { width: 0 })}
          transition={{ duration: 0.6, delay: 0.3 }}
        ></motion.div>
        <p style={styles.description}>
          We are a full-service industrial battery maintenance facility serving businesses across Australia. With 20+ years of field and facility-level experience, we specialize in the inspection, testing, restoration, and optimization of high-reliability battery systems.
        </p>

        {/* Battery Type Cards */}
        <div style={styles.cardsContainer}>
          {/* First Row */}
          <div style={styles.row}>
            <motion.div 
              style={styles.card}
              custom={0}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={isMobile ? mobileVariants : cardVariants}
              whileHover={{
                y: -2,
                scale: 1.05,
                background: 'linear-gradient(to right, #F06123, #FF8803)',
                boxShadow: '0 8px 16px rgba(240, 97, 35, 0.2)'
              }}
              onMouseEnter={(e) => {
                const dot = e.currentTarget.querySelector('[data-dot]');
                const text = e.currentTarget.querySelector('[data-text]');
                if (dot) dot.style.backgroundColor = '#ffffff';
                if (text) text.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                const dot = e.currentTarget.querySelector('[data-dot]');
                const text = e.currentTarget.querySelector('[data-text]');
                if (dot) dot.style.backgroundColor = '#F06123';
                if (text) text.style.color = '#666666';
              }}
            >
              <div data-dot style={styles.dot}></div>
              <span data-text style={styles.cardText}>{batteryTypes[0]}</span>
            </motion.div>

            <motion.div 
              style={styles.card}
              custom={1}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={isMobile ? mobileVariants : cardVariants}
              whileHover={{
                y: -2,
                scale: 1.05,
                background: 'linear-gradient(to right, #F06123, #FF8803)',
                boxShadow: '0 8px 16px rgba(240, 97, 35, 0.2)'
              }}
              onMouseEnter={(e) => {
                const dot = e.currentTarget.querySelector('[data-dot]');
                const text = e.currentTarget.querySelector('[data-text]');
                if (dot) dot.style.backgroundColor = '#ffffff';
                if (text) text.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                const dot = e.currentTarget.querySelector('[data-dot]');
                const text = e.currentTarget.querySelector('[data-text]');
                if (dot) dot.style.backgroundColor = '#F06123';
                if (text) text.style.color = '#666666';
              }}
            >
              <div data-dot style={styles.dot}></div>
              <span data-text style={styles.cardText}>{batteryTypes[1]}</span>
            </motion.div>
          </div>

          {/* Second Row */}
          <div style={styles.row}>
            <motion.div 
              style={styles.card}
              custom={2}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={isMobile ? mobileVariants : cardVariants}
              whileHover={{
                y: -2,
                scale: 1.05,
                background: 'linear-gradient(to right, #F06123, #FF8803)',
                boxShadow: '0 8px 16px rgba(240, 97, 35, 0.2)'
              }}
              onMouseEnter={(e) => {
                const dot = e.currentTarget.querySelector('[data-dot]');
                const text = e.currentTarget.querySelector('[data-text]');
                if (dot) dot.style.backgroundColor = '#ffffff';
                if (text) text.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                const dot = e.currentTarget.querySelector('[data-dot]');
                const text = e.currentTarget.querySelector('[data-text]');
                if (dot) dot.style.backgroundColor = '#F06123';
                if (text) text.style.color = '#666666';
              }}
            >
              <div data-dot style={styles.dot}></div>
              <span data-text style={styles.cardText}>{batteryTypes[2]}</span>
            </motion.div>

            <motion.div 
              style={styles.card}
              custom={3}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={isMobile ? mobileVariants : cardVariants}
              whileHover={{
                y: -2,
                scale: 1.05,
                background: 'linear-gradient(to right, #F06123, #FF8803)',
                boxShadow: '0 8px 16px rgba(240, 97, 35, 0.2)'
              }}
              onMouseEnter={(e) => {
                const dot = e.currentTarget.querySelector('[data-dot]');
                const text = e.currentTarget.querySelector('[data-text]');
                if (dot) dot.style.backgroundColor = '#ffffff';
                if (text) text.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                const dot = e.currentTarget.querySelector('[data-dot]');
                const text = e.currentTarget.querySelector('[data-text]');
                if (dot) dot.style.backgroundColor = '#F06123';
                if (text) text.style.color = '#666666';
              }}
            >
              <div data-dot style={styles.dot}></div>
              <span data-text style={styles.cardText}>{batteryTypes[3]}</span>
            </motion.div>
          </div>

          {/* Third Row - Single Card */}
          <div style={styles.singleRow}>
            <motion.div 
              style={styles.card}
              custom={4}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={isMobile ? mobileVariants : cardVariants}
              whileHover={{
                y: -2,
                scale: 1.05,
                background: 'linear-gradient(to right, #F06123, #FF8803)',
                boxShadow: '0 8px 16px rgba(240, 97, 35, 0.2)'
              }}
              onMouseEnter={(e) => {
                const dot = e.currentTarget.querySelector('[data-dot]');
                const text = e.currentTarget.querySelector('[data-text]');
                if (dot) dot.style.backgroundColor = '#ffffff';
                if (text) text.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                const dot = e.currentTarget.querySelector('[data-dot]');
                const text = e.currentTarget.querySelector('[data-text]');
                if (dot) dot.style.backgroundColor = '#F06123';
                if (text) text.style.color = '#666666';
              }}
            >
              <div data-dot style={styles.dot}></div>
              <span data-text style={{ ...styles.cardText, fontWeight: '600' }}>{batteryTypes[4]}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right Image */}
      <motion.div 
        style={styles.imageContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={isMobile ? mobileVariants : imageVariants}
        onMouseEnter={(e) => {
          const img = e.currentTarget.querySelector('img');
          if (img) {
            img.style.transform = 'scale(1.02)';
            img.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          const img = e.currentTarget.querySelector('img');
          if (img) {
            img.style.transform = 'scale(1)';
            img.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
          }
        }}
      >
        <img
          src={about}
          alt="Industrial battery maintenance facility"
          style={styles.image}
          width={isMobile ? "400" : "622"}
          height={isMobile ? "300" : "418"}
          loading="lazy"
          decoding="async"
        />
      </motion.div>
    </section>
  );
}