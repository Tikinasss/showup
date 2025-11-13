'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { Appointment, AppointmentStats } from '@/lib/types';
import { getAppointments, getStats } from '@/lib/supabase';
import { getCurrentUser, getUserProfile, signOut, UserProfile } from '@/lib/supabase-auth';
import StatsCards from '@/components/StatsCards';
import Filters, { FilterState } from '@/components/Filters';
import AppointmentTable from '@/components/AppointmentTable';
import ExportButton from '@/components/ExportButton';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    confirmed: 0,
    rescheduled: 0,
    noShow: 0,
    pending: 0,
  });
  const [conseillers, setConseillers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    loadUserAndData();
  }, []);

  const loadUserAndData = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const profile = await getUserProfile(currentUser.id);
        setUser(profile);
      }

      const [appointmentsData, statsData] = await Promise.all([
        getAppointments(),
        getStats(),
      ]);

      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);
      setStats(statsData);

      const uniqueConseillers = [
        ...new Set(appointmentsData.map((a) => a.conseiller).filter(Boolean)),
      ];
      setConseillers(uniqueConseillers);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
      router.push('/auth');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...appointments];

    if (filters.status) {
      filtered = filtered.filter((a) => a.status === filters.status);
    }
    if (filters.date) {
      filtered = filtered.filter((a) => a.date === filters.date);
    }
    if (filters.conseiller) {
      filtered = filtered.filter((a) => a.conseiller === filters.conseiller);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.prenom.toLowerCase().includes(search) ||
          a.objet.toLowerCase().includes(search)
      );
    }

    setFilteredAppointments(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with User Menu */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Anti-No-Show
              </h1>
              <p className="text-sm text-gray-500">Gestion et suivi des rendez-vous</p>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <Filters
          conseillers={conseillers}
          onFilterChange={handleFilterChange}
        />

        {/* Export Button */}
        <div className="flex justify-end">
          <ExportButton appointments={filteredAppointments} />
        </div>

        {/* Appointments Table */}
        <AppointmentTable appointments={filteredAppointments} />
      </div>
    </div>
  );
}