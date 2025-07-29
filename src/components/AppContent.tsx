import React from 'react';
import { useReservation } from '../context/ReservationContext';
import { LandingPage } from './LandingPage';
import { ReservationForm } from './ReservationForm';
import { ConfirmationPage } from './ConfirmationPage';
import { AdminPanel } from './AdminPanel';
import { PaymentModal } from './PaymentModal';

export function AppContent() {
  const { state, dispatch } = useReservation();

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'landing':
        return <LandingPage />;
      case 'reservation':
        return <ReservationForm />;
      case 'confirmation':
        return <ConfirmationPage />;
      case 'admin':
        return <AdminPanel />;
      case 'payment':
        return <div>Payment processing...</div>;
      default:
        return <LandingPage />;
    }
  };

  return (
    <>
      {renderCurrentView()}
      
      {/* Removed hidden admin button - now using visible button in LandingPage */}
    </>
  );
}