import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectCatalog } from '../hooks/useProjectCatalog';
import { ArrowRight } from 'lucide-react';

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function RecentProjects() {
  const navigate = useNavigate();
  const { activeProjects, isLoading: loading } = useProjectCatalog({ featuredOnHome: true });
  const projects = activeProjects;
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

  if (loading) return null;
  if (!projects || projects.length === 0) return null;

  return (
    <section className="w-full py-12 md:py-20 bg-white font-sans overflow-hidden select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-16 flex flex-col gap-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start self-stretch gap-6 lg:gap-0">
          <div className="flex flex-col items-start w-full lg:w-[450px] gap-3">
            <div className="flex flex-col items-start self-stretch">
              <span className="text-[#383A3C] text-[24px] sm:text-[28px] lg:text-[33px] font-bold leading-tight">
                Recent Projects
              </span>
            </div>
            <span className="text-[#1F2937] text-[16px] sm:text-[18px] lg:text-[19px] font-normal leading-relaxed">
              See our expertise in action across the country.
            </span>
          </div>

          <button 
            className="flex items-center justify-center bg-[#F06123] hover:bg-[#FF8803] text-left w-full sm:w-auto py-3.5 px-6 mt-0 lg:mt-4 gap-2.5 rounded-xl border-0 shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/project')}
          >
            <span className="text-white text-[15px] font-bold">
              View Full Portfolio
            </span>
            <ArrowRight className="w-[18px] h-[18px] text-white" />
          </button>
        </div>

        {/* MOBILE SLIDER (< 768px): 1 Card per screen with swipe */}
        <div className="block md:hidden">
          <div
            ref={mobileSliderRef}
            onScroll={handleMobileScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 -mx-4 px-5 scroll-smooth"
            style={{ 
              WebkitOverflowScrolling: 'touch', 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none' 
            }}
          >
            {/* Inline style block to handle webkit scrollbar for this specific component if global utility is missing */}
            <style dangerouslySetInnerHTML={{__html: `
              div::-webkit-scrollbar {
                display: none;
              }
            `}} />
            {projects.map((project, index) => (
              <div key={project.id || index} className="w-[85vw] sm:w-[320px] shrink-0 snap-center">
                <ProjectCard project={project} index={index} navigate={navigate} isMobile={true} />
              </div>
            ))}
          </div>

          {/* Mobile Dot Indicators */}
          {projects.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {projects.map((_, i) => (
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
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id || index} project={project} index={index} navigate={navigate} isMobile={false} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ProjectCard({ project, index, navigate, isMobile }) {
  return (
    <motion.div
      variants={scaleIn}
      initial={isMobile ? { opacity: 1, scale: 1 } : "hidden"}
      whileInView={isMobile ? { opacity: 1, scale: 1 } : "visible"}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={{ y: -8, scale: 1.03 }}
      onClick={() => navigate(`/project/${project.slug}`)}
      className="flex flex-col items-start bg-cover bg-center w-full min-h-[260px] md:min-h-[280px] p-6 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0px_15px_35px_rgba(0,0,0,0.2)] group relative border border-slate-100"
      style={{
        backgroundImage: `url('${project.image}')`,
      }}
    >
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 group-hover:from-black/95 transition-all duration-300" />

      {/* Card Content */}
      <div className="text-white text-base w-full mt-auto relative z-20 transform transition-all duration-300 group-hover:translate-y-[-3px]">
        <span className="text-[#F06123] text-lg sm:text-[19px] font-bold block mb-1">
          {project.title}
        </span>
        <span className="text-white/90 text-sm sm:text-base font-normal leading-relaxed line-clamp-2">
          {project.description}
        </span>
      </div>
    </motion.div>
  );
}
