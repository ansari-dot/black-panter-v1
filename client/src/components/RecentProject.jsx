import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProjectCatalog } from '../hooks/useProjectCatalog';
import { ArrowRight } from 'lucide-react';

export default function RecentProjects() {
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

  if (loading) {
    return (
      <section className="w-full py-12 bg-white text-center text-slate-500 font-sans">
        Loading projects...
      </section>
    );
  }

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-24 bg-white font-sans overflow-hidden select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 text-[#F06123] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="block w-8 h-[2px] bg-[#F06123] opacity-60" />
              Recent Portfolio
              <span className="block w-8 h-[2px] bg-[#F06123] opacity-60" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Recent Projects
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-2 max-w-lg leading-relaxed">
              See our expertise in action delivering critical battery infrastructure across the country.
            </p>
          </div>
        </div>

        {/* MOBILE SLIDER (< 768px): 1 Card per screen with swipe */}
        <div className="block md:hidden">
          <div
            ref={mobileSliderRef}
            onScroll={handleMobileScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 -mx-4 px-5 scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {projects.map((project, index) => (
              <div key={project.id || index} className="w-[85vw] sm:w-[320px] shrink-0 snap-center">
                <ProjectCard project={project} index={index} />
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

        {/* DESKTOP GRID (>= 768px): Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id || index} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="relative rounded-2xl overflow-hidden h-[340px] w-full cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 group flex flex-col justify-end p-6 border border-slate-100"
      style={{
        backgroundImage: `url('${project.image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity group-hover:opacity-95" />

      {/* Top Accent Line */}
      {project.gradient && (
        <div
          className="absolute top-0 left-0 right-0 h-1.5 z-20"
          style={{ background: project.gradient }}
        />
      )}

      {/* Content */}
      <div className="relative z-20 flex flex-col gap-2">
        <h3 className="text-xl font-extrabold text-[#FF8803] group-hover:text-white transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="text-xs sm:text-sm text-white/85 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <Link
          to={`/project/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#FF8803] mt-2 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
