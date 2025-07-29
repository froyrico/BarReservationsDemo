import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={toggleLanguage}
        className="group flex items-center space-x-3 bg-gradient-to-r from-gray-900 to-black border border-gray-700 hover:border-yellow-400/50 rounded-full px-4 py-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
      >
        <Languages className="w-4 h-4 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
        
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium transition-colors duration-200 ${
            language === 'en' ? 'text-yellow-400' : 'text-gray-400'
          }`}>
            EN
          </span>
          
          <div className="relative w-10 h-5 bg-gray-700 rounded-full transition-colors duration-300">
            <div className={`absolute top-0.5 w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-md transform transition-transform duration-300 ${
              language === 'es' ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </div>
          
          <span className={`text-sm font-medium transition-colors duration-200 ${
            language === 'es' ? 'text-yellow-400' : 'text-gray-400'
          }`}>
            ES
          </span>
        </div>
      </button>
    </div>
  );
}