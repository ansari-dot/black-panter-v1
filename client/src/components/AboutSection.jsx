import React from "react";
import { Zap, Clock3, TrendingDown, BatteryCharging } from "lucide-react";

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
      className="w-full min-h-[812px] relative"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundColor: "#f8f8f8",
        color: "#0d1117",
      }}
    >
      <div className="flex flex-col lg:flex-row items-start gap-14 px-6 md:px-10 lg:px-16 py-20 w-full">
        {/* LEFT CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col gap-0">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-[3px] bg-[#e85c1a] rounded-sm" />
            <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[#e85c1a]">
              About Us
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[52px] font-black leading-[1.1] text-[#0d1117] mb-5" style={{ fontWeight: 900 }}>
            Powering Industry<br />
            <span className="text-[#e85c1a]">Since 2005</span>
          </h1>

          {/* Accent Bar */}
          <div className="w-[52px] h-1 bg-[#e85c1a] rounded-sm mb-7" />

          {/* Description */}
          <p className="text-[15px] text-[#6b7280] leading-[1.75] mb-10 max-w-[540px]">
            We are a full-service industrial battery maintenance facility with
            20+ years of experience specializing in preventive care,
            troubleshooting, and lifecycle management of high-reliability
            battery systems.
          </p>

          {/* Industries Label */}
          <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#6b7280] mb-4">
            Industries We Serve
          </div>

          {/* Industries Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-9">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 px-[18px] py-3.5 bg-white border border-[#e2e4e8] rounded-xl text-sm font-medium text-[#0d1117] cursor-pointer hover:border-[#e85c1a] transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#e85c1a] flex-shrink-0" />
                {industry}
              </div>
            ))}
          </div>

          {/* Outcomes Card */}
          <div
            className="p-5 rounded-xl border flex items-start gap-3.5"
            style={{
              backgroundColor: "#fff0e8",
              borderColor: "#f5c7a8",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg bg-[#e85c1a] flex items-center justify-center flex-shrink-0 mt-0.5"
            >
              <Zap className="text-white" size={18} />
            </div>
            <div>
              <strong className="text-sm font-bold text-[#e85c1a] block mb-1">
                Key outcomes:
              </strong>
              <p className="text-sm text-[#3d4350] leading-relaxed">
                Uninterrupted operations, reduced downtime, extended battery
                life.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full lg:w-[500px] flex-shrink-0 flex flex-col gap-4">
          {/* Image Card */}
          <div className="w-full h-[408px] rounded-xl overflow-hidden relative">
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
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-white"
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
              <div className="min-h-[92px] flex flex-col items-center justify-center gap-2.5 bg-white border border-[#e2e4e8] rounded-xl p-3.5 text-center">
                <div className="w-[34px] h-[34px] rounded-lg bg-[#e85c1a] flex items-center justify-center flex-shrink-0">
                  <Clock3 className="text-white" size={16} />
                </div>
                <span className="text-xs font-medium text-[#0d1117] leading-snug">
                  Uninterrupted Operations
                </span>
              </div>

              {/* KPI 2 */}
              <div className="min-h-[92px] flex flex-col items-center justify-center gap-2.5 bg-white border border-[#e2e4e8] rounded-xl p-3.5 text-center">
                <div className="w-[34px] h-[34px] rounded-lg bg-[#e85c1a] flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="text-white" size={16} />
                </div>
                <span className="text-xs font-medium text-[#0d1117] leading-snug">
                  Downtime Reduced
                </span>
              </div>

              {/* KPI 3 */}
              <div className="min-h-[92px] flex flex-col items-center justify-center gap-2.5 bg-white border border-[#e2e4e8] rounded-xl p-3.5 text-center">
                <div className="w-[34px] h-[34px] rounded-lg bg-[#e85c1a] flex items-center justify-center flex-shrink-0">
                  <BatteryCharging className="text-white" size={16} />
                </div>
                <span className="text-xs font-medium text-[#0d1117] leading-snug">
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