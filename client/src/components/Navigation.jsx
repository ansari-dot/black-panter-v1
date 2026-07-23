import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaBars, FaTimes } from "react-icons/fa";
import logo from '../assets/logo.webp';
import QuoteModal from "./QuoteModal";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Products", path: "/product" },
  { label: "Contact", path: "/contact" },
];

export const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <div className="relative w-full min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen 2xl:min-h-screen min-h-[600px] md:min-h-[700px] lg:min-h-[800px] xl:min-h-[900px] 2xl:min-h-[1000px] overflow-hidden">
      {/* Background Vector */}
      <img
        className="absolute top-[101px] left-1/2 -translate-x-1/2 w-full max-w-[1270px] h-auto z-10 md:top-[101px] lg:top-[101px] xl:top-[101px] 2xl:top-[101px]"
        style={{
          top: window.innerWidth < 768 ? '-50px' : '101px'
        }}
        alt="Vector"
        src="https://c.animaapp.com/mj32vqleeMiOmR/img/vector-4.svg"
      />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-[100]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile Logo */}
          <img
            className="w-[60px] h-[60px] object-contain"
            alt="Black Panther Batteries Logo"
            src={logo}
          />

          {/* Mobile Menu Button */}
          <button
            className="flex items-center justify-center w-10 h-10 text-[#F06123] bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 relative z-[101]"
            onClick={() => {
              console.log('Mobile menu clicked, current state:', isMobileMenuOpen);
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      <img
        className="hidden md:block absolute -top-2 left-1/2 -translate-x-1/2 w-[110px] h-[110px] object-contain z-50"
        alt="Black Panther Batteries Logo"
        src={logo}
      />

      {/* Navigation */}
      <nav className="relative w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-32 z-50">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between">
          {/* Navigation Items - Desktop */}
          <div className="flex items-center gap-6 md:gap-[39.75px]">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
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
            ))}
          </div>

          {/* Right Side: Social Icons + Button - Desktop */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F06123] flex items-center justify-center hover:bg-[#FF8803] transition-all duration-300"
                aria-label="Visit Black Panther Batteries on Facebook"
              >
                <FaFacebookF className="text-white text-sm" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F06123] flex items-center justify-center hover:bg-[#FF8803] transition-all duration-300"
                aria-label="Visit Black Panther Batteries on LinkedIn"
              >
                <FaLinkedinIn className="text-white text-sm" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F06123] flex items-center justify-center hover:bg-[#FF8803] transition-all duration-300"
                aria-label="Visit Black Panther Batteries on Instagram"
              >
                <FaInstagram className="text-white text-sm" />
              </a>
            </div>

            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="quote-button w-[140px] md:w-[157px] h-[43px] text-white font-bold text-[14px] md:text-[16px] rounded-[30px] transition-all duration-300"
              style={{
                backgroundColor: '#D4480A',
                border: '3px solid #000000 !important',
                borderColor: '#000000 !important',
                borderWidth: '3px !important',
                borderStyle: 'solid !important',
                outline: '3px solid #000000'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#F06123';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#D4480A';
                e.target.style.transform = 'scale(1)';
              }}
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
          <div className="md:hidden fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] bg-white shadow-2xl z-[120] transform transition-transform duration-300 ease-in-out">
            {/* Menu Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <span className="text-lg font-bold text-gray-800">Menu</span>
              <button
                className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {navigationItems.map((item, index) => (
                <div key={index} className="border-b border-gray-50">
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
                        fontFamily: 'DM_Sans, Helvetica'
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
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
                  aria-label="Visit Black Panther Batteries on Facebook"
                >
                  <FaFacebookF className="text-white text-sm" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#F06123] flex items-center justify-center hover:bg-[#FF8803] transition-all duration-300 shadow-md"
                  aria-label="Visit Black Panther Batteries on LinkedIn"
                >
                  <FaLinkedinIn className="text-white text-sm" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#F06123] flex items-center justify-center hover:bg-[#FF8803] transition-all duration-300 shadow-md"
                  aria-label="Visit Black Panther Batteries on Instagram"
                >
                  <FaInstagram className="text-white text-sm" />
                </a>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsQuoteModalOpen(true);
                }}
                className="w-full h-[48px] text-white font-bold text-[16px] rounded-[8px] transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: '#D4480A'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#F06123';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#D4480A';
                }}
                aria-label="Get a quote for battery services"
              >
                Get a Quote
              </button>
            </div>
          </div>
        </>
      )}
      {isQuoteModalOpen && (
        <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} sourceButton="Navigation Get a Quote" />
      )}
    </div>
  );
};
