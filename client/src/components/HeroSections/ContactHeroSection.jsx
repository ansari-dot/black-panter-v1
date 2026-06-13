import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const HeroSection = ({ 
  badge = "Get in Touch",
  title = {
    line1: { white: "Let's ", orange: "Connect" },
    line2: { white: "and Power Your ", orange: "Success" }
  },
  description = "Ready to discuss your battery service needs? Our team of experts is here to help. Contact us today for a consultation or quote.",
  primaryButtonText = "Send Message",
  secondaryButtonText = "Call Us Now"
}) => {
  const navigate = useNavigate();

  const handlePrimaryClick = () => {
    navigate('/contact');
  };

  const handleSecondaryClick = () => {
    // For "Call Us Now", we'll also navigate to contact page
    // In a real app, this could open a phone dialer
    navigate('/contact');
  };
  return (
    <section className="flex flex-col w-full max-w-[700px] items-start gap-4 md:gap-8 mt-4 md:mt-8 px-4 md:px-0">
      {/* Badge */}
      <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#F06123] rounded-full">
        <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full" />
        <span className="text-white text-xs md:text-sm font-medium">
          {badge}
        </span>
      </div>

      {/* Main Heading */}
      <div className="flex flex-col items-start gap-3 md:gap-6 w-full">
        <h1 
          className="text-3xl md:text-5xl font-bold leading-tight"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE4D6 50%, #F3B38A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {title.line1.white}{title.line1.orange}
          <br />
          {title.line2.white}{title.line2.orange}
        </h1>

        {/* Description */}
        <p className="text-white text-sm md:text-lg leading-relaxed max-w-[600px]">
          {description}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 w-full md:w-auto">
        <button 
          className="hero-button flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-[#F06123] hover:bg-[#FF8803] text-white font-bold text-sm md:text-base rounded-xl transition-all duration-300 whitespace-nowrap"
          style={{
            backgroundColor: '#F06123',
            border: 'none'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#FF8803'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#F06123'}
          onClick={handlePrimaryClick}
        >
          {primaryButtonText}
          <ArrowRightIcon className="w-4 md:w-5 h-4 md:h-5" />
        </button>

        <button 
          className="hero-button px-5 md:px-6 py-2.5 md:py-3 bg-white hover:bg-gray-100 text-[#383A3C] font-bold text-sm md:text-base rounded-xl transition-all duration-300 whitespace-nowrap"
          style={{
            backgroundColor: '#ffffff',
            border: 'none'
          }}
          onClick={handleSecondaryClick}
        >
          {secondaryButtonText}
        </button>
      </div>
    </section>
  );
};
