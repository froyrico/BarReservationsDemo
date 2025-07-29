import React from 'react';
import QRCode from 'qrcode';
import { CheckCircle, Calendar, Clock, Users, Phone, Mail, ArrowLeft, Star, Award, Crown, Gift, Shield } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { useLanguage } from '../context/LanguageContext';

export function ConfirmationPage() {
  const { state, dispatch } = useReservation();
  const { t } = useLanguage();
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');
  
  const reservation = state.reservations[state.reservations.length - 1];

  // Generate QR Code
  React.useEffect(() => {
    if (reservation) {
      const qrData = {
        id: reservation.id,
        name: reservation.name,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        phone: reservation.phone,
        email: reservation.email,
        venue: 'The Golden Hour Lounge',
        status: 'confirmed'
      };
      
      const qrString = JSON.stringify(qrData);
      
      QRCode.toDataURL(qrString, {
        width: 200,
        margin: 2,
        color: {
          dark: '#d4af37',
          light: '#000000'
        },
        errorCorrectionLevel: 'M'
      }).then(url => {
        setQrCodeUrl(url);
      }).catch(err => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [reservation]);

  const handleNewReservation = () => {
    dispatch({ type: 'SET_VIEW', payload: 'reservation' });
  };

  const handleBackToHome = () => {
    dispatch({ type: 'SET_VIEW', payload: 'landing' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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

  if (!reservation) {
    return (
      <div className="min-h-screen bg-refined flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">No reservation found</p>
          <button
            onClick={handleBackToHome}
            className="mt-4 btn-refined px-8 py-3 text-black rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-refined py-12 relative overflow-hidden">
      {/* Minimal Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-minimal floating-1 top-20 left-20 w-48 h-48 border border-yellow-400/8 rounded-full"></div>
        <div className="floating-minimal floating-2 bottom-40 right-10 w-32 h-32 border border-yellow-400/10 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-2xl opacity-40 animate-subtle-glow"></div>
            <div className="relative w-32 h-32 glass-premium rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            
            <div className="absolute -top-4 -right-4">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Award className="w-6 h-6 text-yellow-300" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif font-bold golden-gradient-text mb-6 text-shadow-refined animate-slide-up">
            {t('confirmation.title')}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t('confirmation.description')}
          </p>
        </div>

        {/* Reservation Details */}
        <div className="card-refined rounded-2xl p-8 md:p-12 mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="text-center mb-12">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Reservation Confirmed</span>
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            
            <h2 className="text-3xl font-serif font-bold golden-gradient-text mb-4">
              {t('confirmation.details')}
            </h2>
            <div className="inline-flex items-center glass-refined px-6 py-3 rounded-full border border-yellow-400/20">
              <p className="text-yellow-400 font-semibold">
                {t('confirmation.confirmationId').replace('{id}', reservation.id)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Guest Information */}
            <div className="space-y-8">
              <h3 className="text-2xl font-serif font-bold golden-gradient-text border-b border-yellow-400/20 pb-4">
                {t('confirmation.guestInfo')}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 glass-refined rounded-xl flex items-center justify-center mr-4 border border-yellow-400/20 group-hover:scale-105 transition-transform duration-300">
                    <Users className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">{t('confirmation.guestName')}</p>
                    <p className="text-white font-bold text-lg">{reservation.name}</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 glass-refined rounded-xl flex items-center justify-center mr-4 border border-yellow-400/20 group-hover:scale-105 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">{t('reservation.email')}</p>
                    <p className="text-white font-bold text-lg">{reservation.email}</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 glass-refined rounded-xl flex items-center justify-center mr-4 border border-yellow-400/20 group-hover:scale-105 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">{t('reservation.phone')}</p>
                    <p className="text-white font-bold text-lg">{reservation.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Information */}
            <div className="space-y-8">
              <h3 className="text-2xl font-serif font-bold golden-gradient-text border-b border-yellow-400/20 pb-4">
                {t('confirmation.reservationInfo')}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 glass-refined rounded-xl flex items-center justify-center mr-4 border border-yellow-400/20 group-hover:scale-105 transition-transform duration-300">
                    <Calendar className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">{t('confirmation.date')}</p>
                    <p className="text-white font-bold text-lg">{formatDate(reservation.date)}</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 glass-refined rounded-xl flex items-center justify-center mr-4 border border-yellow-400/20 group-hover:scale-105 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">{t('confirmation.time')}</p>
                    <p className="text-white font-bold text-lg">{formatTime(reservation.time)}</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-12 h-12 glass-refined rounded-xl flex items-center justify-center mr-4 border border-yellow-400/20 group-hover:scale-105 transition-transform duration-300">
                    <Users className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">{t('reservation.partySize')}</p>
                    <p className="text-white font-bold text-lg">
                      {reservation.guests} {reservation.guests === 1 ? t('reservation.person') : t('reservation.people')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-12 glass-refined p-6 border-2 border-green-500/30 rounded-xl bg-green-900/10">
            <div className="flex items-center justify-center text-lg">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
              <span className="text-green-400 font-bold">
                {t('confirmation.status')}: {t('confirmation.confirmed')}
              </span>
              <Crown className="w-6 h-6 text-green-400 ml-3" />
            </div>
          </div>

          {/* QR Code Section */}
          {qrCodeUrl && (
            <div className="mt-12 text-center">
              <h3 className="text-xl font-serif font-bold golden-gradient-text mb-6">
                {t('confirmation.qrTitle')}
              </h3>
              <div className="glass-refined p-8 rounded-2xl inline-block border border-yellow-400/20">
                <div className="bg-black p-4 rounded-xl mb-4 inline-block">
                  <img 
                    src={qrCodeUrl} 
                    alt="Reservation QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-gray-300 text-sm max-w-xs mx-auto leading-relaxed">
                  {t('confirmation.qrDescription')}
                </p>
                <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-yellow-400">
                  <Shield className="w-4 h-4" />
                  <span>{t('confirmation.securePass')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={handleNewReservation}
            className="btn-refined px-12 py-4 text-black font-bold rounded-xl text-lg group"
          >
            <Gift className="w-5 h-5 inline mr-3 group-hover:rotate-6 transition-transform duration-300" />
            {t('confirmation.makeAnother')}
          </button>
          
          <button
            onClick={handleBackToHome}
            className="btn-secondary-refined px-12 py-4 font-bold rounded-xl text-lg group"
          >
            <ArrowLeft className="w-5 h-5 inline mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
            {t('reservation.backToHome')}
          </button>
        </div>

        {/* Important Information */}
        <div className="card-refined rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-2xl font-serif font-bold golden-gradient-text mb-8 text-center">
            {t('confirmation.importantInfo')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-refined p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-yellow-400 mr-3" />
                <h4 className="font-bold text-white">{t('confirmation.arrivalPolicy')}</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">{t('confirmation.arrivalPolicyDesc')}</p>
            </div>
            
            <div className="glass-refined p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-yellow-400 mr-3" />
                <h4 className="font-bold text-white">{t('confirmation.cancellationPolicy')}</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">{t('confirmation.cancellationPolicyDesc')}</p>
            </div>
            
            <div className="glass-refined p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Crown className="w-6 h-6 text-yellow-400 mr-3" />
                <h4 className="font-bold text-white">{t('confirmation.dressCode')}</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">{t('confirmation.dressCodeDesc')}</p>
            </div>
            
            <div className="glass-refined p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 text-yellow-400 mr-3" />
                <h4 className="font-bold text-white">{t('confirmation.contactUs')}</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">{t('confirmation.contactUsDesc')}</p>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="glass-refined p-4 rounded-xl inline-block">
            <p className="text-gray-400">
              {t('confirmation.demoNotice')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}