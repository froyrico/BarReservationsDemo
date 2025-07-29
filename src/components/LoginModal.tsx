import React, { useState } from 'react';
import { X, User, Lock, Shield, Crown, Users } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { state, dispatch } = useReservation();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  if (!isOpen) return null;

  const handleLogin = (role: UserRole) => {
    const user = state.users.find(u => u.role === role);
    if (user) {
      dispatch({ type: 'LOGIN_USER', payload: user });
      // Don't call onClose() here - let the parent component handle it
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <Crown className="w-6 h-6" />;
      case 'rp': return <Users className="w-6 h-6" />;
      case 'hostess': return <Shield className="w-6 h-6" />;
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Full access to analytics, reservations, and system management';
      case 'rp': return 'Create custom reservations and view personal statistics';
      case 'hostess': return 'Scan QR codes and manage guest check-ins';
    }
  };

  const roles = [
    { role: 'admin' as UserRole, title: 'Administrator', color: 'from-purple-500 to-purple-700' },
    { role: 'rp' as UserRole, title: 'Relationship Manager', color: 'from-blue-500 to-blue-700' },
    { role: 'hostess' as UserRole, title: 'Hostess', color: 'from-green-500 to-green-700' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md">
        <div className="glass-refined rounded-2xl border border-yellow-400/20 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold golden-gradient-text">
                  Staff Login
                </h2>
                <p className="text-gray-300 text-sm">Select your role to continue</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full glass-refined hover:bg-red-500/20 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            {roles.map(({ role, title, color }) => {
              const user = state.users.find(u => u.role === role);
              return (
                <button
                  key={role}
                  onClick={() => handleLogin(role)}
                  className="w-full glass-refined p-4 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {getRoleIcon(role)}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-white">{title}</h3>
                        {user && (
                          <span className="text-sm text-gray-400">({user.name})</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {getRoleDescription(role)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Demo Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Demo mode - Click any role to login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}