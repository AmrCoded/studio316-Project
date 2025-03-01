import React from 'react';
import { Calendar, Clock, User, Scissors, X } from 'lucide-react';
import { Appointment, Barber, Service } from '../types';
import { format, parseISO } from 'date-fns';
import { useAppointments } from '../contexts/AppointmentContext';

interface AppointmentCardProps {
  appointment: Appointment;
  barber: Barber;
  service: Service;
  onCancel?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  barber, 
  service,
  onCancel
}) => {
  const appointmentDate = parseISO(`${appointment.date}T${appointment.time}`);
  const isPast = new Date() > appointmentDate;
  
  const getStatusBadge = () => {
    switch (appointment.status) {
      case 'confirmed':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Confirmed</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>;
      case 'completed':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Completed</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Cancelled</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{service.name}</h3>
        {getStatusBadge()}
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{format(appointmentDate, 'MMMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>{format(appointmentDate, 'h:mm a')} ({service.duration} min)</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <div className="flex items-center">
            <img 
              src={barber.avatar} 
              alt={barber.name} 
              className="w-5 h-5 rounded-full mr-2"
            />
            <span>{barber.name}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">${service.price}</div>
        
        {!isPast && appointment.status !== 'cancelled' && onCancel && (
          <button 
            onClick={onCancel}
            className="flex items-center text-red-600 hover:text-red-800 text-sm"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
