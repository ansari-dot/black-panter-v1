import React from 'react';
import { motion } from 'framer-motion';

const EquipmentCapabilities = () => {
  // Equipment data matching the image
  const equipmentData = [
    {
      id: 1,
      title: "Part Washer",
      description: "Industrial cleaning of battery components.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Dischargers",
      description: "Controlled battery discharge for testing and conditioning.",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Battery Chargers",
      description: "Precision charging for Ni-Cd, block nickel, and lead-acid batteries.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Load Bank",
      description: "Simulated electrical load testing for performance measurement.",
      image: "https://images.unsplash.com/photo-1581092918484-8313e1f7e8c7?w=500&h=400&fit=crop"
    },
    {
      id: 5,
      title: "Capacity Testing Systems",
      description: "Accurate measurement of actual battery capacity.",
      image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=500&h=400&fit=crop"
    },
    {
      id: 6,
      title: "Testing & Diagnostic Tools",
      description: "Voltage, current, and resistance analysis.",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&h=400&fit=crop"
    },
    {
      id: 7,
      title: "Recycling & Refurbishment Equipment",
      description: "Safe dismantling and battery restoration tools.",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&h=400&fit=crop"
    },
    {
      id: 8,
      title: "Wire Cutting Machine",
      description: "Safe dismantling and battery restoration tools.",
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=500&h=400&fit=crop"
    }
  ];

  return (
    <div className="equipment-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .equipment-section {
          width: 100%;
          background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 100%);
          padding: 80px 20px;
          font-family: 'Inter', sans-serif;
        }
        
        .equipment-container {
          max-width: 1280px;
          margin: 0 auto;
        }
        
        .equipment-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .equipment-header h2 {
          font-size: 38px;
          font-weight: 700;
          color: #2d2d2d;
          margin: 0 0 16px 0;
          letter-spacing: -0.5px;
        }
        
        .equipment-header p {
          font-size: 16px;
          color: #6b6b6b;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .equipment-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .equipment-grid-bottom {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
          max-width: calc(66.666% + 15px);
          margin: 0 auto;
        }
        
        .equipment-card {
          position: relative;
          background: #2b2b2b;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .equipment-card::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 0%;
          background: rgba(0, 0, 0, 0.7);
          transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
        }
        
        .equipment-card:hover::before {
          height: 100%;
        }
        
        .equipment-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
        }
        
        .equipment-card-image {
          width: 100%;
          height: 280px;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .equipment-card:hover .equipment-card-image {
          transform: scale(1.08);
        }
        
        .equipment-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 60%, transparent 100%);
          padding: 28px 24px;
          z-index: 2;
        }
        
        .equipment-card-title {
          font-size: 20px;
          font-weight: 700;
          color: #ff6b35;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }
        
        .equipment-card-description {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          line-height: 1.5;
        }
        
        /* Scroll Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-in {
          animation-duration: 0.8s;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: both;
        }
        
        .fade-in-down {
          animation-name: fadeInDown;
        }
        
        .fade-in-up {
          animation-name: fadeInUp;
        }
        
        .scale-in {
          animation-name: scaleIn;
        }
        
        .slide-in-left {
          animation-name: slideInLeft;
        }
        
        .slide-in-right {
          animation-name: slideInRight;
        }
        
        /* Tablet */
        @media (max-width: 1024px) {
          .equipment-grid,
          .equipment-grid-bottom {
            grid-template-columns: repeat(2, 1fr);
            max-width: 100%;
          }
          
          .equipment-header h2 {
            font-size: 32px;
          }
        }
        
        /* Mobile */
        @media (max-width: 640px) {
          .equipment-section {
            padding: 60px 16px;
          }
          
          .equipment-header {
            margin-bottom: 40px;
          }
          
          .equipment-header h2 {
            font-size: 28px;
          }
          
          .equipment-header p {
            font-size: 15px;
          }
          
          .equipment-grid,
          .equipment-grid-bottom {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .equipment-card-image {
            height: 240px;
          }
          
          .equipment-card-title {
            font-size: 18px;
          }
          
          .equipment-card-description {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="equipment-container">
        {/* Header */}
        <div className="equipment-header">
          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            Our Equipments & Capabilities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            From installation to recycling, we manage the entire lifecycle of your industrial power systems.
          </motion.p>
        </div>

        {/* Top 6 Cards Grid */}
        <div className="equipment-grid">
          {equipmentData.slice(0, 6).map((equipment, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={equipment.id}
                className="equipment-card"
                initial={{
                  opacity: 0,
                  y: 80,
                  x: isEven ? -30 : 30,
                  scale: 0.9
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  x: 0,
                  scale: 1
                }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <motion.img
                  src={equipment.image}
                  alt={equipment.title}
                  className="equipment-card-image"
                  initial={{ scale: 1.2, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.15 + 0.2,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                />
                <motion.div
                  className="equipment-card-overlay"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15 + 0.4,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <h3 className="equipment-card-title">{equipment.title}</h3>
                  <p className="equipment-card-description">{equipment.description}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom 2 Cards Grid */}
        <div className="equipment-grid-bottom">
          {equipmentData.slice(6, 8).map((equipment, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={equipment.id}
                className="equipment-card"
                initial={{
                  opacity: 0,
                  y: 80,
                  x: isEven ? -40 : 40,
                  scale: 0.9
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  x: 0,
                  scale: 1
                }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <motion.img
                  src={equipment.image}
                  alt={equipment.title}
                  className="equipment-card-image"
                  initial={{ scale: 1.2, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2 + 0.2,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                />
                <motion.div
                  className="equipment-card-overlay"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2 + 0.4,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <h3 className="equipment-card-title">{equipment.title}</h3>
                  <p className="equipment-card-description">{equipment.description}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EquipmentCapabilities;
