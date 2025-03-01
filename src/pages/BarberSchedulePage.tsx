import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useAppointments } from '../contexts/AppointmentContext';

const BarberSchedulePage: React.FC = () => {
  const { barberId } = useParams<{ barberId: string }>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { barbers, getBarberTimeSlots } = useAppointments();
  
  if (!barberId) {
    return <div>Barber not found</div>;
  }
  
  const barber = barbers.find(b => b.id === barberId);
  
  if (!barber) {
    return <div>Barber not found</div>;
  }
  
  const timeSlots = getBarberTimeSlots(barberId, selectedDate);
  const availableSlots = timeSlots.filter(slot => slot.available);
  
  const handleDateChange = (daysToAdd: number) => {
    setSelectedDate(addDays(selectedDate, daysToAdd));
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-6">
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back to Home
      </Link>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Barber Info */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img 
              src={barber.avatar} 
              alt={barber.name} 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">{barber.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  barber.status === 'available' ? 'bg-green-500' :
                  barber.status === 'occupied' ? 'bg-red-500' :
                  barber.status === 'break' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-gray-600">
                  {barber.status === 'available' ? 'Available' :
                   barber.status === 'occupied' ? 'Occupied' :
                   barber.status === 'break' ? 'On Break' : 'Off Duty'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{barber.bio}</p>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {barber.specialties.map((specialty, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              
              <Link 
                to={`/booking/${barber.id}`}
                className="block w-full bg-amber-600 hover:bg-amber-700 text-white text-center py-2 rounded-md font-medium transition"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
        
        {/* Schedule */}
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Schedule & Availability</h2>
              
              <div className="flex items-center">
                <button 
                  onClick={() => handleDateChange(-1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center mx-2">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-medium">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleDateChange(1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-medium">Available Time Slots</span>
              </div>
              
              <p className="text-gray-600 mb-4">
                {availableSlots.length} available slots for {format(selectedDate, 'MMMM d, yyyy')}
              </p>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {timeSlots.map((slot, index) => (
                  <div 
                    key={index}
                    className={`
                      py-2 px-3 rounded-md text-center border
                      ${slot.available 
                        ? 'border-green-200 bg-green-50 text-green-800' 
                        : 'border-gray-200 bg-gray-50 text-gray-400 line-through'}
                    `}
                  >
                    {slot.time}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold mb-4">Weekly Schedule</h3>
              
              <div className="space-y-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{day}</span>
                    <span className="text-gray-600">
                      {index < 5 ? '9:00 AM - 6:00 PM' : 
                       index === 5 ? '9:00 AM - 4:00 PM' : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberSchedulePage;
