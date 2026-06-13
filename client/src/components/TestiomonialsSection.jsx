import React from 'react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '60px',
    gap: '24px',
    padding: '0 16px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const contentWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    width: '100%'
  };

  const decorativeContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  };

  const decorativeLineStyle = {
    height: '2px',
    width: '48px',
    background: 'linear-gradient(to right, transparent, #F06123)',
    flexShrink: 0
  };

  const decorativeLineLeftStyle = {
    height: '2px',
    width: '48px',
    background: 'linear-gradient(to left, transparent, #F06123)',
    flexShrink: 0
  };

  const labelStyle = {
    color: '#F06123',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontFamily: 'Poppins, sans-serif',
    whiteSpace: 'nowrap'
  };

  const headingStyle = {
    color: '#383A3C',
    fontSize: '42px',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: '1.2',
    fontFamily: 'Poppins, sans-serif',
    letterSpacing: '-0.5px',
    margin: 0,
    padding: '0 20px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const descriptionStyle = {
    color: '#666',
    fontSize: '19px',
    textAlign: 'center',
    maxWidth: '650px',
    lineHeight: '1.7',
    fontFamily: 'Inter, sans-serif',
    margin: 0,
    padding: '0 20px',
    width: '100%',
    boxSizing: 'border-box'
  };

  // Responsive styles with better mobile optimization
  const mediaQueryStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
    
    * {
      box-sizing: border-box;
    }
    
    @media (max-width: 1024px) {
      .heading-responsive {
        font-size: 38px !important;
      }
      .description-responsive {
        font-size: 18px !important;
      }
    }
    
    @media (max-width: 768px) {
      .heading-responsive {
        font-size: 32px !important;
        padding: 0 16px !important;
      }
      .description-responsive {
        font-size: 17px !important;
        padding: 0 16px !important;
      }
      .decorative-line {
        width: 36px !important;
      }
      .label-text {
        font-size: 13px !important;
      }
    }
    
    @media (max-width: 640px) {
      .heading-responsive {
        font-size: 28px !important;
        padding: 0 12px !important;
      }
      .description-responsive {
        font-size: 16px !important;
        padding: 0 12px !important;
      }
      .decorative-line {
        width: 30px !important;
      }
      .label-text {
        font-size: 12px !important;
      }
    }
    
    @media (max-width: 480px) {
      .heading-responsive {
        font-size: 24px !important;
        padding: 0 8px !important;
      }
      .description-responsive {
        font-size: 15px !important;
        padding: 0 8px !important;
        line-height: 1.6 !important;
      }
      .decorative-line {
        width: 24px !important;
      }
      .decorative-container {
        gap: 8px !important;
      }
    }
    
    @media (max-width: 360px) {
      .heading-responsive {
        font-size: 22px !important;
      }
      .description-responsive {
        font-size: 14px !important;
      }
      .decorative-line {
        width: 20px !important;
      }
    }
  `;

  return (
    <>
      <style>{mediaQueryStyles}</style>
      
      <motion.div 
        style={sectionStyle}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.div 
          style={contentWrapperStyle}
          variants={fadeInUp}
        >
          <motion.div 
            className="decorative-container"
            style={decorativeContainerStyle}
            variants={fadeInUp}
          >
            <motion.div 
              className="decorative-line"
              style={decorativeLineStyle}
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <span className="label-text" style={labelStyle}>
              Testimonials
            </span>
            <motion.div 
              className="decorative-line"
              style={decorativeLineLeftStyle}
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>
          
          <motion.h2 
            className="heading-responsive"
            style={headingStyle}
            variants={fadeInUp}
          >
            Trusted by Industry Leaders
          </motion.h2>
          
          <motion.p 
            className="description-responsive"
            style={descriptionStyle}
            variants={fadeInUp}
          >
            See what our clients say about our reliable service and technical expertise.
          </motion.p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default TestimonialsSection;