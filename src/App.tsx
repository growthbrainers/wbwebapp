import { useState, useEffect, FormEvent } from "react";
import { 
  Shield, 
  Users, 
  Mic, 
  Award, 
  Play, 
  X, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Globe, 
  Cpu, 
  MapPin, 
  Video, 
  BookOpen, 
  FileText,
  Briefcase,
  Layers,
  Sparkles,
  Lock,
  Compass,
  ArrowLeft,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Consultation, ConsultationStatus, ServiceDetail, getWhatsAppLink } from "./types";
import BookingModal from "./components/BookingModal";
import AdminDashboard from "./components/AdminDashboard";
import StatusTracker from "./components/StatusTracker";
import { VideoModal, ServiceModal } from "./components/Modals";

// Default premium sample consultations to bootstrap the application dockets
const DEFAULT_CONSULTATIONS: Consultation[] = [
  {
    id: "sample-1",
    name: "Senator Adebayo Alao",
    email: "a.alao@senate.gov.ng",
    organization: "National Senate Security Committee",
    service: "Cybersecurity Strategy",
    date: "2026-07-15",
    timeSlot: "11:30 AM UTC",
    notes: "We require a complete cybersecurity posture briefing for the parliamentary defense caucus, focusing on critical orbital satcom links and satellite transponder shielding parameters.",
    status: "Confirmed",
    createdAt: new Date("2026-07-01T10:30:00.000Z").toISOString(),
    adminNotes: "Credentials and ministerial clearance checked. preparing Ka-band encryption architecture slides.",
    engagementId: "WB-2026-8941"
  },
  {
    id: "sample-2",
    name: "Engr. Dr. Amadi Oke",
    email: "a.oke@nasrda.gov.ng",
    organization: "NASRDA (Space Research Agency)",
    service: "Satellite VSAT",
    date: "2026-07-18",
    timeSlot: "03:00 PM UTC",
    notes: "Reviewing regional beam coordinates and transponder link budget margins to mitigate microwave frequency degradation in remote geopolitical coordinates.",
    status: "Pending Verification",
    createdAt: new Date("2026-07-02T14:45:00.000Z").toISOString(),
    adminNotes: "Awaiting national space agency credential clearance. Check available transponder slots on Sat-3.",
    engagementId: "WB-2026-1052"
  },
  {
    id: "sample-3",
    name: "Prof. Chinedu Benson",
    email: "c.benson@unilag.edu",
    organization: "University of Lagos (UNILAG)",
    service: "Resource Lecture",
    date: "2026-07-22",
    timeSlot: "09:00 AM UTC",
    notes: "Inviting Fellow Wale Belo to present the keynote lecture at the 2026 Aerospace and Satcom Congress. Topics: Emergency Cyber Governance and Regional Telemetry Operations.",
    status: "Confirmed",
    createdAt: new Date("2026-07-03T09:15:00.000Z").toISOString(),
    adminNotes: "UNILAG Keynote accepted. Lecture slides finalized.",
    engagementId: "WB-2026-4411"
  }
];

export default function App() {
  // Navigation & View States
  const [activeSection, setActiveSection] = useState("about");
  const [viewMode, setViewMode] = useState<"client" | "admin">("client");

  // Core Data Persistence State
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  // Modals Visibility
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  // Video State
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(25);

  // Dual Portfolio Interactive State
  const [portfolioTab, setPortfolioTab] = useState<"engineering" | "art">("engineering");

  // 1. Load consultations on mount
  useEffect(() => {
    const stored = localStorage.getItem("wale_belo_consultations");
    if (stored) {
      try {
        setConsultations(JSON.parse(stored));
      } catch (e) {
        setConsultations(DEFAULT_CONSULTATIONS);
      }
    } else {
      localStorage.setItem("wale_belo_consultations", JSON.stringify(DEFAULT_CONSULTATIONS));
      setConsultations(DEFAULT_CONSULTATIONS);
    }
  }, []);

  // 2. Save consultations helper
  const saveConsultations = (updated: Consultation[]) => {
    setConsultations(updated);
    localStorage.setItem("wale_belo_consultations", JSON.stringify(updated));
  };

  // Add new consultation
  const handleAddConsultation = (newForm: Omit<Consultation, "id" | "status" | "createdAt" | "engagementId">) => {
    const randomId = `client-${Date.now()}`;
    const generatedId = `WB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newRecord: Consultation = {
      ...newForm,
      id: randomId,
      status: "Pending Verification",
      createdAt: new Date().toISOString(),
      engagementId: generatedId,
      adminNotes: "Awaiting initial dossier verification check."
    };

    saveConsultations([newRecord, ...consultations]);
  };

  // Update Status & Admin Notes on Admin side
  const handleUpdateStatus = (id: string, status: ConsultationStatus, adminNotes?: string) => {
    const updated = consultations.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          status, 
          adminNotes: adminNotes !== undefined ? adminNotes : c.adminNotes 
        };
      }
      return c;
    });
    saveConsultations(updated);
  };

  // Delete Consultation on Admin side
  const handleDeleteConsultation = (id: string) => {
    if (confirm("Are you sure you want to delete this consultation dossier from active registers?")) {
      const updated = consultations.filter(c => c.id !== id);
      saveConsultations(updated);
    }
  };

  // Add manual booking from admin side
  const handleAddManualConsultation = (manualRecord: Consultation) => {
    saveConsultations([manualRecord, ...consultations]);
  };

  // Client Reschedule Consultation
  const handleReschedule = (id: string, date: string, timeSlot: string) => {
    const updated = consultations.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          date, 
          timeSlot, 
          status: "Rescheduled" as ConsultationStatus,
          adminNotes: `Client requested rescheduling to ${date} @ ${timeSlot}. Awaiting validation.`
        };
      }
      return c;
    });
    saveConsultations(updated);
  };

  // Client Cancel Consultation
  const handleCancel = (id: string) => {
    const updated = consultations.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          status: "Declined" as ConsultationStatus,
          adminNotes: "Consultation cancelled by the registered client."
        };
      }
      return c;
    });
    saveConsultations(updated);
  };

  // Helper to scroll to a section
  const scrollToSection = (id: string) => {
    if (viewMode !== "client") {
      setViewMode("client");
      // Delay slightly to allow component rendering before scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setActiveSection(id);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Services data mapping for component triggers
  const servicesData: ServiceDetail[] = [
    {
      id: "cybersecurity",
      title: "Cybersecurity Strategy & SOC",
      icon: Shield,
      summary: "High-level information security architecture, threat vector assessment, and Security Operations Center (SOC) lifecycle oversight.",
      bullets: [
        "ISO/IEC 27001 & NIST Framework Compliance alignment",
        "Executive Incident Response and cyber-resiliency strategies",
        "Dual-use aerospace & maritime satellite channel encryption setups",
        "Sovereign data custody and regulatory governance policies"
      ],
      metrics: ["99.99% Secure Node Integrity", "Fellow-Level Advisory SLA", "Zero-Trust Architecture"]
    },
    {
      id: "speaking",
      title: "Resource Speaking & Lectures",
      icon: Mic,
      summary: "Executive keynotes, university lectures, and professional defense seminars on space systems, VSAT engineering, and regional security.",
      bullets: [
        "NSE (Nigerian Society of Engineers) technical paper delivery",
        "Satellite constellation development keynotes",
        "National security panels on critical digital infrastructure",
        "Advanced Telecommunications masterclasses for state enterprises"
      ],
      metrics: ["50+ Major Keynotes", "Fellow of the NSE Panel", "Global Tech Audience"]
    },
    {
      id: "mentorship",
      title: "Youth Tech Mentorship",
      icon: Users,
      summary: "Fostering the next generation of engineers, satellite technicians, and ethical hackers through structured training pipelines.",
      bullets: [
        "Hands-on VSAT terminal alignment workshops",
        "Ethical hacking and cybersecurity defensive bootcamps",
        "Scholarship and fellowship sponsorship facilitation",
        "Direct guidance into global engineering programs"
      ],
      metrics: ["1,200+ Youth Impacted", "Direct Industry Placements", "NSE Youth Outreach Program"]
    }
  ];

  const locations = [
    { name: "Nigeria", flag: "🇳🇬", desc: "NSE Fellow & Satellite Hub" },
    { name: "India", flag: "🇮🇳", desc: "Global Satcom Training & Tech Hub" },
    { name: "China", flag: "🇨🇳", desc: "Aerospace & Telecom Partnership" },
    { name: "Singapore", flag: "🇸🇬", desc: "Advanced Cybersecurity Summit" },
    { name: "Belgium", flag: "🇧🇪", desc: "EU Regulatory Policy Briefing" },
    { name: "Malaysia", flag: "🇲🇾", desc: "Asiapac SATCON Delegation" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-gold-400 selection:text-navy-950 font-sans">
      
      {/* GLOBAL NAVIGATION BAR */}
      <nav id="nav" className="sticky top-0 z-40 bg-navy-900 border-b border-navy-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => {
                setViewMode("client");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                WB <span className="text-gold-500">Advisory</span>
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-gold-500 ml-1 animate-pulse"></span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center space-x-8 font-medium">
              <button 
                onClick={() => scrollToSection("about")} 
                className={`transition-colors hover:text-gold-400 cursor-pointer text-sm ${viewMode === "client" && activeSection === "about" ? "text-gold-500 font-semibold" : "text-slate-300"}`}
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection("services")} 
                className={`transition-colors hover:text-gold-400 cursor-pointer text-sm ${viewMode === "client" && activeSection === "services" ? "text-gold-500 font-semibold" : "text-slate-300"}`}
              >
                Consulting Services
              </button>
              <button 
                onClick={() => scrollToSection("portfolio")} 
                className={`transition-colors hover:text-gold-400 cursor-pointer text-sm ${viewMode === "client" && activeSection === "portfolio" ? "text-gold-500 font-semibold" : "text-slate-300"}`}
              >
                Portfolio
              </button>
              <button 
                onClick={() => scrollToSection("media")} 
                className={`transition-colors hover:text-gold-400 cursor-pointer text-sm ${viewMode === "client" && activeSection === "media" ? "text-gold-500 font-semibold" : "text-slate-300"}`}
              >
                Media
              </button>
            </div>

            {/* Dynamic CTA */}
            <div className="flex items-center space-x-3">
              {viewMode === "client" && (
                <a
                  id="cta-nav-book"
                  href={getWhatsAppLink("Hello Engineer Wale Belo, I would like to book an elite technical consultation with you regarding satellite systems and cybersecurity strategy.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-navy-950 font-bold px-5 py-2.5 rounded-sm transition-all text-sm font-display tracking-wider shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-1.5"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Book Consultation</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* RENDER ACTIVE SCREEN */}
      {viewMode === "admin" ? (
        /* ADVISORY DIRECTORY PORTAL (ADMIN DASHBOARD) */
        <AdminDashboard 
          consultations={consultations}
          onUpdateStatus={handleUpdateStatus}
          onDeleteConsultation={handleDeleteConsultation}
          onAddManualConsultation={handleAddManualConsultation}
        />
      ) : (
        /* STANDARD EXECUTIVE CLIENT EXPERIENCE LANDING PAGE */
        <>
          {/* HERO SECTION */}
          <section id="about" className="relative bg-navy-900 text-white py-24 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#1e3e62_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-25"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl"></div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Narrative */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Prestige Label badge */}
                  <div className="inline-flex items-center space-x-2 bg-navy-800/80 border border-teal-500/30 px-3 py-1.5 rounded-full text-xs font-mono text-teal-400 tracking-wider uppercase">
                    <Award className="h-3.5 w-3.5 text-gold-500" />
                    <span>Executive Technology Advisory & Sovereign Defense</span>
                  </div>
                  
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                    Strategic Technology Leadership & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-gold-400">Cybersecurity Consulting.</span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl">
                    Expert insights from a <strong className="text-white font-semibold">Fellow of the Nigerian Society of Engineers (FNSE)</strong>, national satellite systems manager, and dual-world creative strategist orchestrating heavy infrastructure defense and elite telecommunication vectors.
                  </p>

                  {/* Credentials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm text-slate-400">
                    <div className="flex items-start space-x-3">
                      <div className="h-5 w-5 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mt-0.5 text-teal-400">✓</div>
                      <div>
                        <span className="text-white block font-medium">Federal Satellites & VSAT Operations</span>
                        20+ Years Deploying Deep Spatial Networks
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="h-5 w-5 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mt-0.5 text-teal-400">✓</div>
                      <div>
                        <span className="text-white block font-medium">Critical Aerospace SOC Strategy</span>
                        Authoritative Shield Against Sovereign Threat Actors
                      </div>
                    </div>
                  </div>
                  
                  {/* Hero Actions */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      id="hero-explore-btn"
                      onClick={() => scrollToSection("services")}
                      className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold px-8 py-3.5 rounded-sm transition-all font-display tracking-wide shadow-xl cursor-pointer hover:shadow-gold-500/10 transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center space-x-2"
                    >
                      <span>Explore Services</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      id="hero-bio-btn"
                      onClick={() => scrollToSection("portfolio")}
                      className="bg-transparent hover:bg-white/5 text-white border border-slate-600 hover:border-white px-8 py-3.5 rounded-sm transition-all font-display tracking-wide cursor-pointer inline-flex items-center space-x-2"
                    >
                      <span>View Dual Portfolio</span>
                    </button>
                  </div>
                </div>

                {/* Right: Immersive Executive Card */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative w-full max-w-sm bg-navy-800/95 border border-navy-700 rounded-lg p-6 shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl"></div>
                    
                    <div className="aspect-square w-full rounded-md bg-gradient-to-b from-navy-900 to-navy-950 border border-teal-500/20 flex flex-col items-center justify-center relative p-8 text-center overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:12px_12px] opacity-10"></div>
                      
                      <div className="relative w-36 h-36 rounded-full border-2 border-gold-500/50 p-1 flex items-center justify-center bg-navy-950">
                        <div className="w-full h-full rounded-full bg-navy-900 border border-teal-500/20 flex items-center justify-center text-gold-500 font-display font-bold text-4xl">
                          WB
                        </div>
                        <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-teal-500 border-2 border-navy-950 animate-ping"></span>
                        <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-teal-500 border-2 border-navy-950"></span>
                      </div>

                      <h3 className="mt-6 font-display text-xl font-bold text-white tracking-wide">Engineer Wale Belo</h3>
                      <p className="text-xs text-teal-400 font-mono tracking-widest mt-1 uppercase">Fellow of the NSE (FNSE)</p>
                      
                      <div className="mt-4 flex space-x-2">
                        <span className="px-2.5 py-0.5 bg-navy-900 border border-navy-700 text-[10px] rounded font-mono text-slate-400">VSAT LEAD</span>
                        <span className="px-2.5 py-0.5 bg-navy-900 border border-navy-700 text-[10px] rounded font-mono text-slate-400">CYBER SEC</span>
                        <span className="px-2.5 py-0.5 bg-navy-900 border border-navy-700 text-[10px] rounded font-mono text-slate-400">FINE ARTIST</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="p-3 bg-navy-900/60 rounded border border-navy-800/80 flex items-center justify-between text-xs text-slate-300">
                        <span className="flex items-center space-x-2">
                          <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
                          <span>Advisory Availability</span>
                        </span>
                        <span className="text-gold-500 font-semibold font-mono">Q3/Q4 Slots Open</span>
                      </div>
                      
                      <a 
                        href={getWhatsAppLink("Hello Engineer Wale Belo, I would like to schedule an advisory briefing dial with you to discuss cyber resilience and telemetry solutions.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-navy-900 hover:bg-teal-500 hover:text-white border border-teal-500/30 text-teal-400 rounded text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-teal-400" />
                        <span>SCHEDULE ADVISORY DIAL</span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* GLOBAL FOOTPRINT BANNER */}
          <section id="footprint" className="bg-slate-100 border-y border-slate-200 py-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                <div className="flex-shrink-0 flex items-center space-x-3 text-navy-900 font-mono text-xs font-bold tracking-widest uppercase">
                  <span className="text-2xl filter drop-shadow-sm select-none">🇳🇬</span>
                  <div className="text-left">
                    <span className="block text-slate-400 text-[9px] uppercase font-mono tracking-wider">OFFICIAL RESIDENCY</span>
                    <span className="block text-navy-900 font-bold">GLOBAL CERTIFICATIONS & RECOGNITION</span>
                  </div>
                </div>

                {/* Locations display inline */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:items-center lg:space-x-8 gap-4 lg:gap-0">
                  {locations.map((loc) => (
                    <div 
                      key={loc.name} 
                      className="flex items-center space-x-2.5 bg-white py-1.5 px-3 rounded shadow-xs border border-slate-200/80 hover:border-teal-400 transition-colors group cursor-default"
                      title={loc.desc}
                    >
                      <span className="text-base">{loc.flag}</span>
                      <div className="text-left">
                        <span className="block text-xs font-bold text-navy-900 group-hover:text-teal-600 transition-colors">{loc.name}</span>
                        <span className="block text-[9px] text-slate-400 uppercase font-mono tracking-tighter">{loc.desc.split(" & ")[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* CORE SERVICES GRID */}
          <section id="services" className="bg-slate-50 py-24 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-500 bg-teal-50 px-3 py-1 rounded border border-teal-200">Advisory Capacities</span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
                  Core Services & Tech Strategy
                </h2>
                <div className="h-1 w-20 bg-gold-500 mx-auto rounded"></div>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Targeted, high-ticket technical frameworks safeguarding core aerospace channels, delivering world-class national directives, and sculpting technological security pipelines.
                </p>
              </div>

              {/* Service Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {servicesData.map((service) => {
                  const IconComp = service.icon;
                  return (
                    <div 
                      id={`service-${service.id}`}
                      key={service.id}
                      className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-teal-500/20 transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
                    >
                      <div>
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center p-3.5 bg-slate-50 text-teal-500 rounded-lg group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 shadow-xs mb-6">
                          <IconComp className="h-6 w-6" />
                        </div>

                        <h3 className="font-display text-xl font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors">
                          {service.title}
                        </h3>
                        
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                          {service.summary}
                        </p>

                        {/* Deliverables snippet */}
                        <ul className="space-y-2 mb-8">
                          {service.bullets.slice(0, 2).map((b, i) => (
                            <li key={i} className="flex items-start text-xs text-slate-500">
                              <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 mr-2 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <button
                          onClick={() => setSelectedService(service)}
                          className="text-xs font-mono font-bold text-teal-500 group-hover:text-gold-600 transition-colors flex items-center space-x-1.5 uppercase tracking-wider cursor-pointer"
                        >
                          <span>Explore Core Framework</span>
                          <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Consultation Trigger */}
              <div className="mt-16 bg-navy-900 rounded-lg p-8 text-white relative overflow-hidden shadow-lg border border-navy-800">
                <div className="absolute inset-0 bg-[radial-gradient(#1e3e62_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-wide">
                      Require a custom infrastructure audit or keynote speaker?
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                      Connect directly with Engineer Wale Belo to discuss scope, timeline, and strategic alignment.
                    </p>
                  </div>
                  <a
                    href={getWhatsAppLink("Hello Engineer Wale Belo, I am inquiring about a custom infrastructure audit and technical engagement for our enterprise.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-navy-950 font-bold px-6 py-3 rounded-sm transition-all text-xs uppercase font-mono tracking-wider cursor-pointer shrink-0 flex items-center space-x-1.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-navy-950" />
                    <span>Inquire For Engagement</span>
                  </a>
                </div>
              </div>

            </div>
          </section>

          {/* DUAL PORTFOLIO (ENGINEERING & ART) */}
          <section id="portfolio" className="bg-white py-24 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-500 bg-teal-50 px-3 py-1 rounded border border-teal-200">The Duality</span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
                  Featured Portfolio & Media
                </h2>
                <div className="h-1 w-20 bg-gold-500 mx-auto rounded"></div>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Witness the synthesis of rigorous space systems engineering and traditional structural handcraft—a rare intersection of high technology and premium African artistic heritage.
                </p>
              </div>

              {/* Split Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column (Award Citation / Media) */}
                <div id="media" className="lg:col-span-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 tracking-wider uppercase">
                      <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping"></span>
                      <span>National Recognition & Media</span>
                    </div>
                    
                    <h3 className="font-display text-2xl font-bold text-navy-900 tracking-tight">
                      National Award Citation Video
                    </h3>
                    
                    <p className="text-slate-600 text-sm leading-relaxed">
                      As a leading satellite engineer, his technical leadership has been broadcast and cited nationally. Discover the documented impact of his strategic contributions to aerospace governance and regional satellite telecommunication protocols.
                    </p>

                    <div className="relative group overflow-hidden rounded-lg shadow-lg bg-navy-950 aspect-video border border-navy-800 flex flex-col justify-between p-6">
                      <div className="absolute inset-0 bg-[radial-gradient(#1e3e62_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-15"></div>
                      
                      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-navy-900/90 px-2.5 py-1 rounded text-[10px] font-mono tracking-widest text-teal-400 border border-teal-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        <span>NATIONAL BROADCAST ARCHIVE • 04:12</span>
                      </div>

                      <div className="absolute top-4 right-4 flex items-center space-x-2 bg-navy-900/90 px-2.5 py-1 rounded text-[10px] font-mono tracking-widest text-gold-500 border border-gold-500/20">
                        <span>HD 1080P</span>
                      </div>

                      {/* Centered Play Button block */}
                      <div className="my-auto flex flex-col items-center justify-center relative z-10 pt-4">
                        <button
                          onClick={() => {
                            setVideoPlaying(false);
                            setVideoProgress(15);
                            setIsVideoModalOpen(true);
                          }}
                          className="h-16 w-16 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer group-hover:bg-gold-400 relative"
                          title="Play Citation Archive"
                        >
                          <Play className="h-6 w-6 fill-navy-950 ml-1 text-navy-950" />
                          <span className="absolute -inset-1.5 rounded-full border border-gold-500/30 animate-ping group-hover:border-gold-400/40"></span>
                        </button>
                        <span className="mt-4 text-xs font-mono tracking-wider text-slate-300 font-bold group-hover:text-white transition-colors">
                          LAUNCH ARCHIVE PLAYBACK
                        </span>
                      </div>

                      {/* Video title metadata */}
                      <div className="bg-navy-900/90 border border-navy-800 p-3.5 rounded-md flex items-center justify-between relative z-10">
                        <div className="text-left">
                          <span className="block text-xs font-bold text-white tracking-wide">National Award Citation & Satellite Leadership</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">Federal Telecommunications Commission Broadcast</span>
                        </div>
                        <FileText className="h-4 w-4 text-gold-500" />
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-500 space-y-2">
                      <span className="font-bold text-navy-900 block font-mono">CITATION BRIEF:</span>
                      <p className="leading-relaxed">
                        "Honored for stellar contributions in developing the sovereign satellite architecture framework, enabling remote learning across underserved geopolitical coordinates, and optimizing cyber security incident containment protocols."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column (The Dual Portfolio) */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 tracking-wider uppercase">
                        <Layers className="h-4 w-4 text-teal-500" />
                        <span>Scientific Rigor & Artistic Hand</span>
                      </div>
                      
                      {/* Selector Tabs */}
                      <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
                        <button
                          onClick={() => setPortfolioTab("engineering")}
                          className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${portfolioTab === "engineering" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                        >
                          Engineering
                        </button>
                        <button
                          onClick={() => setPortfolioTab("art")}
                          className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${portfolioTab === "art" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                        >
                          Artistic Hand
                        </button>
                      </div>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-navy-900 tracking-tight">
                      {portfolioTab === "engineering" ? "Sovereign Aerospace & VSAT Infrastructure" : "Traditional Canvas, Sculptures & Wood Carving"}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {portfolioTab === "engineering" 
                        ? "Overseeing deep technical arrays, satellite dish alignments, telemetry pipelines, and microwave transmission systems critical for multi-node regional telecommunication."
                        : "Merging classic Nigerian woodwork aesthetics and heavy relief carving with modern abstract canvas representation—a meditation on structural symmetry and spatial heritage."}
                    </p>

                    {/* Shared CTA in split card */}
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 shadow-xs min-h-[320px] flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>

                      {portfolioTab === "engineering" ? (
                        /* Engineering Details Card */
                        <div className="relative z-10 space-y-6 flex flex-col justify-between h-full">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-teal-600 uppercase bg-teal-50 px-2.5 py-1 rounded border border-teal-200 inline-block mb-2">
                                PROJECT PROFILE: SAT-098
                              </span>
                              <h4 className="font-display text-lg font-bold text-navy-900">Remote VSAT Installation & Satcom</h4>
                              <p className="text-xs text-slate-500 mt-1">Sovereign communications hub linking rural education clinics</p>
                            </div>
                            <Cpu className="h-8 w-8 text-teal-500 bg-teal-50 p-1.5 rounded-lg border border-teal-100" />
                          </div>

                          {/* Schematic Representation */}
                          <div className="border border-slate-200 bg-white rounded-md p-4 space-y-3 shadow-xs">
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>BEAM COORDINATES: 7.4913° N, 9.0628° E</span>
                              <span className="text-teal-600 font-bold">ONLINE</span>
                            </div>
                            
                            <div className="h-20 bg-slate-50 rounded-md border border-slate-200/60 flex items-center justify-center overflow-hidden relative">
                              <div className="absolute top-1 left-2 text-[9px] font-mono text-slate-400 uppercase">Telemetry Signal Vector</div>
                              
                              <div className="flex items-center space-x-6 relative z-10">
                                <div className="h-10 w-10 rounded-full border-r-4 border-t-2 border-b-2 border-navy-800 flex items-center justify-center">
                                  <div className="h-6 w-1 border-b-2 border-gold-500 transform translate-x-3"></div>
                                </div>
                                
                                <div className="flex space-x-1">
                                  <span className="h-2 w-1 bg-teal-500/40 rounded-full animate-bounce"></span>
                                  <span className="h-4 w-1 bg-teal-500/70 rounded-full animate-bounce delay-75"></span>
                                  <span className="h-6 w-1 bg-teal-500 rounded-full animate-bounce delay-150"></span>
                                  <span className="h-4 w-1 bg-teal-500/70 rounded-full animate-bounce delay-200"></span>
                                  <span className="h-2 w-1 bg-teal-500/40 rounded-full animate-bounce delay-300"></span>
                                </div>

                                <div className="h-8 w-8 rounded-sm bg-navy-900 flex items-center justify-center text-gold-500 text-xs font-bold">
                                  SAT
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 font-mono pt-1">
                              <div className="bg-slate-50 p-1 rounded border border-slate-100">
                                <span className="block text-slate-400 text-[8px]">BANDWIDTH</span>
                                <span className="font-semibold text-navy-900">Ka-Band</span>
                              </div>
                              <div className="bg-slate-50 p-1 rounded border border-slate-100">
                                <span className="block text-slate-400 text-[8px]">DISH DIAMETER</span>
                                <span className="font-semibold text-navy-900">3.8m Offset</span>
                              </div>
                              <div className="bg-slate-50 p-1 rounded border border-slate-100">
                                <span className="block text-slate-400 text-[8px]">LINK STATUS</span>
                                <span className="text-teal-600 font-semibold">Active Clear</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Art Details Card */
                        <div className="relative z-10 space-y-6 flex flex-col justify-between h-full">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-gold-600 uppercase bg-gold-50 px-2.5 py-1 rounded border border-gold-200 inline-block mb-2">
                                MUSEUM EXPOSITION
                              </span>
                              <h4 className="font-display text-lg font-bold text-navy-900">Traditional Canvas & Carving</h4>
                              <p className="text-xs text-slate-500 mt-1">Handcrafted wood relief pattern structures and dynamic oils</p>
                            </div>
                            <Sparkles className="h-8 w-8 text-gold-500 bg-gold-50 p-1.5 rounded-lg border border-gold-100" />
                          </div>

                          <div className="border border-slate-200 bg-white rounded-md p-4 space-y-3 shadow-xs">
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>MEDIUM: IROKO WOOD & METALLIC COLLAGE</span>
                              <span className="text-gold-600 font-semibold">GALLERY MOCK</span>
                            </div>

                            <div className="h-20 bg-[amber-50] rounded-md border-2 border-amber-900/20 flex items-center justify-center overflow-hidden relative">
                              <div className="absolute inset-0 bg-[radial-gradient(#b45309_1.5px,transparent_1.5px)] [background-size:10px_10px] opacity-10"></div>
                              
                              <div className="flex space-x-3 items-center relative z-10 py-1 px-4 bg-amber-900/10 rounded-lg border border-amber-900/20">
                                <div className="w-6 h-10 border-2 border-amber-800 rounded bg-amber-950 flex flex-col justify-around p-0.5">
                                  <div className="w-full h-1 bg-gold-500/40"></div>
                                  <div className="w-full h-1 bg-gold-500/40"></div>
                                  <div className="w-full h-1 bg-gold-500/40"></div>
                                </div>
                                <div className="w-10 h-12 border-2 border-amber-800 rounded-full bg-amber-900 flex items-center justify-center">
                                  <div className="w-6 h-6 rounded-full border-4 border-gold-500 bg-amber-950"></div>
                                </div>
                                <div className="w-6 h-10 border-2 border-amber-800 rounded bg-amber-950 flex flex-col justify-around p-0.5">
                                  <div className="w-full h-1 bg-gold-500/40"></div>
                                  <div className="w-full h-1 bg-gold-500/40"></div>
                                  <div className="w-full h-1 bg-gold-500/40"></div>
                                </div>
                              </div>
                              
                              <div className="absolute bottom-1 right-2 text-[8px] font-mono text-amber-800/80">
                                "The Satellite Dualism" - Heritage Relief
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-500 leading-relaxed italic">
                              "Integrating strict spatial layout geometry with natural organic lines—carving mirrors the microchip, where the flow of electrical power mimics the grain of wood."
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Card Footer actions */}
                      <div className="border-t border-slate-200/80 pt-4 mt-4 flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-mono">Status: Published Works</span>
                        <a 
                          href={getWhatsAppLink("Hello Engineer Wale Belo, I am interested in inquiring about your handcrafted art exhibits and fine woodworking portfolio.")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-navy-900 font-bold hover:text-teal-600 flex items-center space-x-1 cursor-pointer"
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-navy-900 mr-0.5" />
                          <span>Inquire About Exhibits</span>
                        </a>
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="bg-navy-950 text-white border-t border-navy-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                
                {/* Logo and Pitch */}
                <div className="md:col-span-5 space-y-6">
                  <div className="flex items-center">
                    <span className="font-display text-2xl font-bold tracking-tight text-white">
                      WB <span className="text-gold-500">Advisory</span>
                    </span>
                    <span className="h-2.5 w-2.5 rounded-full bg-gold-500 ml-1"></span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                    Executive strategy at the high-integrity intersection of national defense, Ka/Ku-band satellite telecommunications, and advanced cyber governance.
                  </p>
                  
                  <div className="space-y-2 text-xs font-mono text-slate-500">
                    <div className="flex items-center space-x-2">
                      <Award className="h-3.5 w-3.5 text-gold-500" />
                      <span>Fellow of the Nigerian Society of Engineers (FNSE)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-3.5 w-3.5 text-teal-400" />
                      <span>Certified Information Systems Security Professional</span>
                    </div>
                  </div>
                </div>

                {/* Nav targets footer columns */}
                <div className="md:col-span-3 space-y-4">
                  <h4 className="font-display text-sm font-bold tracking-widest text-gold-500 uppercase">
                    Advisory Sectors
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-400 font-medium">
                    <li>
                      <button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors cursor-pointer text-left">
                        Cybersecurity Auditing
                      </button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors cursor-pointer text-left">
                        Satellite Link Budgets
                      </button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors cursor-pointer text-left">
                        State Technical Lectures
                      </button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors cursor-pointer text-left">
                        NSE Strategic Policy
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="md:col-span-4 space-y-4">
                  <h4 className="font-display text-sm font-bold tracking-widest text-gold-500 uppercase">
                    Direct Contact & Inquiries
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Inquiries regarding advisory availability, government commissions, or public keynotes may be directed via secure channels:
                  </p>
                  
                  <div className="pt-2 space-y-3">
                    <div>
                      <a
                        href={getWhatsAppLink("Hello Engineer Wale Belo, I would like to initiate a secure advisory consultation with you regarding satellite communications or cyber strategy.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-xs font-mono tracking-wider font-bold text-teal-400 hover:text-gold-400 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="h-3 w-3 text-teal-400" />
                        <span>SECURE ENGAGEMENT ENVELOPE</span>
                      </a>
                    </div>
                    <div>
                      <a
                        href={getWhatsAppLink("Hello Engineer Wale Belo, I would like to initiate a premium advisory consultation regarding satellite communications and cybersecurity. Can we connect?")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-xs font-mono tracking-wider font-bold text-emerald-400 hover:text-gold-400 transition-colors cursor-pointer"
                      >
                        <span>DIRECT WHATSAPP CHANNEL</span>
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              <div className="border-t border-navy-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
                <div>
                  <span>© 2026 Wale Belo Consulting. All rights reserved.</span>
                </div>
                <div className="flex space-x-6">
                  <span>NIGERIAN SOCIETY OF ENGINEERS • FELLOW PORTAL</span>
                  <span>SATELLITE COMMUNICATIONS COMMISSION</span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* FLOATING DIRECT WHATSAPP ADVISORY TRIGGER BUTTON */}
      <div className="fixed bottom-6 right-6 z-30">
        <a
          href={getWhatsAppLink("Hello Engineer Wale Belo, I would like to inquire about your elite technical consulting and VSAT advisory services. Can we discuss scheduling a secure briefing?")}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/30 text-white p-3.5 rounded-full shadow-2xl transition-all flex items-center justify-center group relative cursor-pointer"
          title="Direct WhatsApp Advisory Channel"
        >
          <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform text-white" />
          <span className="absolute right-full mr-3 bg-navy-900 text-white font-mono text-[10px] font-bold py-1 px-2.5 rounded shadow border border-navy-800 transition-all opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 tracking-wider whitespace-nowrap">
            SECURE WHATSAPP DIRECTORY
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </a>
      </div>

      {/* RENDER DYNAMIC INTERACTIVE MODALS */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <BookingModal 
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            onSave={handleAddConsultation}
            existingConsultations={consultations}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTrackerModalOpen && (
          <StatusTracker 
            isOpen={isTrackerModalOpen}
            onClose={() => setIsTrackerModalOpen(false)}
            consultations={consultations}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVideoModalOpen && (
          <VideoModal 
            isOpen={isVideoModalOpen}
            onClose={() => setIsVideoModalOpen(false)}
            videoPlaying={videoPlaying}
            setVideoPlaying={setVideoPlaying}
            videoProgress={videoProgress}
            setVideoProgress={setVideoProgress}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedService && (
          <ServiceModal 
            selectedService={selectedService}
            onClose={() => setSelectedService(null)}
            onRequestBriefing={() => {
              const serviceTitle = selectedService.title;
              setSelectedService(null);
              window.open(getWhatsAppLink(`Hello Engineer Wale Belo, I would like to request an advisory briefing on: "${serviceTitle}".`), "_blank", "noopener,noreferrer");
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
