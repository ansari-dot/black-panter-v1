import React, { useRef } from 'react';
import { Shield, DollarSign, Clock, Award, Users, Heart } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

export default function WhyChooseUsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const reasons = [
    {
      Icon: Shield,
      title: "Licensed & Certified Battery Technicians",
      description: "Fully certified professionals delivering safe, compliant, and reliable battery maintenance services."
    },
    {
      Icon: DollarSign,
      title: "Upfront, Honest Pricing",
      description: "Clear estimates with no hidden fees or last-minute surprises for all battery services."
    },
    {
      Icon: Clock,
      title: "Fast Response Times",
      description: "Quick scheduling and rapid on-site support when your critical power systems need attention."
    },
    {
      Icon: Award,
      title: "Quality Work Guaranteed",
      description: "High standards, durable solutions, and workmanship you can trust for your battery systems."
    },
    {
      Icon: Users,
      title: "Experienced Battery Technicians",
      description: "Skilled professionals with hands-on expertise across industrial, commercial, and utility battery systems."
    },
    {
      Icon: Heart,
      title: "Customer-First Service",
      description: "Clear communication, dependable support, and complete satisfaction from start to finish."
    }
  ];

  const styles = {
    section: {
      width: '100%',
      backgroundColor: '#3d3d3d',
      padding: isMobile ? '60px 15px' : '80px 40px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      marginBottom: isMobile ? '40px' : '60px'
    },
    title: {
      color: '#ffffff',
      fontSize: isMobile ? '28px' : '36px',
      fontWeight: '700',
      margin: '0 0 20px 0'
    },
    accentLine: {
      width: '70px',
      height: '4px',
      backgroundColor: '#ffffff',
      marginBottom: isMobile ? '16px' : '24px'
    },
    subtitle: {
      color: '#c5c5c5',
      fontSize: isMobile ? '14px' : '16px',
      lineHeight: '1.6',
      margin: '0',
      maxWidth: '600px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? '16px' : '24px'
    },
    card: {
      backgroundColor: '#7a7a7a',
      padding: isMobile ? '28px 20px' : '36px 28px',
      borderRadius: isMobile ? '12px' : '16px',
      border: '2px solid transparent',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      minHeight: isMobile ? 'auto' : '200px',
      display: 'flex',
      flexDirection: 'column',
      transform: 'translateY(0)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    },
    cardContent: {
      position: 'relative',
      zIndex: 2
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 107, 53, 0.1) 50%, transparent 100%)',
      opacity: 0,
      transition: 'opacity 0.4s ease',
      zIndex: 1,
      pointerEvents: 'none'
    },
    cardHover: {
      border: '2px solid #FF6B35'
    },
    iconWrapper: {
      width: isMobile ? '44px' : '48px',
      height: isMobile ? '44px' : '48px',
      marginBottom: isMobile ? '16px' : '24px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    iconGradientOverlay: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'transparent',
      borderRadius: '4px',
      pointerEvents: 'none'
    },
    cardTitle: {
      color: '#ffffff',
      fontSize: isMobile ? '17px' : '19px',
      fontWeight: '700',
      margin: isMobile ? '0 0 10px 0' : '0 0 14px 0',
      lineHeight: '1.4'
    },
    cardDescription: {
      color: '#c5c5c5',
      fontSize: isMobile ? '13.5px' : '14.5px',
      lineHeight: '1.6',
      margin: '0'
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
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
    <section style={styles.section} ref={sectionRef}>
      {/* Header */}
      <motion.div 
        style={styles.header}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={isMobile ? mobileVariants : headerVariants}
      >
        <h2 style={styles.title}>Why Choose Us?</h2>
        <motion.div 
          style={styles.accentLine}
          initial={{ width: 0 }}
          animate={isInView ? { width: '70px' } : { width: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        ></motion.div>
        <p style={styles.subtitle}>
          We combine technical expertise with unwavering commitment to safety and compliance.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div 
        style={styles.grid}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={isMobile ? mobileVariants : containerVariants}
      >
        {reasons.map((reason, index) => {
          const IconComponent = reason.Icon;
          return (
            <motion.div
              key={index}
              style={styles.card}
              variants={itemVariants}
              whileHover={{
                y: -8,
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                borderColor: '#FF6B35',
                transition: { duration: 0.3 }
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <motion.div
                style={styles.gradientOverlay}
                animate={{
                  opacity: hoveredCard === index ? 1 : 0,
                  background: hoveredCard === index 
                    ? [
                        'linear-gradient(135deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 107, 53, 0.1) 50%, transparent 100%)',
                        'linear-gradient(225deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 107, 53, 0.1) 50%, transparent 100%)',
                        'linear-gradient(315deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 107, 53, 0.1) 50%, transparent 100%)',
                        'linear-gradient(45deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 107, 53, 0.1) 50%, transparent 100%)',
                        'linear-gradient(135deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 107, 53, 0.1) 50%, transparent 100%)'
                      ]
                    : 'linear-gradient(135deg, rgba(255, 107, 53, 0.3) 0%, rgba(255, 107, 53, 0.1) 50%, transparent 100%)'
                }}
                transition={{
                  opacity: { duration: 0.3 },
                  background: { 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              />
              <div style={styles.cardContent}>
                <motion.div 
                  style={styles.iconWrapper}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.2 + (index * 0.1),
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <IconComponent size={isMobile ? 28 : 32} color="#FF6B35" style={{ position: 'relative', zIndex: 1 }} />
                </motion.div>
                <h3 style={styles.cardTitle}>{reason.title}</h3>
                <p style={styles.cardDescription}>{reason.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}