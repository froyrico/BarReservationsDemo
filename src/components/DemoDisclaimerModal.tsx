import React from 'react';
import { X, AlertTriangle, Eye, Code, Database, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DemoDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoDisclaimerModal({ isOpen, onClose }: DemoDisclaimerModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="glass-refined rounded-2xl border border-yellow-400/30 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold golden-gradient-text">
                  {t('demo.title')}
                </h2>
                <p className="text-gray-300 text-sm">{t('demo.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full glass-refined hover:bg-red-500/20 transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-300" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Main Message */}
            <div className="glass-refined p-6 rounded-xl border border-orange-400/30 bg-orange-900/10">
              <div className="flex items-start space-x-3">
                <Eye className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">
                    {t('demo.mainTitle')}
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    {t('demo.mainDescription')}
                  </p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold golden-gradient-text">
                {t('demo.featuresTitle')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-refined p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <Database className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-white">{t('demo.simulatedData')}</h4>
                  </div>
                  <p className="text-gray-300 text-sm">{t('demo.simulatedDataDesc')}</p>
                </div>

                <div className="glass-refined p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <Code className="w-5 h-5 text-green-400" />
                    <h4 className="font-semibold text-white">{t('demo.fullFunctionality')}</h4>
                  </div>
                  <p className="text-gray-300 text-sm">{t('demo.fullFunctionalityDesc')}</p>
                </div>

                <div className="glass-refined p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <h4 className="font-semibold text-white">{t('demo.noRealData')}</h4>
                  </div>
                  <p className="text-gray-300 text-sm">{t('demo.noRealDataDesc')}</p>
                </div>

                <div className="glass-refined p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <Eye className="w-5 h-5 text-yellow-400" />
                    <h4 className="font-semibold text-white">{t('demo.portfolioShowcase')}</h4>
                  </div>
                  <p className="text-gray-300 text-sm">{t('demo.portfolioShowcaseDesc')}</p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="glass-refined p-6 rounded-xl border border-red-400/30 bg-red-900/10">
              <h3 className="text-lg font-semibold text-red-400 mb-3">
                {t('demo.importantNotes')}
              </h3>
              <ul className="space-y-2 text-gray-200">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('demo.note1')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('demo.note2')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('demo.note3')}</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center glass-refined p-4 rounded-xl">
              <p className="text-gray-300 mb-2">{t('demo.contactInfo')}</p>
              <p className="text-yellow-400 font-semibold">
                {t('demo.developerName')} - {t('demo.portfolioDemo')}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="btn-refined px-12 py-4 text-black font-bold rounded-xl text-lg"
            >
              {t('demo.understood')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}