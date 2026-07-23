import React from 'react';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const resolveImage = (image = '') => {
  if (!image) return '';
  if (image.startsWith('/uploads/')) return `${API}${image}`;
  if (image.startsWith('uploads/')) return `${API}/${image}`;
  return image;
};

const EquipmentCapabilities = ({
  title = 'Our Equipments & Capabilities',
  subtitle = 'From installation to recycling, we manage the entire lifecycle of your industrial power systems.',
}) => {
  const [equipmentData, setEquipmentData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    fetch(`${API}/api/equipment`)
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        setEquipmentData(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setEquipmentData([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="equipment-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap');
        .equipment-section { width: 100%; background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 100%); padding: 80px 20px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .equipment-container { max-width: 1280px; margin: 0 auto; }
        .equipment-header { text-align: center; margin-bottom: 60px; }
        .equipment-header h2 { font-size: 38px; font-weight: 700; color: #2d2d2d; margin: 0 0 16px 0; letter-spacing: -0.5px; }
        .equipment-header p { font-size: 16px; color: #6b6b6b; max-width: 600px; margin: 0 auto; line-height: 1.6; }
        .equipment-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 30px; }
        .equipment-grid-bottom { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; max-width: calc(66.666% + 15px); margin: 0 auto; }
        .equipment-card { position: relative; background: #2b2b2b; border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); }
        .equipment-card::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 0%; background: rgba(0, 0, 0, 0.7); transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1; }
        .equipment-card:hover::before { height: 100%; }
        .equipment-card:hover { transform: translateY(-8px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25); }
        .equipment-card-image { width: 100%; height: 280px; object-fit: cover; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .equipment-card:hover .equipment-card-image { transform: scale(1.08); }
        .equipment-card-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 60%, transparent 100%); padding: 28px 24px; z-index: 2; }
        .equipment-card-title { font-size: 20px; font-weight: 700; color: #ff6b35; margin: 0 0 8px 0; line-height: 1.3; }
        .equipment-card-description { font-size: 14px; color: rgba(255, 255, 255, 0.9); margin: 0; line-height: 1.5; }
        @media (max-width: 1024px) { .equipment-grid, .equipment-grid-bottom { grid-template-columns: repeat(2, 1fr); max-width: 100%; } .equipment-header h2 { font-size: 32px; } }
        @media (max-width: 640px) { .equipment-section { padding: 60px 16px; } .equipment-header { margin-bottom: 40px; } .equipment-header h2 { font-size: 28px; } .equipment-header p { font-size: 15px; } .equipment-grid, .equipment-grid-bottom { grid-template-columns: 1fr; gap: 20px; } .equipment-card-image { height: 240px; } .equipment-card-title { font-size: 18px; } .equipment-card-description { font-size: 13px; } }
      `}</style>

      <div className="equipment-container">
        <div className="equipment-header">
          <motion.h2 initial={{ opacity: 0, y: -40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}>
            {title}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}>
            {subtitle}
          </motion.p>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 py-10">Loading equipment...</div>
        ) : equipmentData.length === 0 ? (
          <div className="text-center text-gray-600 py-10">No equipment items found.</div>
        ) : (
          <>
            <div className="equipment-grid">
              {equipmentData.slice(0, 6).map((equipment, index) => (
                <motion.div key={equipment.id || equipment._id} className="equipment-card" initial={{ opacity: 0, y: 80, x: index % 2 === 0 ? -30 : 30, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}>
                  <motion.img src={resolveImage(equipment.imageUrl)} alt={equipment.title} className="equipment-card-image" initial={{ scale: 1.2, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.15 + 0.2, ease: [0.4, 0, 0.2, 1] }} />
                  <motion.div className="equipment-card-overlay" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.15 + 0.4, ease: [0.4, 0, 0.2, 1] }}>
                    <h3 className="equipment-card-title">{equipment.title}</h3>
                    <p className="equipment-card-description">{equipment.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <div className="equipment-grid-bottom">
              {equipmentData.slice(6, 8).map((equipment, index) => (
                <motion.div key={equipment.id || equipment._id} className="equipment-card" initial={{ opacity: 0, y: 80, x: index % 2 === 0 ? -40 : 40, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: index * 0.2, ease: [0.4, 0, 0.2, 1] }}>
                  <motion.img src={resolveImage(equipment.imageUrl)} alt={equipment.title} className="equipment-card-image" initial={{ scale: 1.2, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.2 + 0.2, ease: [0.4, 0, 0.2, 1] }} />
                  <motion.div className="equipment-card-overlay" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 + 0.4, ease: [0.4, 0, 0.2, 1] }}>
                    <h3 className="equipment-card-title">{equipment.title}</h3>
                    <p className="equipment-card-description">{equipment.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EquipmentCapabilities;
