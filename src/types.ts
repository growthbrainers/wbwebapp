export type ConsultationStatus = 'Pending Verification' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Declined';

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone?: string; // Optional WhatsApp / mobile contact
  organization: string;
  service: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: ConsultationStatus;
  createdAt: string;
  adminNotes?: string;
  engagementId: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  icon: any; // Can be any LucideIcon component type
  summary: string;
  bullets: string[];
  metrics: string[];
}

export const WALE_BELO_WHATSAPP = "2348128686426"; // Engineer Wale Belo's direct advisory channel

export function getWhatsAppLink(message: string) {
  return `https://wa.me/${WALE_BELO_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
