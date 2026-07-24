import React from "react";
import { Zap, Clock3, TrendingDown, BatteryCharging } from "lucide-react";

const systemSansFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif";

export const AboutSection = () => {
  const industries = [
    "Power generation & utilities",
    "Telecommunications infrastructure",
    "Data centers & server farms",
    "Healthcare facilities",
    "Transportation & logistics",
    "Manufacturing plants",
    "Oil and gas",
    "Aviation & aerospace",
  ];

  return (
    <section
      className="w-full min-h-[700px] relative"
      style={{
        fontFamily: systemSansFont,
        backgroundColor: "#f8f8f8",
        color: "#0d1117",
      }}
    >
      <div className="flex flex-col lg:flex-row items-start gap-14 px-6 md:px-10 lg:px-16 py-16 md:py-20 w-full max-w-[1280px] mx-auto">
        {/* LEFT CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col gap-0">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-[3px] bg-[#F06123] rounded-sm" />
            <span className="text-[13px] font-bold tracking-[0.12em] uppercase text-[#F06123]">
              About Us
            </span>
          </div>

          {/* Title: 33px (Mobile 24px -> Desktop 33px), Bold (700), #383A3C */}
          <h2 
            className="text-[24px] md:text-[33px] font-bold leading-tight text-[#383A3C] mb-4" 
            style={{ fontFamily: systemSansFont, fontWeight: 700 }}
          >
            Powering Industry Since 2005
          </h2>

          {/* Accent Bar */}
          <div className="w-[52px] h-1 bg-[#F06123] rounded-sm mb-6" />

          {/* Body Text: 19px (Mobile 16px -> Desktop 19px), Regular (400), #6B7280 */}
          <p 
            className="text-[16px] md:text-[19px] font-normal text-[#6B7280] leading-[1.75] mb-8 max-w-[560px]"
            style={{ fontFamily: systemSansFont }}
          >
            We are a full-service industrial battery maintenance facility with 20+ years of experience specializing in preventive care, troubleshooting, and lifecycle management of high-reliability battery systems.
          </p>

          {/* Industries Label */}
          <div className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#6B7280] mb-4">
            Industries We Serve
          </div>

          {/* Industries Grid: 14px, Regular (400), #6B7280 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 px-4 py-3 bg-white border border-[#e2e4e8] rounded-xl text-[14px] font-normal text-[#6B7280] hover:border-[#F06123] transition-colors"
                style={{ fontFamily: systemSansFont }}
              >
                <span className="w-2 h-2 rounded-full bg-[#F06123] flex-shrink-0" />
                {industry}
              </div>
            ))}
          </div>

          {/* Outcomes Card: 19px (Mobile 16px -> Desktop 19px), Regular (400), Brand Orange (#F06123) */}
          <div
            className="p-5 rounded-xl border flex items-start gap-3.5"
            style={{
              backgroundColor: "#fff0e8",
              borderColor: "#f5c7a8",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg bg-[#F06123] flex items-center justify-center flex-shrink-0 mt-0.5"
            >
              <Zap className="text-white" size={18} />
            </div>
            <div>
              <p 
                className="text-[16px] md:text-[19px] font-normal text-[#F06123] leading-relaxed m-0"
                style={{ fontFamily: systemSansFont }}
              >
                <strong className="font-bold">Key outcomes:</strong> Uninterrupted operations, reduced downtime, extended battery life.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full lg:w-[480px] flex-shrink-0 flex flex-col gap-4">
          {/* Image Card */}
          <div className="w-full h-[380px] rounded-2xl overflow-hidden relative shadow-md">
            <img
              src="https://storage.googleapis.com/banani-generated-images/generated-images/50bbf919-975c-4838-870f-b606d0f4c28f.jpg"
              alt="Industrial battery maintenance"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(13, 17, 23, 0.08) 0%, rgba(13, 17, 23, 0.18) 38%, rgba(13, 17, 23, 0.52) 100%)",
              }}
            />
            {/* Badge */}
            <div className="absolute top-4 left-4 right-4 flex items-center gap-2.5 z-10">
              <div
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.16)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255, 255, 255, 0.24)",
                }}
              >
                Industrial battery specialists
              </div>
            </div>
          </div>

          {/* KPI Panel */}
          <div className="w-full">
            <div className="grid grid-cols-3 gap-3">
              {/* KPI 1 */}
              <div className="min-h-[90px] flex flex-col items-center justify-center gap-2 bg-white border border-[#e2e4e8] rounded-xl p-3 text-center">
                <div className="w-8 h-8 rounded-lg bg-[#F06123] flex items-center justify-center flex-shrink-0">
                  <Clock3 className="text-white" size={15} />
                </div>
                <span className="text-xs font-medium text-[#383A3C] leading-snug">
                  Uninterrupted Operations
                </span>
              </div>

              {/* KPI 2 */}
              <div className="min-h-[90px] flex flex-col items-center justify-center gap-2 bg-white border border-[#e2e4e8] rounded-xl p-3 text-center">
                <div className="w-8 h-8 rounded-lg bg-[#F06123] flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="text-white" size={15} />
                </div>
                <span className="text-xs font-medium text-[#383A3C] leading-snug">
                  Downtime Reduced
                </span>
              </div>

              {/* KPI 3 */}
              <div className="min-h-[90px] flex flex-col items-center justify-center gap-2 bg-white border border-[#e2e4e8] rounded-xl p-3 text-center">
                <div className="w-8 h-8 rounded-lg bg-[#F06123] flex items-center justify-center flex-shrink-0">
                  <BatteryCharging className="text-white" size={15} />
                </div>
                <span className="text-xs font-medium text-[#383A3C] leading-snug">
                  Battery Life Extended
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};