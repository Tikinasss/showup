'use client';

import { useEffect, useState } from 'react';
import { Appointment, AppointmentStats } from '@/lib/types';
import { getAppointments, getStats } from '@/lib/supabase';
import StatsCards from '@/components/StatsCards';
import Filters, { FilterState } from '@/components/Filters';
import AppointmentTable from '@/components/AppointmentTable';
import toast from 'react-hot-toast';
import ExportButton from '@/components/ExportButton';

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    confirmed: 0,
    rescheduled: 0,
    noShow: 0,
    pending: 0,
  });
  const [conseillers, setConseillers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) loadAppointmentsWithFilters();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [appointmentsData, statsData] = await Promise.all([
        getAppointments(), // toutes les appointments initialement
        getStats(),        // stats globales
      ]);

      setAppointments(appointmentsData);
      setStats(statsData);

      const uniqueConseillers = [
        ...new Set(appointmentsData.map(a => a.conseiller).filter(Boolean)),
      ];
      setConseillers(uniqueConseillers);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAppointmentsWithFilters = async () => {
    try {
      setLoading(true);
      const filteredData = await getAppointments(filters);
      setAppointments(filteredData);
    } catch (error) {
      toast.error('Erreur lors du filtrage des rendez-vous');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Anti-No-Show
            </h1>
            <p className="text-gray-600 mt-1">Gestion et suivi des rendez-vous</p>
          </div>
          <ExportButton />
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <Filters onFilterChange={handleFilterChange} conseillers={conseillers} />

        {/* Appointments Table */}
        <AppointmentTable appointments={appointments} />
      </div>
    </div>
  );
}
