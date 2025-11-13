import { createClient } from '@supabase/supabase-js';
import { Appointment, AppointmentStats } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Récupère appointments avec filtres optionnels
export async function getAppointments(filters?: {
  statut?: string;
  date?: string;
  conseiller?: string;
}): Promise<Appointment[]> {
  let query = supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: true });

  if (filters?.statut) query = query.eq('statut', filters.statut);
  if (filters?.date) query = query.eq('date', filters.date);
  if (filters?.conseiller) query = query.eq('conseiller', filters.conseiller);

  const { data, error } = await query;
  if (error) throw error;
  return data as Appointment[];
}

// Récupère stats globales depuis la vue
export async function getStats(): Promise<AppointmentStats> {
  const { data, error } = await supabase
    .from('stats_global')
    .select('*')
    .single();

  if (error) throw error;

  return {
    total: data.total_appointments,
    confirmed: data.confirmed,
    rescheduled: data.rescheduled,
    noShow: data.no_shows,
    pending: data.cancelled, // mapping selon besoin
  };
}
