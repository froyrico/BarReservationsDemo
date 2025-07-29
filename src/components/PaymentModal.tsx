import React, { useState } from 'react';
import { X, CreditCard, Shield, Lock, CheckCircle, AlertCircle, Calendar, DollarSign, Users } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { useLanguage } from '../context/LanguageContext';
import { Table } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table;
  reservationData: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
  };
}

export function PaymentModal({ isOpen, onClose, table, reservationData }: PaymentModalProps) {
  const { dispatch } = useReservation();
  const { t } = useLanguage();
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'processing'>('details');

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    
    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    if (!paymentData.cardNumber.replace(/\s/g, '') || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Valid card number is required';
    }
    
    if (!paymentData.expiryDate || paymentData.expiryDate.length < 5) {
      newErrors.expiryDate = 'Valid expiry date is required';
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = 'Valid CVV is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;
    
    setStep('processing');
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create reservation with table
    const newReservation = {
      id: Date.now().toString(),
      ...reservationData,
      tableId: table.id,
      status: 'confirmed' as const,
      createdAt: new Date()
    };
    
    dispatch({ type: 'CONFIRM_RESERVATION', payload: newReservation });
    setIsProcessing(false);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="glass-refined rounded-2xl border border-yellow-400/20">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-yellow-400/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold golden-gradient-text">
                  Secure Payment
                </h2>
                <p className="text-gray-300 text-sm">Complete your table reservation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full glass-refined hover:bg-red-500/20 transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-300" />
            </button>
          </div>

          <div className="flex">
            {/* Reservation Summary */}
            <div className="w-1/3 p-6 border-r border-yellow-400/20">
              <h3 className="text-lg font-serif font-bold golden-gradient-text mb-6">
                Reservation Summary
              </h3>
              
              {/* Table Details */}
              <div className="glass-refined p-4 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300">Table</span>
                  <span className="text-white font-semibold capitalize">
                    {table.type} #{table.id}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300">Capacity</span>
                  <span className="text-white font-semibold">{table.capacity} people</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Price</span>
                  <span className="text-yellow-400 font-bold text-lg">${table.price}</span>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-gray-300 text-sm">Date</p>
                    <p className="text-white font-semibold">{formatDate(reservationData.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-gray-300 text-sm">Time & Guests</p>
                    <p className="text-white font-semibold">
                      {formatTime(reservationData.time)} • {reservationData.guests} people
                    </p>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="mt-8 pt-6 border-t border-yellow-400/20">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-300">Total</span>
                  <span className="text-2xl font-bold golden-gradient-text">${table.price}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Includes service charge</p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="flex-1 p-6">
              {step === 'details' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-serif font-bold golden-gradient-text">
                      Payment Details
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Lock className="w-4 h-4" />
                      <span>SSL Encrypted</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-yellow-400 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardholderName}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                        className="input-refined w-full px-4 py-3 rounded-xl text-white"
                        placeholder="John Doe"
                      />
                      {errors.cardholderName && (
                        <p className="mt-1 text-sm text-red-400">{errors.cardholderName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-yellow-400 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                        className="input-refined w-full px-4 py-3 rounded-xl text-white"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-400">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-yellow-400 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                          className="input-refined w-full px-4 py-3 rounded-xl text-white"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiryDate && (
                          <p className="mt-1 text-sm text-red-400">{errors.expiryDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-yellow-400 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                          className="input-refined w-full px-4 py-3 rounded-xl text-white"
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvv && (
                          <p className="mt-1 text-sm text-red-400">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      onClick={onClose}
                      className="btn-secondary-refined flex-1 py-3 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setStep('payment')}
                      className="btn-refined flex-1 py-3 text-black font-bold rounded-xl"
                    >
                      Review Payment
                    </button>
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif font-bold golden-gradient-text">
                    Confirm Payment
                  </h3>

                  <div className="glass-refined p-6 rounded-xl">
                    <div className="flex items-center space-x-4 mb-4">
                      <CreditCard className="w-8 h-8 text-yellow-400" />
                      <div>
                        <p className="text-white font-semibold">
                          **** **** **** {paymentData.cardNumber.slice(-4)}
                        </p>
                        <p className="text-gray-300 text-sm">{paymentData.cardholderName}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-yellow-400/20 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Amount to charge:</span>
                        <span className="text-2xl font-bold golden-gradient-text">${table.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep('details')}
                      className="btn-secondary-refined flex-1 py-3 font-bold rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePayment}
                      className="btn-refined flex-1 py-3 text-black font-bold rounded-xl"
                    >
                      <Shield className="w-5 h-5 inline mr-2" />
                      Pay Now
                    </button>
                  </div>
                </div>
              )}

              {step === 'processing' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-6 relative">
                    <div className="absolute inset-0 border-4 border-yellow-400/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
                    <CheckCircle className="w-8 h-8 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold golden-gradient-text mb-2">
                    Processing Payment
                  </h3>
                  <p className="text-gray-300">
                    Please wait while we confirm your reservation...
                  </p>
                  
                  <div className="mt-6 glass-refined p-4 rounded-xl">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                      <Shield className="w-4 h-4" />
                      <span>Your payment is secured with 256-bit SSL encryption</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}