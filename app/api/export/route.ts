import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Appointment } from '@/lib/types';

const convertToCSV = (appointments: Appointment[]) => {
  const header = [
    'Prénom', 'Phone', 'Email', 'Date', 'Heure', 'Lieu',
    'Conseiller', 'Objet', 'Statut', 'Langue', 'Créé', 'MisAJour'
  ];
  const rows = appointments.map(a => [
    a.prenom, a.phone, a.email, a.date, a.heure,
    a.lieu, a.conseiller, a.objet, a.statut,
    a.langue, a.created_at, a.updated_at
  ]);
  return [header, ...rows].map(r => r.join(';')).join('\n');
};

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*');

    if (error) throw error;

    const csv = convertToCSV(data as Appointment[]);

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="appointments.csv"`,
      },
    });
  } catch (err) {
    console.error('Erreur API export:', err);
    return NextResponse.json(
      { error: 'Erreur lors de l’export CSV' },
      { status: 500 }
    );
  }
}
