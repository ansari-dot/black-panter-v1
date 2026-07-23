import React, { useCallback, useEffect } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTestimonialCatalog } from "../hooks/useTestimonialCatalog";

export default function Testimonials() {
  const { testimonials } = useTestimonialCatalog();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const getCardWidth = useCallback(() => {
    const wrapper = document.getElementById("sliderWrapper");
    if (!wrapper) return 300;
    const gap = 24;
    return (wrapper.offsetWidth - gap * 2) / 3 + gap;
  }, []);

  const updateSlider = useCallback(() => {
    const track = document.getElementById("sliderTrack");
    if (!track) return;
    const offset = currentSlide * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;

    const dots = document.querySelectorAll(".dot");
    dots.forEach((d, i) => {
      d.classList.toggle("active", i === currentSlide);
    });
  }, [currentSlide, getCardWidth]);

  useEffect(() => {
    updateSlider();
  }, [currentSlide, updateSlider]);

  const slideLeft = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const slideRight = () => {
    const totalSlides = Math.max(0, testimonials.length - 3);
    if (currentSlide < totalSlides) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  if (!testimonials.length) return null;

  return (
    <section
      className="w-full py-20"
      style={{
        backgroundColor: "#f4f4f4",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-[0.15em] mb-3"
            style={{ color: "#e87722" }}
          >
            Testimonials
          </span>
          <h2
            className="text-[40px] font-bold leading-tight mb-3"
            style={{ color: "#1a1a1a" }}
          >
            What Our Customers Say
          </h2>
          <p
            className="text-[15px] max-w-[500px] mx-auto leading-relaxed"
            style={{ color: "#888888" }}
          >
            Real experiences from businesses and individuals who trust Black
            Panther Batteries.
          </p>
        </div>

        {/* Slider */}
        <div className="slider-wrapper relative overflow-hidden" id="sliderWrapper">
          <div
            className="slider-track flex gap-6 transition-transform duration-400"
            id="sliderTrack"
            style={{ transition: "transform 0.4s ease" }}
          >
            {testimonials.map((t, i) => {
              const imageUrl = t.image || null;

              return (
                <div
                  key={t._id}
                  className="testimonial-card flex flex-col gap-4"
                  style={{
                    flex: "0 0 calc((100% - 48px) / 3)",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "32px 28px 28px",
                    borderTop: "3px solid #e87722",
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.07)",
                    minWidth: 0,
                  }}
                >
                  {/* Quote Icon */}
                  <div
                    className="w-9 h-9 flex items-center justify-center rounded-md"
                    style={{
                      background: "rgba(232, 119, 34, 0.12)",
                    }}
                  >
                    <Quote
                      style={{ fontSize: 18, color: "#e87722" }}
                      size={18}
                    />
                  </div>

                  {/* Testimonial Text */}
                  <p
                    className="flex-1 text-[14px] leading-[1.7]"
                    style={{ color: "#1a1a1a" }}
                  >
                    &ldquo;{t.message}&rdquo;
                  </p>

                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        size={16}
                        style={{
                          color: si < t.rating ? "#e87722" : "#e5e7eb",
                        }}
                        fill={si < t.rating ? "#e87722" : "#e5e7eb"}
                      />
                    ))}
                  </div>

                  {/* Reviewer Info */}
                  <div
                    className="flex items-center gap-3 pt-4"
                    style={{ borderTop: "1px solid #e2e2e2" }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        style={{ border: "2px solid #f3f4f6" }}
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          background: "#e87722",
                          color: "#ffffff",
                        }}
                      >
                        {t.name?.[0] || "U"}
                      </div>
                    )}
                    <div>
                      <p
                        className="text-sm font-semibold m-0"
                        style={{ color: "#1a1a1a" }}
                      >
                        {t.name}
                      </p>
                      <p
                        className="text-xs m-0 mt-0.5"
                        style={{ color: "#888888" }}
                      >
                        {t.company}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slider Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: "#ffffff",
              border: "1.5px solid #e2e2e2",
              color: "#1a1a1a",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.07)",
            }}
            onClick={slideLeft}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="slider-dots flex gap-2 items-center">
            {Array.from({ length: Math.max(1, testimonials.length - 2) }).map(
              (_, i) => (
                <div
                  key={i}
                  className={`dot ${i === currentSlide ? "active" : ""}`}
                  style={{
                    width: i === currentSlide ? "24px" : "8px",
                    height: "8px",
                    borderRadius: i === currentSlide ? "4px" : "50%",
                    background: i === currentSlide ? "#e87722" : "#e2e2e2",
                    transition: "all 0.3s ease",
                  }}
                />
              )
            )}
          </div>

          <button
            className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: "#ffffff",
              border: "1.5px solid #e2e2e2",
              color: "#1a1a1a",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.07)",
            }}
            onClick={slideRight}
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}