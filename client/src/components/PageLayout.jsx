import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { ScrollToTop } from "./ScrollToTop";
import logo from '../assets/logo.webp';
import { useServiceCatalog } from "../hooks/useServiceCatalog";
import QuoteModal from "./QuoteModal";
import { getServiceCardIcon } from "../utils/serviceCatalog";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services", dropdownType: "services" },
  { label: "Products", path: "/product" },
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

export const PageLayout = ({ children, heroContent, backgroundImage, vectorBackground, backgroundSlider }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeServices } = useServiceCatalog();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleGetQuote = () => {
    setIsQuoteModalOpen(true);
  };

  // Handle slider functionality
  useEffect(() => {
    if (backgroundSlider && backgroundSlider.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % backgroundSlider.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [backgroundSlider]);

  // Determine which background to use
  const currentBackground = backgroundSlider ? backgroundSlider[currentSlide] : vectorBackground;
  const servicesDropdownItems = activeServices.slice(0, 6).map((service) => ({
    label: service.title,
    Icon: getServiceCardIcon(service.iconName, service.title),
    slug: service.slug,
  }));

  return (
    <div className="bg-[#f4f5f7] w-full overflow-x-hidden">
      {/* Hero Section with Background */}
      <div className="relative w-full min-h-[40vh] rounded-b-[3.5rem] md:rounded-b-[5.5rem] overflow-hidden">
        {/* Background Image Layer (behind vector) */}
        {backgroundImage && (
          <div className="absolute inset-0 w-full h-full">
            <img
              className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
              alt="Background"
              src={backgroundImage}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 w-full h-full bg-black/40" />
          </div>
        )}

        {/* Background Vector */}
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet={currentBackground}
            width="768"
            height="1024"
          />
          <img
            className="absolute top-0 md:top-[72px] left-1/2 -translate-x-1/2 w-full h-full object-cover object-center z-10 rounded-xl md:rounded-2xl"
            width="1920"
            height="1080"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            alt="Vector"
            src={currentBackground}
          />
        </picture>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-[100] pointer-events-auto">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile Logo */}
            <img
              className="w-[100px] h-[100px] object-contain pointer-events-none"
              width="100"
              height="100"
              loading="eager"
              decoding="async"
              alt="Black Panther Batteries Logo"
              src={logo}
            />

            {/* Mobile Menu Button */}
            <button
              className="flex items-center justify-center w-10 h-10 text-[#F06123] bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 relative z-[101] pointer-events-auto"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Desktop Logo */}
        <img
          className="hidden md:block absolute -top-6 left-1/2 -translate-x-1/2 w-[150px] h-[150px] object-contain z-50"
          width="150"
          height="150"
          loading="eager"
          decoding="async"
          alt="Black Panther Batteries Logo"
          src={logo}
        />

        {/* Navigation */}
        <nav className="relative w-full max-w-[1200px] mx-auto px-4 md:px-8 lg:px-8 pt-16 md:pt-24 z-50">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            {/* Navigation Items - Desktop */}
            <div className="flex items-center gap-4 md:gap-6 lg:gap-[39.75px]">
              {navigationItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.dropdownType ? (
                    <div className="relative group">
                      <Link
                        to={item.path}
                        className={`transition-all duration-300 p-0 m-0 flex items-center gap-1 ${location.pathname === item.path
                          ? 'opacity-100 font-extrabold'
                          : 'opacity-70 hover:opacity-100'
                          }`}
                      >
                        <span
                          className="font-bold text-[15.1px] whitespace-nowrap text-[#F06123]"
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            color: '#F06123'
                          }}
                        >
                          {item.label}
                        </span>
                        <IoIosArrowDown className="text-[#F06123] text-xs" />
                      </Link>

                      {item.dropdownType === 'services' && (
                        /* Services Dropdown - Desktop */
                        <div className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-lg shadow-xl border border-gray-200 py-3 z-[100] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
                        /* Products Dropdown - Desktop */
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[540px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-5 px-6 z-[100] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top">
                          <div className="grid grid-cols-2 gap-4">
                            {productDropdownCategories.map((category, idx) => (
                              <Link
                                key={idx}
                                to={category.path}
                                className="flex items-start gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-orange-50/20 group/item transition-all duration-200"
                              >
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 text-[#F06123] flex items-center justify-center group-hover/item:bg-[#F06123] group-hover/item:text-white transition-all duration-300">
                                  {category.icon}
                                </div>
                                <div>
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
                          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
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
                      to={item.path}
                      className={`transition-all duration-300 p-0 m-0 ${location.pathname === item.path
                        ? 'opacity-100 font-extrabold'
                        : 'opacity-70 hover:opacity-100'
                        }`}
                    >
                      <span
                        className="font-bold text-[15.1px] whitespace-nowrap text-[#F06123]"
                        style={{
                          fontFamily: 'DM_Sans, Helvetica',
                          color: '#F06123'
                        }}
                      >
                        {item.label}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side: Social Icons + Button - Desktop */}
            <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
              {/* Social Media Icons */}
              <div className="flex items-center gap-2 md:gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#F06123] flex items-center justify-center hover:bg-[#FF8803] transition-all duration-300"
                  aria-label="Black Panther Batteries on Facebook"
                >
                  <FaFacebookF className="text-white text-xs md:text-sm" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#F06123] flex items-center justify-center hover:bg-[#FF8803] transition-all duration-300"
                  aria-label="Black Panther Batteries on LinkedIn"
                >
                  <FaLinkedinIn className="text-white text-xs md:text-sm" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#F06123] flex items-center justify-center hover:bg-[#FF8803] transition-all duration-300"
                  aria-label="Black Panther Batteries on Instagram"
                >
                  <FaInstagram className="text-white text-xs md:text-sm" />
                </a>
              </div>

              <button
                className="quote-button w-[120px] md:w-[140px] lg:w-[157px] h-[40px] md:h-[43px] text-white font-bold text-[12px] md:text-[14px] lg:text-[16px] rounded-[30px] transition-all duration-300"
                style={{
                  backgroundColor: '#F06123',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FF8803';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#F06123';
                  e.target.style.transform = 'scale(1)';
                }}
                onClick={handleGetQuote}
                aria-label="Get a quote for battery services"
              >
                Get a Quote
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu - Modern Slide-in */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-[110] backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <div className="md:hidden fixed top-0 right-0 bottom-0 w-[90%] max-w-[400px] bg-white shadow-2xl z-[120] transform transition-transform duration-300 ease-in-out rounded-t-2xl">
              {/* Menu Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <span className="text-lg font-bold text-gray-800">Menu</span>
                <button
                  className="flex items-center justify-center w-10 h-10 p-2 text-gray-600 hover:text-gray-900 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-4">
                {navigationItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-50">
                    {item.dropdownType ? (
                      <div>
                        <button
                          onClick={() => {
                            if (item.dropdownType === 'services') {
                              setIsServicesOpen(!isServicesOpen);
                            } else if (item.dropdownType === 'products') {
                              setIsProductsOpen(!isProductsOpen);
                            }
                          }}
                          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200"
                        >
                          <span
                            className="font-semibold text-[16px] text-gray-900"
                            style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif"
                            }}
                          >
                            {item.label}
                          </span>
                          <IoIosArrowDown className={`text-gray-500 text-sm transition-transform duration-200 ${(item.dropdownType === 'services' ? isServicesOpen : isProductsOpen) ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Services Dropdown - Mobile */}
                        {item.dropdownType === 'services' && isServicesOpen && (
                          <div className="bg-gray-50">
                            {servicesDropdownItems.map((service, idx) => {
                              const IconComponent = service.Icon;
                              return (
                                <Link
                                  key={idx}
                                  to={`/service/${service.slug}`}
                                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-100 transition-colors duration-200 group min-h-[48px]"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <IconComponent className="text-xl text-gray-500 group-hover:text-[#F06123] transition-colors duration-200 flex-shrink-0" />
                                  <div className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-200 leading-relaxed block min-h-[44px]">
                                    {service.label}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}

                        {/* Products Dropdown - Mobile */}
                        {item.dropdownType === 'products' && isProductsOpen && (
                          <div className="bg-gray-50 py-1">
                            {productDropdownCategories.map((category, idx) => (
                              <Link
                                key={idx}
                                to={category.path}
                                className="flex items-start gap-4 px-8 py-3.5 hover:bg-gray-100 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-50 text-[#F06123] flex items-center justify-center">
                                  {category.icon}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-gray-800">
                                      {category.label}
                                    </span>
                                    {category.badge && (
                                      <span className="text-[9px] font-extrabold px-1 py-0.2 rounded bg-orange-100 text-[#F06123] uppercase">
                                        {category.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                                    {category.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={`block px-6 py-4 transition-all duration-200 ${location.pathname === item.path
                          ? 'bg-[#F06123]/10 border-l-4 border-[#F06123]'
                          : 'hover:bg-gray-50'
                          }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span
                          className="font-semibold text-[16px] text-gray-800"
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif"
                          }}
                        >
                          {item.label}
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-center gap-4 mb-4">

                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#F06123] flex items-center justify-center hover:bg-[#FF8803] transition-all duration-300 shadow-md"
                  >
                    <FaFacebookF className="text-white text-sm" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#F06123] flex items-center justify-center hover:bg-[#FF8803] transition-all duration-300 shadow-md"
                  >
                    <FaLinkedinIn className="text-white text-sm" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#F06123] flex items-center justify-center hover:bg-[#FF8803] transition-all duration-300 shadow-md"
                  >
                    <FaInstagram className="text-white text-sm" />
                  </a>
                </div>

                <button
                  className="w-full h-[48px] text-white font-bold text-[16px] rounded-[8px] transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: '#F06123'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#FF8803';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#F06123';
                  }}
                  onClick={handleGetQuote}
                  aria-label="Get a quote for battery services"
                >
                  Get a Quote
                </button>
              </div>
            </div>
          </>
        )}

        {/* Hero Section Content */}
        <div className="relative z-20 w-full max-w-[1200px] mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-14 md:pb-18 flex items-start min-h-[calc(40vh-150px)] md:min-h-0">
          {heroContent}
        </div>
      </div>

      {/* Page Content */}
      {children}

      {isQuoteModalOpen && (
        <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} sourceButton="PageLayout Get a Quote" />
      )}
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};
