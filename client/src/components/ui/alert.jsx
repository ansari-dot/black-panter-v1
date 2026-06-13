import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/logo.webp";

// Animation variants
const fadeInUp = {
	hidden: { opacity: 0, y: 60 },
	visible: { 
		opacity: 1, 
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" }
	}
};

const fadeInLeft = {
	hidden: { opacity: 0, x: -60 },
	visible: { 
		opacity: 1, 
		x: 0,
		transition: { duration: 0.6, ease: "easeOut" }
	}
};

const fadeInRight = {
	hidden: { opacity: 0, x: 60 },
	visible: { 
		opacity: 1, 
		x: 0,
		transition: { duration: 0.6, ease: "easeOut" }
	}
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1
		}
	}
};

const scaleIn = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: { 
		opacity: 1, 
		scale: 1,
		transition: { duration: 0.5, ease: "easeOut" }
	}
};

export default (props) => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [currentSlide, setCurrentSlide] = useState(0);
	const totalSlides = 1; // We have 3 testimonials, showing 3 at a time on desktop
	const [currentStatementSlide, setCurrentStatementSlide] = useState(0);
	const statements = [
		"\"Your battery systems are the backbone of your operations? We ensure they perform when it matters most?\"",
		"\"Reliable power is critical for your business continuity? We deliver proven solutions that keep you running 24/7?\"",
		"\"Expert maintenance prevents costly downtime? Our certified technicians protect your investment with precision care?\""
	];
	const totalStatementSlides = statements.length;

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % totalSlides);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
	};

	const goToSlide = (slideIndex) => {
		setCurrentSlide(slideIndex);
	};

	const nextStatementSlide = () => {
		setCurrentStatementSlide((prev) => (prev + 1) % totalStatementSlides);
	};

	const prevStatementSlide = () => {
		setCurrentStatementSlide((prev) => (prev - 1 + totalStatementSlides) % totalStatementSlides);
	};

	const goToStatementSlide = (slideIndex) => {
		setCurrentStatementSlide(slideIndex);
	};

	// Auto-rotate statements every 4 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			nextStatementSlide();
		}, 4000);

		return () => clearInterval(interval);
	}, [currentStatementSlide]);
	
	return (
		<div className="items-start bg-white about-page">
			<div className="bg-[#F4F5F7] w-full">
				<div className="flex flex-col items-center self-stretch mt-3 mb-[3px]">
					<div className="flex flex-col self-stretch relative mb-20">
						<div className="flex flex-col items-start self-stretch bg-[url('https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/82ab4bb7-7c83-4dc6-88bc-57ba32836cf9')] bg-cover bg-center mt-4 md:mt-[89px] hero-section relative">
						{/* Dark Overlay */}
						<div className="absolute inset-0 w-full h-full bg-black/40 z-0" />
							{/* Mobile Top Bar with Centered Social Icons */}
							<div className="flex md:hidden justify-center items-center self-stretch py-3 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] backdrop-blur-lg">
								<div className="flex items-center gap-4">
									<div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
										</svg>
									</div>
									<div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
									</div>
									<div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
										</svg>
									</div>
								</div>
							</div>

							{/* Modern Mobile Header with Logo */}
							<div className="flex justify-between items-center self-stretch mt-2 md:mt-[11px] mb-8 md:mb-[103px] px-4 md:ml-[59px] md:mr-[17px]">
								{/* Logo - Left Side on Mobile */}
								<div className="flex items-center md:hidden">
									<Link to="/" className="flex items-center gap-3">
										<img
											src={logo} 
											className="h-28 w-auto object-contain transform hover:scale-125 transition-transform duration-300"
											alt="Black Panther Batteries Logo"
										/>
									</Link>
								</div>

								{/* Desktop Navigation */}
								<div className="hidden md:flex items-start w-96 py-[17px] px-[26px] rounded-[47px]">
									<Link to="/about" className="flex flex-col items-start w-[46px] mr-[39px] rounded-[28px]">
										<span className="text-white text-[15px]" >
											{"About"}
										</span>
									</Link>
									<Link to="/services" className="text-white text-[15px] mr-[41px]" >
										{"Services"}
									</Link>
									<Link to="/contact" className="text-white text-[15px]" >
										{"Contact"}
									</Link>
								</div>

								{/* Modern Hamburger Menu - Right Side on Mobile */}
								<button 
									className="flex md:hidden justify-center items-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 z-50"
									onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								>
									<div className="flex flex-col justify-center items-center gap-1.5">
										<span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[3px]' : ''}`}></span>
										<span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
										<span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`}></span>
									</div>
								</button>
							</div>

							{/* Modern Mobile Menu Overlay */}
							{mobileMenuOpen && (
								<div className="fixed inset-0 bg-gradient-to-br from-[#1a1a1a]/95 to-[#2d2d2d]/95 backdrop-blur-xl z-50 flex flex-col md:hidden">
									<div className="flex justify-between items-center p-4 border-b border-white/10">
										<Link to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
											<img
												src={logo} 
												className="h-28 w-auto object-contain transform hover:scale-125 transition-transform duration-300"
												alt="Black Panther Batteries Logo"
											/>
										</Link>
										<button 
											className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20"
											onClick={() => setMobileMenuOpen(false)}
										>
											<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									</div>
									<div className="flex-1 flex flex-col justify-center px-6 py-8">
										<div className="flex flex-col gap-6">
											<Link 
												to="/about" 
												className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
												onClick={() => setMobileMenuOpen(false)}
											>
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-[#F06123]/20 rounded-lg flex items-center justify-center group-hover:bg-[#F06123]/30 transition-colors duration-300">
														<svg className="w-5 h-5 text-[#F06123]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
														</svg>
													</div>
													<span className="text-white text-lg font-medium">About</span>
												</div>
												<svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
											</Link>
											<Link 
												to="/services" 
												className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
												onClick={() => setMobileMenuOpen(false)}
											>
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-[#F06123]/20 rounded-lg flex items-center justify-center group-hover:bg-[#F06123]/30 transition-colors duration-300">
														<svg className="w-5 h-5 text-[#F06123]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
														</svg>
													</div>
													<span className="text-white text-lg font-medium">Services</span>
												</div>
												<svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
											</Link>
											<Link 
												to="/contact" 
												className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
												onClick={() => setMobileMenuOpen(false)}
											>
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-[#F06123]/20 rounded-lg flex items-center justify-center group-hover:bg-[#F06123]/30 transition-colors duration-300">
														<svg className="w-5 h-5 text-[#F06123]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
														</svg>
													</div>
													<span className="text-white text-lg font-medium">Contact</span>
												</div>
												<svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
											</Link>
											
											<Link 
												to="/contact" 
												className="flex items-center justify-center bg-gradient-to-r from-[#F06123] to-[#E55113] w-full py-4 px-6 rounded-xl border-0 transition-all duration-300 mt-8"
												onClick={() => setMobileMenuOpen(false)}
											>
												<span className="text-white text-lg font-bold">
													{"Get a Quote"}
												</span>
											</Link>
										</div>
									</div>
									<div className="p-4 border-t border-white/10">
										<div className="flex justify-center gap-4">
											<div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
												<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
												</svg>
											</div>
											<div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
												<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
												</svg>
											</div>
											<div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
												<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
												</svg>
											</div>
										</div>
									</div>
								</div>
							)}
							
							{/* Hero Section - Centered Content */}
					<motion.div 
						className="flex flex-col items-center justify-center mb-10 md:mb-20 lg:mb-[145px] mx-auto gap-6 md:gap-8 lg:gap-[33px] px-4 md:px-0 text-center max-w-6xl relative z-10"
								variants={staggerContainer}
								initial="hidden"
								animate="visible"
							>
								<motion.button 
									className="flex items-center justify-center bg-[#F0612380] text-center py-[7px] px-[13px] gap-2 rounded-[26px] border-0"
									onClick={()=>alert("Pressed!")}
									variants={fadeInLeft}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<img
										src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ff9f43df-4f51-49b2-8e3c-e1e9487bf723"} 
										className="w-[7px] h-[7px] rounded-[26px] object-fill"
									/>
									<span className="text-white text-[13px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
										{"Nationwide Industrial Battery Services"}
									</span>
								</motion.button>
								<motion.div 
									className="flex flex-col items-center gap-6 md:gap-8 lg:gap-[33px]"
									variants={staggerContainer}
								>
									<motion.div 
										className="flex flex-col items-center gap-4 md:gap-6 lg:gap-[23px]"
										variants={fadeInLeft}
									>
										<motion.div 
											className="flex flex-col items-center px-[3px]"
											variants={fadeInLeft}
										>
											<span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[58px] font-bold w-full max-w-[617px] leading-tight text-center" style={{ 
												fontFamily: 'Poppins, sans-serif',
												fontSize: '58px',
												fontWeight: '700',
												lineHeight: '1.15',
												letterSpacing: '-0.3px',
												background: 'linear-gradient(to right, #FFFFFF, #F3B38A)',
												WebkitBackgroundClip: 'text',
												WebkitTextFillColor: 'transparent',
												backgroundClip: 'text',
												textFillColor: 'transparent',
												textAlign: 'center'
											}}>
												{"About Us"}
											</span>
										</motion.div>
										<motion.div 
											className="flex flex-col items-center pb-[1px] mx-auto"
											variants={fadeInLeft}
										>
											<span className="text-white text-base sm:text-lg md:text-[19px] font-semibold w-full max-w-[650px] text-center" style={{ 
												fontFamily: 'Inter, sans-serif',
												fontSize: '17px',
												fontWeight: '600',
												lineHeight: '1.65',
												color: '#FFFFFF',
												maxWidth: '650px',
												margin: '16px auto 0',
												textAlign: 'center'
											}}>
												{"Maximize the lifespan and reliability of your critical power systems with our comprehensive maintenance, testing, and restoration services designed for heavy-duty industrial applications."}
											</span>
										</motion.div>
									</motion.div>
									<motion.div 
										className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mx-auto"
										variants={staggerContainer}
									>
										<motion.button 
											className="flex items-center bg-[#F06123] text-left w-full sm:w-[259px] py-[17px] px-[25px] gap-[9px] rounded-xl border-0"
											onClick={()=>alert("Pressed!")}
											variants={fadeInUp}
											whileHover={{ scale: 1.05, y: -2 }}
											whileTap={{ scale: 0.95 }}
										>
											<span className="text-white text-[15px] font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
												{"Request a Consultation"}
											</span>
											<img
												src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e9143fdc-cf53-4309-92e5-f9ed5d05a76b"} 
												className="w-[18px] h-[18px] object-fill"
											/>
										</motion.button>
										<motion.button 
											className="flex flex-col items-center bg-white text-left w-full sm:w-[177px] py-[18px] px-6 rounded-xl border border-solid border-white"
											onClick={()=>alert("Pressed!")}
											variants={fadeInUp}
											whileHover={{ scale: 1.05, y: -2 }}
											whileTap={{ scale: 0.95 }}
										>
											<span className="text-[#383A3C] text-[15px] font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
												{"Explore Services"}
											</span>
										</motion.button>
									</motion.div>
								</motion.div>
							</motion.div>

						</div>
						
						{/* Desktop Logo - Centered */}
						<img
							src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/19d29bf1-e1b8-4fdf-be07-1f803f6b22e2"} 
							className="hidden md:block h-16 sm:h-20 lg:h-[129px] absolute top-0 left-1/2 transform -translate-x-1/2 object-contain"
						/>
					</div>
					
					{/* Our Mission Section */}
<motion.section
  className="w-full flex justify-center px-4"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  variants={staggerContainer}
>
  <motion.div
    className="
      w-full max-w-4xl
      bg-white
      py-20 px-6
      mb-20
      rounded-xl
      text-center
      transition-all duration-500
      relative
    "
    style={{ boxShadow: "0px 0px 21px #00000012" }}
    variants={fadeInUp}
    whileHover={{ y: -5, scale: 1.02 }}
  >
    {/* Decorative Top Border - Clean Line */}
    <div className="absolute top-0 left-0 right-0 h-1 flex items-center justify-center">
      {/* Left half line */}
      <div className="w-1/2 h-1 bg-gradient-to-r from-transparent to-[#FF8803]"></div>
      {/* Right half line */}
      <div className="w-1/2 h-1 bg-gradient-to-l from-transparent to-[#FF8803]"></div>
    </div>
    {/* Icon */}
    <motion.div
      className="
        mx-auto mb-5
        flex items-center justify-center
        w-12 h-12
        rounded-[9px]
        bg-[#FF88031A]
        cursor-pointer
      "
      variants={scaleIn}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img
        src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/00e79ba5-a2c6-41c6-9512-ae537db8f4cf"
        alt="Mission Icon"
        className="w-8 h-8 object-contain"
      />
    </motion.div>

    {/* Heading */}
    <motion.h2
      className="
        text-[#383A3C]
        text-2xl sm:text-3xl lg:text-[36px]
        font-bold
        mb-6
      "
      variants={fadeInUp}
    >
      Our Mission
    </motion.h2>

    {/* Paragraph */}
    <motion.p
      className="
        text-[#6B7280]
        text-base sm:text-lg lg:text-[19px]
        leading-relaxed
        max-w-[700px]
        mx-auto
      "
      style={{
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '400',
        color: '#666666',
        wordSpacing: '0.05em',
        letterSpacing: '0.02em',
        lineHeight: '1.8'
      }}
      variants={fadeInUp}
    >
      To ensure every industrial facility has dependable, long-lasting battery
      systems that perform at their peak—especially when reliability matters
      most.
    </motion.p>
  </motion.div>
</motion.section>

					{/* Who We Are Section - Professional Design */}
					<motion.div 
						className="flex flex-col lg:flex-row justify-between items-start lg:items-center self-stretch bg-gray-50 py-20 gap-8 lg:gap-0"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={staggerContainer}
					>
						<motion.div 
							className="flex flex-col items-start w-full lg:w-[550px] px-4 lg:px-8"
							variants={fadeInLeft}
						>
							<motion.span 
								className="text-[#383A3C] text-2xl sm:text-3xl lg:text-[40px] font-bold mb-5 leading-tight" 
								variants={fadeInUp}
							>
								{"Who We Are"}
							</motion.span>
							<motion.div 
								className="bg-[#F06123] w-[77px] h-2 mb-7 rounded-[5px]"
								variants={scaleIn}
							/>
							<motion.span 
								className="text-base sm:text-lg lg:text-[19px] mb-[30px] leading-relaxed" 
								style={{
									fontFamily: 'Poppins, sans-serif',
									fontWeight: '400',
									color: '#666666',
									wordSpacing: '0.05em',
									letterspacing: '0.02em',
									lineHeight: '1.8'
								}}
								variants={fadeInUp}
							>
								{"We are a full-service industrial battery maintenance facility serving businesses across Australia. With 20+ years of field and facility-level experience, we specialize in the inspection, testing, restoration, and optimization of high-reliability battery systems."}
							</motion.span>
							
							{/* Professional Battery Type Cards */}
							<motion.div 
								className="flex flex-col self-stretch gap-6"
								variants={staggerContainer}
							>
								<motion.div 
									className="grid grid-cols-1 sm:grid-cols-2 gap-4"
									variants={staggerContainer}
								>
									<motion.div 
									className="flex items-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 cursor-pointer group"
										variants={scaleIn}
										whileHover={{ 
											y: -2,
											background: 'linear-gradient(to right, #F06123, #FF8803)'
										}}
										whileTap={{ scale: 0.95 }}
									>
										<div className="w-3 h-3 bg-[#F06123] rounded-full mr-3 flex-shrink-0 group-hover:bg-white"></div>
										<span className="text-gray-800 font-medium text-sm sm:text-base group-hover:text-white" style={{ color: '#1f2937' }}>
											{"Ni-Cd & Block Nickel Batteries"}
										</span>
									</motion.div>
									<motion.div 
									className="flex items-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 cursor-pointer group"
										variants={scaleIn}
										whileHover={{ 
											y: -2,
											background: 'linear-gradient(to right, #F06123, #FF8803)'
										}}
										whileTap={{ scale: 0.95 }}
									>
										<div className="w-3 h-3 bg-[#F06123] rounded-full mr-3 flex-shrink-0 group-hover:bg-white"></div>
										<span className="text-gray-800 font-medium text-sm sm:text-base group-hover:text-white" style={{ color: '#1f2937' }}>
											{"Lead-Acid & VRLA"}
										</span>
									</motion.div>
								</motion.div>
								
								<motion.div 
									className="grid grid-cols-1 sm:grid-cols-2 gap-4"
									variants={staggerContainer}
								>
									<motion.div 
									className="flex items-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 cursor-pointer group"
										variants={scaleIn}
										whileHover={{ 
											y: -2,
											background: 'linear-gradient(to right, #F06123, #FF8803)'
										}}
										whileTap={{ scale: 0.95 }}
									>
										<div className="w-3 h-3 bg-[#F06123] rounded-full mr-3 flex-shrink-0 group-hover:bg-white"></div>
										<span className="text-gray-800 font-medium text-sm sm:text-base group-hover:text-white" style={{ color: '#1f2937' }}>
											{"UPS Backup Power Banks"}
										</span>
									</motion.div>
									<motion.div 
									className="flex items-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 cursor-pointer group"
										variants={scaleIn}
										whileHover={{ 
											y: -2,
											background: 'linear-gradient(to right, #F06123, #FF8803)'
										}}
										whileTap={{ scale: 0.95 }}
									>
										<div className="w-3 h-3 bg-[#F06123] rounded-full mr-3 flex-shrink-0 group-hover:bg-white"></div>
										<span className="text-gray-800 font-medium text-sm sm:text-base group-hover:text-white" style={{ color: '#1f2937' }}>
											{"Hybrid Solar–Battery Systems"}
										</span>
									</motion.div>
								</motion.div>
								
								<motion.div 
									className="flex justify-start"
									variants={scaleIn}
								>
									<motion.div 
									className="flex items-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 cursor-pointer group"
										whileHover={{ 
											y: -2,
											background: 'linear-gradient(to right, #F06123, #FF8803)'
										}}
										whileTap={{ scale: 0.95 }}
									>
										<div className="w-3 h-3 bg-[#F06123] rounded-full mr-3 flex-shrink-0 group-hover:bg-white"></div>
										<span className="font-semibold text-sm sm:text-base text-gray-600 group-hover:text-white" style={{ color: '#666666' }}>
											{"Industrial Motive-Power Batteries"}
										</span>
									</motion.div>
								</motion.div>
							</motion.div>
						</motion.div>
						
						<motion.div
							className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[622px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[418px] mx-4 lg:mx-8"
							variants={fadeInRight}
							whileHover={{ scale: 1.02 }}
						>
							<img
								src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/25a985ad-a94d-44dd-a241-d622f7763bbf"} 
								className="w-full h-full object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
								alt="Industrial battery maintenance facility"
							/>
						</motion.div>
					</motion.div>
					
					{/* Why Choose Us Section */}
					<motion.div 
						className="flex flex-col self-stretch bg-[#383A3C] py-20 gap-[50px] px-4 lg:px-8"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={staggerContainer}
					>
						<motion.div 
							className="flex flex-col items-start self-stretch gap-7"
							variants={staggerContainer}
						>
							<motion.div 
								className="flex flex-col items-start gap-[19px]"
								variants={fadeInUp}
							>
								<motion.div 
									className="flex flex-col items-start pb-[1px]"
									variants={fadeInLeft}
								>
									<span className="text-white text-2xl sm:text-3xl lg:text-[36px] font-bold">
										{"Why Choose Us?"}
									</span>
								</motion.div>
								<motion.div 
									className="bg-[#F06123] w-[77px] h-2 rounded-[5px]"
									variants={scaleIn}
								/>
							</motion.div>
							<motion.span 
								className="text-white text-base sm:text-lg lg:text-[19px] w-full max-w-[428px] leading-relaxed" 
								variants={fadeInUp}
							>
								{"We combine technical expertise with unwavering commitment to safety and compliance."}
							</motion.span>
						</motion.div>
						
						<motion.div 
							className="flex flex-col self-stretch pb-[1px] gap-8"
							variants={staggerContainer}
						>
							<motion.div 
								className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 self-stretch gap-4 lg:gap-7"
								variants={staggerContainer}
							>
								{/* Card 1 - Licensed & Insured Professionals */}
								<motion.div 
									className="group relative flex flex-col items-start w-full py-[30px] px-[27px] rounded-[13px] border border-solid border-transparent hover:border-[#F06123] transition-all duration-300 overflow-hidden" 
									style={{
										background: "linear-gradient(180deg, #4E4E4E, #B4B4B480)"
									}}
									variants={scaleIn}
									whileHover={{ y: -5, scale: 1.05 }}
								>
									<motion.div 
										className="flex flex-col items-start py-[7px] px-1.5 mb-[23px] rounded-[9px]"
										whileHover={{ scale: 1.1, rotate: 5 }}
										transition={{ type: "spring", stiffness: 300 }}
									>
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/0b829c52-3267-4eb3-a23c-6819a8cda316"} 
											className="w-[33px] h-[33px] rounded-[9px] object-fill"
										/>
									</motion.div>
									<span className="text-white text-lg sm:text-xl lg:text-[22px] font-bold mb-[7px]">
										{"Licensed & Insured Professionals"}
									</span>
									<span className="text-white text-sm sm:text-base lg:text-[17px] mb-4">
										{"Fully certified professionals delivering safe, compliant, and reliable service."}
									</span>
									{/* Hover Link */}
									<motion.button
										className="absolute bottom-4 left-6 right-6 bg-[#F06123] text-white py-2 px-4 rounded-lg font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#e55520]"
										initial={{ y: 20, opacity: 0 }}
										whileHover={{ scale: 1.05 }}
										onClick={() => alert("Learn More about Licensed Professionals")}
									>
										Learn More
									</motion.button>
								</motion.div>
								
								{/* Card 2 - Upfront, Honest Pricing */}
								<motion.div 
									className="group relative flex flex-col items-start w-full py-[30px] px-[27px] rounded-[13px] border border-solid border-transparent hover:border-[#F06123] transition-all duration-300 overflow-hidden"
									style={{
										background: "linear-gradient(180deg, #4E4E4E, #B4B4B480)"
									}}
									variants={scaleIn}
									whileHover={{ y: -5, scale: 1.05 }}
								>
									<motion.div 
										className="flex flex-col items-start py-[7px] px-1.5 mb-[23px] rounded-[9px]"
										whileHover={{ scale: 1.1, rotate: 5 }}
										transition={{ type: "spring", stiffness: 300 }}
									>
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e2ad966d-3195-4300-bf6c-0f4e30d3e3b7"} 
											className="w-[33px] h-[33px] rounded-[9px] object-fill"
										/>
									</motion.div>
									<span className="text-white text-lg sm:text-xl lg:text-[22px] font-bold mb-[7px]">
										{"Upfront, Honest Pricing"}
									</span>
									<span className="text-white text-sm sm:text-base lg:text-[17px] mb-4">
										{"Clear estimates with no hidden fees or last-minute surprises."}
									</span>
									{/* Hover Link */}
									<motion.button
										className="absolute bottom-4 left-6 right-6 bg-[#F06123] text-white py-2 px-4 rounded-lg font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#e55520]"
										initial={{ y: 20, opacity: 0 }}
										whileHover={{ scale: 1.05 }}
										onClick={() => alert("Learn More about Pricing")}
									>
										Learn More
									</motion.button>
								</motion.div>
								
								{/* Card 3 - Fast Response Times */}
								<motion.div 
									className="group relative flex flex-col items-start w-full py-[30px] px-[27px] rounded-[13px] border border-solid border-transparent hover:border-[#F06123] transition-all duration-300 overflow-hidden" 
									style={{
										background: "linear-gradient(180deg, #4E4E4E, #B4B4B480)"
									}}
									variants={scaleIn}
									whileHover={{ y: -5, scale: 1.05 }}
								>
									<motion.div 
										className="flex flex-col items-start py-[7px] px-1.5 mb-[23px] rounded-[9px]"
										whileHover={{ scale: 1.1, rotate: 5 }}
										transition={{ type: "spring", stiffness: 300 }}
									>
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/81c449cf-3616-41e1-aeb2-c17dd27538eb"} 
											className="w-[33px] h-[33px] rounded-[9px] object-fill"
										/>
									</motion.div>
									<span className="text-white text-lg sm:text-xl lg:text-[22px] font-bold mb-[7px]">
										{"Fast Response Times"}
									</span>
									<span className="text-white text-sm sm:text-base lg:text-[17px] mb-4">
										{"Quick scheduling and rapid on-site support when you need it most."}
									</span>
									{/* Hover Link */}
									<motion.button
										className="absolute bottom-4 left-6 right-6 bg-[#F06123] text-white py-2 px-4 rounded-lg font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#e55520]"
										initial={{ y: 20, opacity: 0 }}
										whileHover={{ scale: 1.05 }}
										onClick={() => alert("Learn More about Response Times")}
									>
										Learn More
									</motion.button>
								</motion.div>
							</motion.div>
							
							{/* Second Row of Cards */}
							<motion.div 
								className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 self-stretch gap-4 lg:gap-7"
								variants={staggerContainer}
							>
								{/* Card 4 - Quality Work Guaranteed */}
								<motion.div 
									className="group relative flex flex-col items-start w-full py-[30px] px-[27px] rounded-[13px] border border-solid border-transparent hover:border-[#F06123] transition-all duration-300 overflow-hidden" 
									style={{
										background: "linear-gradient(180deg, #4E4E4E, #B4B4B480)"
									}}
									variants={scaleIn}
									whileHover={{ y: -5, scale: 1.05 }}
								>
									<motion.div 
										className="flex flex-col items-start py-[7px] px-1.5 mb-[23px] rounded-[9px]"
										whileHover={{ scale: 1.1, rotate: 5 }}
										transition={{ type: "spring", stiffness: 300 }}
									>
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fde789db-55dd-4bb4-9cf5-687c658dd7c9"} 
											className="w-[33px] h-[33px] rounded-[9px] object-fill"
										/>
									</motion.div>
									<span className="text-white text-lg sm:text-xl lg:text-[22px] font-bold mb-[7px]">
										{"Quality Work Guaranteed"}
									</span>
									<span className="text-white text-sm sm:text-base lg:text-[17px] mb-4">
										{"High standards, durable solutions, and workmanship you can trust."}
									</span>
									{/* Hover Link */}
									<motion.button
										className="absolute bottom-4 left-6 right-6 bg-[#F06123] text-white py-2 px-4 rounded-lg font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#e55520]"
										initial={{ y: 20, opacity: 0 }}
										whileHover={{ scale: 1.05 }}
										onClick={() => alert("Learn More about Quality Guarantee")}
									>
										Learn More
									</motion.button>
								</motion.div>
								
								{/* Card 5 - Experienced Technicians */}
								<motion.div 
									className="group relative flex flex-col items-start w-full py-[30px] px-[27px] rounded-[13px] border border-solid border-transparent hover:border-[#F06123] transition-all duration-300 overflow-hidden" 
									style={{
										background: "linear-gradient(180deg, #4E4E4E, #B4B4B480)"
									}}
									variants={scaleIn}
									whileHover={{ y: -5, scale: 1.05 }}
								>
									<motion.div 
										className="flex flex-col items-start py-[7px] px-1.5 mb-[23px] rounded-[9px]"
										whileHover={{ scale: 1.1, rotate: 5 }}
										transition={{ type: "spring", stiffness: 300 }}
									>
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/abe17467-9ad7-48f7-ad62-977a1f8df920"} 
											className="w-[33px] h-[33px] rounded-[9px] object-fill"
										/>
									</motion.div>
									<span className="text-white text-lg sm:text-xl lg:text-[22px] font-bold mb-[7px]">
										{"Experienced Technicians"}
									</span>
									<span className="text-white text-sm sm:text-base lg:text-[17px] mb-4">
										{"Skilled professionals with hands-on expertise across all battery technologies."}
									</span>
									{/* Hover Link */}
									<motion.button
										className="absolute bottom-4 left-6 right-6 bg-[#F06123] text-white py-2 px-4 rounded-lg font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#e55520]"
										initial={{ y: 20, opacity: 0 }}
										whileHover={{ scale: 1.05 }}
										onClick={() => alert("Learn More about Our Technicians")}
									>
										Learn More
									</motion.button>
								</motion.div>
								
								{/* Card 6 - Customer-First Service */}
								<motion.div 
									className="group relative flex flex-col items-start w-full py-[30px] px-[27px] rounded-[13px] border border-solid border-transparent hover:border-[#F06123] transition-all duration-300 overflow-hidden" 
									style={{
										background: "linear-gradient(180deg, #4E4E4E, #B4B4B480)"
									}}
									variants={scaleIn}
									whileHover={{ y: -5, scale: 1.05 }}
								>
									<motion.div 
										className="flex flex-col items-start py-[7px] px-1.5 mb-[23px] rounded-[9px]"
										whileHover={{ scale: 1.1, rotate: 5 }}
										transition={{ type: "spring", stiffness: 300 }}
									>
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d795f47f-6a24-415e-8d2d-d6e9ef04a6aa"} 
											className="w-[33px] h-[33px] rounded-[9px] object-fill"
										/>
									</motion.div>
									<span className="text-white text-lg sm:text-xl lg:text-[22px] font-bold mb-[7px]">
										{"Customer-First Service"}
									</span>
									<span className="text-white text-sm sm:text-base lg:text-[17px] mb-4">
										{"Clear communication, dependable support, and complete satisfaction from start to finish."}
									</span>
									{/* Hover Link */}
									<motion.button
										className="absolute bottom-4 left-6 right-6 bg-[#F06123] text-white py-2 px-4 rounded-lg font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#e55520]"
										initial={{ y: 20, opacity: 0 }}
										whileHover={{ scale: 1.05 }}
										onClick={() => alert("Learn More about Customer Service")}
									>
										Learn More
									</motion.button>
								</motion.div>
							</motion.div>
						</motion.div>
					</motion.div>
					
					{/* Meet Our Experts Section - Exact Home Page Design */}
					<motion.div 
						className="flex flex-col items-center self-stretch bg-gray-50 py-20 mb-20 gap-[50px]"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						variants={staggerContainer}
					>
						<motion.div 
							className="flex flex-col items-center gap-3.5 px-4"
							variants={fadeInUp}
						>
							<div className="flex flex-col items-start">
								<span className="text-[#383A3C] text-2xl sm:text-3xl lg:text-[33px] font-bold text-center">
									{"Meet Our Experts"}
								</span>
							</div>
							<span className="text-gray-500 text-base sm:text-lg lg:text-[19px] text-center">
								{"Certified engineers and technicians dedicated to your power reliability."}
							</span>
						</motion.div>
						<div className="self-stretch pb-[1px]">
							<motion.div 
								className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 self-stretch px-4 gap-6 lg:gap-8"
								variants={staggerContainer}
							>
								<motion.div 
									className="flex flex-col items-center group cursor-pointer"
									variants={scaleIn}
									whileHover={{ y: -5 }}
								>
									<div className="w-full max-w-[350px] overflow-hidden rounded-t-[11px] transition-all duration-300 group-hover:shadow-[0px_10px_25px_rgba(0,0,0,0.15)]">
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/098dd817-857d-4e5c-a413-e497f5382f00"} 
											className="w-full h-[280px] sm:h-[320px] lg:h-[350px] object-cover transition-all duration-300 group-hover:scale-105"
										/>
									</div>
									<div className="flex flex-col items-center bg-white w-full max-w-[350px] py-4 px-6 rounded-b-[11px] border border-solid border-[#00000012] transition-all duration-300 group-hover:shadow-[0px_10px_25px_rgba(0,0,0,0.15)] group-hover:translate-y-[-2px]">
										<span className="text-[#070B15] text-lg sm:text-xl lg:text-[21px] font-bold mb-1">
											{"Robert Chen"}
										</span>
										<span className="text-gray-500 text-sm sm:text-base text-center">
											{"Senior Battery Engineer"}
										</span>
									</div>
								</motion.div>
								<motion.div 
									className="flex flex-col items-center group cursor-pointer"
									variants={scaleIn}
									whileHover={{ y: -5 }}
								>
									<div className="w-full max-w-[350px] overflow-hidden rounded-t-[11px] transition-all duration-300 group-hover:shadow-[0px_10px_25px_rgba(0,0,0,0.15)]">
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/bbb8befc-30f7-4e96-9430-20c92331a944"} 
											className="w-full h-[280px] sm:h-[320px] lg:h-[350px] object-cover transition-all duration-300 group-hover:scale-105"
										/>
									</div>
									<div className="flex flex-col items-center bg-white w-full max-w-[350px] py-4 px-6 rounded-b-[11px] border border-solid border-[#00000012] transition-all duration-300 group-hover:shadow-[0px_10px_25px_rgba(0,0,0,0.15)] group-hover:translate-y-[-2px]">
										<span className="text-[#070B15] text-lg sm:text-xl lg:text-[21px] font-bold mb-1">
											{"Sarah Martinez"}
										</span>
										<span className="text-gray-500 text-sm sm:text-base text-center">
											{"Lead Maintenance Technician"}
										</span>
									</div>
								</motion.div>
								<motion.div 
									className="flex flex-col items-center group cursor-pointer"
									variants={scaleIn}
									whileHover={{ y: -5 }}
								>
									<div className="w-full max-w-[350px] overflow-hidden rounded-t-[11px] transition-all duration-300 group-hover:shadow-[0px_10px_25px_rgba(0,0,0,0.15)]">
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6f0dd650-dfe2-4656-b542-513abc888cd3"} 
											className="w-full h-[280px] sm:h-[320px] lg:h-[350px] object-cover transition-all duration-300 group-hover:scale-105"
										/>
									</div>
									<div className="flex flex-col items-center bg-white w-full max-w-[350px] py-4 px-6 rounded-b-[11px] border border-solid border-[#00000012] transition-all duration-300 group-hover:shadow-[0px_10px_25px_rgba(0,0,0,0.15)] group-hover:translate-y-[-2px]">
										<span className="text-[#070B15] text-lg sm:text-xl lg:text-[21px] font-bold mb-1">
											{"Michael Johnson"}
										</span>
										<span className="text-gray-500 text-sm sm:text-base text-center">
											{"Field Service Specialist"}
										</span>
									</div>
								</motion.div>
							</motion.div>
						</div>
					</motion.div>
					
					{/* Trusted by Industry Leaders - Enhanced Services Design */}
				<motion.div 
					className="flex flex-col items-center mb-[50px] gap-3.5 px-4"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={fadeInUp}
				>
					<div className="flex flex-col items-start">
						<span className="text-[#383A3C] text-2xl sm:text-3xl lg:text-[33px] font-bold text-center" >
							{"Trusted by Industry Leaders"}
						</span>
					</div>
					<span className="text-gray-600 text-base sm:text-lg lg:text-[19px] text-center" 
						style={{
							fontFamily: 'Poppins, sans-serif',
							fontWeight: '400',
							color: '#666666',
							wordSpacing: '0.05em',
							letterSpacing: '0.02em',
							lineHeight: '1.8'
						}}
					>
						{"Certified engineers and technicians dedicated to your power reliability."}
					</span>
				</motion.div>
				
				{/* Testimonials Section - Slider */}
				<div className="relative mb-10">
					<motion.div 
						className="overflow-hidden"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						variants={staggerContainer}
					>
						<div 
							className="flex transition-transform duration-500 ease-in-out"
							style={{ transform: `translateX(-${currentSlide * 100}%)` }}
						>
							{/* Slide 1 - All 3 testimonials */}
							<div className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
								<motion.div 
									className="flex flex-col items-start bg-white h-[280px] py-[30px] px-[27px] rounded-[11px] border border-solid border-[#00000012] hover:shadow-[0px_11px_25px_#0000001A] transition-all duration-300"
									variants={scaleIn}
									whileHover={{ y: -5, scale: 1.02 }}
								>
									<span className="text-gray-600 text-[17px] mb-5 flex-1" 
										style={{
											fontFamily: 'Poppins, sans-serif',
											fontWeight: '400',
											color: '#666666',
											wordSpacing: '0.05em',
											letterSpacing: '0.02em',
											lineHeight: '1.8'
										}}
									>
										{"Black Panther Batteries' preventive maintenance program saved us from a catastrophic failure during peak production. Their team is unmatched."}
									</span>
									<img
										src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/aaec5c0c-c278-4ec9-873b-b51ee7852e29"} 
										className="w-[135px] h-[19px] mb-4 object-fill"
									/>
									<div className="flex items-center gap-3 mt-auto">
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/90be2a1e-5158-436d-81e1-7bcef30f2b63"} 
											className="w-[37px] h-[37px] object-fill rounded-full"
										/>
										<span className="text-gray-600 text-[12px] leading-tight" >
											{"Operations Director\nRegional Utility Co."}
										</span>
									</div>
								</motion.div>
								<motion.div 
									className="flex flex-col items-start bg-white h-[280px] py-[30px] px-[27px] rounded-[11px] border border-solid border-[#00000012] hover:shadow-[0px_11px_25px_#0000001A] transition-all duration-300 shadow-[0px_11px_25px_#0000001A]"
									variants={scaleIn}
									whileHover={{ y: -5, scale: 1.02 }}
								>
									<span className="text-gray-600 text-[17px] mb-5 flex-1" 
										style={{
											fontFamily: 'Poppins, sans-serif',
											fontWeight: '400',
											color: '#666666',
											wordSpacing: '0.05em',
											letterSpacing: '0.02em',
											lineHeight: '1.8'
										}}
									>
										{"Their rapid response during our emergency saved millions in potential downtime. Exceptional service quality and technical expertise."}
									</span>
									<img
										src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/eb5876d1-f0f5-4229-9076-a69879bd3866"} 
										className="w-[135px] h-[19px] mb-4 object-fill"
									/>
									<div className="flex items-center gap-3 mt-auto">
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/16bafc13-84ae-4127-98b1-f059e89d76b6"} 
											className="w-[37px] h-[37px] object-fill rounded-full"
										/>
										<span className="text-gray-600 text-[12px] leading-tight" >
											{"Facility Manager\nManufacturing Corp."}
										</span>
									</div>
								</motion.div>
								<motion.div 
									className="flex flex-col items-start bg-white h-[280px] py-[30px] px-[27px] rounded-[11px] border border-solid border-[#00000012] hover:shadow-[0px_11px_25px_#0000001A] transition-all duration-300"
									variants={scaleIn}
									whileHover={{ y: -5, scale: 1.02 }}
								>
									<span className="text-gray-600 text-[17px] mb-5 flex-1" 
										style={{
											fontFamily: 'Poppins, sans-serif',
											fontWeight: '400',
											color: '#666666',
											wordSpacing: '0.05em',
											letterSpacing: '0.02em',
											lineHeight: '1.8'
										}}
									>
										{"Professional, reliable, and always available when we need them. Their proactive approach has saved us significant downtime."}
									</span>
									<img
										src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5a5e262d-3c93-4568-a96a-bcda9a3411ae"} 
										className="w-[135px] h-[19px] mb-4 object-fill"
									/>
									<div className="flex items-center gap-3 mt-auto">
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/135074d3-a646-4045-aae6-aaf841b28e24"} 
											className="w-[37px] h-[37px] object-fill rounded-full"
										/>
										<span className="text-gray-600 text-[12px] leading-tight" >
											{"Chief Engineer\nData Center Solutions"}
										</span>
									</div>
								</motion.div>
							</div>
						</div>
					</motion.div>
					
					{/* Navigation Dots */}
					<div className="flex justify-center gap-2 mt-6">
						{[...Array(totalSlides + 1)].map((_, index) => (
							<button
								key={index}
								onClick={() => goToSlide(index)}
								className={`w-3 h-3 rounded-full transition-all duration-300 ${
									currentSlide === index 
										? 'bg-[#F06123] w-8' 
										: 'bg-gray-300 hover:bg-gray-400'
								}`}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>
				</div>
					
					<img
						src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/1ec019e8-40bf-400e-a866-f83928cb6a14"} 
						className="w-10 h-[13px] mb-[81px] object-fill hidden"
					/>
				</div>
				
				{/* CTA Section */}
				<motion.div 
					className="flex flex-col items-center self-stretch"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={staggerContainer}
				>
					{/* Statement Slider */}
					<div className="flex flex-col items-center w-full max-w-[804px] mt-32 mb-16 px-4">
						<div className="relative w-full overflow-hidden py-12">
							<div className="flex transition-transform duration-500 ease-in-out" 
								style={{ transform: `translateX(-${currentStatementSlide * 100}%)` }}>
								{statements.map((statement, index) => (
									<motion.div
										key={index}
										className="w-full flex-shrink-0 text-center flex items-center justify-center min-h-[120px]"
										variants={fadeInUp}
									>
										<span className="text-[#383A3C] text-2xl sm:text-3xl lg:text-[33px] font-bold italic px-4" 
											style={{
												wordSpacing: '0.1em',
												letterSpacing: '0.03em',
												lineHeight: '1.4'
											}}>
											{statement}
										</span>
									</motion.div>
								))}
							</div>
						</div>
						
						{/* Navigation Dots */}
						<div className="flex justify-center items-center gap-2 mt-8">
							{statements.map((_, index) => (
								<button
									key={index}
									onClick={() => goToStatementSlide(index)}
									className={`w-3 h-3 rounded-full transition-all duration-300 ${
										currentStatementSlide === index 
											? 'bg-[#F06123] w-8' 
											: 'bg-gray-300 hover:bg-gray-400'
									}`}
									aria-label={`Go to statement ${index + 1}`}
								/>
							))}
						</div>
					</div>
					<motion.img
						src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/0d743c58-9092-4882-afb4-eb13bf689859"} 
						className="w-10 h-[13px] mb-[102px] object-fill hidden"
						variants={scaleIn}
					/>
					
					<motion.div 
						className="flex flex-col items-center self-stretch py-[68px] gap-[33px] px-4" 
						style={{
							background: "linear-gradient(90deg, #323232 0%, #323232 45%, #8B492C 100%)"
						}}
						variants={fadeInUp}
					>
						<motion.div 
							className="flex flex-col items-center self-stretch gap-[33px]"
							variants={staggerContainer}
						>
							<motion.button 
								className="flex items-center bg-[#F0612380] text-left py-[7px] px-[13px] gap-2 rounded-[26px] border-0 hover:bg-[#F06123] transition-all duration-300"
								variants={fadeInUp}
								whileHover={{ scale: 1.05 }}
								onClick={()=>alert("Pressed!")}
							>
								<img
									src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ed3ff17b-af29-4199-b6f3-507d15ba9ba5"} 
									className="w-[7px] h-[7px] rounded-[26px] object-fill"
								/>
								<span className="text-white text-[13px]">
									{"Nationwide Industrial Battery Services"}
								</span>
							</motion.button>
							
							<motion.div 
								className="flex flex-col items-center self-stretch gap-[23px]"
								variants={staggerContainer}
							>
								<motion.div 
									className="flex flex-col items-center px-2 md:px-4"
									variants={fadeInUp}
								>
									<span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[62px] font-bold text-center max-w-[598px] leading-tight" style={{
										fontFamily: 'Poppins, sans-serif',
										fontWeight: '700',
										lineHeight: '1.15',
										letterSpacing: '-0.3px',
										background: 'linear-gradient(to right, #FFFFFF, #F3B38A)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
										textFillColor: 'transparent',
										textAlign: 'center'
									}}>
										{"Need Reliable Battery Performance?"}
									</span>
								</motion.div>
								<motion.div 
									className="flex flex-col items-center px-4"
									variants={fadeInUp}
								>
									<span className="text-white text-base sm:text-lg lg:text-[19px] font-semibold text-center max-w-[496px]">
										{"Speak with our certified technicians for a complete system assessment and customized maintenance plan."}
									</span>
								</motion.div>
							</motion.div>
						</motion.div>
						
						<motion.div 
							className="flex flex-col sm:flex-row items-center gap-3.5"
							variants={staggerContainer}
						>
							<motion.button 
								className="flex items-center bg-[#F06123] text-left w-full sm:w-[259px] py-[17px] px-[25px] gap-[9px] rounded-xl border-0 hover:bg-[#e55520] transition-all duration-300"
								variants={fadeInUp}
								whileHover={{ scale: 1.05, y: -2 }}
								onClick={()=>alert("Pressed!")}
							>
								<span className="text-white text-[15px] font-bold">
									{"Request a Consultation"}
								</span>
								<img
									src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d71fa14c-826b-42f7-aafe-98fc179c0744"} 
									className="w-[18px] h-[18px] object-fill"
								/>
							</motion.button>
							<motion.div 
								className="flex flex-col items-start bg-white w-full sm:w-[231px] py-[18px] px-[34px] rounded-xl border border-solid border-white hover:bg-gray-50 transition-all duration-300"
								variants={fadeInUp}
								whileHover={{ scale: 1.05, y: -2 }}
							>
								<span className="text-[#383A3C] text-[15px] font-bold">
									{"Call: +61 402 277 723"}
								</span>
							</motion.div>
						</motion.div>
					</motion.div>
					
					{/* Footer */}
					<div className="flex flex-col items-center self-stretch bg-[#383A3C] py-12 md:py-16">
						<div className="flex flex-col lg:flex-row justify-between items-start lg:items-start self-stretch w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 mb-8 md:mb-12 gap-12 lg:gap-0">
							<div className="flex flex-col items-start w-full lg:w-[483px] gap-6 md:gap-8">
								<div className="flex flex-col items-start gap-6">
									<Link to="/">
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c717461f-10f6-4bcf-a73a-4aa27d9f6953"} 
											className="w-24 h-24 md:w-28 md:h-28 lg:w-[129px] lg:h-[129px] object-contain cursor-pointer hover:opacity-90 transition-opacity duration-300"
										/>
									</Link>
									<p className="text-white text-base md:text-[17px] leading-relaxed w-full max-w-[366px] opacity-90">
										{"Leading industrial battery maintenance facility serving critical infrastructure nationwide."}
									</p>
								</div>
								<div className="flex items-center gap-4">
									<a href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-300 cursor-pointer">
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b239a125-bbb8-4267-9e28-e7de08f02801"} 
											className="w-6 h-6 object-contain hover:scale-110 transition-transform duration-300"
										/>
									</a>
									<a href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-300 cursor-pointer">
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/bdf48038-ac66-41d5-bf20-eaf3f5370b30"} 
											className="w-6 h-6 object-contain hover:scale-110 transition-transform duration-300"
										/>
									</a>
									<a href="#" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-300 cursor-pointer">
										<img
											src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e129d8ef-9044-43eb-978e-d2cfeb695b1c"} 
											className="w-[24px] h-[24px] object-contain hover:scale-110 transition-transform duration-300"
										/>
									</a>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row justify-between items-start w-full lg:w-[665px] gap-8 sm:gap-12 lg:gap-16">
								<div className="flex flex-col items-start gap-4">
									<h3 className="text-white text-lg font-bold mb-2">
										{"Services"}
									</h3>
									<div className="flex flex-col gap-2.5">
										<Link to="/services" className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300">
											{"Battery Testing"}
										</Link>
										<Link to="/services" className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300">
											{"Maintenance"}
										</Link>
										<Link to="/services" className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300">
											{"Reconditioning"}
										</Link>
										<Link to="/services" className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300">
											{"Emergency Service"}
										</Link>
										<Link to="/services" className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300">
											{"Consultation"}
										</Link>
										<Link to="/services" className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300">
											{"Field Services"}
										</Link>
									</div>
								</div>
								<div className="flex flex-col items-start gap-4">
									<h3 className="text-white text-lg font-bold mb-2">
										{"Industries"}
									</h3>
									<div className="flex flex-col gap-2.5">
										<span className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300 cursor-pointer">
											{"Power Generation"}
										</span>
										<span className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300 cursor-pointer">
											{"Manufacturing"}
										</span>
										<span className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300 cursor-pointer">
											{"Data Centers"}
										</span>
										<span className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300 cursor-pointer">
											{"Healthcare"}
										</span>
									</div>
								</div>
								<div className="flex flex-col items-start gap-4">
									<h3 className="text-white text-lg font-bold mb-2">
										{"Company"}
									</h3>
									<div className="flex flex-col gap-2.5">
										<Link to="/about" className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300">
											{"About Us"}
										</Link>
										<span className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300 cursor-pointer">
											{"Our Team"}
										</span>
										<span className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300 cursor-pointer">
											{"Careers"}
										</span>
										<Link to="/contact" className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300">
											{"Contact"}
										</Link>
										<span className="text-white text-sm opacity-80 hover:opacity-100 hover:text-[#F06123] transition-all duration-300 cursor-pointer">
											{"News"}
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
							<div className="h-px bg-white/10 mb-6"></div>
							<div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4">
								<p className="text-white text-sm opacity-70 text-center sm:text-left">
									{" 2024 Black Panther Batteries. All rights reserved."}
								</p>
								<div className="flex items-center gap-6">
									<Link to="#" className="text-white text-sm opacity-70 hover:opacity-100 hover:text-[#F06123] transition-all duration-300">
										{"Privacy Policy"}
									</Link>
									<Link to="#" className="text-white text-sm opacity-70 hover:opacity-100 hover:text-[#F06123] transition-all duration-300">
										{"Terms of Service"}
									</Link>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};