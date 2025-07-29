import React, { useState } from 'react';
import { Users, Calendar, Plus, Star, ArrowLeft, Phone, Mail, Clock } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { Reservation } from '../types';

export function RPDashboard() {
  const { state, dispatch } = useReservation();
  const { t } = useLanguage();
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    notes: ''
  });

  const handleBackToHome = () => {
    dispatch({ type: 'LOGOUT_USER' });
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReservation: Reservation = {
      id: Date.now().toString(),
      ...formData,
      status: 'confirmed',
      createdAt: new Date()
    };

    dispatch({ type: 'CONFIRM_RESERVATION', payload: newReservation });
    setShowNewReservation(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: 2,
      notes: ''
    });
  };

  // Get RP's reservations (simulated - in real app would filter by RP ID)
  const rpReservations = state.reservations.slice(0, Math.ceil(state.reservations.length * 0.6));
  const totalGuests = rpReservations.reduce((sum, r) => sum + r.guests, 0);
  const avgPartySize = rpReservations.length > 0 ? (totalGuests / rpReservations.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-refined py-8 relative">
      <LanguageToggle />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('common.logout') || 'Logout'}
            </button>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold golden-gradient-text mb-2">
              {t('rp.dashboard') || 'RP Dashboard'}
            </h1>
            <p className="text-xl text-gray-300">
              {t('rp.welcomeBack') || 'Welcome back'}, {state.currentUser?.name}
            </p>
          </div>

          <button
            onClick={() => setShowNewReservation(true)}
            className="btn-refined px-8 py-3 text-black font-bold rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('rp.newReservation') || 'New Reservation'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-refined p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('rp.myReservations') || 'My Reservations'}</p>
                <p className="text-3xl font-bold text-white">{rpReservations.length}</p>
                <p className="text-green-400 text-sm mt-1">{t('rp.activeBookings') || 'Active bookings'}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="card-refined p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('rp.totalGuests') || 'Total Guests'}</p>
                <p className="text-3xl font-bold text-white">{totalGuests}</p>
                <p className="text-blue-400 text-sm mt-1">{t('rp.servedThisMonth') || 'Served this month'}</p>
              </div>
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="card-refined p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('admin.avgPartySize') || 'Avg Party Size'}</p>
                <p className="text-3xl font-bold text-white">{avgPartySize}</p>
                <p className="text-yellow-400 text-sm mt-1">{t('rp.peoplePerBooking') || 'People per booking'}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="card-refined rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-bold golden-gradient-text mb-6">
            {t('rp.myClientReservations') || 'My Client Reservations'}
          </h2>

          {rpReservations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">{t('rp.noReservations') || 'No reservations yet'}</p>
              <p className="text-gray-500">{t('rp.createFirstReservation') || 'Create your first reservation for a client'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rpReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="glass-refined p-6 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{reservation.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                      </p>
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

                    <div className="flex items-center justify-end">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-400 border border-green-500/50">
                        {t('confirmation.confirmed') || 'Confirmed'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Reservation Modal */}
        {showNewReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowNewReservation(false)} />
            
            <div className="relative w-full max-w-2xl">
              <div className="glass-refined rounded-2xl border border-yellow-400/20 p-8">
                <h2 className="text-2xl font-serif font-bold golden-gradient-text mb-6">
                  {t('rp.createNewReservation') || 'Create New Reservation'}
                </h2>

                <form onSubmit={handleCreateReservation} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-yellow-400 mb-2">
                        {t('rp.clientName') || 'Client Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="input-refined w-full px-4 py-3 rounded-xl text-white"
                        placeholder={t('rp.enterClientName') || 'Enter client name'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-yellow-400 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="input-refined w-full px-4 py-3 rounded-xl text-white"
                        placeholder={t('rp.clientEmailPlaceholder') || 'client@example.com'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-yellow-400 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="input-refined w-full px-4 py-3 rounded-xl text-white"
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-yellow-400 mb-2">
                        {t('reservation.partySize') || 'Party Size'} *
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                        className="input-refined w-full px-4 py-3 rounded-xl text-white"
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1} className="bg-black">
                            {i + 1} {i === 0 ? t('reservation.person') : t('reservation.people')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-yellow-400 mb-2">
                        {t('reservation.date') || 'Date'} *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="input-refined w-full px-4 py-3 rounded-xl text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-yellow-400 mb-2">
                        {t('reservation.time') || 'Time'} *
                      </label>
                      <select
                        required
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="input-refined w-full px-4 py-3 rounded-xl text-white"
                      >
                        <option value="" className="bg-black">{t('rp.selectTime') || 'Select time'}</option>
                        {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'].map(time => (
                          <option key={time} value={time} className="bg-black">{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-400 mb-2">
                      {t('rp.specialNotes') || 'Special Notes'}
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="input-refined w-full px-4 py-3 rounded-xl text-white h-24 resize-none"
                      placeholder={t('rp.specialNotesPlaceholder') || 'Any special requests or notes...'}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowNewReservation(false)}
                      className="btn-secondary-refined flex-1 py-3 font-bold rounded-xl"
                    >
                      {t('common.cancel') || 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="btn-refined flex-1 py-3 text-black font-bold rounded-xl"
                    >
                      {t('rp.createReservation') || 'Create Reservation'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo Disclaimer */}
      <div className="mt-12 text-center">
        <div className="glass-refined p-4 rounded-xl inline-block border border-yellow-400/20">
          <p className="text-gray-400 text-sm">
            {t('admin.demoNotice') || 'This is a portfolio demonstration. All data is simulated for demo purposes.'}
          </p>
        </div>
      </div>
    </div>
  );
}