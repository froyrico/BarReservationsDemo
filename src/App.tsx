import React from 'react';
import { ReservationProvider } from './context/ReservationContext';
import { LanguageProvider } from './context/LanguageContext';
import { LanguageToggle } from './components/LanguageToggle';
import { AppContent } from './components/AppContent';

function App() {
  return (
    <LanguageProvider>
      <ReservationProvider>
        <div className="font-sans">
          <LanguageToggle />
          <AppContent />
        </div>
      </ReservationProvider>
    </LanguageProvider>
  );
}

export default App;