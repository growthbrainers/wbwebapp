import { motion, AnimatePresence } from "motion/react";
import { X, Video, Play, FileText, Sparkles, MessageSquare } from "lucide-react";
import { ServiceDetail, getWhatsAppLink } from "../types";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoPlaying: boolean;
  setVideoPlaying: (playing: boolean) => void;
  videoProgress: number;
  setVideoProgress: (progress: number | ((prev: number) => number)) => void;
}

export function VideoModal({
  isOpen,
  onClose,
  videoPlaying,
  setVideoPlaying,
  videoProgress,
  setVideoProgress
}: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div id="video-modal-container" className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="video-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        
        {/* Overlay background */}
        <div 
          onClick={onClose}
          className="fixed inset-0 transition-opacity bg-navy-950/95 backdrop-blur-sm" 
        />

        {/* Centering element */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Video Player Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="inline-block w-full max-w-2xl overflow-hidden text-left align-middle transition-all transform bg-navy-900 rounded-lg shadow-2xl border border-navy-800 text-white relative"
        >
          {/* Header info bar */}
          <div className="flex justify-between items-center bg-navy-950 px-4 py-3.5 border-b border-navy-800">
            <div className="flex items-center space-x-2.5">
              <Video className="h-4 w-4 text-gold-500" />
              <span id="video-title" className="text-xs font-mono font-bold tracking-wide text-slate-300">
                Archive: Federal Telecommunications Commission Briefing
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-navy-900 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Main Video Body Frame */}
          <div className="aspect-video bg-black relative flex flex-col justify-between p-6">
            {/* Outer scanline layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none z-10"></div>
            
            {/* Subtle noise grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e3e62_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

            {/* Top info overlay */}
            <div className="relative z-10 flex justify-between items-start">
              <span className="text-[9px] font-mono tracking-widest text-teal-400 bg-navy-950/80 px-2.5 py-1 rounded border border-teal-500/10">
                SECURE SOURCE: BROADCAST FEED #09
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                JULY 2026
              </span>
            </div>

            {/* Video content: Simulating an active streaming satellite monitoring feed with dynamic metrics */}
            <div className="my-auto text-center relative z-10 space-y-4">
              {videoPlaying ? (
                <div className="space-y-3">
                  {/* Rotating globe radar signal mock */}
                  <div className="h-20 w-20 rounded-full border border-teal-500/40 mx-auto flex items-center justify-center relative bg-navy-950/40">
                    <span className="absolute inset-2 rounded-full border border-teal-500 border-dashed animate-spin"></span>
                    <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping"></span>
                    <span className="h-2 w-2 rounded-full bg-teal-400"></span>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold tracking-wider text-white">PLAYING BRODCAST STREAM</h4>
                    <p className="text-[10px] text-teal-400 font-mono">Ka-Band Transponder Downlink Stable • 18.2 Gbps</p>
                  </div>

                  {/* Simulated telemetry numbers scrolling */}
                  <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto text-[8px] font-mono text-slate-400 bg-black/60 p-2 rounded border border-navy-800">
                    <div>
                      <span className="block text-slate-500">AZIMUTH</span>
                      <span>214.5° N</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">ELEVATION</span>
                      <span>42.8°</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">POLAR</span>
                      <span>LHCP</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">SOC INCIDENT</span>
                      <span className="text-emerald-400">CLEARED</span>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setVideoPlaying(true)}
                  className="h-16 w-16 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 flex items-center justify-center shadow-2xl mx-auto hover:scale-105 active:scale-95 transition-transform cursor-pointer relative"
                  title="Play Broadcast"
                >
                  <Play className="h-6 w-6 fill-navy-950 ml-1 text-navy-950" />
                  <span className="absolute -inset-1 rounded-full border border-gold-500 animate-ping opacity-75"></span>
                </button>
              )}
            </div>

            {/* Player custom timeline controls bar */}
            <div className="relative z-10 space-y-2">
              <div className="w-full bg-navy-950/80 rounded h-1 overflow-hidden cursor-pointer" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const pct = Math.floor((x / rect.width) * 100);
                setVideoProgress(pct);
              }}>
                <div className="bg-gold-500 h-full transition-all duration-300" style={{ width: `${videoProgress}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <button 
                  onClick={() => setVideoPlaying(!videoPlaying)}
                  className="hover:text-white cursor-pointer bg-navy-950 px-2.5 py-1 rounded border border-navy-800"
                >
                  {videoPlaying ? "PAUSE FEED" : "RESUME FEED"}
                </button>
                <span>00:{(videoProgress * 0.04).toFixed(0).padStart(2, "0")} / 04:12</span>
                <button 
                  onClick={() => setVideoProgress(prev => Math.min(prev + 10, 100))}
                  className="hover:text-white cursor-pointer bg-navy-950 px-2.5 py-1 rounded border border-navy-800"
                >
                  SKIP SECTOR
                </button>
              </div>
            </div>

          </div>

          {/* Description footer */}
          <div className="bg-navy-950 p-4 border-t border-navy-800 text-xs text-slate-400 leading-relaxed">
            <div className="flex justify-between mb-2">
              <strong className="text-white">COSMIC COMMUNICATIONS INITIATIVE</strong>
              <span className="text-gold-500 font-bold">FELLOWSHIP SEAL</span>
            </div>
            Evaluating regional link resilience, ensuring emergency backup VSAT networks withstand cybersecurity denial-of-service parameters. Hosted under executive auspices.
          </div>

        </motion.div>
      </div>
    </div>
  );
}

interface ServiceModalProps {
  selectedService: ServiceDetail | null;
  onClose: () => void;
  onRequestBriefing: () => void;
}

export function ServiceModal({
  selectedService,
  onClose,
  onRequestBriefing
}: ServiceModalProps) {
  if (!selectedService) return null;

  return (
    <div id="service-modal-container" className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="service-modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        
        <div 
          onClick={onClose}
          className="fixed inset-0 transition-opacity bg-navy-950/80 backdrop-blur-xs" 
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-2xl border border-slate-200 sm:p-8 relative"
        >
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 inline-block mb-1">
                FRAMEWORK SPECIFICATION
              </span>
              <h3 className="font-display text-xl font-bold text-navy-900" id="service-modal-title">
                {selectedService.title}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="mt-6 space-y-6 text-sm">
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {selectedService.summary}
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-navy-900 uppercase tracking-widest">
                Key Deliverables & Methodologies
              </h4>
              
              <ul className="space-y-3">
                {selectedService.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start text-slate-600">
                    <span className="h-5 w-5 rounded-full bg-teal-50 text-teal-500 border border-teal-100 flex items-center justify-center shrink-0 mr-3 text-xs font-mono">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Custom Metrics */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">
                Quality Standards
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {selectedService.metrics.map((m, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded border border-slate-200/60 text-center shadow-xs">
                    <span className="block font-display text-[10px] font-bold text-navy-900 truncate" title={m}>
                      {m}
                    </span>
                    <span className="block text-[8px] font-mono text-slate-400 uppercase mt-0.5">verified</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Action */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end items-center gap-3">
            <a
              href={getWhatsAppLink(`Hello Engineer Wale Belo, I am inquiring about your advisory specialty framework for: "${selectedService.title}". I would appreciate some guidance on...`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs font-display tracking-wider flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-md"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Inquire on WhatsApp</span>
            </a>

            <button
              onClick={onRequestBriefing}
              className="w-full sm:w-auto px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold rounded text-xs font-display tracking-wider cursor-pointer"
            >
              Request Advisory Briefing
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
