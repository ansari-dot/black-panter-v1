import React from 'react';
import { motion } from 'framer-motion';
import { useTeamCatalog } from '../hooks/useTeamCatalog';

const TeamSection = ({
  title = 'Meet Our Experts',
  subtitle = 'Certified engineers and technicians dedicated to your power reliability.',
}) => {
  const { activeMembers: members, isLoading: loading, isError } = useTeamCatalog();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const cardVariants = {
    initial: { y: 60, opacity: 0, scale: 0.9 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const mobileVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#f9fafb',
    padding: '80px 0',
    marginBottom: '80px',
    gap: '50px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const gridStyle = {
    display: 'grid',
    alignSelf: 'stretch',
    padding: '0 16px',
    gap: '24px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const mediaQueryStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
    .experts-grid { grid-template-columns: 1fr !important; padding: 0 16px !important; gap: 24px !important; }
    @media (min-width: 768px) { .experts-grid { grid-template-columns: repeat(2, 1fr) !important; padding: 0 32px !important; gap: 32px !important; } }
    @media (min-width: 1024px) { .experts-grid { grid-template-columns: repeat(3, 1fr) !important; padding: 0 48px !important; gap: 40px !important; } }
    .expert-card:hover .expert-image { transform: scale(1.05); }
    .expert-card:hover .expert-name { color: #F06123; }
    @media (max-width: 640px) {
      .expert-title { font-size: 24px !important; }
      .expert-subtitle { font-size: 16px !important; }
      .expert-image-wrapper { height: 450px !important; max-width: 100% !important; border-radius: 24px !important; }
      .expert-image { height: 450px !important; object-fit: cover !important; background-color: #f3f4f6 !important; }
    }
    @media (max-width: 480px) {
      .expert-title { font-size: 20px !important; }
      .expert-subtitle { font-size: 15px !important; }
      .expert-name { font-size: 18px !important; }
      .expert-position { font-size: 14px !important; }
    }
  `;

  return (
    <>
      <style>{mediaQueryStyles}</style>
      <motion.div style={sectionStyle} initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div
          className="text-center px-4"
          variants={isMobile ? mobileVariants : cardVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, amount: 0.3 }}
        >
          <h2 className="expert-title font-black" style={{ color: '#383A3C', fontSize: '33px', fontWeight: 900, margin: 0 }}>
            {title}
          </h2>
          <p className="expert-subtitle" style={{ color: '#6b7280', fontSize: '19px', fontWeight: 400, margin: 0 }}>
            {subtitle}
          </p>
        </motion.div>

        <div className="experts-grid" style={gridStyle}>
          {loading ? (
            <div className="col-span-full text-center text-gray-500">Loading team members...</div>
          ) : members.length > 0 ? (
            members.map((member) => (
            <motion.div
              key={member.id}
              className="expert-card"
              variants={isMobile ? mobileVariants : cardVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div
                className="expert-image-wrapper"
                style={{
                  backgroundColor: '#f3f4f6',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  width: '100%',
                  maxWidth: '320px',
                  height: '380px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="expert-image"
                  style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '24px', width: '100%', maxWidth: '320px' }}>
                <h3 className="expert-name" style={{ color: '#070B15', fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0' }}>
                  {member.name}
                </h3>
                <p className="expert-position" style={{ color: '#6b7280', fontSize: '16px', margin: 0, textAlign: 'center' }}>
                  {member.role}
                </p>
              </div>
            </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              {isError ? 'Team data is unavailable right now.' : 'No team members found.'}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default TeamSection;
