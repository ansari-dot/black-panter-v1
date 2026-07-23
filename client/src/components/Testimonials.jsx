import React, { useState, useRef } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTestimonialCatalog } from "../hooks/useTestimonialCatalog";

export default function Testimonials() {
  const { testimonials } = useTestimonialCatalog();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const mobileSliderRef = useRef(null);

  const slideLeft = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const slideRight = () => {
    const totalDesktopSlides = Math.max(0, testimonials.length - 3);
    if (currentSlide < totalDesktopSlides) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

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
      behavior: "smooth",
    });
    setActiveMobileSlide(index);
  };

  if (!testimonials.length) return null;

  return (
    <section className="w-full py-12 md:py-24 bg-[#f4f4f4] font-sans overflow-hidden select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-16">
        
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-2.5 text-[#F06123]">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-3 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
            Real experiences from businesses and individuals who trust Black Panther Batteries.
          </p>
        </div>

        {/* MOBILE SLIDER (< 768px): 1 Card per screen with touch swipe */}
        <div className="block md:hidden">
          <div
            ref={mobileSliderRef}
            onScroll={handleMobileScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 -mx-4 px-5 scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {testimonials.map((t, index) => (
              <div key={t._id || index} className="w-[85vw] sm:w-[320px] shrink-0 snap-center">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>

          {/* Mobile Dot Indicators */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToMobileSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeMobileSlide === i ? "w-6 bg-[#F06123]" : "w-2 bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP SLIDER (>= 768px): 3 Cards per view */}
        <div className="hidden md:block">
          <div className="relative overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / 3 + 1)}%)`,
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={t._id}
                  className="w-[calc((100%-48px)/3)] shrink-0"
                >
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Slider Controls */}
          {testimonials.length > 3 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-800 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all cursor-pointer"
                onClick={slideLeft}
                disabled={currentSlide === 0}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-2 items-center">
                {Array.from({ length: Math.max(1, testimonials.length - 2) }).map(
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentSlide ? "w-6 bg-[#F06123]" : "w-2 bg-slate-300"
                      }`}
                    />
                  )
                )}
              </div>

              <button
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-800 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all cursor-pointer"
                onClick={slideRight}
                disabled={currentSlide >= testimonials.length - 3}
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

function TestimonialCard({ t }) {
  const imageUrl = t.image || null;

  return (
    <div className="flex flex-col justify-between gap-4 bg-white rounded-2xl p-6 border-t-4 border-t-[#F06123] shadow-md hover:shadow-xl transition-all duration-300 h-full">
      {/* Top Section */}
      <div className="flex flex-col gap-3">
        {/* Quote Icon */}
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F06123]/10">
          <Quote className="text-[#F06123]" size={18} />
        </div>

        {/* Testimonial Message */}
        <p className="text-sm leading-relaxed text-slate-700 italic">
          &ldquo;{t.message}&rdquo;
        </p>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 mt-2">
        {/* Rating Stars */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, si) => (
            <Star
              key={si}
              size={14}
              className={si < t.rating ? "text-[#F06123] fill-[#F06123]" : "text-slate-200 fill-slate-200"}
            />
          ))}
        </div>

        {/* Reviewer Info */}
        <div className="flex items-center gap-3">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={t.name}
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-[#F06123] text-white">
              {t.name?.[0] || "U"}
            </div>
          )}
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 m-0 leading-tight">
              {t.name}
            </p>
            {t.company && (
              <p className="text-[11px] text-slate-500 m-0 mt-0.5">
                {t.company}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}