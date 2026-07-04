import { useState, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { X, Calendar, Clock, Shield, Briefcase, FileText, CheckCircle2, Award, ChevronRight, ChevronLeft, MessageSquare } from "lucide-react";
import { Consultation, getWhatsAppLink } from "../types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (consultation: Omit<Consultation, "id" | "status" | "createdAt" | "engagementId">) => void;
  existingConsultations: Consultation[];
}

export default function BookingModal({ isOpen, onClose, onSave, existingConsultations }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    service: "Cybersecurity Strategy",
    timeSlot: "09:00 AM UTC",
    date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0], // 3 days in future by default
    notes: ""
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [generatedEngagementId, setGeneratedEngagementId] = useState("");

  const timeSlots = ["09:00 AM UTC", "11:30 AM UTC", "03:00 PM UTC", "05:30 PM UTC"];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBookingSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Check if a slot is already taken on the selected date
  const isSlotTaken = (date: string, slot: string) => {
    return existingConsultations.some(
      (c) => c.date === date && c.timeSlot === slot && c.status !== "Declined"
    );
  };

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      // Final Submit
      const engagementId = `WB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedEngagementId(engagementId);
      
      onSave({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        organization: formData.organization,
        service: formData.service,
        date: formData.date,
        timeSlot: formData.timeSlot,
        notes: formData.notes
      });
      
      setBookingSuccess(true);
    }
  };

  return (
    <div id="booking-modal-container" className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="booking-modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div 
          onClick={onClose}
          className="fixed inset-0 transition-opacity bg-navy-950/80 backdrop-blur-xs" 
        />

        {/* Centering spacer */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-2xl border border-slate-200 sm:p-8 relative"
        >
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-100">
            <div className="text-left">
              <span className="text-[10px] font-mono font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 inline-block mb-1 tracking-wider uppercase">
                {bookingSuccess ? "REGISTRY ENGAGEMENT DISPATCHED" : `STEP ${step} OF 3: ADVISORY INTAKE`}
              </span>
              <h3 className="font-display text-xl font-bold text-navy-900" id="booking-modal-title">
                {bookingSuccess ? "Booking Confirmed & Secured" : "Schedule Executive Advisory"}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!bookingSuccess ? (
            <form onSubmit={handleNextStep} className="mt-6 space-y-5">
              {/* Step indicator pipeline */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-100 pb-4 mb-4">
                <div className={`flex items-center space-x-1.5 ${step >= 1 ? "text-teal-600 font-bold" : ""}`}>
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center border ${step >= 1 ? "border-teal-500 bg-teal-50 text-teal-600" : "border-slate-300"}`}>1</span>
                  <span>Credentials</span>
                </div>
                <div className="h-px bg-slate-200 flex-1 mx-3" />
                <div className={`flex items-center space-x-1.5 ${step >= 2 ? "text-teal-600 font-bold" : ""}`}>
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center border ${step >= 2 ? "border-teal-500 bg-teal-50 text-teal-600" : "border-slate-300"}`}>2</span>
                  <span>Temporal</span>
                </div>
                <div className="h-px bg-slate-200 flex-1 mx-3" />
                <div className={`flex items-center space-x-1.5 ${step >= 3 ? "text-teal-600 font-bold" : ""}`}>
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center border ${step >= 3 ? "border-teal-500 bg-teal-50 text-teal-600" : "border-slate-300"}`}>3</span>
                  <span>Scope Brief</span>
                </div>
              </div>

              {/* Step 1: Principal Credentials */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wide text-slate-500 mb-1 font-semibold">Your Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Hon. Minister / Chief Executive"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wide text-slate-500 mb-1 font-semibold">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="name@agency.gov or organization.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wide text-slate-500 mb-1 font-semibold">WhatsApp / Mobile Contact (Optional)</label>
                      <input 
                        type="tel" 
                        placeholder="e.g. +234 803 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wide text-slate-500 mb-1 font-semibold">Organization / Sovereign Agency *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. National Satellite Operations / Sovereign Security Board"
                      value={formData.organization}
                      onChange={(e) => setFormData({...formData, organization: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wide text-slate-500 mb-1 font-semibold">Advisory Specialty Vector *</label>
                    <select 
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 font-medium text-navy-900"
                    >
                      <option value="Cybersecurity Strategy">Cybersecurity Strategy & SOC Guidance</option>
                      <option value="Satellite VSAT">Sovereign VSAT Operations & Satcom Link Budgets</option>
                      <option value="Resource Lecture">Speaking Inquiries & University Tech Keynotes</option>
                      <option value="Youth Mentorship">Youth Tech Sponsorship & NGO Mentorship</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Temporal Coordinates */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wide text-slate-500 mb-1 font-semibold">Advisory Date *</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 text-navy-900 font-semibold"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">Wale Belo schedules consultations on a premium 3-day buffer policy.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wide text-slate-500 mb-2 font-semibold">Select Available Slot (UTC Coordinate) *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => {
                        const taken = isSlotTaken(formData.date, time);
                        return (
                          <button
                            type="button"
                            key={time}
                            disabled={taken}
                            onClick={() => setFormData({...formData, timeSlot: time})}
                            className={`py-2 px-3 text-xs font-mono font-semibold rounded border text-center transition-all cursor-pointer ${
                              formData.timeSlot === time 
                                ? "bg-navy-900 border-navy-900 text-white shadow-sm font-bold" 
                                : taken 
                                ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed line-through" 
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className="block">{time}</span>
                            {taken && <span className="block text-[8px] text-slate-400 font-bold tracking-tight uppercase">SLOT CONFLICT</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Operational Scope Brief */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wide text-slate-500 mb-1 font-semibold">Brief Operational Scope (Confidential) *</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Specify satellite payloads, threat metrics, critical dates, speaking parameters, or specific technical criteria required for Wale Belo's pre-briefing..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 text-sm leading-relaxed"
                    />
                  </div>

                  {/* Summary preview block */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs space-y-2">
                    <span className="font-bold text-navy-900 block font-mono tracking-wider">INTAKE DISPATCH SUMMARY:</span>
                    <div className="grid grid-cols-2 gap-y-1.5 text-slate-600 font-mono">
                      <span>Principal:</span> <span className="text-navy-900 font-bold truncate">{formData.name}</span>
                      <span>Agency:</span> <span className="text-navy-900 font-bold truncate">{formData.organization}</span>
                      <span>Specialty:</span> <span className="text-navy-900 font-bold truncate">{formData.service}</span>
                      <span>Target Coordinate:</span> <span className="text-navy-900 font-bold">{formData.date} @ {formData.timeSlot}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation controls */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-xs font-mono font-bold tracking-wide hover:bg-slate-50 transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>BACK</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-300 text-slate-600 rounded text-xs font-mono tracking-wide hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                )}

                <button
                  type="submit"
                  className="px-6 py-2 bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-navy-950 font-bold rounded text-xs font-mono tracking-wider transition-colors cursor-pointer flex items-center justify-center space-x-1 shadow-md hover:shadow-lg"
                >
                  <span>{step === 3 ? "DISPATCH REGISTRY" : "CONTINUE"}</span>
                  {step < 3 && <ChevronRight className="h-3.5 w-3.5" />}
                </button>
              </div>
            </form>
          ) : (
            /* Successful Registration Receipt Screen */
            <div className="my-6 text-center space-y-6">
              <div className="h-16 w-16 bg-teal-100 border border-teal-300 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-2xl font-bold text-navy-900">Briefing Pipeline Scheduled</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  A high-ticket secure meeting manifest has been successfully registered. A confirmation coordinate dispatch is routed to <strong className="text-navy-900">{formData.email}</strong>.
                </p>
              </div>

              {/* Receipt metadata board */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-left text-xs space-y-3 font-mono">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-400">SECURE REGISTRY ID:</span>
                  <span className="text-teal-600 font-bold">{generatedEngagementId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PRINCIPAL:</span>
                  <span className="text-navy-900 font-bold">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AGENCY:</span>
                  <span className="text-navy-900 font-bold truncate max-w-[240px]">{formData.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">FOCUS CONTEXT:</span>
                  <span className="text-navy-900 font-bold">{formData.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SCHEDULED DATE:</span>
                  <span className="text-navy-900 font-bold">{formData.date} @ {formData.timeSlot}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded text-[10px] text-amber-800 leading-relaxed max-w-md mx-auto">
                <strong>🔒 MANDATORY SECURITY SCREENING:</strong> As high-value federal satellite and digital infrastructure briefing coordinates are exchanged, your agency credentials will undergo technical clearance verification prior to dial coordinate exchange.
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    // Copy ID to clipboard
                    navigator.clipboard.writeText(generatedEngagementId);
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-slate-200 text-slate-600 font-mono text-xs hover:bg-slate-50 rounded cursor-pointer transition-colors"
                >
                  COPY REGISTRY ID
                </button>
                
                <a
                  href={getWhatsAppLink(
                    `Hello Engineer Wale Belo, I have successfully scheduled a consultation on your advisory platform.\n\n📂 Dossier ID: ${generatedEngagementId}\n👤 Name: ${formData.name}\n🏢 Agency: ${formData.organization}\n📡 Specialty: ${formData.service}\n📅 Date & Time: ${formData.date} @ ${formData.timeSlot}\n\nPlease let me know when verified. Thank you.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs font-mono tracking-wide flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>WHATSAPP DISPATCH</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded text-xs font-mono tracking-widest uppercase cursor-pointer transition-colors"
                >
                  Close Registry
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
