import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const HeroSection = ({ 
  badge = "Nationwide Industrial Battery Services",
  title = {
    line1: { white: "Reliable Power ", orange: "Starts" },
    line2: { white: "with Reliable ", orange: "Batteries" }
  },
  description = "Complete industrial battery maintenance, diagnostics, testing, and reconditioning services. We ensure your critical power infrastructure never fails.",
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
    <section className="flex flex-col w-full max-w-[660px] items-start md:items-start gap-4 md:gap-7 mt-2 md:mt-4 px-2 md:px-0 ml-1 md:ml-4">
      {/* Top Badge Pill */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#F06123] rounded-full shadow-sm">
        <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full" />
        <span 
          className="text-white text-[13px] font-normal tracking-normal leading-none"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {badge}
        </span>
      </div>

      {/* Main Heading */}
      <div className="flex flex-col items-start gap-3 md:gap-6 w-full">
        <h1 
          className="text-[30px] sm:text-[36px] md:text-[48px] xl:text-[58px] font-bold leading-[1.15] tracking-[-0.3px] max-w-[620px]"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE4D6 55%, #F3B38A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title.line1.white}{title.line1.orange}
          <br />
          {title.line2.white}{title.line2.orange}
        </h1>

        {/* Subtitle */}
        <p 
          className="text-white text-[17px] md:text-[19px] font-semibold leading-[1.65] max-w-[580px]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {description}
        </p>
      </div>

      {/* Hero Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 w-full md:w-auto">
        <button 
          className="hero-button flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-[#F06123] hover:bg-[#FF8803] text-white text-[15px] font-bold rounded-xl transition-all duration-300 whitespace-nowrap shadow-lg shadow-[#F06123]/25"
          style={{
            backgroundColor: '#F06123',
            border: 'none',
            fontFamily: "'Poppins', sans-serif"
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
