import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Check, 
  X, 
  Trash2, 
  Search, 
  Filter, 
  TrendingUp, 
  Calendar, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  Lock, 
  Plus, 
  Download,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Consultation, ConsultationStatus } from "../types";

interface AdminDashboardProps {
  consultations: Consultation[];
  onUpdateStatus: (id: string, status: ConsultationStatus, adminNotes?: string) => void;
  onDeleteConsultation: (id: string) => void;
  onAddManualConsultation: (consultation: Consultation) => void;
}

export default function AdminDashboard({ 
  consultations, 
  onUpdateStatus, 
  onDeleteConsultation,
  onAddManualConsultation 
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [serviceFilter, setServiceFilter] = useState<string>("All");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [showAddManualModal, setShowAddManualModal] = useState(false);
  
  // Manual Entry Form State
  const [manualForm, setManualForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    service: "Cybersecurity Strategy",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "09:00 AM UTC",
    notes: ""
  });

  // Calculate high-ticket executive KPI stats
  const totalInquiries = consultations.length;
  const pendingInquiries = consultations.filter(c => c.status === "Pending Verification").length;
  const confirmedBriefings = consultations.filter(c => c.status === "Confirmed").length;
  const completedEngagements = consultations.filter(c => c.status === "Completed").length;
  
  // Sector distribution breakdown
  const serviceStats = {
    "Cybersecurity Strategy": consultations.filter(c => c.service === "Cybersecurity Strategy").length,
    "Satellite VSAT": consultations.filter(c => c.service === "Satellite VSAT").length,
    "Resource Lecture": consultations.filter(c => c.service === "Resource Lecture").length,
    "Youth Mentorship": consultations.filter(c => c.service === "Youth Mentorship").length,
  };

  // Filter consultations
  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.engagementId.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesService = serviceFilter === "All" || c.service === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const handleUpdateStatusClick = (id: string, status: ConsultationStatus) => {
    onUpdateStatus(id, status, adminNoteInput);
    setAdminNoteInput("");
    if (selectedConsultation && selectedConsultation.id === id) {
      setSelectedConsultation(prev => prev ? { ...prev, status, adminNotes: adminNoteInput } : null);
    }
  };

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newConsultation: Consultation = {
      id: `manual-${Date.now()}`,
      name: manualForm.name,
      email: manualForm.email,
      phone: manualForm.phone || undefined,
      organization: manualForm.organization,
      service: manualForm.service,
      date: manualForm.date,
      timeSlot: manualForm.timeSlot,
      notes: manualForm.notes,
      status: "Confirmed", // Manual is immediately confirmed
      createdAt: new Date().toISOString(),
      engagementId: `WB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      adminNotes: "Direct manual entry into executive scheduler."
    };
    onAddManualConsultation(newConsultation);
    setShowAddManualModal(false);
    // Reset
    setManualForm({
      name: "",
      email: "",
      phone: "",
      organization: "",
      service: "Cybersecurity Strategy",
      date: new Date().toISOString().split("T")[0],
      timeSlot: "09:00 AM UTC",
      notes: ""
    });
  };

  // Export consultations as mock manifest download
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(consultations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "wale_belo_engagement_manifest.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-teal-600 font-bold uppercase tracking-widest">
              <Lock className="h-3.5 w-3.5" />
              <span>Sovereign Executive Advisory Control Center</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-navy-900 tracking-tight mt-1">
              WB Client & Inquiries Portal
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Review agency dossiers, verify high-ticket telemetry requests, and manage sovereign schedules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-xs font-mono font-bold tracking-wider cursor-pointer transition-all flex items-center space-x-1.5 shadow-sm"
              title="Download engagement database"
            >
              <Download className="h-3.5 w-3.5" />
              <span>EXPORT MANIFEST</span>
            </button>
            <button
              onClick={() => setShowAddManualModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-mono font-bold tracking-wider cursor-pointer transition-all flex items-center space-x-1.5 shadow-md shadow-teal-500/10"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>MANUAL DIAL ENTRY</span>
            </button>
          </div>
        </div>

        {/* Executive Dashboard KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1 */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider font-semibold block">Total Dossiers Logged</span>
              <span className="text-3xl font-display font-bold text-navy-900 block">{totalInquiries}</span>
              <span className="text-[10px] text-slate-500 font-mono block">All historical outreach</span>
            </div>
            <div className="h-12 w-12 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center text-navy-800 font-bold">
              ∑
            </div>
          </div>
          {/* KPI 2 */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider font-semibold block">Awaiting Verification</span>
              <span className="text-3xl font-display font-bold text-amber-600 block">{pendingInquiries}</span>
              <span className="text-[10px] text-amber-600/80 font-mono block">Requires credential check</span>
            </div>
            <div className="h-12 w-12 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          {/* KPI 3 */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider font-semibold block">Confirmed Briefings</span>
              <span className="text-3xl font-display font-bold text-teal-600 block">{confirmedBriefings}</span>
              <span className="text-[10px] text-teal-600/80 font-mono block">Secure channels allocated</span>
            </div>
            <div className="h-12 w-12 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          {/* KPI 4 */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider font-semibold block">Engagement Ratio</span>
              <span className="text-3xl font-display font-bold text-navy-900 block">
                {totalInquiries > 0 ? `${((confirmedBriefings / totalInquiries) * 100).toFixed(0)}%` : "0%"}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block">Clearance approval rate</span>
            </div>
            <div className="h-12 w-12 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center text-navy-800">
              <TrendingUp className="h-5 w-5 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Filters and List Splitting layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Bookings list - Col 8 */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Search & Filters block */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search agency, ID, or principal dossier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 bg-slate-50/50 text-navy-900"
                />
              </div>

              {/* Status and Service filters inline dropdowns */}
              <div className="flex flex-wrap gap-2">
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-1.5 px-2.5 border border-slate-200 rounded bg-white text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
                <div>
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="py-1.5 px-2.5 border border-slate-200 rounded bg-white text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 max-w-[160px]"
                  >
                    <option value="All">All Sectors</option>
                    <option value="Cybersecurity Strategy">Cybersecurity</option>
                    <option value="Satellite VSAT">VSAT / Space</option>
                    <option value="Resource Lecture">Lecture</option>
                    <option value="Youth Mentorship">Mentorship</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Inquiries Dossier List */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
              
              {filteredConsultations.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-3 font-mono">
                  <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-xs">No matching credentials or dossiers detected in active directory.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-mono uppercase font-bold border-b border-slate-100">
                        <th className="p-4">Dossier ID / Date</th>
                        <th className="p-4">Principal Principal</th>
                        <th className="p-4">Operational Sector</th>
                        <th className="p-4">Status Coordinate</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-navy-900">
                      {filteredConsultations.map((c) => (
                        <tr 
                          key={c.id} 
                          onClick={() => {
                            setSelectedConsultation(c);
                            setAdminNoteInput(c.adminNotes || "");
                          }}
                          className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedConsultation?.id === c.id ? "bg-teal-50/40" : ""}`}
                        >
                          {/* ID & Date */}
                          <td className="p-4">
                            <span className="block font-mono font-bold text-teal-600">{c.engagementId}</span>
                            <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{c.date} ({c.timeSlot.split(" ")[0]})</span>
                          </td>
                          {/* Name & Agency */}
                          <td className="p-4">
                            <span className="block font-bold">{c.name}</span>
                            <span className="block text-[10px] text-slate-500 font-mono uppercase truncate max-w-[150px]" title={c.organization}>{c.organization}</span>
                          </td>
                          {/* Service Vector */}
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold inline-block">
                              {c.service.split(" ")[0]} {c.service.split(" ")[1] || ""}
                            </span>
                          </td>
                          {/* Status Coordinate */}
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold inline-block border ${
                              c.status === "Confirmed" 
                                ? "bg-teal-50 border-teal-200 text-teal-600" 
                                : c.status === "Pending Verification" 
                                ? "bg-amber-50 border-amber-200 text-amber-600"
                                : c.status === "Completed"
                                ? "bg-navy-50 border-navy-200 text-navy-800"
                                : c.status === "Rescheduled"
                                ? "bg-purple-50 border-purple-200 text-purple-600"
                                : "bg-rose-50 border-rose-200 text-rose-600"
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          {/* Fast Actions */}
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end space-x-1">
                              {c.status === "Pending Verification" && (
                                <>
                                  <button
                                    onClick={() => onUpdateStatus(c.id, "Confirmed", "Approved via portal verification check.")}
                                    className="p-1 text-teal-600 hover:bg-teal-50 rounded cursor-pointer"
                                    title="Verify & Confirm Slot"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => onUpdateStatus(c.id, "Declined", "Declined credentials validation failure.")}
                                    className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                                    title="Decline Engagement"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => onDeleteConsultation(c.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

            {/* Micro Charts Sector Breakdown widget */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
              <h4 className="text-xs font-mono font-bold text-navy-900 uppercase tracking-widest mb-4">
                Inquiry Distribution by Strategic Sector
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {Object.entries(serviceStats).map(([serviceName, count]) => {
                  const percentage = totalInquiries > 0 ? (count / totalInquiries) * 100 : 0;
                  return (
                    <div key={serviceName} className="bg-slate-50 p-4 rounded border border-slate-200/60 relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 left-0 h-1 bg-teal-500" style={{ width: `${percentage}%` }}></div>
                      <div>
                        <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wide truncate">{serviceName}</span>
                        <span className="block text-2xl font-bold text-navy-900 mt-1 font-display">{count}</span>
                      </div>
                      <span className="block text-[9px] text-slate-400 font-mono mt-2">{percentage.toFixed(0)}% of total briefings</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right panel: Selected Dossier Details - Col 4 */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              {selectedConsultation ? (
                <motion.div 
                  key={selectedConsultation.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* Selected Dossier Header */}
                  <div className="bg-navy-900 text-white p-5 border-b border-navy-800 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#1e3e62_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-15"></div>
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono font-bold tracking-widest text-teal-400">ACTIVE DOSSIER AUDIT</span>
                        <h3 className="font-display text-lg font-bold mt-1">{selectedConsultation.name}</h3>
                        <p className="text-[10px] text-slate-300 font-mono uppercase mt-0.5">{selectedConsultation.organization}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-gold-500 bg-navy-950 px-2 py-1 rounded">{selectedConsultation.engagementId}</span>
                    </div>
                  </div>

                  {/* Selected Dossier Body Info */}
                  <div className="p-5 space-y-5 text-xs text-slate-600">
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Temporal Coordinate</span>
                        <span className="text-navy-900 font-semibold block mt-0.5">{selectedConsultation.date}</span>
                        <span className="text-slate-400 font-mono text-[8px] block">{selectedConsultation.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Dossier Registered</span>
                        <span className="text-navy-900 font-semibold block mt-0.5">
                          {new Date(selectedConsultation.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-slate-400 font-mono text-[8px] block">
                          {new Date(selectedConsultation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Advisory Specialty Target</span>
                      <span className="text-navy-900 font-bold block mt-1">{selectedConsultation.service}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Principal email secure contact</span>
                      <span className="text-teal-600 font-mono font-bold block mt-0.5 hover:underline select-all">{selectedConsultation.email}</span>
                    </div>

                    {selectedConsultation.phone && (
                      <div>
                        <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Principal phone secure contact</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-navy-900 font-mono font-bold select-all">{selectedConsultation.phone}</span>
                          <a
                            href={`https://wa.me/${selectedConsultation.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Hello ${selectedConsultation.name}, this is Engineer Wale Belo. Regarding your advisory request for "${selectedConsultation.service}" (Dossier ID: ${selectedConsultation.engagementId}), the status is currently: ${selectedConsultation.status}.\n\nDirectives: ${adminNoteInput || selectedConsultation.adminNotes || "None"}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[9px] font-bold rounded flex items-center space-x-1 cursor-pointer transition-colors"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>WHATSAPP CLIENT</span>
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded">
                      <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block mb-1">Confidential Scope Briefing</span>
                      <p className="text-navy-900 leading-relaxed italic">{selectedConsultation.notes || "No extra notes compiled by the agency principal."}</p>
                    </div>

                    {/* Operational controls status updates */}
                    <div className="border-t border-slate-100 pt-4 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Consultant Private Notes / Feedback</label>
                        <textarea
                          rows={3}
                          placeholder="Type specific telemetry pre-requisites, state panel confirmations, or scheduling adjustments here..."
                          value={adminNoteInput}
                          onChange={(e) => setAdminNoteInput(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 bg-slate-50/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Alter Dossier Authorization</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleUpdateStatusClick(selectedConsultation.id, "Confirmed")}
                            disabled={selectedConsultation.status === "Confirmed"}
                            className="px-3 py-1.5 bg-teal-600 text-white font-mono text-[10px] font-bold rounded cursor-pointer hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-center"
                          >
                            CONFIRM DIAL
                          </button>
                          <button
                            onClick={() => handleUpdateStatusClick(selectedConsultation.id, "Declined")}
                            disabled={selectedConsultation.status === "Declined"}
                            className="px-3 py-1.5 bg-rose-600 text-white font-mono text-[10px] font-bold rounded cursor-pointer hover:bg-rose-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-center"
                          >
                            DECLINE ENGAGEMENT
                          </button>
                          <button
                            onClick={() => handleUpdateStatusClick(selectedConsultation.id, "Rescheduled")}
                            className="px-3 py-1.5 bg-purple-600 text-white font-mono text-[10px] font-bold rounded cursor-pointer hover:bg-purple-700 text-center col-span-2"
                          >
                            RESCHEDULE REQUEST
                          </button>
                          <button
                            onClick={() => handleUpdateStatusClick(selectedConsultation.id, "Completed")}
                            disabled={selectedConsultation.status === "Completed"}
                            className="px-3 py-1.5 bg-navy-950 text-white font-mono text-[10px] font-bold rounded cursor-pointer hover:bg-navy-900 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-center col-span-2"
                          >
                            MARK COMPLETED
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-400 space-y-3 font-mono h-80 flex flex-col justify-center">
                  <FileText className="h-10 w-10 text-slate-300 mx-auto" />
                  <p className="text-xs">Select any inquiry coordinate dossier from the ledger to load credentials, notes, and authorization controls.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* MODAL: Add Manual Booking */}
      <AnimatePresence>
        {showAddManualModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="manual-booking-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              
              {/* Backdrop */}
              <div onClick={() => setShowAddManualModal(false)} className="fixed inset-0 transition-opacity bg-navy-950/80 backdrop-blur-xs" />

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              {/* Modal Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-2xl border border-slate-200"
              >
                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                  <h3 className="font-display text-lg font-bold text-navy-900" id="manual-booking-title">
                    Manual Dial Entry - Consultant Input
                  </h3>
                  <button onClick={() => setShowAddManualModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleManualSubmit} className="mt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-semibold font-mono uppercase mb-1">Principal Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={manualForm.name}
                        onChange={(e) => setManualForm({...manualForm, name: e.target.value})}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold font-mono uppercase mb-1">Secure Email *</label>
                      <input 
                        type="email" 
                        required 
                        value={manualForm.email}
                        onChange={(e) => setManualForm({...manualForm, email: e.target.value})}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold font-mono uppercase mb-1">WhatsApp / Phone (Optional)</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. +234 803 123 4567"
                      value={manualForm.phone}
                      onChange={(e) => setManualForm({...manualForm, phone: e.target.value})}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold font-mono uppercase mb-1">Organization / Enterprise *</label>
                    <input 
                      type="text" 
                      required 
                      value={manualForm.organization}
                      onChange={(e) => setManualForm({...manualForm, organization: e.target.value})}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-semibold font-mono uppercase mb-1">Sector *</label>
                      <select 
                        value={manualForm.service}
                        onChange={(e) => setManualForm({...manualForm, service: e.target.value})}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                      >
                        <option value="Cybersecurity Strategy">Cybersecurity Strategy</option>
                        <option value="Satellite VSAT">Satellite VSAT</option>
                        <option value="Resource Lecture">Speaking & Keynote</option>
                        <option value="Youth Mentorship">Youth Mentorship</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold font-mono uppercase mb-1">Date Coordinate *</label>
                      <input 
                        type="date" 
                        required 
                        value={manualForm.date}
                        onChange={(e) => setManualForm({...manualForm, date: e.target.value})}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold font-mono uppercase mb-1">Slot *</label>
                    <select 
                      value={manualForm.timeSlot}
                      onChange={(e) => setManualForm({...manualForm, timeSlot: e.target.value})}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                    >
                      <option value="09:00 AM UTC">09:00 AM UTC</option>
                      <option value="11:30 AM UTC">11:30 AM UTC</option>
                      <option value="03:00 PM UTC">03:00 PM UTC</option>
                      <option value="05:30 PM UTC">05:30 PM UTC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold font-mono uppercase mb-1">Manual Dossier Summary</label>
                    <textarea 
                      rows={3} 
                      value={manualForm.notes}
                      onChange={(e) => setManualForm({...manualForm, notes: e.target.value})}
                      placeholder="Enter telecommunication context or credentials details..."
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-slate-50"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowAddManualModal(false)} className="px-4 py-2 border border-slate-200 rounded text-xs font-mono">CANCEL</button>
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded text-xs font-mono font-bold hover:bg-teal-700">ADD & CONFIRM</button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
