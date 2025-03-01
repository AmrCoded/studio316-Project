import React, { useState } from 'react';
import { User, Clock, Calendar, X } from 'lucide-react';
import { Barber, TimeSlot } from '../types';
import { format, addDays } from 'date-fns';
import { useAppointments } from '../contexts/AppointmentContext';
import { useNavigate } from 'react-router-dom';

interface BarberChairProps {
  barber: Barber;
  onClick?: () => void;
}

const BarberChair: React.FC<BarberChairProps> = ({ barber, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getBarberTimeSlots } = useAppointments();
  const navigate = useNavigate();
  
  const timeSlots = getBarberTimeSlots(barber.id, selectedDate);
  const availableSlots = timeSlots.filter(slot => slot.available);
  
  const getStatusColor = (status: Barber['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'occupied':
        return 'bg-red-500';
      case 'break':
        return 'bg-yellow-500';
      case 'off':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusText = (status: Barber['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'occupied':
        return 'Occupied';
      case 'break':
        return 'On Break';
      case 'off':
        return 'Off Duty';
      default:
        return 'Unknown';
    }
  };
  
  const handleClick = () => {
    setIsExpanded(!isExpanded);
    if (onClick) onClick();
  };
  
  const handleBookNow = () => {
    navigate(`/booking/${barber.id}`);
  };
  
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
  };
  
  const handleDateChange = (daysToAdd: number) => {
    setSelectedDate(addDays(selectedDate, daysToAdd));
  };
  
  return (
    <div 
      className={`relative ${isExpanded ? 'z-10' : ''}`}
      style={{ 
        position: 'absolute', 
        left: `${barber.position.x}%`, 
        top: `${barber.position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Barber Chair */}
      <div 
        className={`
          w-24 h-24 rounded-full border-4 cursor-pointer transition-all duration-300
          ${isExpanded ? 'border-amber-500 scale-110' : 'border-gray-300 hover:border-amber-400'}
          ${getStatusColor(barber.status)} bg-opacity-20
        `}
        onClick={handleClick}
      >
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div 
            className={`w-4 h-4 rounded-full ${getStatusColor(barber.status)}`} 
            title={getStatusText(barber.status)}
          ></div>
          <span className="text-xs font-semibold mt-1 text-center">{barber.name}</span>
        </div>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
          <button 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="p-4">
            <div className="flex items-center mb-4">
              <img 
                src={barber.avatar} 
                alt={barber.name} 
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-bold text-lg">{barber.name}</h3>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(barber.status)} mr-2`}></div>
                  <span className="text-sm text-gray-600">{getStatusText(barber.status)}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{barber.bio}</p>
            
            <div className="mb-3">
              <h4 className="font-semibold text-sm mb-1">Specialties:</h4>
              <div className="flex flex-wrap gap-1">
                {barber.specialties.map((specialty, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <button 
                  onClick={() => handleDateChange(-1)}
                  className="text-amber-600 hover:text-amber-800"
                >
                  &larr; Prev
                </button>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm font-medium">
                    {format(selectedDate, 'MMM dd, yyyy')}
                  </span>
                </div>
                <button 
                  onClick={() => handleDateChange(1)}
                  className="text-amber-600 hover:text-amber-800"
                >
                  Next &rarr;
                </button>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                <span>
                  {availableSlots.length} available time slots
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-1 mb-3">
                {timeSlots.slice(0, 6).map((slot, index) => (
                  <div 
                    key={index}
                    className={`
                      text-xs py-1 px-2 text-center rounded
                      ${slot.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-400 line-through'}
                    `}
                  >
                    {slot.time}
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleBookNow}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-md font-medium transition"
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarberChair;
