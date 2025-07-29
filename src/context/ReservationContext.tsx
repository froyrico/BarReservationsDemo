import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Reservation, ViewType, TimeSlot, Table, PaymentData, User, UserRole, ReservationStats } from '../types';

interface ReservationState {
  currentView: ViewType;
  currentReservation: Partial<Reservation>;
  reservations: Reservation[];
  selectedDate: string;
  timeSlots: TimeSlot[];
  tables: Table[];
  paymentData: Partial<PaymentData>;
  currentUser: User | null;
  users: User[];
}

type ReservationAction =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'UPDATE_RESERVATION'; payload: Partial<Reservation> }
  | { type: 'CONFIRM_RESERVATION'; payload: Reservation }
  | { type: 'SET_SELECTED_DATE'; payload: string }
  | { type: 'GENERATE_TIME_SLOTS'; payload: string }
  | { type: 'CANCEL_RESERVATION'; payload: string }
  | { type: 'UPDATE_PAYMENT'; payload: Partial<PaymentData> }
  | { type: 'PROCESS_PAYMENT'; payload: PaymentData }
  | { type: 'LOGIN_USER'; payload: User }
  | { type: 'LOGOUT_USER' };

const initialState: ReservationState = {
  currentView: 'landing',
  currentReservation: {},
  reservations: [
    // Julio 2025 - Semana actual (22-28 julio)
    {
      id: '1',
      date: '2025-07-28',
      time: '19:00',
      guests: 4,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      status: 'confirmed',
      createdAt: new Date('2025-07-20T10:00:00Z')
    },
    {
      id: '2',
      date: '2025-07-27',
      time: '20:30',
      guests: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 234 567 8901',
      status: 'confirmed',
      createdAt: new Date('2025-07-21T14:30:00Z')
    },
    {
      id: '3',
      date: '2025-07-26',
      time: '18:30',
      guests: 6,
      name: 'Michael Rodriguez',
      email: 'michael@example.com',
      phone: '+1 234 567 8902',
      status: 'confirmed',
      createdAt: new Date('2025-07-22T09:15:00Z')
    },
    {
      id: '4',
      date: '2025-07-25',
      time: '19:30',
      guests: 3,
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '+1 234 567 8903',
      status: 'confirmed',
      createdAt: new Date('2025-07-23T16:45:00Z')
    },
    {
      id: '5',
      date: '2025-07-24',
      time: '21:00',
      guests: 8,
      name: 'David Chen',
      email: 'david@example.com',
      phone: '+1 234 567 8904',
      status: 'confirmed',
      createdAt: new Date('2025-07-24T11:30:00Z')
    },
    {
      id: '6',
      date: '2025-07-23',
      time: '18:00',
      guests: 2,
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      phone: '+1 234 567 8905',
      status: 'confirmed',
      createdAt: new Date('2025-07-25T13:20:00Z')
    },
    {
      id: '7',
      date: '2025-07-22',
      time: '20:00',
      guests: 5,
      name: 'Robert Taylor',
      email: 'robert@example.com',
      phone: '+1 234 567 8906',
      status: 'confirmed',
      createdAt: new Date('2025-07-26T08:45:00Z')
    },
    {
      id: '8',
      date: '2025-07-21',
      time: '19:15',
      guests: 4,
      name: 'Jennifer Martinez',
      email: 'jennifer@example.com',
      phone: '+1 234 567 8907',
      status: 'confirmed',
      createdAt: new Date('2025-07-19T15:10:00Z')
    },
    {
      id: '22',
      date: '2025-07-20',
      time: '18:30',
      guests: 3,
      name: 'Carlos Mendez',
      email: 'carlos@example.com',
      phone: '+1 234 567 8921',
      status: 'confirmed',
      createdAt: new Date('2025-07-14T10:00:00Z')
    },
    {
      id: '23',
      date: '2025-07-19',
      time: '20:00',
      guests: 6,
      name: 'Ana Rodriguez',
      email: 'ana@example.com',
      phone: '+1 234 567 8922',
      status: 'confirmed',
      createdAt: new Date('2025-07-13T15:30:00Z')
    },
    {
      id: '9',
      date: '2025-07-18',
      time: '21:30',
      guests: 7,
      name: 'Christopher Lee',
      email: 'christopher@example.com',
      phone: '+1 234 567 8908',
      status: 'confirmed',
      createdAt: new Date('2025-07-18T12:00:00Z')
    },
    {
      id: '10',
      date: '2025-07-17',
      time: '18:45',
      guests: 3,
      name: 'Amanda Garcia',
      email: 'amanda@example.com',
      phone: '+1 234 567 8909',
      status: 'confirmed',
      createdAt: new Date('2025-07-17T14:25:00Z')
    },
    {
      id: '24',
      date: '2025-07-16',
      time: '19:30',
      guests: 4,
      name: 'Roberto Silva',
      email: 'roberto@example.com',
      phone: '+1 234 567 8923',
      status: 'confirmed',
      createdAt: new Date('2025-07-15T12:00:00Z')
    },
    {
      id: '25',
      date: '2025-07-15',
      time: '20:15',
      guests: 2,
      name: 'Carmen Lopez',
      email: 'carmen@example.com',
      phone: '+1 234 567 8924',
      status: 'confirmed',
      createdAt: new Date('2025-07-14T16:30:00Z')
    },
    {
      id: '26',
      date: '2025-07-14',
      time: '18:45',
      guests: 5,
      name: 'Diego Morales',
      email: 'diego@example.com',
      phone: '+1 234 567 8925',
      status: 'confirmed',
      createdAt: new Date('2025-07-13T11:15:00Z')
    },
    {
      id: '27',
      date: '2025-07-13',
      time: '21:00',
      guests: 3,
      name: 'Isabella Torres',
      email: 'isabella@example.com',
      phone: '+1 234 567 8926',
      status: 'confirmed',
      createdAt: new Date('2025-07-12T14:45:00Z')
    },
    {
      id: '28',
      date: '2025-07-12',
      time: '19:45',
      guests: 6,
      name: 'Fernando Ruiz',
      email: 'fernando@example.com',
      phone: '+1 234 567 8927',
      status: 'confirmed',
      createdAt: new Date('2025-07-11T09:30:00Z')
    },
    // Junio 2025 - Mes anterior
    {
      id: '11',
      date: '2025-06-15',
      time: '19:00',
      guests: 4,
      name: 'James Wilson',
      email: 'james@example.com',
      phone: '+1 234 567 8910',
      status: 'confirmed',
      createdAt: new Date('2025-06-10T10:00:00Z')
    },
    {
      id: '12',
      date: '2025-06-20',
      time: '20:30',
      guests: 6,
      name: 'Maria Gonzalez',
      email: 'maria@example.com',
      phone: '+1 234 567 8911',
      status: 'confirmed',
      createdAt: new Date('2025-06-15T11:30:00Z')
    },
    {
      id: '13',
      date: '2025-06-25',
      time: '18:00',
      guests: 8,
      name: 'Thomas Brown',
      email: 'thomas@example.com',
      phone: '+1 234 567 8912',
      status: 'confirmed',
      createdAt: new Date('2025-06-20T09:15:00Z')
    },
    {
      id: '14',
      date: '2025-06-28',
      time: '20:00',
      guests: 4,
      name: 'Patricia Davis',
      email: 'patricia@example.com',
      phone: '+1 234 567 8913',
      status: 'confirmed',
      createdAt: new Date('2025-06-23T16:45:00Z')
    },
    {
      id: '15',
      date: '2025-06-30',
      time: '19:30',
      guests: 6,
      name: 'Daniel Miller',
      email: 'daniel@example.com',
      phone: '+1 234 567 8914',
      status: 'confirmed',
      createdAt: new Date('2025-06-25T13:20:00Z')
    },
    // Mayo 2025 - Hace 2 meses
    {
      id: '16',
      date: '2025-05-10',
      time: '19:30',
      guests: 2,
      name: 'Kevin Johnson',
      email: 'kevin@example.com',
      phone: '+1 234 567 8915',
      status: 'confirmed',
      createdAt: new Date('2025-05-05T16:45:00Z')
    },
    {
      id: '17',
      date: '2025-05-25',
      time: '21:00',
      guests: 5,
      name: 'Rachel Green',
      email: 'rachel@example.com',
      phone: '+1 234 567 8916',
      status: 'confirmed',
      createdAt: new Date('2025-05-20T13:20:00Z')
    },
    // Abril 2025 - Hace 3 meses
    {
      id: '18',
      date: '2025-04-15',
      time: '18:30',
      guests: 3,
      name: 'Mark Thompson',
      email: 'mark@example.com',
      phone: '+1 234 567 8917',
      status: 'confirmed',
      createdAt: new Date('2025-04-10T11:30:00Z')
    },
    {
      id: '19',
      date: '2025-04-28',
      time: '20:30',
      guests: 7,
      name: 'Laura Martinez',
      email: 'laura@example.com',
      phone: '+1 234 567 8918',
      status: 'confirmed',
      createdAt: new Date('2025-04-23T14:15:00Z')
    },
    // Marzo 2025 - Hace 4 meses
    {
      id: '20',
      date: '2025-03-12',
      time: '19:00',
      guests: 4,
      name: 'Steven Wilson',
      email: 'steven@example.com',
      phone: '+1 234 567 8919',
      status: 'confirmed',
      createdAt: new Date('2025-03-07T10:00:00Z')
    },
    {
      id: '21',
      date: '2025-03-25',
      time: '21:15',
      guests: 2,
      name: 'Michelle Brown',
      email: 'michelle@example.com',
      phone: '+1 234 567 8920',
      status: 'confirmed',
      createdAt: new Date('2025-03-20T16:30:00Z')
    }
  ],
  selectedDate: '',
  timeSlots: [],
  tables: [
    { 
      id: 1, 
      capacity: 2, 
      status: 'available',
      position: { x: 15, y: 25 },
      price: 150,
      type: 'standard',
      features: ['Window view', 'Intimate setting'],
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      shape: 'round'
    },
    { 
      id: 2, 
      capacity: 4, 
      status: 'available',
      position: { x: 35, y: 20 },
      price: 250,
      type: 'premium',
      features: ['Central location', 'Perfect for groups'],
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      shape: 'square'
    },
    { 
      id: 3, 
      capacity: 6, 
      status: 'available',
      position: { x: 65, y: 25 },
      price: 400,
      type: 'vip',
      features: ['Private area', 'Premium service', 'City view'],
      image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      shape: 'rectangular'
    },
    { 
      id: 4, 
      capacity: 2, 
      status: 'occupied', 
      reservationId: '1',
      position: { x: 15, y: 55 },
      price: 180,
      type: 'standard',
      features: ['Cozy corner', 'Quiet atmosphere'],
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      shape: 'round'
    },
    { 
      id: 5, 
      capacity: 4, 
      status: 'reserved', 
      reservationId: '2',
      position: { x: 50, y: 45 },
      price: 280,
      type: 'premium',
      features: ['Bar view', 'Social atmosphere'],
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      shape: 'square'
    },
    { 
      id: 6, 
      capacity: 8, 
      status: 'available',
      position: { x: 75, y: 60 },
      price: 600,
      type: 'vip',
      features: ['Large group', 'Private dining', 'Exclusive service'],
      image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      shape: 'rectangular'
    },
    { 
      id: 7, 
      capacity: 2, 
      status: 'available',
      position: { x: 85, y: 35 },
      price: 200,
      type: 'premium',
      features: ['Terrace view', 'Romantic setting'],
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      shape: 'round'
    },
    { 
      id: 8, 
      capacity: 6, 
      status: 'available',
      position: { x: 35, y: 65 },
      price: 450,
      type: 'vip',
      features: ['Private booth', 'Sound isolation', 'Premium lighting'],
      image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      shape: 'rectangular'
    }
  ],
  paymentData: {},
  currentUser: null,
  users: [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@goldenhour.com',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '2',
      name: 'Maria Rodriguez',
      email: 'maria@goldenhour.com',
      role: 'rp',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '3',
      name: 'Sofia Chen',
      email: 'sofia@goldenhour.com',
      role: 'hostess',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ]
};

const generateTimeSlots = (date: string, reservations: Reservation[]): TimeSlot[] => {
  const times = [
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', 
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
  ];
  
  const dayReservations = reservations.filter(r => r.date === date);
  
  return times.map(time => {
    const isReserved = dayReservations.some(r => r.time === time);
    // Add some random unavailability for demo purposes
    const randomUnavailable = Math.random() > 0.8;
    return {
      time,
      available: !isReserved && !randomUnavailable
    };
  });
};

function reservationReducer(state: ReservationState, action: ReservationAction): ReservationState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'UPDATE_RESERVATION':
      return { 
        ...state, 
        currentReservation: { ...state.currentReservation, ...action.payload } 
      };
    
    case 'CONFIRM_RESERVATION':
      return {
        ...state,
        reservations: [...state.reservations, action.payload],
        currentView: 'confirmation'
      };
    
    case 'SET_SELECTED_DATE':
      return {
        ...state,
        selectedDate: action.payload,
        timeSlots: generateTimeSlots(action.payload, state.reservations)
      };
    
    case 'GENERATE_TIME_SLOTS':
      return {
        ...state,
        timeSlots: generateTimeSlots(action.payload, state.reservations)
      };
    
    case 'CANCEL_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.filter(r => r.id !== action.payload)
      };
    
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        paymentData: { ...state.paymentData, ...action.payload }
      };
    
    case 'PROCESS_PAYMENT':
      return {
        ...state,
        currentView: 'confirmation'
      };
    
    case 'LOGIN_USER':
      return {
        ...state,
        currentUser: action.payload,
        currentView: 'admin'
      };
    
    case 'LOGOUT_USER':
      return {
        ...state,
        currentUser: null,
        currentView: 'landing'
      };
    
    default:
      return state;
  }
}

const ReservationContext = createContext<{
  state: ReservationState;
  dispatch: React.Dispatch<ReservationAction>;
} | null>(null);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reservationReducer, initialState);

  return (
    <ReservationContext.Provider value={{ state, dispatch }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
}