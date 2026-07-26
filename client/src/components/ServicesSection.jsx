import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getServiceCardIcon } from "../utils/serviceCatalog";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

const mobileCardVariants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 }
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

export default function ComprehensiveBatterySolutions() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const mobileSliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/services?featuredOnHome=true`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const active = data
            .filter((s) => s.status === "Active")
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setServices(active);
        }
      })
      .catch(() => {});
  }, []);

  const handleMobileScroll = () => {
    if (!mobileSliderRef.current) return;
    const scrollLeft = mobileSliderRef.current.scrollLeft;
    const width = mobileSliderRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveMobileSlide(newIndex);
  };

  const scrollToMobileSlide = (index) => {
    if (!mobileSliderRef.current) return;
    const width = mobileSliderRef.current.offsetWidth;
    mobileSliderRef.current.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
    setActiveMobileSlide(index);
  };

  if (!services.length) return null;

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
      transition: 'all 0.4s ease',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)'
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
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* Background Circles */}
      <motion.div 
        style={styles.backgroundCircle1}
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div 
        style={styles.backgroundCircle2}
        variants={floatingVariants}
        animate="animate"
      />

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
            <motion.div style={styles.line} />
            <motion.span style={styles.label}>Our Services</motion.span>
            <motion.div style={styles.lineReverse} />
          </motion.div>
          
          <motion.h2 style={styles.title}>Comprehensive Battery Solutions</motion.h2>
          
          <motion.p style={styles.subtitle}>
            From installation to recycling, we manage the entire lifecycle of your industrial power systems with precision and expertise.
          </motion.p>
        </motion.div>

        {/* MOBILE SLIDER (< 768px): Swipe Cards */}
        {isMobile ? (
          <div className="w-full">
            <div
              ref={mobileSliderRef}
              onScroll={handleMobileScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 -mx-2 px-3 scroll-smooth"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {services.map((service, index) => (
                <div key={service._id || index} className="w-[85vw] shrink-0 snap-center">
                  <ServiceCardItem
                    service={service}
                    index={index}
                    navigate={navigate}
                    styles={styles}
                    isMobile={isMobile}
                  />
                </div>
              ))}
            </div>

            {/* Dot Indicators */}
            {services.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {services.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToMobileSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeMobileSlide === i ? "w-6 bg-[#F06123]" : "w-2 bg-slate-300"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* DESKTOP GRID (>= 768px): 3-Column Cards Grid */
          <motion.div style={styles.grid}>
            {services.map((service, index) => (
              <ServiceCardItem
                key={service._id || index}
                service={service}
                index={index}
                navigate={navigate}
                styles={styles}
                isMobile={isMobile}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}

function ServiceCardItem({ service, index, navigate, styles, isMobile }) {
  const IconComponent = getServiceCardIcon(service.iconName, service.title);

  return (
    <motion.div 
      style={styles.card}
      variants={isMobile ? mobileCardVariants : cardVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.1 }}
      onClick={() => navigate(`/service/${service.slug}`)}
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
        
        const iconContainerSpan = e.currentTarget.querySelector('[data-icon-wrap]');
        if (iconContainerSpan) {
          iconContainerSpan.style.color = '#ffffff';
        }
        
        const title = e.currentTarget.querySelector('[data-title]');
        if (title) title.style.color = '#F06123';
        
        const learnMore = e.currentTarget.querySelector('[data-learn-more]');
        if (learnMore) learnMore.style.transform = 'translateX(5px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.04)';
        
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

        const iconContainerSpan = e.currentTarget.querySelector('[data-icon-wrap]');
        if (iconContainerSpan) {
          iconContainerSpan.style.color = '#F06123';
        }
        
        const title = e.currentTarget.querySelector('[data-title]');
        if (title) title.style.color = '#070B15';
        
        const learnMore = e.currentTarget.querySelector('[data-learn-more]');
        if (learnMore) learnMore.style.transform = 'translateX(0)';
      }}
    >
      {/* Gradient Overlay */}
      <div data-overlay style={styles.gradientOverlay} />
      
      {/* Corner Element */}
      <div data-corner style={styles.cornerElement} />

      {/* Icon */}
      <motion.div 
        data-icon-container 
        style={styles.iconContainer}
        variants={pulseVariants}
        animate="animate"
      >
        <span data-icon-wrap style={{ color: '#F06123', transition: 'color 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconComponent className={isMobile ? "w-7 h-7" : "w-8 h-8"} />
        </span>
      </motion.div>

      {/* Title */}
      <h3 data-title style={styles.cardTitle}>{service.title}</h3>

      {/* Description */}
      <p style={styles.cardDescription}>{service.heroDescription || service.description}</p>

      {/* Learn More */}
      <div 
        data-learn-more 
        style={styles.learnMore}
      >
        <span>Learn More</span>
        <ArrowRight className="w-5 h-5" />
      </div>
    </motion.div>
  );
}