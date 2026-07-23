
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import QuoteModal from "./QuoteModal";

import { useServiceCatalog } from "../hooks/useServiceCatalog";
import { getServiceCardIcon } from "../utils/serviceCatalog";
import { IoIosArrowDown } from "react-icons/io";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services", dropdownType: "services" },
  { label: "Products", path: "/product" },
  { label: "Project", path: "/project" },
  { label: "Contact", path: "/contact" },
];

const productDropdownCategories = [
  {
    label: "Lithium Traction",
    description: "High-performance lithium batteries for industrial & traction vehicles.",
    path: "/product?category=Lithium%20Traction",
    badge: "Hot",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    label: "Solar & Deep Cycle",
    description: "Clean, renewable energy storage for off-grid & solar systems.",
    path: "/product?category=Solar%20%2F%20Deep%20Cycle",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    )
  },
  {
    label: "Lead-Acid Traction",
    description: "Traditional heavy-duty power solutions for forklifts & logistics.",
    path: "/product?category=Lead-Acid%20Traction",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    label: "Industrial Solutions",
    description: "Industrial energy storage engineered for critical infrastructure.",
    path: "/product?category=Industrial%20Solutions",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  }
];

export const Header = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const { activeServices } = useServiceCatalog();
  const servicesDropdownItems = activeServices.slice(0, 6).map((service) => ({
    label: service.title,
    Icon: getServiceCardIcon(service.iconName, service.title),
    slug: service.slug,
  }));

  return (
    <div className="relative w-full">
      <div className="relative w-full h-[804px] lg:h-[900px] xl:h-[1000px] 2xl:h-[1100px]">
        {/* Background Vector */}
        <img
          className="absolute top-[101px] lg:top-[120px] xl:top-[140px] left-[calc(50%-635px)] lg:left-[calc(50%-750px)] xl:left-[calc(50%-850px)] w-[1270px] lg:w-[1500px] xl:w-[1700px] h-[703px] lg:h-[800px] xl:h-[900px]"
          alt="Vector"
          src="https://c.animaapp.com/mj32vqleeMiOmR/img/vector-4.svg"
        />

        {/* Main Image */}
        <img
          className="absolute top-3 lg:top-4 xl:top-6 left-[calc(50%-64px)] lg:left-[calc(50%-80px)] xl:left-[calc(50%-96px)] w-[129px] lg:w-[160px] xl:w-[192px] h-[129px] lg:h-[160px] xl:h-[192px] object-cover opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:0ms]"
          alt="Image"
          src="https://c.animaapp.com/mj32vqleeMiOmR/img/image-9-1.png"
        />

        {/* Navigation */}
        <nav className="flex w-[1194px] lg:w-[1400px] xl:w-[1600px] 2xl:w-[1800px] items-center justify-between absolute top-28 lg:top-32 xl:top-36 left-36 lg:left-40 xl:left-48 2xl:left-56 opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:200ms]">
          {/* Navigation Items */}
          <div className="inline-flex items-center justify-center gap-[39.75px] lg:gap-[48px] xl:gap-[56px] px-[25.55px] lg:px-[32px] xl:px-[38px] py-[17px] lg:py-[20px] xl:py-[24px] rounded-[47.32px]">
            {navigationItems.map((item, index) => (
              <div key={index} className="relative">
                {item.dropdownType ? (
                  <div className="relative group">
                    <Link
                      to={item.path || "#"}
                      className="inline-flex items-center justify-center gap-1 transition-opacity hover:opacity-70 text-white"
                    >
                      <span className="relative w-fit mt-[-0.95px] [font-family:'Plus_Jakarta_Sans',sans-serif] font-bold text-white text-[15.1px] lg:text-[18px] xl:text-[21px] 2xl:text-[24px] text-center tracking-[0] leading-[15.2px] lg:leading-[18px] xl:leading-[21px] 2xl:leading-[24px] whitespace-nowrap flex items-center gap-1">
                        {item.label} <IoIosArrowDown className="text-white text-xs lg:text-sm" />
                      </span>
                    </Link>

                    {item.dropdownType === 'services' && (
                      <div className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-lg shadow-xl border border-gray-200 py-3 z-[100] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-left">
                        {servicesDropdownItems.map((service, idx) => {
                          const IconComponent = service.Icon;
                          return (
                            <Link
                              key={idx}
                              to={`/service/${service.slug}`}
                              className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors duration-200 group/item"
                            >
                              <IconComponent className="text-lg text-gray-500 group-hover/item:text-[#F06123] transition-colors duration-200 flex-shrink-0" />
                              <span className="text-sm text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors duration-200 leading-relaxed">
                                {service.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {item.dropdownType === 'products' && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[540px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-5 px-6 z-[100] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top text-left">
                        <div className="grid grid-cols-2 gap-4">
                          {productDropdownCategories.map((category, idx) => (
                            <Link
                              key={idx}
                              to={category.path}
                              className="flex items-start gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-orange-50/20 group/item transition-all duration-200 text-left"
                            >
                              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 text-[#F06123] flex items-center justify-center group-hover/item:bg-[#F06123] group-hover/item:text-white transition-all duration-300">
                                {category.icon}
                              </div>
                              <div className="text-left">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[14px] text-gray-900 group-hover/item:text-[#F06123] transition-colors duration-200">
                                    {category.label}
                                  </span>
                                  {category.badge && (
                                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-orange-100 text-[#F06123] uppercase tracking-wider">
                                      {category.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                                  {category.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                          <span className="text-gray-500">Need a custom battery configuration?</span>
                          <Link to="/contact" className="font-semibold text-[#F06123] hover:text-[#D4480A] flex items-center gap-1 transition-all duration-200 hover:translate-x-0.5">
                            Contact Experts <span className="text-sm">→</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path || "#"}
                    className="inline-flex items-center justify-center gap-[9.46px] transition-opacity hover:opacity-70"
                  >
                    <div className="relative w-fit mt-[-0.95px] [font-family:'Plus_Jakarta_Sans',sans-serif] font-bold text-white text-[15.1px] lg:text-[18px] xl:text-[21px] 2xl:text-[24px] text-center tracking-[0] leading-[15.2px] lg:leading-[18px] xl:leading-[21px] 2xl:leading-[24px] whitespace-nowrap">
                      {item.label}
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side: Logo / Button */}
          <div className="inline-flex items-center justify-center gap-[34px] lg:gap-[42px] xl:gap-[50px]">
            <img
              className="relative"
              alt="Frame"
              src="https://c.animaapp.com/mj32vqleeMiOmR/img/frame-20577.svg"
            />
            <Button 
              onClick={() => setIsQuoteModalOpen(true)}
              className="w-[157px] lg:w-[190px] xl:w-[220px] 2xl:w-[250px] h-[43px] lg:h-[52px] xl:h-[60px] 2xl:h-[68px] bg-c-1 hover:bg-c-1/90 rounded-[13px] lg:rounded-[16px] xl:rounded-[18px] transition-colors"
            >
              <span className="[font-family:'Plus_Jakarta_Sans',sans-serif] font-bold text-white text-[18.9px] lg:text-[22px] xl:text-[26px] 2xl:text-[30px] text-center tracking-[0] leading-[19px] lg:leading-[22px] xl:leading-[26px] 2xl:leading-[30px]">
                Get a Quote
              </span>
            </Button>
          </div>
        </nav>
      </div>
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} sourceButton="Header Get a Quote" />
    </div>
  );
};

