import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Calendar, Clock, ShieldCheck, X, FileText, CheckCircle2, AlertTriangle, Eye, ArrowRight, MessageSquare } from "lucide-react";
import { Consultation, getWhatsAppLink } from "../types";

interface StatusTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  consultations: Consultation[];
  onReschedule: (id: string, date: string, timeSlot: string) => void;
  onCancel: (id: string) => void;
}

export default function StatusTracker({ 
  isOpen, 
  onClose, 
  consultations, 
  onReschedule, 
  onCancel 
}: StatusTrackerProps) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [foundBookings, setFoundBookings] = useState<Consultation[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Consultation | null>(null);
  
  // Reschedule Form State
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("09:00 AM UTC");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toLowerCase();
    
    const results = consultations.filter(
      c => c.engagementId.toLowerCase() === cleanQuery || c.email.toLowerCase() === cleanQuery
    );
    
    setFoundBookings(results);
    setSearched(true);
    if (results.length === 1) {
      setSelectedBooking(results[0]);
    } else {
      setSelectedBooking(null);
    }
  };

  const handleRescheduleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    
    onReschedule(selectedBooking.id, newDate, newSlot);
    
    // Update local state
    setSelectedBooking({
      ...selectedBooking,
      date: newDate,
      timeSlot: newSlot,
      status: "Rescheduled"
    });
    
    setIsRescheduling(false);
  };

  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    if (confirm("Are you sure you want to cancel this executive consultation?")) {
      onCancel(selectedBooking.id);
      
      setSelectedBooking({
        ...selectedBooking,
        status: "Declined"
      });
    }
  };

  const getStepStatus = (currentStatus: string, stepIndex: number) => {
    // 0: Created, 1: Verified/Confirmed, 2: Completed
    if (currentStatus === "Declined") {
      return "declined";
    }
    
    if (stepIndex === 0) {
      return "completed"; // Draft/Created is always done
    }
    
    if (stepIndex === 1) {
      if (currentStatus === "Confirmed" || currentStatus === "Completed" || currentStatus === "Rescheduled") {
        return "completed";
      }
      return "pending";
    }
    
    if (stepIndex === 2) {
      if (currentStatus === "Completed") {
        return "completed";
      }
      return "upcoming";
    }
    
    return "upcoming";
  };

  if (!isOpen) return null;

  return (
    <div id="status-tracker-container" className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="tracker-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div onClick={onClose} className="fixed inset-0 transition-opacity bg-navy-950/80 backdrop-blur-xs" />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-2xl border border-slate-200 sm:p-8"
        >
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-100">
            <div className="text-left">
              <span className="text-[10px] font-mono font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 inline-block mb-1 tracking-wider uppercase">
                SECURE ACCESS LOGS
              </span>
              <h3 className="font-display text-xl font-bold text-navy-900" id="tracker-title">
                Briefing Status Checker
              </h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                required
                placeholder="Enter Secure Engagement ID or Email Address..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 bg-slate-50/50 text-navy-900 font-mono font-semibold"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded text-xs font-mono font-bold tracking-wider cursor-pointer transition-colors"
            >
              QUERY
            </button>
          </form>

          {/* Results Area */}
          <div className="mt-6 space-y-6">
            {searched && foundBookings.length === 0 && (
              <div className="p-6 text-center border border-dashed border-slate-200 rounded-lg space-y-2">
                <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto" />
                <h4 className="text-xs font-bold text-navy-900 font-mono">NO DOSSIER RETRIEVED</h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Verify that your Engagement ID matches the format <code className="bg-slate-50 px-1 py-0.5 rounded font-bold text-navy-900">WB-2026-XXXX</code> or the exact email registered.
                </p>
              </div>
            )}

            {/* Multiple Bookings Match List */}
            {searched && foundBookings.length > 1 && !selectedBooking && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Multiple records detected:</span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded bg-slate-50/50 overflow-hidden">
                  {foundBookings.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSelectedBooking(b);
                        setNewDate(b.date);
                        setNewSlot(b.timeSlot);
                      }}
                      className="w-full p-3 text-left hover:bg-slate-50 transition-colors flex justify-between items-center text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold block text-navy-900">{b.service.split(" ")[0]} Briefing</span>
                        <span className="text-slate-400 text-[10px]">{b.date} • {b.timeSlot}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-teal-600 font-bold">
                        <span>{b.engagementId}</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Booking Detail Board */}
            {selectedBooking && (
              <div className="space-y-5">
                
                {/* Dossier Card Panel */}
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs font-mono space-y-2.5 relative">
                  {/* Status Tag absolute top right */}
                  <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded text-[9px] font-bold border ${
                    selectedBooking.status === "Confirmed" 
                      ? "bg-teal-50 border-teal-200 text-teal-600" 
                      : selectedBooking.status === "Pending Verification" 
                      ? "bg-amber-50 border-amber-200 text-amber-600"
                      : selectedBooking.status === "Completed"
                      ? "bg-navy-50 border-navy-200 text-navy-800"
                      : selectedBooking.status === "Rescheduled"
                      ? "bg-purple-50 border-purple-200 text-purple-600"
                      : "bg-rose-50 border-rose-200 text-rose-600"
                  }`}>
                    {selectedBooking.status}
                  </span>

                  <div>
                    <span className="text-slate-400 text-[9px]">ENGAGEMENT ID:</span>
                    <h4 className="text-sm font-bold text-navy-900">{selectedBooking.engagementId}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1 text-slate-600">
                    <span>Principal:</span> <span className="text-navy-900 font-bold truncate">{selectedBooking.name}</span>
                    <span>Agency:</span> <span className="text-navy-900 font-bold truncate">{selectedBooking.organization}</span>
                    <span>Sector:</span> <span className="text-navy-900 font-bold truncate">{selectedBooking.service}</span>
                    <span>Timing:</span> <span className="text-navy-900 font-bold">{selectedBooking.date} @ {selectedBooking.timeSlot}</span>
                  </div>

                  {selectedBooking.adminNotes && (
                    <div className="border-t border-slate-200 pt-2 mt-2 bg-slate-100/50 p-2 rounded text-[10px] text-slate-500">
                      <strong className="text-navy-950 font-bold block mb-0.5 uppercase text-[9px]">Consultant Directives:</strong>
                      {selectedBooking.adminNotes}
                    </div>
                  )}
                </div>

                {/* Direct WhatsApp Follow-up */}
                <a
                  href={getWhatsAppLink(
                    `Hello Engineer Wale Belo, I am checking on the status of my advisory dossier: ${selectedBooking.engagementId}.\n\n📂 Dossier: ${selectedBooking.engagementId}\n👤 Name: ${selectedBooking.name}\n🏢 Agency: ${selectedBooking.organization}\n📅 Target Date: ${selectedBooking.date} @ ${selectedBooking.timeSlot}\n\nPlease let me know if any further credentials or clearances are required. Thank you.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-md cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>PULL STATUS DISPATCH VIA WHATSAPP</span>
                </a>

                {/* Progress Visual Timeline (Zero-Trust/Executive Steps) */}
                {selectedBooking.status !== "Declined" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">VERIFICATION TELEMETRY PIPELINE:</span>
                    
                    <div className="space-y-4 text-xs">
                      {/* Step 1 */}
                      <div className="flex items-start space-x-3">
                        <div className="flex flex-col items-center">
                          <span className="h-5 w-5 rounded-full flex items-center justify-center bg-teal-500 text-white font-mono font-bold text-[10px]">1</span>
                          <span className="w-0.5 h-6 bg-teal-500 my-1" />
                        </div>
                        <div>
                          <h5 className="font-bold text-navy-900">Advisory Request Registered</h5>
                          <p className="text-[10px] text-slate-400 leading-tight">Credentials locked and queued in sovereign directory.</p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex items-start space-x-3">
                        <div className="flex flex-col items-center">
                          <span className={`h-5 w-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                            getStepStatus(selectedBooking.status, 1) === "completed" 
                              ? "bg-teal-500 text-white" 
                              : "border border-slate-300 text-slate-400 bg-slate-50"
                          }`}>2</span>
                          <span className={`w-0.5 h-6 my-1 ${
                            getStepStatus(selectedBooking.status, 1) === "completed" ? "bg-teal-500" : "bg-slate-200"
                          }`} />
                        </div>
                        <div>
                          <h5 className={`font-bold ${getStepStatus(selectedBooking.status, 1) === "completed" ? "text-navy-900" : "text-slate-400"}`}>
                            Credential Verification Clearance
                          </h5>
                          <p className="text-[10px] text-slate-400 leading-tight">National Security / Fellow audit and available transponder checking.</p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex items-start space-x-3">
                        <div className="flex flex-col items-center">
                          <span className={`h-5 w-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                            getStepStatus(selectedBooking.status, 2) === "completed" 
                              ? "bg-teal-500 text-white" 
                              : "border border-slate-300 text-slate-400 bg-slate-50"
                          }`}>3</span>
                        </div>
                        <div>
                          <h5 className={`font-bold ${getStepStatus(selectedBooking.status, 2) === "completed" ? "text-navy-900" : "text-slate-400"}`}>
                            Advisory Briefing Executed
                          </h5>
                          <p className="text-[10px] text-slate-400 leading-tight">Exchange of technical payloads and dial parameters completed.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reschedule Drawer Form inside selectedBooking */}
                {isRescheduling ? (
                  <form onSubmit={handleRescheduleSubmit} className="border-t border-slate-100 pt-4 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">SPECIFY NEW TEMPORAL COORDINATES:</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">New Date *</label>
                        <input 
                          type="date"
                          required
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">New Slot *</label>
                        <select
                          value={newSlot}
                          onChange={(e) => setNewSlot(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-slate-50"
                        >
                          <option value="09:00 AM UTC">09:00 AM UTC</option>
                          <option value="11:30 AM UTC">11:30 AM UTC</option>
                          <option value="03:00 PM UTC">03:00 PM UTC</option>
                          <option value="05:30 PM UTC">05:30 PM UTC</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setIsRescheduling(false)}
                        className="px-3 py-1.5 border border-slate-300 rounded text-xs font-mono cursor-pointer"
                      >
                        CANCEL
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-1.5 bg-teal-600 text-white rounded text-xs font-mono font-bold cursor-pointer hover:bg-teal-700"
                      >
                        SUBMIT COORDINATE
                      </button>
                    </div>
                  </form>
                ) : (
                  selectedBooking.status !== "Declined" && selectedBooking.status !== "Completed" && (
                    <div className="border-t border-slate-100 pt-4 flex justify-between">
                      <button
                        onClick={() => {
                          setNewDate(selectedBooking.date);
                          setNewSlot(selectedBooking.timeSlot);
                          setIsRescheduling(true);
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded text-xs font-mono text-slate-700 cursor-pointer transition-colors"
                      >
                        RESCHEDULE SLOT
                      </button>
                      <button
                        onClick={handleCancelBooking}
                        className="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded text-xs font-mono text-rose-600 font-semibold cursor-pointer transition-colors"
                      >
                        CANCEL BRIEFING
                      </button>
                    </div>
                  )
                )}

              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded text-xs font-mono tracking-wide cursor-pointer transition-colors"
            >
              DISMISS TRACKER
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
