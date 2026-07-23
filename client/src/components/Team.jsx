import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTeamCatalog } from '../hooks/useTeamCatalog';

const TeamSection = ({
  title = 'Meet Our Experts',
  subtitle = 'Certified engineers and technicians dedicated to your power reliability.',
}) => {
  const { activeMembers: members, isLoading: loading, isError } = useTeamCatalog();
  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const mobileSliderRef = useRef(null);

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
      behavior: 'smooth',
    });
    setActiveMobileSlide(index);
  };

  if (loading) {
    return (
      <section className="w-full py-12 bg-[#f9fafb] text-center text-slate-500 font-sans">
        Loading team members...
      </section>
    );
  }

  if (!members || members.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-24 bg-[#f9fafb] font-sans overflow-hidden select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-16">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight mb-2">
            {title}
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-normal leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* MOBILE SLIDER (< 768px): 1 Card per screen with swipe */}
        <div className="block md:hidden">
          <div
            ref={mobileSliderRef}
            onScroll={handleMobileScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 -mx-4 px-5 scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {members.map((member, index) => (
              <div key={member.id || index} className="w-[85vw] sm:w-[320px] shrink-0 snap-center">
                <TeamCard member={member} index={index} />
              </div>
            ))}
          </div>

          {/* Mobile Dot Indicators */}
          {members.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {members.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToMobileSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeMobileSlide === i ? 'w-6 bg-[#F06123]' : 'w-2 bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP GRID (>= 768px): 3-Column Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <TeamCard key={member.id || index} member={member} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

function TeamCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="flex flex-col items-center group cursor-pointer w-full"
    >
      <div className="w-full h-[360px] rounded-2xl overflow-hidden bg-slate-200 shadow-md group-hover:shadow-xl transition-all duration-300">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex flex-col items-center mt-4 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#F06123] transition-colors">
          {member.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          {member.role}
        </p>
      </div>
    </motion.div>
  );
}

export default TeamSection;
