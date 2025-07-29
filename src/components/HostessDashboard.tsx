import React, { useState } from 'react';
import { QrCode, CheckCircle, XCircle, Users, Clock, ArrowLeft, Search, Camera } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export function HostessDashboard() {
  const { state, dispatch } = useReservation();
  const { t } = useLanguage();
  const [scannedCode, setScannedCode] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleBackToHome = () => {
    dispatch({ type: 'LOGOUT_USER' });
  };

  const handleQRScan = (qrData: string) => {
    try {
      const data = JSON.parse(qrData);
      const reservation = state.reservations.find(r => r.id === data.id);
      
      if (reservation) {
        setScanResult({
          success: true,
          reservation,
          data
        });
      } else {
        setScanResult({
          success: false,
          error: t('hostess.reservationNotFound') || 'Reservation not found'
        });
      }
    } catch (error) {
      setScanResult({
        success: false,
        error: t('hostess.invalidQRCode') || 'Invalid QR code format'
      });
    }
  };

  const handleManualScan = () => {
    if (scannedCode.trim()) {
      handleQRScan(scannedCode);
    }
  };

  const todayReservations = state.reservations.filter(r => {
    const today = new Date().toISOString().split('T')[0];
    return r.date === today;
  });

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

  return (
    <div className="min-h-screen bg-refined py-8 relative">
      <LanguageToggle />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('common.logout')}
            </button>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold golden-gradient-text mb-2">
              {t('hostess.title')}
            </h1>
            <p className="text-xl text-gray-300">
              {t('hostess.welcome')}, {state.currentUser?.name}
            </p>
          </div>
        </div>

        {/* QR Scanner Section */}
        <div className="card-refined rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold golden-gradient-text mb-6">
            {t('hostess.qrScanner')}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scanner Interface */}
            <div className="space-y-6">
              <div className="glass-refined p-6 rounded-xl border-2 border-dashed border-yellow-400/30">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t('hostess.scanGuestQR')}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {t('hostess.scanInstructions')}
                  </p>
                  
                  <button
                    onClick={() => setShowScanner(true)}
                    className="btn-refined px-6 py-3 text-black font-bold rounded-xl mb-4"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {t('hostess.openCamera')}
                  </button>
                  
                  <div className="border-t border-gray-600 pt-4">
                    <p className="text-sm text-gray-400 mb-3">{t('hostess.manualEntry')}:</p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={scannedCode}
                        onChange={(e) => setScannedCode(e.target.value)}
                        placeholder={t('hostess.pasteQRCode')}
                        className="input-refined flex-1 px-4 py-2 rounded-lg text-white text-sm"
                      />
                      <button
                        onClick={handleManualScan}
                        className="btn-secondary-refined px-4 py-2 rounded-lg text-sm"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo QR Codes */}
              <div className="glass-refined p-4 rounded-xl">
                <h4 className="font-semibold text-white mb-3">{t('hostess.demoQRCodes')}:</h4>
                <div className="space-y-2">
                  {state.reservations.slice(0, 2).map((reservation) => (
                    <button
                      key={reservation.id}
                      onClick={() => handleQRScan(JSON.stringify({
                        id: reservation.id,
                        name: reservation.name,
                        date: reservation.date,
                        time: reservation.time,
                        guests: reservation.guests,
                        venue: 'The Golden Hour Lounge'
                      }))}
                      className="w-full text-left p-3 glass-refined rounded-lg hover:border-yellow-400/40 transition-colors duration-200 border border-yellow-400/20"
                    >
                      <p className="text-white font-medium">{reservation.name}</p>
                      <p className="text-gray-400 text-sm">
                        {reservation.date} at {reservation.time}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scan Result */}
            <div className="space-y-6">
              {scanResult ? (
                <div className={`glass-refined p-6 rounded-xl border-2 ${
                  scanResult.success 
                    ? 'border-green-500/50 bg-green-900/10' 
                    : 'border-red-500/50 bg-red-900/10'
                }`}>
                  <div className="flex items-center mb-4">
                    {scanResult.success ? (
                      <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-400 mr-3" />
                    )}
                    <h3 className={`text-lg font-semibold ${
                      scanResult.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {scanResult.success ? 'Valid Reservation' : 'Scan Failed'}
                    </h3>
                  </div>

                  {scanResult.success ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">{t('hostess.guestName')}</p>
                          <p className="text-white font-semibold">{scanResult.reservation.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">{t('reservation.partySize')}</p>
                          <p className="text-white font-semibold">{scanResult.reservation.guests} {scanResult.reservation.guests === 1 ? t('reservation.person') : t('reservation.people')}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">{t('confirmation.date')}</p>
                          <p className="text-white font-semibold">{scanResult.reservation.date}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">{t('confirmation.time')}</p>
                          <p className="text-white font-semibold">{formatTime(scanResult.reservation.time)}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-green-500/20">
                        <button className="btn-refined w-full py-3 text-black font-bold rounded-xl">
                          {t('hostess.checkInGuest')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-400">{scanResult.error}</p>
                  )}
                </div>
              ) : (
                <div className="glass-refined p-6 rounded-xl text-center">
                  <QrCode className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">{t('hostess.scanResultHere')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Today's Reservations */}
        <div className="card-refined rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-bold golden-gradient-text mb-6">
            {t('hostess.todayReservations')} ({todayReservations.length})
          </h2>

          {todayReservations.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">{t('hostess.noReservationsToday')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="glass-refined p-4 rounded-xl border border-yellow-400/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{reservation.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {formatTime(reservation.time)} • {reservation.guests} {reservation.guests === 1 ? t('reservation.person') : t('reservation.people')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-400 border border-green-500/50">
                        {t('confirmation.confirmed')}
                      </span>
                      <button
                        onClick={() => handleQRScan(JSON.stringify({
                          id: reservation.id,
                          name: reservation.name,
                          date: reservation.date,
                          time: reservation.time,
                          guests: reservation.guests,
                          venue: 'The Golden Hour Lounge'
                        }))}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                      >
                        <QrCode className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Camera Scanner Modal (Simulated) */}
        {showScanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90" onClick={() => setShowScanner(false)} />
            
            <div className="relative w-full max-w-md">
              <div className="glass-refined rounded-2xl border border-yellow-400/20 p-8 text-center">
                <h3 className="text-xl font-serif font-bold golden-gradient-text mb-4">
                  {t('hostess.cameraScanner')}
                </h3>
                
                <div className="w-64 h-64 mx-auto mb-6 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-yellow-400/30">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">{t('hostess.cameraViewHere')}</p>
                    <p className="text-gray-500 text-xs mt-1">{t('hostess.pointAtQR')}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowScanner(false)}
                  className="btn-secondary-refined px-6 py-3 font-bold rounded-xl"
                >
                  {t('hostess.closeScanner')}
                </button>
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