import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const styles = {
    button: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '56px',
      height: '56px',
      backgroundColor: '#F06123',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      boxShadow: '0 4px 12px rgba(240, 97, 35, 0.3)',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? 'visible' : 'hidden',
      transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
      zIndex: '1000'
    },
    buttonHover: {
      backgroundColor: '#FF8803',
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(240, 97, 35, 0.4)'
    }
  };

  return (
    <button
      style={styles.button}
      onClick={scrollToTop}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#FF8803';
        e.target.style.transform = 'translateY(-3px)';
        e.target.style.boxShadow = '0 6px 20px rgba(240, 97, 35, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#F06123';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 12px rgba(240, 97, 35, 0.3)';
      }}
      aria-label="Scroll to top"
    >
      <FaArrowUp />
    </button>
  );
};
