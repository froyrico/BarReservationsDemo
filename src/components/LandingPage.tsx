import React from 'react';
import { Calendar, Clock, Users, Award, Star, Wine, Sparkles, ChevronDown, Crown, Gem, Shield } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { useLanguage } from '../context/LanguageContext';
import { DemoDisclaimerModal } from './DemoDisclaimerModal';

export function LandingPage() {
  const { dispatch } = useReservation();
  const { t } = useLanguage();
  const [showDisclaimer, setShowDisclaimer] = React.useState(true);

  const handleMakeReservation = () => {
    dispatch({ type: 'SET_VIEW', payload: 'reservation' });
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: t('landing.easyBooking'),
      description: t('landing.easyBookingDesc'),
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t('landing.flexibleHours'),
      description: t('landing.flexibleHoursDesc'),
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('landing.anyPartySize'),
      description: t('landing.anyPartySizeDesc'),
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t('landing.premiumExperience'),
      description: t('landing.premiumExperienceDesc'),
    }
  ];

  const luxuryFeatures = [
    {
      icon: <Crown className="w-5 h-5" />,
      title: "VIP Treatment",
    },
    {
      icon: <Gem className="w-5 h-5" />,
      title: "Premium Spirits",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Private Atmosphere",
    }
  ];

  return (
    <div className="min-h-screen bg-refined relative overflow-hidden">
      {/* Demo Disclaimer Modal */}
      <DemoDisclaimerModal 
        isOpen={showDisclaimer} 
        onClose={() => setShowDisclaimer(false)} 
      />
      
      {/* Minimal Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-minimal floating-1 top-20 left-10 w-48 h-48 border border-yellow-400/8 rounded-full"></div>
        <div className="floating-minimal floating-2 top-40 right-20 w-32 h-32 border border-yellow-400/10 rounded-full"></div>
        <div className="floating-minimal floating-3 bottom-32 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-full blur-xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/3 via-transparent to-yellow-600/3"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center">
            {/* Refined Logo */}
            <div className="flex justify-center items-center mb-12 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-xl opacity-40 animate-subtle-glow"></div>
                <div className="relative glass-premium p-6 rounded-full transform hover:scale-105 transition-all duration-500">
                  <Wine className="w-16 h-16 text-yellow-400" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>
            
            {/* Main Title */}
            <div className="animate-slide-up">
              <h1 className="text-6xl md:text-8xl font-serif font-bold text-refined mb-8 tracking-tight text-shadow-refined leading-none">
                {t('landing.title')}
                <span className="block golden-gradient-text animate-shimmer text-7xl md:text-9xl">
                  {t('landing.subtitle')}
                </span>
              </h1>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
                {t('landing.description')}
              </p>
              
              {/* Luxury Features Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {luxuryFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="glass-refined px-5 py-2 rounded-full flex items-center space-x-2 animate-slide-in-left"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <div className="text-yellow-400">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-200">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <button
                onClick={handleMakeReservation}
                className="group btn-refined inline-flex items-center px-12 py-4 text-xl font-bold text-black rounded-full mb-12"
              >
                <Calendar className="w-6 h-6 mr-3 group-hover:rotate-6 transition-transform duration-300" />
                {t('landing.makeReservation')}
                <Sparkles className="w-5 h-5 ml-3 group-hover:rotate-12 transition-transform duration-300" />
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <button
                onClick={scrollToFeatures}
                className="text-yellow-400 hover:text-yellow-300 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center space-y-2">
                  <ChevronDown className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-base font-medium">{t('landing.scrollToExplore')}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-serif font-bold golden-gradient-text mb-6 text-shadow-refined">
            {t('landing.whyChoose')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            {t('landing.whyChooseDesc')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group card-refined p-8 rounded-2xl animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="text-yellow-400 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex justify-center">
                <div className="p-3 rounded-xl glass-refined">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300 font-serif">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 via-black/60 to-gray-900/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-serif font-bold golden-gradient-text mb-6 text-shadow-refined">
              {t('landing.whatGuestsSay')}
            </h2>
            <div className="flex justify-center mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-current mx-1" />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: t('landing.review1'),
                author: t('landing.author1'),
                image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
              },
              {
                text: t('landing.review2'),
                author: t('landing.author2'),
                image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
              },
              {
                text: t('landing.review3'),
                author: t('landing.author3'),
                image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
              }
            ].map((review, index) => (
              <div
                key={index}
                className="card-refined p-8 rounded-2xl animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={review.image}
                    alt={review.author}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-yellow-400/20"
                  />
                  <div>
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      ))}
                    </div>
                    <p className="golden-gradient-text font-semibold">{review.author}</p>
                  </div>
                </div>
                <p className="text-gray-200 italic leading-relaxed">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black/80 py-16 border-t border-yellow-400/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-lg opacity-30"></div>
              <div className="relative glass-refined p-4 rounded-full">
                <Wine className="w-10 h-10 text-yellow-400" />
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-serif font-bold golden-gradient-text mb-6">
            {t('landing.footerTitle')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-refined p-4 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white mb-1">Hours</h4>
              <p className="text-gray-300 text-sm">Daily 5:00 PM - 12:00 AM</p>
            </div>
            
            <div className="glass-refined p-4 rounded-xl">
              <Users className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white mb-1">Reservations</h4>
              <p className="text-gray-300 text-sm">Book up to 3 months ahead</p>
            </div>
            
            <div className="glass-refined p-4 rounded-xl">
              <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white mb-1">Experience</h4>
              <p className="text-gray-300 text-sm">Premium cocktail culture</p>
            </div>
          </div>
          
          <p className="text-gray-400">
            {t('landing.footerDisclaimer')}
          </p>
        </div>
      </footer>
      
      {/* Admin Access Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => {
            dispatch({ type: 'SET_VIEW', payload: 'admin' });
          }}
          className="group glass-refined px-4 py-3 rounded-full border border-yellow-400/30 hover:border-yellow-400/70 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          title="Demo: Admin Panel Access"
        >
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.11 7 14 7.9 14 9S13.11 11 12 11 10 10.11 10 9 10.9 7 12 7M18 15H6V13.5C6 11.84 9.33 11 12 11S18 11.84 18 13.5V15Z"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
              DEMO ADMIN
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}