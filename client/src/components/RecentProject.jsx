import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const resolveImageUrl = (value = '') => {
  if (!value) return '';
  if (value.startsWith('/uploads/')) return `${API}${value}`;
  if (value.startsWith('uploads/')) return `${API}/${value}`;
  return value;
};

export default function RecentProjects() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API}/api/projects/public`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setProjects(data.slice(0, 3).map(p => ({
            ...p,
            image: resolveImageUrl(p.imageUrl),
            title: p.title,
            description: p.subtitle || p.description,
            gradient: "linear-gradient(to right, #F06123, #FF8803)",
            slug: p.slug
          })));
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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

  const projectVariants = {
    initial: { y: 80, opacity: 0, scale: 0.9 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    initial: { x: 50, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

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

  const styles = {
    section: {
      padding: isMobile ? '60px 15px' : '80px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#ffffff'
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '32px' : '50px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '32px',
      flexWrap: 'wrap'
    },
    headerLeft: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      maxWidth: '413px'
    },
    titleWrapper: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '1px'
    },
    title: {
      fontSize: isMobile ? '26px' : '33px',
      fontWeight: '700',
      color: '#383A3C',
      margin: '0'
    },
    accentLine: {
      height: '4px',
      width: '80px',
      background: 'linear-gradient(to right, #F06123, #FF8803)',
      borderRadius: '4px',
      marginTop: '12px'
    },
    subtitle: {
      fontSize: isMobile ? '16px' : '19px',
      color: '#6b6b6b',
      lineHeight: '1.6',
      margin: '0'
    },
    button: {
      display: isMobile ? 'none' : 'inline-flex',
      alignItems: 'center',
      background: 'linear-gradient(to right, #F06123, #FF8803)',
      color: '#ffffff',
      padding: '17px 21px',
      gap: '8px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '15px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginTop: '28px'
    },
    arrow: {
      width: '18px',
      height: '18px',
      color: '#ffffff'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: isMobile ? '16px' : '24px'
    },
    card: {
      position: 'relative',
      minHeight: isMobile ? '200px' : '240px',
      padding: isMobile ? '20px' : '24px',
      borderRadius: isMobile ? '10px' : '12px',
      overflow: 'hidden',
      cursor: 'pointer',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    },
    cardOverlay: {
      position: 'absolute',
      inset: '0',
      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)',
      pointerEvents: 'none'
    },
    topBorder: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '4px'
    },
    content: {
      position: 'relative',
      zIndex: '10',
      transition: 'transform 0.3s ease'
    },
    projectTitle: {
      fontSize: isMobile ? '18px' : '20px',
      fontWeight: '700',
      color: '#FF8803',
      margin: '0 0 8px 0',
      transition: 'color 0.3s ease'
    },
    projectDescription: {
      fontSize: isMobile ? '14px' : '16px',
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: '1.6',
      margin: '0'
    },
    viewDetails: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '12px',
      opacity: '0',
      transition: 'all 0.3s ease'
    },
    viewDetailsText: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#ffffff'
    },
    viewDetailsArrow: {
      width: '16px',
      height: '16px',
      color: '#ffffff'
    }
  };

  if (loading) {
    return (
      <section style={styles.section}>
        <div style={styles.container}>
          <p style={{ textAlign: 'center', color: '#6b6b6b' }}>Loading projects...</p>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <motion.section 
      style={styles.section}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div style={styles.container}>
        <motion.div 
          style={styles.header}
          variants={isMobile ? mobileVariants : headerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.div style={styles.headerLeft}>
            <motion.div style={styles.titleWrapper}>
              <motion.h2 style={styles.title}>Recent Projects</motion.h2>
              <motion.div style={styles.accentLine}></motion.div>
            </motion.div>
            <motion.p style={styles.subtitle}>
              See our expertise in action across the country.
            </motion.p>
          </motion.div>

          <motion.button 
            style={styles.button}
            variants={isMobile ? mobileVariants : buttonVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: false, amount: 0.3 }}
            whileHover={{ 
              scale: 1.05,
              translateY: -2,
              background: 'linear-gradient(to right, #FF8803, #F06123)',
              boxShadow: '0 8px 16px rgba(240, 97, 35, 0.3)',
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => alert('View Full Portfolio')}
          >
            <span>View Full Portfolio</span>
            <svg style={styles.arrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>

        <motion.div style={styles.grid}>
          {projects.map((project, index) => (
            <motion.div 
              key={project.id || index}
              style={{
                ...styles.card,
                backgroundImage: `url('${project.image}')`
              }}
              variants={isMobile ? mobileVariants : projectVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ 
                scale: 1.02,
                translateY: -10,
                boxShadow: '0px 20px 40px rgba(240, 97, 35, 0.3)',
                transition: { duration: 0.3 }
              }}
              onMouseEnter={(e) => {
                const content = e.currentTarget.querySelector('[data-content]');
                if (content) content.style.transform = 'translateY(-8px)';
                
                const title = e.currentTarget.querySelector('[data-title]');
                if (title) title.style.color = '#ffffff';
                
                const viewDetails = e.currentTarget.querySelector('[data-view-details]');
                if (viewDetails) viewDetails.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                const content = e.currentTarget.querySelector('[data-content]');
                if (content) content.style.transform = 'translateY(0)';
                
                const title = e.currentTarget.querySelector('[data-title]');
                if (title) title.style.color = '#FF8803';
                
                const viewDetails = e.currentTarget.querySelector('[data-view-details]');
                if (viewDetails) viewDetails.style.opacity = '0';
              }}
            >
              <div style={styles.cardOverlay}></div>
              <div style={{
                ...styles.topBorder,
                background: project.gradient
              }}></div>

              <motion.div 
                data-content 
                style={styles.content}
                variants={floatingVariants}
                animate="animate"
              >
                <h3 data-title style={styles.projectTitle}>
                  {project.title}
                </h3>
                <p style={styles.projectDescription}>
                  {project.description}
                </p>
                
                <Link to={`/project/${project.slug}`} style={{ textDecoration: 'none' }}>
                  <motion.div 
                    data-view-details 
                    style={styles.viewDetails}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span style={styles.viewDetailsText}>View Details</span>
                    <svg style={styles.viewDetailsArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
