import { Appointment as TAppointment } from '@/lib/types';
import { Appointment as UAppointment, generateICS } from '@/lib/utils';

interface CalendarLinkProps {
  appointment: TAppointment;
}

export default function CalendarLink({ appointment }: CalendarLinkProps) {
  const handleDownload = () => {
    // transformer en type utils.Appointment
    const appointmentForICS: UAppointment = {
      ...appointment,
      status: appointment.status, // si utils attend 'status'
      lieu_lien: appointment.lieu_lien || '', // valeur par défaut si undefined
    };

    const icsContent = generateICS(appointmentForICS);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rdv_${appointment.id}.ics`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
    >
      📅 Ajouter à mon calendrier
    </button>
  );
}
