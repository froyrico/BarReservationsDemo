import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Phone, Mail, User, ArrowLeft, CheckCircle, AlertCircle, Crown, Shield, MapPin, ChevronDown } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { useLanguage } from '../context/LanguageContext';
import { Reservation } from '../types';
import { TableMapModal } from './TableMapModal';
import { PaymentModal } from './PaymentModal';

export function ReservationForm() {
  const { state, dispatch } = useReservation();
  const { t } = useLanguage();
  
  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: today,
    time: '',
    guests: 2,
    tableId: undefined as number | undefined
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showTableMap, setShowTableMap] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Initialize with today's date
  useEffect(() => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: today });
  }, [dispatch, today]);

  useEffect(() => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: formData.date });
  }, [formData.date, dispatch]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = t('reservation.errors.nameRequired');
    if (!formData.email.trim()) {
      newErrors.email = t('reservation.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('reservation.errors.emailInvalid');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('reservation.errors.phoneRequired');
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = t('reservation.errors.phoneInvalid');
    }
    if (!formData.date) newErrors.date = t('reservation.errors.dateRequired');
    if (!formData.time) newErrors.time = t('reservation.errors.timeRequired');
    if (formData.guests < 1 || formData.guests > 12) {
      newErrors.guests = t('reservation.errors.guestsInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // If table is selected, show payment modal
    if (formData.tableId) {
      setShowPayment(true);
    } else {
      // Regular reservation without table selection
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newReservation: Reservation = {
        id: Date.now().toString(),
        ...formData,
        status: 'confirmed',
        createdAt: new Date()
      };

      dispatch({ type: 'CONFIRM_RESERVATION', payload: newReservation });
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getQuickDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const selectedTable = formData.tableId ? state.tables.find(t => t.id === formData.tableId) : null;
  const selectedTimeSlot = state.timeSlots.find(slot => slot.time === formData.time);
  const isTimeAvailable = selectedTimeSlot?.available ?? true;

  return (
    <div className="min-h-screen bg-refined py-12 relative overflow-hidden">
      {/* Minimal Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-minimal floating-1 top-20 right-20 w-32 h-32 border border-yellow-400/8 rounded-full"></div>
        <div className="floating-minimal floating-2 bottom-40 left-10 w-24 h-24 border border-yellow-400/10 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'landing' })}
            className="group inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-12 transition-all duration-300 glass-refined px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">{t('reservation.backToHome')}</span>
          </button>
          
          <div className="flex justify-center items-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-xl opacity-40 animate-subtle-glow"></div>
              <div className="relative glass-premium p-5 rounded-full">
                <Calendar className="w-12 h-12 text-yellow-400" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Crown className="w-5 h-5 text-yellow-300" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif font-bold golden-gradient-text mb-6 text-shadow-refined">
            {t('reservation.title')}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
            {t('reservation.description')}
          </p>
        </div>

        {/* Reservation Form */}
        <div className="card-refined rounded-2xl p-8 md:p-12 animate-slide-up">
          {/* Form header */}
          <div className="text-center mb-10">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Secure Reservation</span>
              <Shield className="w-5 h-5 text-yellow-400" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold golden-gradient-text mb-6 text-center">
                Guest Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-lg font-semibold golden-gradient-text">
                    <User className="w-5 h-5 inline mr-2" />
                    {t('reservation.fullName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`input-refined w-full px-6 py-4 rounded-xl text-white ${
                      errors.name 
                        ? 'border-red-500' 
                        : focusedField === 'name' ? 'border-yellow-400' : ''
                    }`}
                    placeholder={t('reservation.fullNamePlaceholder')}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-lg font-semibold golden-gradient-text">
                    <Mail className="w-5 h-5 inline mr-2" />
                    {t('reservation.email')} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`input-refined w-full px-6 py-4 rounded-xl text-white ${
                      errors.email 
                        ? 'border-red-500' 
                        : focusedField === 'email' ? 'border-yellow-400' : ''
                    }`}
                    placeholder={t('reservation.emailPlaceholder')}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-lg font-semibold golden-gradient-text">
                    <Phone className="w-5 h-5 inline mr-2" />
                    {t('reservation.phone')} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    className={`input-refined w-full px-6 py-4 rounded-xl text-white ${
                      errors.phone 
                        ? 'border-red-500' 
                        : focusedField === 'phone' ? 'border-yellow-400' : ''
                    }`}
                    placeholder="+1 234 567 8900"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-400 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-lg font-semibold golden-gradient-text">
                    <Users className="w-5 h-5 inline mr-2" />
                    {t('reservation.partySize')} *
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                    onFocus={() => setFocusedField('guests')}
                    onBlur={() => setFocusedField(null)}
                    className={`input-refined w-full px-6 py-4 rounded-xl text-white ${
                      errors.guests 
                        ? 'border-red-500' 
                        : focusedField === 'guests' ? 'border-yellow-400' : ''
                    }`}
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-black">
                        {i + 1} {i === 0 ? t('reservation.person') : t('reservation.people')}
                      </option>
                    ))}
                  </select>
                  {errors.guests && (
                    <p className="mt-2 text-sm text-red-400 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.guests}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold golden-gradient-text mb-6 text-center">
                Reservation Details
              </h3>

              {/* Date Selection */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold golden-gradient-text">
                  <Calendar className="w-5 h-5 inline mr-2" />
                  {t('reservation.preferredDate')} *
                </label>
                
                {/* Quick Date Selection */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {getQuickDateOptions().map((date) => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => handleInputChange('date', date)}
                        className={`time-slot-refined p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          formData.date === date ? 'selected' : ''
                        }`}
                      >
                        {formatDate(date)}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Date Picker Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full glass-refined p-3 rounded-xl text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Choose different date</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDatePicker ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Custom Date Input */}
                  {showDatePicker && (
                    <div className="animate-fade-in">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        min={today}
                        max={maxDateStr}
                        className="input-refined w-full px-6 py-4 rounded-xl text-white"
                      />
                    </div>
                  )}
                </div>
                
                {errors.date && (
                  <p className="mt-2 text-sm text-red-400 flex items-center animate-fade-in">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Time Selection */}
              {formData.date && (
                <div className="space-y-4">
                  <label className="block text-lg font-semibold golden-gradient-text">
                    <Clock className="w-5 h-5 inline mr-2" />
                    {t('reservation.availableTimes')} *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {state.timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => handleInputChange('time', slot.time)}
                        disabled={!slot.available}
                        className={`time-slot-refined p-4 rounded-xl font-semibold transition-all duration-300 ${
                          formData.time === slot.time
                            ? 'selected'
                            : slot.available
                            ? ''
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                        {!slot.available && (
                          <span className="block text-xs mt-1 opacity-75">{t('reservation.unavailable')}</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.time && (
                    <p className="mt-3 text-sm text-red-400 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.time}
                    </p>
                  )}
                </div>
              )}

              {/* Table Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold golden-gradient-text">
                  <MapPin className="w-5 h-5 inline mr-2" />
                  Table Selection (Optional)
                </label>
                
                {selectedTable ? (
                  <div className="glass-refined p-4 rounded-xl border border-green-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <span className="text-green-400 font-bold">{selectedTable.id}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold capitalize">
                            {selectedTable.type} Table {selectedTable.id}
                          </h4>
                          <p className="text-gray-300 text-sm">
                            {selectedTable.capacity} seats • ${selectedTable.price}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTableMap(true)}
                        className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                      >
                        Change
                      </button>
                    </div>
                    <div className="text-xs text-gray-400">
                      {selectedTable.features.join(' • ')}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowTableMap(true)}
                    className="w-full glass-refined p-4 rounded-xl border-2 border-dashed border-yellow-400/30 hover:border-yellow-400/50 transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-center space-x-3 text-gray-300 group-hover:text-yellow-400">
                      <MapPin className="w-6 h-6" />
                      <span className="font-medium">Choose Your Table</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      View interactive map and select your preferred table
                    </p>
                  </button>
                )}
              </div>
            </div>

            {/* Availability Status */}
            {formData.time && (
              <div className={`glass-refined p-6 rounded-xl border-2 animate-fade-in ${
                isTimeAvailable 
                  ? 'border-green-500/30 bg-green-900/10'
                  : 'border-red-500/30 bg-red-900/10'
              }`}>
                <div className="flex items-center text-lg">
                  <CheckCircle className={`w-6 h-6 mr-3 ${
                    isTimeAvailable ? 'text-green-400' : 'text-red-400'
                  }`} />
                  <span className={`font-semibold ${
                    isTimeAvailable ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isTimeAvailable 
                      ? t('reservation.tableAvailable')
                          .replace('{guests}', formData.guests.toString())
                          .replace('{date}', formData.date)
                          .replace('{time}', formData.time)
                      : t('reservation.timeNotAvailable')
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isTimeAvailable}
              className="btn-refined w-full py-5 px-12 text-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-3 border-black border-t-transparent mr-3"></div>
                  {t('reservation.confirmingReservation')}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Crown className="w-6 h-6 mr-3" />
                  {formData.tableId ? 'Proceed to Payment' : t('reservation.confirmReservation')}
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Table Map Modal */}
        <TableMapModal
          isOpen={showTableMap}
          onClose={() => setShowTableMap(false)}
          tables={state.tables}
          selectedTableId={formData.tableId}
          onSelectTable={(tableId) => {
            handleInputChange('tableId', tableId);
            setShowTableMap(false);
          }}
          guests={formData.guests}
        />

        {/* Payment Modal */}
        {showPayment && selectedTable && (
          <PaymentModal
            isOpen={showPayment}
            onClose={() => setShowPayment(false)}
            table={selectedTable}
            reservationData={formData}
          />
        )}
      </div>
    </div>
  );
}