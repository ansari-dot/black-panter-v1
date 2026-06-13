import BatteryRecycle from '../assets/BatteryRecycle.png';
import ElectricalConditioning from '../assets/Electrical Conditioning.png';
import equpiment from '../assets/equpiment.png';
import Maintenance from '../assets/Maintenance.png';
import major from '../assets/major.png';
import Nik from '../assets/Nik.webp';
import UPS from '../assets/UPS.webp';
import emr from '../assets/Emer.webp';
import Onsite from '../assets/Onsite.webp';
import prevent from '../assets/prevent.webp';
import washing from '../assets/washing.webp'
import rec from  '../assets/reconditiong.webp'



export const serviceDetailData = [
  {
    id: 1,
    title: "Ni-Cd & Block Nickel Maintenance",
    slug: "ni-cd-block-nickel-maintenance",
    heroTitle: {
      line1: { white: "Expert ", orange: "Ni-Cd" },
      line2: { white: "Maintenance ", orange: "Services" }
    },
    heroDescription: "Professional Nickel-Cadmium battery maintenance, testing, and rejuvenation services for industrial backup power systems.",
    criticalPowerTitle: "Critical Power Integrity",
    criticalPowerDescription: "Nickel-Cadmium (Ni-Cd) and Block Nickel batteries are the backbone of industrial backup power, known for their durability in harsh environments. However, without proper maintenance, electrolyte levels can drift, carbonates can build up, and capacity can degrade silently.\n\nOur specialized maintenance program ensures your systems remain IEEE compliant and ready to perform when the grid fails. We service utility substations, railway signaling, and offshore platforms.",
    keyHighlights: [
      "Full ISO 17025 Lab Testing Capabilities",
      "Australian Standards Compliance Documentation",
      "Nationwide 24/7 Field Support Response",
      "Ecologically Responsible Recycling Program",
      "IEEE 1106 & 1188 / AS 3820 Standard Compliance"
    ],
    services: [
      { name: "Ni-Cd & Block Nickel Maintenance", active: true },
      { name: "Lead-Acid & VRLA Services", active: false },
      { name: "Electrical Conditioning", active: false },
      { name: "UPS Bank Support", active: false },
      { name: "Recycling & Disposal", active: false }
    ],
    technicalProcedures: [
      {
        title: "Capacity Testing",
        description: "Full discharge testing to verify actual amp-hour performance against manufacturer ratings.",
        icon: "FaBolt"
      },
      {
        title: "Electrolyte Analysis",
        description: "Comprehensive electrolyte testing for specific gravity, contamination, and carbonate levels.",
        icon: "FaVial"
      },
      {
        title: "Cell Balancing",
        description: "Individual cell voltage equalization to ensure uniform performance across the entire string.",
        icon: "FaBalanceScale"
      },
      {
        title: "Charger Calibration",
        description: "Precision adjustment of float and equalize voltages to prevent over/under-charging.",
        icon: "FaWrench"
      },
      {
        title: "Deep-Cycle Rejuvenation",
        description: "Specialized cycling protocols to break down crystalline formations and restore capacity.",
        icon: "FaSyncAlt"
      },
      {
        title: "Compliance Inspections",
        description: "Detailed visual and mechanical inspections to meet safety and regulatory standards.",
        icon: "FaCheckCircle"
      }
    ],
    emergencyTitle: "Need Immediate Support?",
    emergencyDescription: "Our emergency response team is available 24/7 for critical Ni-Cd battery system issues.",
    certificationTitle: "IEEE & AS Certified",
    certificationDescription: "All procedures comply with IEEE 1106, 1188, 450 and Australian AS 3820 standards.",
    imageUrl: Nik
  },
  {
    id: 2,
    title: "Preventive Maintenance Programs",
    slug: "preventive-maintenance-programs",
    heroTitle: {
      line1: { white: "Preventive ", orange: "Maintenance" },
      line2: { white: "Proactive ", orange: "Care" }
    },
    heroDescription: "Comprehensive preventive maintenance programs designed to maximize battery life and prevent unexpected failures.",
    criticalPowerTitle: "Proactive System Protection",
    criticalPowerDescription: "Preventive maintenance is the cornerstone of reliable power systems. Regular inspections and maintenance can identify potential issues before they become critical failures, saving you from costly downtime and emergency repairs.\n\nOur preventive maintenance programs are tailored to your specific battery types, usage patterns, and operational requirements. We provide detailed reporting, trend analysis, and recommendations to optimize your battery system performance.",
    keyHighlights: [
      "Customized Maintenance Schedules",
      "Detailed Performance Trend Analysis",
      "Early Failure Detection Systems",
      "Comprehensive Documentation",
      "Cost-Effective Long-Term Planning"
    ],
    services: [
      { name: "Ni-Cd & Block Nickel Maintenance", active: false },
      { name: "Lead-Acid & VRLA Services", active: false },
      { name: "Electrical Conditioning", active: false },
      { name: "UPS Bank Support", active: false },
      { name: "Preventive Maintenance Programs", active: true },
      { name: "Recycling & Disposal", active: false }
    ],
    technicalProcedures: [
      {
        title: "Monthly Inspections",
        description: "Visual checks, voltage measurements, and connection torque verification.",
        icon: "FaSearch"
      },
      {
        title: "Quarterly Testing",
        description: "Load testing and capacity verification to track performance degradation.",
        icon: "FaBolt"
      },
      {
        title: "Semi-Annual Analysis",
        description: "Comprehensive system analysis including impedance and conductance testing.",
        icon: "FaChartLine"
      },
      {
        title: "Annual Overhauls",
        description: "Complete system maintenance including cleaning, tightening, and calibration.",
        icon: "FaTools"
      },
      {
        title: "Trend Monitoring",
        description: "Continuous performance tracking with predictive failure analysis.",
        icon: "FaChartArea"
      },
      {
        title: "Documentation Review",
        description: "Comprehensive record keeping and compliance verification.",
        icon: "FaFileAlt"
      }
    ],
    emergencyTitle: "Schedule Your Maintenance",
    emergencyDescription: "Contact us to design a customized preventive maintenance program for your facility.",
    certificationTitle: "Australian Standards Compliant",
    certificationDescription: "All maintenance programs meet or exceed Australian reliability standards.",
    imageUrl: prevent
  },
  {
    id: 3,
    title: "Battery Recycling & Disposal",
    slug: "battery-recycling-disposal",
    heroTitle: {
      line1: { white: "Responsible ", orange: "Recycling" },
      line2: { white: "Eco-Friendly ", orange: "Disposal" }
    },
    heroDescription: "Environmentally responsible battery recycling and disposal services ensuring full regulatory compliance.",
    criticalPowerTitle: "Environmental Stewardship",
    criticalPowerDescription: "Battery disposal is heavily regulated due to environmental concerns and hazardous materials. Improper disposal can lead to significant fines and environmental damage. Our recycling programs ensure 100% compliance with all local, state, and federal regulations.\n\nWe partner with certified recycling facilities to maximize material recovery while minimizing environmental impact. Our comprehensive documentation provides audit trails and certificates of recycling for your compliance records.",
    keyHighlights: [
      "Australian EPA Compliant Disposal Methods",
      "100% Material Recovery Programs",
      "Complete Documentation & Certificates",
      "Hazardous Materials Handling Certified",
      "Zero Landfill Policy"
    ],
    services: [
      { name: "Ni-Cd & Block Nickel Maintenance", active: false },
      { name: "Lead-Acid & VRLA Services", active: false },
      { name: "Electrical Conditioning", active: false },
      { name: "UPS Bank Support", active: false },
      { name: "Recycling & Disposal", active: true }
    ],
    technicalProcedures: [
      {
        title: "Battery Assessment",
        description: "Evaluation of battery type, age, and condition for proper recycling classification.",
        icon: "FaClipboardCheck"
      },
      {
        title: "Safe Removal",
        description: "Professional de-installation following Australian WHS and environmental safety protocols.",
        icon: "FaShieldAlt"
      },
      {
        title: "Transportation",
        description: "Licensed hazardous material transport to certified recycling facilities.",
        icon: "FaTruck"
      },
      {
        title: "Material Separation",
        description: "Automated and manual separation of battery components for maximum recovery.",
        icon: "FaRecycle"
      },
      {
        title: "Hazardous Processing",
        description: "Safe handling and processing of electrolytes and toxic materials.",
        icon: "FaBiohazard"
      },
      {
        title: "Documentation",
        description: "Complete chain-of-custody and recycling certification documentation.",
        icon: "FaCertificate"
      }
    ],
    emergencyTitle: "Emergency Disposal Needed?",
    emergencyDescription: "We provide rapid response for emergency battery removal and disposal situations.",
    certificationTitle: "Australian EPA Certified",
    certificationDescription: "Fully certified under Australian EPA hazardous waste regulations and protocols.",
    imageUrl: BatteryRecycle,
  },
  {
    id: 4,
    title: "UPS Battery Bank Support",
    slug: "ups-battery-bank-support",
    heroTitle: {
      line1: { white: "UPS ", orange: "Battery" },
      line2: { white: "Bank ", orange: "Support" }
    },
    heroDescription: "Complete UPS battery bank management including testing, maintenance, and replacement services.",
    criticalPowerTitle: "Uninterruptible Power Reliability",
    criticalPowerDescription: "UPS battery banks are critical for protecting sensitive electronics and ensuring business continuity. These systems require specialized maintenance due to their unique charging requirements and sensitivity to environmental conditions.\n\nOur UPS support services cover all major manufacturers and battery chemistries. We provide comprehensive testing, capacity verification, and replacement planning to ensure your UPS systems are ready when needed most.",
    keyHighlights: [
      "All Major UPS Brands Supported",
      "Real-Time Capacity Monitoring",
      "Thermal Imaging & Analysis",
      "Load Bank Testing Capabilities",
      "24/7 Emergency Response"
    ],
    services: [
      { name: "Ni-Cd & Block Nickel Maintenance", active: false },
      { name: "Lead-Acid & VRLA Services", active: false },
      { name: "Electrical Conditioning", active: false },
      { name: "UPS Bank Support", active: true },
      { name: "Recycling & Disposal", active: false }
    ],
    technicalProcedures: [
      {
        title: "Battery String Testing",
        description: "Individual cell and string testing to identify weak or failing batteries.",
        icon: "FaBolt"
      },
      {
        title: "Load Bank Analysis",
        description: "Full system testing under actual load conditions to verify runtime performance.",
        icon: "FaCog"
      },
      {
        title: "Thermal Scanning",
        description: "Infrared analysis to detect high-resistance connections and hot spots.",
        icon: "FaThermometerHalf"
      },
      {
        title: "Charger Verification",
        description: "Testing and calibration of UPS charging systems for optimal battery health.",
        icon: "FaChargingStation"
      },
      {
        title: "Runtime Testing",
        description: "Discharge testing to verify actual backup runtime versus specifications.",
        icon: "FaClock"
      },
      {
        title: "System Integration",
        description: "Testing UPS and battery bank integration for proper communication and operation.",
        icon: "FaNetworkWired"
      }
    ],
    emergencyTitle: "UPS System Down?",
    emergencyDescription: "Our rapid response team can restore your UPS battery bank within hours, not days.",
    certificationTitle: "Manufacturer Certified",
    certificationDescription: "Certified by major UPS manufacturers including APC, Eaton, and Liebert.",
    imageUrl: UPS
  },
  {
    id: 5,
    title: "Emergency Response Services",
    slug: "emergency-response-services",
    heroTitle: {
      line1: { white: "Emergency ", orange: "Response" },
      line2: { white: "24/7 ", orange: "Support" }
    },
    heroDescription: "Round-the-clock emergency response team for critical battery failures and power system emergencies.",
    criticalPowerTitle: "Critical Response Capability",
    criticalPowerDescription: "When battery systems fail, every minute counts. Our emergency response teams are strategically positioned to provide rapid assistance when you need it most. We understand the critical nature of power systems and the impact of downtime on your operations.\n\nOur emergency services include temporary power solutions, rapid battery replacement, and system restoration. We maintain an extensive inventory of common battery types and components to ensure we can respond effectively to any emergency situation.",
    keyHighlights: [
      "2-Hour Response Time Guarantee",
      "Nationwide Service Coverage",
      "Temporary Power Solutions",
      "Rapid Battery Replacement",
      "System Restoration Services"
    ],
    services: [
      { name: "Ni-Cd & Block Nickel Maintenance", active: false },
      { name: "Lead-Acid & VRLA Services", active: false },
      { name: "Electrical Conditioning", active: false },
      { name: "UPS Bank Support", active: false },
      { name: "Emergency Response Services", active: true },
      { name: "Recycling & Disposal", active: false }
    ],
    technicalProcedures: [
      {
        title: "Rapid Diagnosis",
        description: "Quick system assessment to identify failure points and restoration requirements.",
        icon: "FaStethoscope"
      },
      {
        title: "Temporary Power",
        description: "Deployment of temporary battery systems to restore critical power immediately.",
        icon: "FaPlug"
      },
      {
        title: "Emergency Replacement",
        description: "Rapid replacement of failed batteries with fully tested and certified units.",
        icon: "FaExchangeAlt"
      },
      {
        title: "System Recovery",
        description: "Complete system restoration including testing and verification of proper operation.",
        icon: "FaRedo"
      },
      {
        title: "Load Transfer",
        description: "Safe transfer of critical loads to temporary or restored power systems.",
        icon: "FaArrowRight"
      },
      {
        title: "Post-Emergency Analysis",
        description: "Comprehensive analysis of failure causes and recommendations for prevention.",
        icon: "FaSearchPlus"
      }
    ],
    emergencyTitle: "Emergency Hotline Active",
    emergencyDescription: "Call our 24/7 emergency hotline for immediate assistance with critical power failures.",
    certificationTitle: "Rapid Response Certified",
    certificationDescription: "Certified emergency response team with Australian WHS and safety training.",
    imageUrl: emr
  },
  {
    id: 6,
    title: "Industrial Battery Reconditioning",
    slug: "industrial-battery-reconditioning",
    heroTitle: {
      line1: { white: "Battery ", orange: "Reconditioning" },
      line2: { white: "Performance ", orange: "Restoration" }
    },
    heroDescription: "Professional reconditioning services to restore aging batteries to near-original performance.",
    criticalPowerTitle: "Extended Battery Life",
    criticalPowerDescription: "Battery replacement is expensive and often unnecessary. Many aging batteries can be restored to 80-90% of their original capacity through professional reconditioning processes. Our reconditioning services use advanced techniques to reverse sulfation, restore electrolyte balance, and rejuvenate cell performance.\n\nWe specialize in industrial battery systems where replacement costs can run into hundreds of thousands of dollars. Our reconditioning process is scientifically proven and can extend battery life by 3-5 years, providing significant cost savings and reducing environmental impact.",
    keyHighlights: [
      "Up to 90% Capacity Restoration",
      "3-5 Year Life Extension",
      "Scientifically Proven Methods",
      "Cost-Effective Alternative",
      "Environmentally Sustainable"
    ],
    services: [
      { name: "Ni-Cd & Block Nickel Maintenance", active: false },
      { name: "Lead-Acid & VRLA Services", active: false },
      { name: "Industrial Battery Reconditioning", active: true },
      { name: "UPS Bank Support", active: false },
      { name: "Recycling & Disposal", active: false }
    ],
    technicalProcedures: [
      {
        title: "Desulfation Treatment",
        description: "Advanced pulse charging to break down sulfate crystals and restore plate surfaces.",
        icon: "FaBolt"
      },
      {
        title: "Electrolyte Rebalancing",
        description: "Restoration of proper electrolyte specific gravity and chemical balance.",
        icon: "FaFlask"
      },
      {
        title: "Equalization Charging",
        description: "Controlled overcharging to balance cell voltages and remove stratification.",
        icon: "FaBatteryFull"
      },
      {
        title: "Deep Cycling",
        description: "Controlled discharge and recharge cycles to rejuvenate active materials.",
        icon: "FaSyncAlt"
      },
      {
        title: "Capacity Testing",
        description: "Before and after testing to measure restoration effectiveness.",
        icon: "FaChartLine"
      },
      {
        title: "Performance Validation",
        description: "Comprehensive testing to verify restored performance meets specifications.",
        icon: "FaCheckCircle"
      }
    ],
    emergencyTitle: "Battery Performance Degraded?",
    emergencyDescription: "Contact us for a free reconditioning assessment to see if your batteries can be restored.",
    certificationTitle: "Reconditioning Certified",
    certificationDescription: "Certified reconditioning processes meeting industry best practices.",
    imageUrl: rec
  },
  {
    id: 7,
    title: "On-Site Field Services",
    slug: "onsite-field-services",
    heroTitle: {
      line1: { white: "On-Site ", orange: "Field" },
      line2: { white: "Mobile ", orange: "Services" }
    },
    heroDescription: "Fully equipped mobile service teams providing comprehensive battery maintenance at your facility.",
    criticalPowerTitle: "Mobile Service Excellence",
    criticalPowerDescription: "Many industrial battery systems cannot be moved or transported to service facilities. Our on-site field services bring the complete battery service capability directly to your location. Our mobile service units are equipped with state-of-the-art testing equipment, tools, and replacement parts.\n\nOur field service teams are experienced in working in various industrial environments including power plants, data centers, manufacturing facilities, and remote sites. We minimize disruption to your operations while providing comprehensive battery services.",
    keyHighlights: [
      "Fully Equipped Mobile Units",
      "Certified Field Technicians",
      "Minimal Operational Disruption",
      "Complete On-Site Testing",
      "Immediate Service Reports"
    ],
    services: [
      { name: "Ni-Cd & Block Nickel Maintenance", active: false },
      { name: "Lead-Acid & VRLA Services", active: false },
      { name: "On-Site Field Services", active: true },
      { name: "UPS Bank Support", active: false },
      { name: "Recycling & Disposal", active: false }
    ],
    technicalProcedures: [
      {
        title: "Mobile Testing Lab",
        description: "Complete battery testing capabilities using portable laboratory equipment.",
        icon: "FaTruck"
      },
      {
        title: "On-Site Load Testing",
        description: "Portable load banks for full system testing without removing batteries.",
        icon: "FaCog"
      },
      {
        title: "Field Maintenance",
        description: "Complete maintenance procedures performed at your facility location.",
        icon: "FaTools"
      },
      {
        title: "Remote Monitoring",
        description: "Installation of monitoring systems for continuous performance tracking.",
        icon: "FaSatelliteDish"
      },
      {
        title: "Emergency Response",
        description: "Rapid deployment for on-site emergency battery service and repair.",
        icon: "FaAmbulance"
      },
      {
        title: "Safety Compliance",
        description: "Full safety protocols and compliance for on-site work in industrial environments.",
        icon: "FaHardHat"
      }
    ],
    emergencyTitle: "Need On-Site Service?",
    emergencyDescription: "Our mobile service teams can be at your facility within hours for emergency service.",
    certificationTitle: "Field Service Certified",
    certificationDescription: "All field technicians are Australian WHS certified and manufacturer trained.",
    imageUrl: Onsite
  },
  {
    id: 8,
    title: "Battery Wash & Cleaning",
    slug: "battery-wash-cleaning",
    heroTitle: {
      line1: { white: "Battery ", orange: "Cleaning" },
      line2: { white: "Professional ", orange: "Washing" }
    },
    heroDescription: "Professional cleaning and washing services to remove corrosion and ensure optimal battery performance.",
    criticalPowerTitle: "Clean Power Performance",
    criticalPowerDescription: "Battery corrosion and contamination are leading causes of battery failure and reduced performance. Dirt, acid residue, and corrosion can create high-resistance connections, cause self-discharge, and lead to premature battery failure. Our professional cleaning services address these issues comprehensively.\n\nOur battery washing and cleaning services use specialized equipment and environmentally safe cleaning agents. We follow strict safety protocols to protect both our technicians and your equipment. Regular cleaning can extend battery life by up to 25% and improve system reliability.",
    keyHighlights: [
      "Acid Neutralization Treatment",
      "Corrosion Removal Services",
      "Connection Cleaning",
      "Environmentally Safe Methods",
      "Performance Improvement Guarantee"
    ],
    services: [
      { name: "Ni-Cd & Block Nickel Maintenance", active: false },
      { name: "Lead-Acid & VRLA Services", active: false },
      { name: "Battery Wash & Cleaning", active: true },
      { name: "UPS Bank Support", active: false },
      { name: "Recycling & Disposal", active: false }
    ],
    technicalProcedures: [
      {
        title: "Acid Neutralization",
        description: "Safe neutralization and removal of battery acid residue and deposits.",
        icon: "FaFlask"
      },
      {
        title: "Corrosion Removal",
        description: "Professional removal of corrosion from terminals, connectors, and battery cases.",
        icon: "FaEraser"
      },
      {
        title: "Connection Cleaning",
        description: "Cleaning and polishing of all electrical connections for optimal conductivity.",
        icon: "FaPlug"
      },
      {
        title: "Case Washing",
        description: "Complete exterior cleaning using specialized battery-safe cleaning solutions.",
        icon: "FaSoap"
      },
      {
        title: "Ventilation Cleaning",
        description: "Clearing and cleaning of battery vents and ventilation systems.",
        icon: "FaWind"
      },
      {
        title: "Protective Coating",
        description: "Application of anti-corrosion coatings to prevent future corrosion buildup.",
        icon: "FaShieldAlt"
      }
    ],
    emergencyTitle: "Corrosion Issues Detected?",
    emergencyDescription: "Contact us immediately for professional corrosion removal and battery cleaning services.",
    certificationTitle: "Safety Certified",
    certificationDescription: "All cleaning procedures meet Australian WHS and environmental safety standards.",
    imageUrl: washing
  },
  {
    id: 9,
    title: "Battery Maintenance Services",
    slug: "battery-maintenance-services",
    heroTitle: {
      line1: { white: "Expert Battery ", orange: "Maintenance" },
      line2: { white: "Solutions", orange: "" }
    },
    heroDescription: "Comprehensive battery maintenance services including testing, repair, and preventive maintenance for all battery types.",
    criticalPowerTitle: "Battery Health Management",
    criticalPowerDescription: "Professional battery maintenance ensures optimal performance and extends battery life. Our services include regular testing, cleaning, and preventive maintenance to keep your backup power systems reliable.",
    keyHighlights: [
      "Comprehensive Battery Testing",
      "Preventive Maintenance Programs",
      "Expert Battery Repair Services",
      "Emergency Battery Replacement",
      "Battery Performance Optimization",
      "Industry-Leading Expertise"
    ],
    services: [
      { name: "Battery Maintenance Services", active: true },
      { name: "Electrical Conditioning & Testing", active: false },
      { name: "Major Battery Work", active: false },
      { name: "Battery Recycling & Refurbishment", active: false },
      { name: "Equipment We Use", active: false }
    ],
    technicalProcedures: [
      {
        title: "Battery Load Testing",
        description: "Comprehensive load testing to verify battery capacity and performance under real-world conditions.",
        icon: "FaBolt"
      },
      {
        title: "Electrical System Analysis",
        description: "Advanced electrical analysis to identify potential issues and optimize battery system performance.",
        icon: "FaBolt"
      },
      {
        title: "Battery Repair & Replacement",
        description: "Professional repair services and replacement solutions for all types of industrial batteries.",
        icon: "FaWrench"
      },
      {
        title: "Preventive Maintenance",
        description: "Scheduled maintenance programs to prevent battery failures and extend system lifespan.",
        icon: "FaTools"
      },
      {
        title: "Battery Recycling",
        description: "Environmentally responsible battery recycling and disposal services following all regulations.",
        icon: "FaRecycle"
      },
      {
        title: "Equipment Calibration",
        description: "Precision calibration of testing and maintenance equipment for accurate battery diagnostics.",
        icon: "FaCog"
      }
    ],
    emergencyTitle: "Battery Emergency?",
    emergencyDescription: "24/7 emergency battery services available for critical power system failures.",
    certificationTitle: "Certified Technicians",
    certificationDescription: "Our technicians are certified and trained for all major battery brands and types.",
    imageUrl: Maintenance
  },
  {
    id: 10,
    title: "Electrical Conditioning & Testing",
    slug: "electrical-conditioning-testing",
    heroTitle: {
      line1: { white: "Advanced Electrical ", orange: "Testing" },
      line2: { white: "& Conditioning", orange: "" }
    },
    heroDescription: "State-of-the-art electrical testing and conditioning services to ensure battery system reliability and performance.",
    criticalPowerTitle: "Electrical System Excellence",
    criticalPowerDescription: "Advanced electrical testing and conditioning services to maximize battery performance and reliability. Our comprehensive testing procedures ensure your systems meet all industry standards and perform optimally.",
    keyHighlights: [
      "Advanced Diagnostic Equipment",
      "Load Bank Testing",
      "Cell Balancing Services",
      "IEEE & AS Standards Compliance",
      "Thermal Imaging Analysis",
      "Expert Electrical Engineering"
    ],
    services: [
      { name: "Battery Maintenance Services", active: false },
      { name: "Electrical Conditioning & Testing", active: true },
      { name: "Major Battery Work", active: false },
      { name: "Battery Recycling & Refurbishment", active: false },
      { name: "Equipment We Use", active: false }
    ],
    technicalProcedures: [
      {
        title: "Load Bank Testing",
        description: "Comprehensive load bank testing with advanced monitoring equipment.",
        icon: "FaBolt"
      },
      {
        title: "Cell Voltage Analysis",
        description: "Detailed cell-by-cell voltage analysis to identify weak or failing cells.",
        icon: "FaSearch"
      },
      {
        title: "Impedance Testing",
        description: "Professional impedance testing to measure internal resistance and battery health.",
        icon: "FaChartLine"
      },
      {
        title: "Thermal Imaging",
        description: "Infrared thermal imaging to detect hot spots and potential failures.",
        icon: "FaThermometerHalf"
      },
      {
        title: "System Calibration",
        description: "Precision calibration of battery monitoring and management systems.",
        icon: "FaCog"
      },
      {
        title: "Performance Reporting",
        description: "Detailed performance reports with actionable insights and recommendations.",
        icon: "FaFileAlt"
      }
    ],
    emergencyTitle: "Electrical Emergency?",
    emergencyDescription: "24/7 emergency electrical services for critical battery system issues.",
    certificationTitle: "Certified Testing",
    certificationDescription: "All testing procedures comply with IEEE 450, 1188, 1106 and Australian AS 3820 standards.",
    imageUrl: ElectricalConditioning
  },
  {
    id: 11,
    title: "Major Battery Work",
    slug: "major-battery-work",
    heroTitle: {
      line1: { white: "Professional ", orange: "Battery" },
      line2: { white: "Installation", orange: " & Maintenance" }
    },
    heroDescription: "Expert battery installation, replacement, and major maintenance services for industrial and commercial applications.",
    criticalPowerTitle: "Battery System Installation",
    criticalPowerDescription: "Professional battery installation and major maintenance services for industrial backup power systems. Our expert technicians handle everything from new installations to complete system overhauls.",
    keyHighlights: [
      "Expert Installation Services",
      "Major System Overhauls",
      "Industrial Battery Solutions",
      "Safety-First Approach",
      "Project Management",
      "24/7 Support Availability"
    ],
    services: [
      { name: "Battery Maintenance Services", active: false },
      { name: "Electrical Conditioning & Testing", active: false },
      { name: "Major Battery Work", active: true },
      { name: "Battery Recycling & Refurbishment", active: false },
      { name: "Equipment We Use", active: false }
    ],
    technicalProcedures: [
      {
        title: "Battery Installation",
        description: "Professional installation of all types of industrial battery systems.",
        icon: "FaWrench"
      },
      {
        title: "System Commissioning",
        description: "Complete system commissioning including testing and startup procedures.",
        icon: "FaPlug"
      },
      {
        title: "Battery Replacement",
        description: "Safe and efficient battery replacement services for aging systems.",
        icon: "FaBatteryFull"
      },
      {
        title: "Cable Management",
        description: "Professional cable routing, management, and optimization services.",
        icon: "FaNetworkWired"
      },
      {
        title: "System Testing",
        description: "Comprehensive testing of installed battery systems before handover.",
        icon: "FaCheckCircle"
      },
      {
        title: "Maintenance Planning",
        description: "Customized maintenance planning and scheduling for optimal system performance.",
        icon: "FaClipboardCheck"
      }
    ],
    emergencyTitle: "Installation Emergency?",
    emergencyDescription: "24/7 emergency installation and maintenance services for critical battery system failures.",
    certificationTitle: "Installation Certified",
    certificationDescription: "All installation work meets Australian AS/NZS 3000 and local electrical code requirements.",
    imageUrl: major
  },
  {
    id: 12,
    title: "Battery Recycling & Refurbishment",
    slug: "battery-recycling-refurbishment",
    heroTitle: {
      line1: { white: "Eco-Friendly Battery ", orange: "Recycling" },
      line2: { white: "& Refurbishment", orange: "" }
    },
    heroDescription: "Environmentally responsible battery recycling and refurbishment services following all regulatory standards.",
    criticalPowerTitle: "Sustainable Battery Solutions",
    criticalPowerDescription: "Professional battery recycling and refurbishment services that protect the environment while maximizing value. Our processes ensure compliance with all environmental regulations.",
    keyHighlights: [
      "Australian EPA Compliant Recycling",
      "Battery Refurbishment Programs",
      "Environmental Protection",
      "Resource Recovery",
      "Regulatory Compliance",
      "Sustainable Practices"
    ],
    services: [
      { name: "Battery Maintenance Services", active: false },
      { name: "Electrical Conditioning & Testing", active: false },
      { name: "Major Battery Work", active: false },
      { name: "Battery Recycling & Refurbishment", active: true },
      { name: "Equipment We Use", active: false }
    ],
    technicalProcedures: [
      {
        title: "Battery Assessment",
        description: "Comprehensive assessment to determine refurbishment potential and value.",
        icon: "FaSearch"
      },
      {
        title: "Safe Disassembly",
        description: "Professional and safe disassembly procedures for all battery types.",
        icon: "FaTools"
      },
      {
        title: "Material Recovery",
        description: "Advanced material recovery processes for valuable battery components.",
        icon: "FaRecycle"
      },
      {
        title: "Environmental Testing",
        description: "Testing for hazardous materials and environmental safety compliance.",
        icon: "FaBiohazard"
      },
      {
        title: "Refurbishment Process",
        description: "Professional refurbishment to extend battery life and performance.",
        icon: "FaRedo"
      },
      {
        title: "Quality Certification",
        description: "Quality assurance and certification for refurbished batteries.",
        icon: "FaCertificate"
      }
    ],
    emergencyTitle: "Recycling Emergency?",
    emergencyDescription: "24/7 emergency recycling services for battery spills and environmental incidents.",
    certificationTitle: "Environmental Certified",
    certificationDescription: "All recycling processes meet Australian EPA and environmental regulatory standards.",
    imageUrl: BatteryRecycle
  },
  {
    id: 13,
    title: "Equipment We Use",
    slug: "equipment-we-use",
    heroTitle: {
      line1: { white: "Advanced ", orange: "Equipment" },
      line2: { white: " & Technology", orange: "" }
    },
    heroDescription: "State-of-the-art equipment and technology for professional battery services and maintenance.",
    criticalPowerTitle: "Technology-Driven Solutions",
    criticalPowerDescription: "Advanced equipment and cutting-edge technology for superior battery service delivery. Our investment in technology ensures accurate diagnostics and efficient service delivery.",
    keyHighlights: [
      "Advanced Diagnostic Tools",
      "State-of-the-Art Equipment",
      "Precision Testing Instruments",
      "Digital Monitoring Systems",
      "Safety Equipment",
      "Technology Integration"
    ],
    services: [
      { name: "Battery Maintenance Services", active: false },
      { name: "Electrical Conditioning & Testing", active: false },
      { name: "Major Battery Work", active: false },
      { name: "Battery Recycling & Refurbishment", active: false },
      { name: "Equipment We Use", active: true }
    ],
    technicalProcedures: [
      {
        title: "Advanced Diagnostics",
        description: "Cutting-edge diagnostic equipment for accurate battery analysis.",
        icon: "FaSearchPlus"
      },
      {
        title: "Load Bank Testing",
        description: "Computer-controlled load bank testing for precise performance measurement.",
        icon: "FaChartLine"
      },
      {
        title: "Thermal Analysis",
        description: "Infrared thermal analysis for hotspot detection and prevention.",
        icon: "FaThermometerHalf"
      },
      {
        title: "Digital Monitoring",
        description: "Real-time digital monitoring systems for continuous performance tracking.",
        icon: "FaNetworkWired"
      },
      {
        title: "Precision Instruments",
        description: "Calibrated precision instruments for accurate measurements and testing.",
        icon: "FaFlask"
      },
      {
        title: "Safety Equipment",
        description: "Advanced safety equipment for technician protection and hazard prevention.",
        icon: "FaHardHat"
      }
    ],
    emergencyTitle: "Equipment Emergency?",
    emergencyDescription: "24/7 emergency equipment support for critical tool failures and service needs.",
    certificationTitle: "Technology Certified",
    certificationDescription: "All equipment meets manufacturer specifications and industry standards.",
    imageUrl: equpiment
  }
];
