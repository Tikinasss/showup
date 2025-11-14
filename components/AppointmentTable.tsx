'use client';

import { Appointment } from '@/lib/types';
import { formatDate, getStatusLabel, getStatusColor } from '@/lib/utils';

interface AppointmentTableProps {
  appointments: Appointment[];
  onReschedule?: (appointment: Appointment) => void; // ajout prop
}

export default function AppointmentTable({ appointments, onReschedule }: AppointmentTableProps) {
  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        Aucun rendez-vous trouvé
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heure</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conseiller</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière MAJ</th>
              {onReschedule && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{apt.prenom}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{apt.objet}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(apt.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apt.heure}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apt.conseiller}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(apt.status)}`}>
                    {getStatusLabel(apt.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(apt.updated_at)}</td>
                {onReschedule && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onReschedule(apt)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Reprogrammer
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
