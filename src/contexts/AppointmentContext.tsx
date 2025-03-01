import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appointment, TimeSlot, Barber, Service } from '../types';
import { appointments as mockAppointments, barbers as mockBarbers, services as mockServices, generateTimeSlots } from '../data/mockData';
import { format, addDays } from 'date-fns';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface AppointmentContextType {
  appointments: Appointment[];
  barbers: Barber[];
  services: Service[];
  getBarberTimeSlots: (barberId: string, date: Date) => TimeSlot[];
  bookAppointment: (barberId: string, serviceId: string, date: string, time: string) => Promise<Appointment>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  getUserAppointments: () => Appointment[];
  updateBarberStatus: (barberId: string, status: Barber['status']) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [barbers, setBarbers] = useState<Barber[]>(mockBarbers);
  const [services] = useState<Service[]>(mockServices);
  const { currentUser } = useAuth();

  // Update barber status based on appointments
  useEffect(() => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const currentTime = format(now, 'HH:mm');
    
    const updatedBarbers = barbers.map(barber => {
      // Check if barber has an active appointment right now
      const currentAppointment = appointments.find(
        app => 
          app.barberId === barber.id && 
          app.date === today && 
          app.time <= currentTime && 
          app.status === 'confirmed'
      );
      
      if (currentAppointment) {
        return { ...barber, status: 'occupied' as const };
      }
      
      // Keep existing status if it's 'break' or 'off'
      if (barber.status === 'break' || barber.status === 'off') {
        return barber;
      }
      
      return { ...barber, status: 'available' as const };
    });
    
    setBarbers(updatedBarbers);
  }, [appointments]);

  const getBarberTimeSlots = (barberId: string, date: Date): TimeSlot[] => {
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Get all appointments for this barber on this date
    const barberAppointments = appointments.filter(
      app => app.barberId === barberId && app.date === dateString && app.status !== 'cancelled'
    );
    
    // Generate base time slots
    const slots = generateTimeSlots(date, barberId);
    
    // Mark slots as unavailable if there's an appointment
    return slots.map(slot => {
      const hasAppointment = barberAppointments.some(app => app.time === slot.time);
      return {
        ...slot,
        available: slot.available && !hasAppointment,
      };
    });
  };

  const bookAppointment = async (barberId: string, serviceId: string, date: string, time: string): Promise<Appointment> => {
    return new Promise((resolve, reject) => {
      if (!currentUser) {
        reject(new Error('You must be logged in to book an appointment'));
        return;
      }
      
      // Check if the time slot is available
      const dateObj = new Date(date);
      const slots = getBarberTimeSlots(barberId, dateObj);
      const slot = slots.find(s => s.time === time);
      
      if (!slot || !slot.available) {
        reject(new Error('This time slot is no longer available'));
        return;
      }
      
      // Create new appointment
      const newAppointment: Appointment = {
        id: `appointment${appointments.length + 1}`,
        userId: currentUser.id,
        barberId,
        serviceId,
        date,
        time,
        status: 'confirmed',
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      };
      
      // In a real app, this would be saved to a database
      setAppointments(prev => [...prev, newAppointment]);
      
      // Update barber status if the appointment is for now
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      const currentTime = format(now, 'HH:mm');
      
      if (date === today && time <= currentTime) {
        updateBarberStatus(barberId, 'occupied');
      }
      
      toast.success('Appointment booked successfully!');
      resolve(newAppointment);
    });
  };

  const cancelAppointment = async (appointmentId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const appointmentIndex = appointments.findIndex(app => app.id === appointmentId);
      
      if (appointmentIndex === -1) {
        reject(new Error('Appointment not found'));
        return;
      }
      
      const appointment = appointments[appointmentIndex];
      
      // Check if user owns this appointment or is admin
      if (currentUser?.id !== appointment.userId && !currentUser?.isAdmin) {
        reject(new Error('You are not authorized to cancel this appointment'));
        return;
      }
      
      // Update appointment status
      const updatedAppointments = [...appointments];
      updatedAppointments[appointmentIndex] = {
        ...appointment,
        status: 'cancelled',
      };
      
      setAppointments(updatedAppointments);
      toast.success('Appointment cancelled successfully');
      resolve();
    });
  };

  const getUserAppointments = (): Appointment[] => {
    if (!currentUser) return [];
    
    return appointments.filter(app => app.userId === currentUser.id);
  };

  const updateBarberStatus = (barberId: string, status: Barber['status']) => {
    setBarbers(prev => 
      prev.map(barber => 
        barber.id === barberId ? { ...barber, status } : barber
      )
    );
  };

  const value = {
    appointments,
    barbers,
    services,
    getBarberTimeSlots,
    bookAppointment,
    cancelAppointment,
    getUserAppointments,
    updateBarberStatus,
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

export const useAppointments = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
