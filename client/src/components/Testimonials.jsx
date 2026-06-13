import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const cardVariants = {
  initial: { y: 60, opacity: 0, scale: 0.95 },
  animate: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const gradients = [
  'linear-gradient(to right, #F06123, #FF8803)',
  'linear-gradient(to right, #FF8803, #F06123)',
  'linear-gradient(to right, #F06123, #FF8803, #F06123)',
];

export default function TestimonialsCards() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/testimonials`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data))
          setTestimonials(data.filter((t) => t.status === 'Approved'));
      })
      .catch(() => {});
  }, []);

  if (!testimonials.length) return null;

  return (
    <>
      <style>{`
        .testimonials-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          padding: 0 16px;
          margin-bottom: 40px;
          width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); padding: 0 32px; }
        }
        @media (min-width: 1024px) {
          .testimonials-grid { grid-template-columns: repeat(3, 1fr); padding: 0 48px; }
        }
      `}</style>

      <div className="testimonials-grid">
        {testimonials.map((t, i) => {
          const imageUrl = t.image
            ? t.image.startsWith('http') ? t.image : `${API}${t.image}`
            : null;

          return (
            <motion.div
              key={t._id}
              variants={cardVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ y: -8, scale: 1.02, borderColor: 'rgba(240,97,35,0.3)', boxShadow: '0 15px 35px rgba(240,97,35,0.15)', transition: { duration: 0.3 } }}
              style={{
                display: 'flex', flexDirection: 'column', backgroundColor: 'white',
                minHeight: '300px', padding: '32px', borderRadius: '16px',
                border: '2px solid #f3f4f6', position: 'relative', overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              {/* Accent line */}
              <motion.div
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: gradients[i % gradients.length], transformOrigin: 'left' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />

              {/* Quote icon */}
              <div style={{ width: 48, height: 48, background: 'rgba(240,97,35,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Quote style={{ width: 24, height: 24, color: '#F06123' }} />
              </div>

              {/* Message */}
              <p style={{ color: '#374151', fontSize: 17, lineHeight: 1.75, flex: 1, marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>
                "{t.message}"
              </p>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} style={{ width: 18, height: 18, color: si < t.rating ? '#FF8803' : '#e5e7eb' }} fill={si < t.rating ? '#FF8803' : '#e5e7eb'} />
                ))}
              </div>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 'auto' }}>
                {imageUrl
                  ? <img src={imageUrl} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f3f4f6' }} />
                  : <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(to br, #F06123, #FF8803)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18 }}>{t.name?.[0]}</div>
                }
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#070B15', fontFamily: 'Poppins, sans-serif' }}>{t.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>{t.company}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
