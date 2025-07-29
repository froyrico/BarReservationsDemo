export interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  tableId?: number;
}

export interface Table {
  id: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  reservationId?: string;
  position: { x: number; y: number };
  price: number;
  type: 'standard' | 'premium' | 'vip';
  features: string[];
  image: string;
  shape: 'round' | 'square' | 'rectangular';
  rotation?: number;
}

export type ViewType = 'landing' | 'reservation' | 'confirmation' | 'admin' | 'payment';

export interface PaymentData {
  tableId: number;
  amount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export type UserRole = 'admin' | 'rp' | 'hostess';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface ReservationStats {
  totalReservations: number;
  todayReservations: number;
  weeklyReservations: number;
  monthlyRevenue: number;
  averagePartySize: number;
  popularTimes: { time: string; count: number }[];
  dailyStats: { date: string; reservations: number; revenue: number }[];
}