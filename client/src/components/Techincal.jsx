import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaBolt, FaThermometerHalf, FaBalanceScale, FaWrench, FaSyncAlt, FaCheckCircle, FaVial, FaSearch, FaChartLine, FaTools, FaFileAlt, FaClipboardCheck, FaShieldAlt, FaTruck, FaRecycle, FaBiohazard, FaCertificate, FaCog, FaChargingStation, FaClock, FaNetworkWired, FaStethoscope, FaPlug, FaExchangeAlt, FaRedo, FaArrowRight, FaSearchPlus, FaFlask, FaBatteryFull, FaSatelliteDish, FaAmbulance, FaHardHat, FaEraser, FaSoap, FaWind, FaStar, FaCar, FaBus, FaShip } from 'react-icons/fa';
import { getServiceCardIcon } from '../utils/serviceCatalog';

const defaultProcedures = [
  { title: "Capacity Testing & Analysis", description: "Controlled discharge testing to measure actual battery capacity under full industrial load.", icon: "FaBolt" },
  { title: "Electrolyte Rejuvenation", description: "Precise chemical balancing, gravity check, and cell cleaning for maximum longevity.", icon: "FaThermometerHalf" },
  { title: "Cell Balancing & Equalization", description: "Equalizing individual block voltages to eliminate weak links across the battery string.", icon: "FaBalanceScale" },
  { title: "Preventive Component Inspection", description: "Comprehensive infrared thermography and torque checking of terminal connections.", icon: "FaWrench" },
  { title: "UPS & Backup System Testing", description: "Simulated power failure testing to guarantee instant emergency transition.", icon: "FaSyncAlt" },
  { title: "Environmental & Recycling Care", description: "Eco-friendly disposal and recycling compliant with EPA standards.", icon: "FaRecycle" }
];

const TechnicalProcedures = ({ service }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: 40
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const scaleIn = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

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

  // Icon mapping
  const iconMap = {
    FaBolt, FaThermometerHalf, FaBalanceScale, FaWrench, FaSyncAlt, FaCheckCircle,
    FaVial, FaSearch, FaChartLine, FaTools, FaFileAlt, FaClipboardCheck, FaShieldAlt,
    FaTruck, FaRecycle, FaBiohazard, FaCertificate, FaCog, FaChargingStation,
    FaClock, FaNetworkWired, FaStethoscope, FaPlug, FaExchangeAlt, FaRedo,
    FaArrowRight, FaSearchPlus, FaFlask, FaBatteryFull, FaCar, FaBus, FaShip,
    FaSatelliteDish, FaAmbulance, FaHardHat, FaEraser, FaSoap, FaWind, FaStar
  };

  const rawProcedures = Array.isArray(service?.technicalProcedures) && service.technicalProcedures.length > 0
    ? service.technicalProcedures
    : defaultProcedures;

  const procedures = rawProcedures.map((proc, index) => ({
    id: proc.id || proc._id || index,
    title: proc.title,
    description: proc.description,
    Icon: iconMap[proc.icon] || getServiceCardIcon(proc.icon, proc.title) || FaBolt
  }));

  // Styles
  const sectionStyle = {
    background: 'linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%)',
    padding: isMobile ? '60px 15px' : '96px 20px 101px 20px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundCircle1 = {
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
  };

  const backgroundCircle2 = {
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
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: isMobile ? '40px' : '60px',
    position: 'relative',
    zIndex: '10'
  };

  const headerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    textAlign: 'center'
  };

  const labelWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px'
  };

  const lineStyle = {
    height: '2px',
    width: '48px',
    background: 'linear-gradient(to right, transparent, #F06123)'
  };

  const lineReverseStyle = {
    height: '2px',
    width: '48px',
    background: 'linear-gradient(to left, transparent, #F06123)'
  };

  const labelStyle = {
    color: '#F06123',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1.5px'
  };

  const titleStyle = {
    fontSize: isMobile ? '28px' : '42px',
    fontWeight: '700',
    color: '#383A3C',
    margin: '0',
    letterSpacing: '-0.5px',
    lineHeight: '1.2'
  };

  const subtitleStyle = {
    fontSize: isMobile ? '16px' : '19px',
    color: '#6b6b6b',
    lineHeight: '1.7',
    margin: '0',
    maxWidth: '680px',
    padding: isMobile ? '0 10px' : '0'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: isMobile ? '20px' : '32px',
    width: '100%',
    padding: isMobile ? '0 10px' : '0 48px'
  };

  const cardStyle = {
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
  };

  const gradientOverlayStyle = {
    position: 'absolute',
    inset: '0',
    background: 'linear-gradient(to bottom right, rgba(240, 97, 35, 0.05), transparent)',
    opacity: '0',
    transition: 'opacity 0.5s ease',
    pointerEvents: 'none'
  };

  const cornerElementStyle = {
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
  };

  const iconContainerStyle = {
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
  };

  const iconStyle = {
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: '10',
    color: '#F06123'
  };

  const cardTitleStyle = {
    fontSize: isMobile ? '18px' : '24px',
    fontWeight: '700',
    color: '#070B15',
    margin: '0 0 12px 0',
    lineHeight: '1.3',
    transition: 'color 0.3s ease',
    position: 'relative',
    zIndex: '10'
  };

  const cardDescriptionStyle = {
    fontSize: isMobile ? '14px' : '17px',
    color: '#6b6b6b',
    lineHeight: '1.65',
    margin: '0',
    flex: '1',
    position: 'relative',
    zIndex: '10'
  };

  const mediaQueryStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap');
    
    .procedure-card:hover {
      transform: translateY(-8px);
      box-shadow: 0px 20px 50px rgba(240, 97, 35, 0.25);
    }
  `;

  return (
    <>
      <style>{mediaQueryStyles}</style>

      <motion.section
        style={sectionStyle}
        ref={sectionRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div style={backgroundCircle1} />
        <div style={backgroundCircle2} />

        <motion.div style={containerStyle}>
          {/* Header Section */}
          <motion.div
            style={headerStyle}
            variants={fadeInUp}
          >
            <div style={labelWrapperStyle}>
              <div style={lineStyle} />
              <span style={labelStyle}>OUR EXPERTISE</span>
              <div style={lineReverseStyle} />
            </div>
            <h2 style={titleStyle}>Technical Procedures</h2>
            <p style={subtitleStyle}>
              From installation to recycling, we manage the entire lifecycle of your industrial power systems.
            </p>
          </motion.div>

          {/* Service Cards Grid */}
          <motion.div style={gridStyle}>
            {procedures.map((procedure, index) => {
              const IconComponent = procedure.Icon;

              return (
                <motion.div
                  key={procedure.id}
                  className="procedure-card"
                  style={cardStyle}
                  custom={index}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={isMobile ? mobileVariants : scaleIn}
                  whileHover={{
                    y: -5,
                    boxShadow: '0px 10px 25px rgba(240, 97, 35, 0.12)',
                    transition: { duration: 0.2 }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0px 10px 25px rgba(240, 97, 35, 0.12)';

                    const overlay = e.currentTarget.querySelector('[data-overlay]');
                    if (overlay) overlay.style.opacity = '1';

                    const corner = e.currentTarget.querySelector('[data-corner]');
                    if (corner) {
                      corner.style.opacity = '1';
                      corner.style.transform = 'rotate(0deg)';
                    }

                    const iconContainer = e.currentTarget.querySelector('[data-icon-container]');
                    if (iconContainer) {
                      iconContainer.style.background = 'linear-gradient(to bottom right, #F06123, #FF8803)';
                    }

                    const icon = e.currentTarget.querySelector('[data-icon]');
                    if (icon) {
                      icon.style.color = '#ffffff';
                    }

                    const title = e.currentTarget.querySelector('[data-title]');
                    if (title) title.style.color = '#F06123';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';

                    const overlay = e.currentTarget.querySelector('[data-overlay]');
                    if (overlay) overlay.style.opacity = '0';

                    const corner = e.currentTarget.querySelector('[data-corner]');
                    if (corner) {
                      corner.style.opacity = '0';
                      corner.style.transform = 'rotate(-45deg)';
                    }

                    const iconContainer = e.currentTarget.querySelector('[data-icon-container]');
                    if (iconContainer) {
                      iconContainer.style.background = 'linear-gradient(to bottom right, rgba(255, 136, 3, 0.1), rgba(240, 97, 35, 0.1))';
                    }

                    const icon = e.currentTarget.querySelector('[data-icon]');
                    if (icon) {
                      icon.style.color = '#F06123';
                    }

                    const title = e.currentTarget.querySelector('[data-title]');
                    if (title) title.style.color = '#070B15';
                  }}
                >
                  {/* Gradient Overlay */}
                  <div data-overlay style={gradientOverlayStyle} />

                  {/* Decorative Corner */}
                  <div data-corner style={cornerElementStyle} />

                  {/* Icon */}
                  <motion.div
                    data-icon-container
                    style={iconContainerStyle}
                  >
                    <IconComponent
                      size={isMobile ? 28 : 32}
                      style={iconStyle}
                      data-icon="true"
                    />
                  </motion.div>

                  {/* Title */}
                  <h3 data-title style={cardTitleStyle}>{procedure.title}</h3>

                  {/* Description */}
                  <p style={cardDescriptionStyle}>{procedure.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.section>
    </>
  );
};

export default TechnicalProcedures;
