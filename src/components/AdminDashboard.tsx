import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, DollarSign, TrendingUp, Clock, Star, ArrowLeft } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { ReservationStats } from '../types';

export function AdminDashboard() {
  const { state, dispatch } = useReservation();
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const handleBackToHome = () => {
    dispatch({ type: 'LOGOUT_USER' });
  };

  // Generate mock statistics
  const generateStats = (period: 'week' | 'month' | 'year'): ReservationStats => {
    const today = new Date();
    console.log('Today:', today.toISOString().split('T')[0]);
    const todayStr = today.toISOString().split('T')[0];
    const todayReservations = state.reservations.filter(r => r.date === todayStr).length;
    console.log('Today reservations:', todayReservations);
    
    // Filter reservations based on selected period
    let filteredReservations = state.reservations;
    let dailyStats: { date: string; reservations: number; revenue: number }[] = [];
    let popularTimes: { time: string; count: number }[] = [];
    
    const now = new Date();
    
    if (period === 'week') {
      // Last 7 days
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      console.log('Week range:', weekAgo.toISOString().split('T')[0], 'to', now.toISOString().split('T')[0]);
      filteredReservations = state.reservations.filter(r => {
        const reservationDate = new Date(r.date);
        return reservationDate >= weekAgo && reservationDate <= now;
      });
      console.log('Week filtered reservations:', filteredReservations.length);
      
      // Generate daily stats for the week
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayReservations = filteredReservations.filter(r => r.date === dateStr);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        dailyStats.push({
          date: dayName,
          reservations: dayReservations.length,
          revenue: dayReservations.reduce((sum, r) => sum + (r.guests * 85), 0) // $85 promedio por persona
        });
      }
    } else if (period === 'month') {
      // Last 30 days
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 30);
      console.log('Month range:', monthAgo.toISOString().split('T')[0], 'to', now.toISOString().split('T')[0]);
      filteredReservations = state.reservations.filter(r => {
        const reservationDate = new Date(r.date);
        return reservationDate >= monthAgo && reservationDate <= now;
      });
      console.log('Month filtered reservations:', filteredReservations.length);
      
      // Generate weekly stats for the month
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7 + 6));
        const weekEnd = new Date(now);
        weekEnd.setDate(now.getDate() - (i * 7));
        
        const weekReservations = filteredReservations.filter(r => {
          const reservationDate = new Date(r.date);
          return reservationDate >= weekStart && reservationDate <= weekEnd;
        });
        
        dailyStats.push({
          date: `Week ${4-i}`,
          reservations: weekReservations.length,
          revenue: weekReservations.reduce((sum, r) => sum + (r.guests * 85), 0)
        });
      }
    } else { // year
      // Last 12 months
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      filteredReservations = state.reservations.filter(r => {
        const reservationDate = new Date(r.date);
        return reservationDate >= yearAgo && reservationDate <= now;
      });
      
      // Generate monthly stats for the year
      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(now);
        monthDate.setMonth(now.getMonth() - i);
        const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
        
        const monthReservations = filteredReservations.filter(r => {
          const reservationDate = new Date(r.date);
          return reservationDate.getMonth() === monthDate.getMonth() && 
                 reservationDate.getFullYear() === monthDate.getFullYear();
        });
        
        dailyStats.push({
          date: monthName,
          reservations: monthReservations.length,
          revenue: monthReservations.reduce((sum, r) => sum + (r.guests * 85), 0)
        });
      }
    }
    
    // Calculate popular times from filtered reservations
    const timeCount: { [key: string]: number } = {};
    filteredReservations.forEach(r => {
      const hour = r.time.split(':')[0] + ':00';
      timeCount[hour] = (timeCount[hour] || 0) + 1;
    });
    
    popularTimes = Object.entries(timeCount)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
    
    // Calculate metrics
    const totalGuests = filteredReservations.reduce((sum, r) => sum + r.guests, 0);
    const averagePartySize = filteredReservations.length > 0 ? totalGuests / filteredReservations.length : 0;
    const monthlyRevenue = filteredReservations.reduce((sum, r) => sum + (r.guests * 85), 0);
    
    return {
      totalReservations: filteredReservations.length,
      todayReservations,
      weeklyReservations: filteredReservations.length,
      monthlyRevenue,
      averagePartySize: Math.round(averagePartySize * 10) / 10,
      popularTimes,
      dailyStats
    };
  };

  const stats = generateStats(selectedPeriod);

  const COLORS = ['#d4af37', '#ffd700', '#ffed4e', '#b8860b'];

  const tableTypeData = [
    { name: 'Standard', value: 45, color: '#d4af37' },
    { name: 'Premium', value: 35, color: '#ffd700' },
    { name: 'VIP', value: 20, color: '#ffed4e' }
  ];

  return (
    <div className="min-h-screen bg-refined py-8 relative">
      <LanguageToggle />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('admin.logout') || 'Logout'}
            </button>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold golden-gradient-text mb-2">
              {t('admin.title') || 'Admin Dashboard'}
            </h1>
            <p className="text-xl text-gray-300">
              {t('admin.description') || 'Complete analytics and system overview'}
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex bg-gray-800 rounded-xl p-1">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                  selectedPeriod === period
                    ? 'bg-yellow-400 text-black'
                    : 'text-yellow-400 hover:text-yellow-300'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card-refined p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('admin.totalReservations') || 'Total Reservations'}</p>
                <p className="text-3xl font-bold text-white">{stats.totalReservations}</p>
                <p className="text-green-400 text-sm mt-1">+12% from last month</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="card-refined p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('admin.todayReservations') || "Today's Reservations"}</p>
                <p className="text-3xl font-bold text-white">{stats.todayReservations}</p>
                <p className="text-blue-400 text-sm mt-1">Active bookings</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="card-refined p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('admin.monthlyRevenue') || 'Monthly Revenue'}</p>
                <p className="text-3xl font-bold text-white">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-green-400 text-sm mt-1">+8% from last month</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="card-refined p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{t('admin.avgPartySize') || 'Avg Party Size'}</p>
                <p className="text-3xl font-bold text-white">{stats.averagePartySize}</p>
                <p className="text-yellow-400 text-sm mt-1">People per reservation</p>
              </div>
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Daily Revenue Chart */}
          <div className="card-refined p-8 rounded-2xl">
            <h3 className="text-xl font-serif font-bold golden-gradient-text mb-6">
              Daily Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #d4af37',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Times Chart */}
          <div className="card-refined p-8 rounded-2xl">
            <h3 className="text-xl font-serif font-bold golden-gradient-text mb-6">
              Popular Reservation Times ({selectedPeriod})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              {stats.popularTimes.length > 0 ? (
                <LineChart data={stats.popularTimes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #d4af37',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#d4af37" 
                    strokeWidth={3}
                    dot={{ fill: '#d4af37', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No data available for selected period</p>
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Period Summary */}
        <div className="card-refined p-6 rounded-2xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold golden-gradient-text">{stats.totalReservations}</p>
              <p className="text-gray-400 text-sm">Total Reservations</p>
            </div>
            <div>
              <p className="text-2xl font-bold golden-gradient-text">
                {stats.totalReservations > 0 ? stats.totalReservations * 4 : 0}
              </p>
              <p className="text-gray-400 text-sm">Total Guests</p>
            </div>
            <div>
              <p className="text-2xl font-bold golden-gradient-text">${stats.monthlyRevenue.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Revenue ({selectedPeriod})</p>
            </div>
            <div>
              <p className="text-2xl font-bold golden-gradient-text">{stats.averagePartySize}</p>
              <p className="text-gray-400 text-sm">Avg Party Size</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Daily Revenue Chart */}
          <div className="card-refined p-8 rounded-2xl">
            <h3 className="text-xl font-serif font-bold golden-gradient-text mb-6">
              {selectedPeriod === 'week' ? 'Daily' : selectedPeriod === 'month' ? 'Weekly' : 'Monthly'} Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              {stats.dailyStats.length > 0 ? (
                <BarChart data={stats.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #d4af37',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#d4af37" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No data available for selected period</p>
                </div>
              )}
            </ResponsiveContainer>
          </div>

          {/* Popular Times Chart */}
          <div className="card-refined p-8 rounded-2xl">
            <h3 className="text-xl font-serif font-bold golden-gradient-text mb-6">
              Popular Reservation Times ({selectedPeriod})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              {stats.popularTimes.length > 0 ? (
                <LineChart data={stats.popularTimes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #d4af37',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#d4af37" 
                  strokeWidth={3}
                  dot={{ fill: '#d4af37', strokeWidth: 2, r: 6 }}
                />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No data available for selected period</p>
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Types Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card-refined p-8 rounded-2xl">
            <h3 className="text-xl font-serif font-bold golden-gradient-text mb-6">
              Table Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={tableTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tableTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {tableTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 card-refined p-8 rounded-2xl">
            <h3 className="text-xl font-serif font-bold golden-gradient-text mb-6">
              Recent Reservations
            </h3>
            <div className="space-y-4">
              {state.reservations.slice(-5).reverse().map((reservation) => (
                <div key={reservation.id} className="glass-refined p-4 rounded-xl border border-yellow-400/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{reservation.name}</p>
                        <p className="text-sm text-gray-400">
                          {reservation.date} at {reservation.time} • {reservation.guests} guests
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-400 border border-green-500/50">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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