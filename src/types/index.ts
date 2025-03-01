export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  preferredBarberId?: string;
}

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  bio: string;
  status: 'available' | 'occupied' | 'break' | 'off';
  position: {
    x: number;
    y: number;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}
