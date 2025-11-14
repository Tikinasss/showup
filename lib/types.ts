export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  RESCHEDULED = 'RESCHEDULED',
  NO_SHOW = 'NO_SHOW',
  OPT_OUT = 'OPT_OUT',
}

export interface Appointment {
  id: string;
  prenom: string;
  phone?: string;
  email: string;
  date: string;
  heure: string;
  lieu: string;
  lieu_lien: string; // ✅ corriger ici
  conseiller: string;
  objet: string;
  status: AppointmentStatus;  // ✅ correct
  langue: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentStats {
  total: number;
  confirmed: number;
  rescheduled: number;
  noShow: number;
  pending: number;
  optOut: number; 
}

export interface UserProfile {
  id?: string;
  email: string;
  name?: string;
  full_name?: string; // ← AJOUTÉ
  role?: string;
  phone?: string;
}

interface FormData {
  prenom: string;
  phone: string;
  email: string;
  date?: string;
  heure?: string;
  [key: string]: any; // pour les champs dynamiques si besoin
}