import { ArrowRightIcon } from "lucide-react";
import React from "react";

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
  return (
    <section className="flex flex-col w-full max-w-[700px] items-start gap-8">
      {/* Badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#F06123] rounded-full">
        <div className="w-2 h-2 bg-white rounded-full" />
        <span className="text-white text-sm font-medium">
          {badge}
        </span>
      </div>

      {/* Main Heading */}
      <div className="flex flex-col items-start gap-6 w-full">
        <h1 
          className="text-5xl md:text-6xl font-bold leading-tight"
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
        <p className="text-white text-lg md:text-xl leading-relaxed max-w-[600px]">
          {description}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-4 w-full">
        <button 
          className="hero-button flex items-center gap-2 px-6 py-3 bg-[#F06123] hover:bg-[#FF8803] text-white font-bold rounded-xl transition-all duration-300"
          style={{
            backgroundColor: '#F06123',
            border: 'none'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#FF8803'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#F06123'}
        >
          {primaryButtonText}
          <ArrowRightIcon className="w-5 h-5" />
        </button>

        <button 
          className="hero-button px-6 py-3 bg-white hover:bg-gray-100 text-[#383A3C] font-bold rounded-xl transition-all duration-300"
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
