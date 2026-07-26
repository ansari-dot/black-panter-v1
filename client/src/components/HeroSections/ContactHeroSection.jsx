import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const HeroSection = ({ 
  badge = "Nationwide Industrial Battery Services",
  title = {
    line1: { white: "Contact ", orange: "Us" },
    line2: { white: "", orange: "" }
  },
  description = "Get in touch with our expert team for custom battery solutions, urgent field service, or technical assistance.",
  primaryButtonText = "Request a Consultation",
  secondaryButtonText = "Explore Services"
}) => {
  const navigate = useNavigate();

  const handlePrimaryClick = () => {
    navigate('/contact');
  };

  const handleSecondaryClick = () => {
    navigate('/services');
  };

  return (
    <section className="flex flex-col w-full max-w-[700px] items-start gap-4 md:gap-8 mt-4 md:mt-8 px-4 md:px-0">
      {/* Top Badge Pill */}
      <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#F06123] rounded-full shadow-sm">
        <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full" />
        <span className="text-white text-[13px] font-normal tracking-normal leading-none font-sans">
          {badge}
        </span>
      </div>

      {/* Main Heading */}
      <div className="flex flex-col items-start gap-3 md:gap-6 w-full">
        <h1 
          className="text-lg sm:text-xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE4D6 50%, #F3B38A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title.line1 ? `${title.line1.white}${title.line1.orange}` : "Contact Us"}
          {title.line2 && (title.line2.white || title.line2.orange) && (
            <>
              <br />
              {title.line2.white}{title.line2.orange}
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p 
          className="text-[#FFFFFF] text-xs sm:text-sm md:text-lg font-semibold leading-relaxed max-w-[600px]"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
          }}
        >
          {description}
        </p>
      </div>

      {/* Hero Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 w-full md:w-auto">
        <button 
          className="hero-button flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-[#F06123] hover:bg-[#FF8803] text-white text-[15px] font-bold rounded-xl transition-all duration-300 whitespace-nowrap shadow-md"
          style={{
            backgroundColor: '#F06123',
            border: 'none',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF8803'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F06123'}
          onClick={handlePrimaryClick}
        >
          {primaryButtonText}
          <ArrowRightIcon className="w-4 md:w-5 h-4 md:h-5 text-white" />
        </button>

        <button 
          className="hero-button px-5 md:px-6 py-2.5 md:py-3 bg-white hover:bg-gray-100 text-[#383A3C] text-[15px] font-bold rounded-xl transition-all duration-300 whitespace-nowrap shadow-sm"
          style={{
            backgroundColor: '#ffffff',
            color: '#383A3C',
            border: 'none',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
          }}
          onClick={handleSecondaryClick}
        >
          {secondaryButtonText}
        </button>
      </div>
    </section>
  );
};
