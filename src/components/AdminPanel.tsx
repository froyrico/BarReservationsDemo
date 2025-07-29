import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, Clock, Phone, Mail, CheckCircle, XCircle, Edit3, LogIn } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { useLanguage } from '../context/LanguageContext';
import { LoginModal } from './LoginModal';
import { AdminDashboard } from './AdminDashboard';
import { RPDashboard } from './RPDashboard';
import { HostessDashboard } from './HostessDashboard';
import { useEffect } from 'react';

export function AdminPanel() {
  const { state, dispatch } = useReservation();
  const { t } = useLanguage();
  const [showLogin, setShowLogin] = useState(false);

  // Show login modal if no user is logged in
  if (!state.currentUser) {
    if (!showLogin) {
      setShowLogin(true);
    }
    
    return (
      <div className="min-h-screen bg-refined flex items-center justify-center">
        <LoginModal 
          isOpen={showLogin} 
          onClose={() => {
            setShowLogin(false);
            dispatch({ type: 'SET_VIEW', payload: 'landing' });
          }} 
        />
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  switch (state.currentUser.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'rp':
      return <RPDashboard />;
    case 'hostess':
      return <HostessDashboard />;
    default:
      return <AdminDashboard />;
  }
}

// Keep the original AdminPanel as a separate component for reference
export function OriginalAdminPanel() {
  const { state, dispatch } = useReservation();
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'reservations' | 'tables'>('reservations');

  const handleBackToHome = () => {
    dispatch({ type: 'SET_VIEW', payload: 'landing' });
  };
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const filteredReservations = state.reservations.filter(r => r.date === selectedDate);
  const totalReservations = filteredReservations.length;
  const totalGuests = filteredReservations.reduce((sum, r) => sum + r.guests, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-900/20 border-green-500/50';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/50';
      case 'cancelled': return 'text-red-400 bg-red-900/20 border-red-500/50';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/50';
    }
  };

  const getTableStatus = (table: any) => {
    switch (table.status) {
      case 'available': return 'bg-green-900/30 border-green-500/50 text-green-400';
      case 'occupied': return 'bg-red-900/30 border-red-500/50 text-red-400';
      case 'reserved': return 'bg-yellow-900/30 border-yellow-500/50 text-yellow-400';
      default: return 'bg-gray-900/30 border-gray-500/50 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('reservation.backToHome')}
            </button>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
              {t('admin.title')}
            </h1>
            <p className="text-xl text-gray-300">
              {t('admin.description')}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('reservations')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                viewMode === 'reservations'
                  ? 'bg-yellow-400 text-black'
                  : 'text-yellow-400 hover:text-yellow-300'
              }`}
            >
              {t('admin.reservations')}
            </button>
            <button
              onClick={() => setViewMode('tables')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                viewMode === 'tables'
                  ? 'bg-yellow-400 text-black'
                  : 'text-yellow-400 hover:text-yellow-300'
              }`}
            >
              {t('admin.tables')}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('admin.totalReservations')}</p>
                <p className="text-3xl font-bold text-white">{state.reservations.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('admin.todayReservations')}</p>
                <p className="text-3xl font-bold text-white">{totalReservations}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('admin.expectedGuests')}</p>
                <p className="text-3xl font-bold text-white">{totalGuests}</p>
              </div>
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('admin.availableTables')}</p>
                <p className="text-3xl font-bold text-white">
                  {state.tables.filter(t => t.status === 'available').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-yellow-400 mb-2">
            {t('admin.selectDate')}
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 bg-black border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
          />
        </div>

        {/* Content based on view mode */}
        {viewMode === 'reservations' ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8">
            <h2 className="text-2xl font-serif font-bold text-white mb-6">
              {t('admin.reservationsFor').replace('{date}', formatDate(selectedDate))}
            </h2>

            {filteredReservations.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">{t('admin.noReservations')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="bg-black border border-gray-700 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{reservation.name}</h3>
                        <p className="text-gray-400 text-sm">{formatTime(reservation.time)}</p>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <Users className="w-4 h-4 mr-2 text-yellow-400" />
                        {reservation.guests} {reservation.guests === 1 ? t('reservation.person') : t('reservation.people')}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center text-gray-300 text-sm">
                          <Phone className="w-3 h-3 mr-2 text-yellow-400" />
                          {reservation.phone}
                        </div>
                        <div className="flex items-center text-gray-300 text-sm">
                          <Mail className="w-3 h-3 mr-2 text-yellow-400" />
                          {reservation.email}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                          {t('confirmation.confirmed')}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8">
            <h2 className="text-2xl font-serif font-bold text-white mb-6">
              {t('admin.tableManagement')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {state.tables.map((table) => (
                <div
                  key={table.id}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${getTableStatus(table)}`}
                >
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-2">{t('admin.table')} {table.id}</h3>
                    <p className="text-sm mb-3">{t('admin.seats')} {table.capacity}</p>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-current flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-medium capitalize">
                      {table.status === 'available' ? t('admin.available') : 
                       table.status === 'reserved' ? t('admin.reserved') : 
                       t('admin.occupied')}
                    </p>
                    {table.reservationId && (
                      <p className="text-xs mt-1 opacity-75">ID: {table.reservationId}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-900/30 border border-green-500/50 rounded mr-2"></div>
                <span className="text-sm text-gray-400">{t('admin.available')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-900/30 border border-yellow-500/50 rounded mr-2"></div>
                <span className="text-sm text-gray-400">{t('admin.reserved')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-900/30 border border-red-500/50 rounded mr-2"></div>
                <span className="text-sm text-gray-400">{t('admin.occupied')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {t('admin.demoNotice')}
          </p>
        </div>
      </div>
    </div>
  );
}