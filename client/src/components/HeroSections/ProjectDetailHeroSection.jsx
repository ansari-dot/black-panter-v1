
import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export const HeroSection = ({ 
  badge = "Detailed Service Information",
  title = {
    line1: { white: "Expert ", orange: "Solutions" },
    line2: { white: "Tailored for ", orange: "You" }
  },
  description = "Discover our specialized battery services designed to maximize performance, extend battery life, and ensure uninterrupted power for your critical operations.",
  primaryButtonText = "Request Service",
  secondaryButtonText = "Contact Expert"
}) => {
  return (
    <section className="flex flex-col w-full max-w-[640px] items-start md:items-start gap-4 md:gap-7 mt-2 md:mt-4 px-2 md:px-0 ml-1 md:ml-4">
      {/* Badge */}
      <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#D4480A] rounded-full">
        <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full" />
        <span className="text-white text-xs md:text-sm font-medium">
          {badge}
        </span>
      </div>

      {/* Main Heading */}
      <div className="flex flex-col items-start gap-3 md:gap-6 w-full">
        <h1 
          className="text-3xl md:text-[3.5rem] lg:text-[3.85rem] font-bold leading-[1.06] tracking-tight max-w-[600px]"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE4D6 55%, #F3B38A 100%)',
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
        <p className="text-white text-sm md:text-[1rem] leading-relaxed max-w-[560px] text-white/88">
          {description}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 w-full md:w-auto">
        <button 
          className="hero-button flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-[#F06123] hover:bg-[#FF8803] text-white font-bold text-sm md:text-base rounded-xl transition-all duration-300 whitespace-nowrap shadow-lg shadow-[#F06123]/25"
          style={{
            backgroundColor: '#F06123',
            border: 'none'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#FF8803'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#F06123'}
        >
          {/whatsapp|buy/i.test(primaryButtonText) ? <FaWhatsapp className="w-4 md:w-5 h-4 md:h-5" /> : null}
          {primaryButtonText}
          {/whatsapp|buy/i.test(primaryButtonText) ? null : <ArrowRightIcon className="w-4 md:w-5 h-4 md:h-5" />}
        </button>

        <button 
          className="hero-button px-5 md:px-6 py-2.5 md:py-3 bg-white hover:bg-gray-100 text-[#383A3C] font-bold text-sm md:text-base rounded-xl transition-all duration-300 whitespace-nowrap"
          style={{
            backgroundColor: '#ffffff',
            border: 'none'
          }}
        >
          {secondaryButtonText}
        </button>
      </div>
    </section>
  );
};
