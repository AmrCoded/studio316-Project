import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { useAppointments } from '../contexts/AppointmentContext';
import { useAuth } from '../contexts/AuthContext';
import ServiceCard from '../components/ServiceCard';
import toast from 'react-hot-toast';

const BookingPage: React.FC = () => {
  const { barberId } = useParams<{ barberId?: string }>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(barberId || null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { barbers, services, getBarberTimeSlots, bookAppointment } = useAppointments();
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Set initial barber if provided in URL
  useEffect(() => {
    if (barberId) {
      setSelectedBarberId(barberId);
      setCurrentStep(2);
    }
  }, [barberId]);
  
  const handleDateChange = (daysToAdd: number) => {
    setSelectedDate(addDays(selectedDate, daysToAdd));
    setSelectedTime(null);
  };
  
  const handleBarberSelect = (id: string) => {
    setSelectedBarberId(id);
    setCurrentStep(2);
  };
  
  const handleServiceSelect = (id: string) => {
    setSelectedServiceId(id);
    setCurrentStep(3);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    
    if (!isAuthenticated) {
      toast.error('Please log in to book an appointment');
      navigate('/login');
      return;
    }
    
    setCurrentStep(4);
  };
  
  const handleBookAppointment = async () => {
    if (!selectedBarberId || !selectedServiceId || !selectedTime) {
      toast.error('Please complete all booking steps');
      return;
    }
    
    try {
      await bookAppointment(
        selectedBarberId,
        selectedServiceId,
        format(selectedDate, 'yyyy-MM-dd'),
        selectedTime
      );
      
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
      console.error(error);
    }
  };
  
  const selectedBarber = barbers.find(b => b.id === selectedBarberId);
  const selectedService = services.find(s => s.id === selectedServiceId);
  const timeSlots = selectedBarberId ? getBarberTimeSlots(selectedBarberId, selectedDate) : [];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book Your Appointment</h1>
        <p className="text-gray-600">
          Follow the steps below to book your appointment with one of our skilled barbers.
        </p>
      </div>
      
      {/* Booking Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-amber-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <div className={`h-1 w-16 ${currentStep >= 3 ? 'bg-amber-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            3
          </div>
          <div className={`h-1 w-16 ${currentStep >= 4 ? 'bg-amber-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 4 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            4
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Select Barber</span>
          <span>Choose Service</span>
          <span>Pick Date & Time</span>
          <span>Confirm</span>
        </div>
      </div>
      
      {/* Step 1: Select Barber */}
      {currentStep === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select a Barber</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {barbers.map(barber => (
              <div 
                key={barber.id}
                className={`
                  border rounded-lg overflow-hidden cursor-pointer transition-all
                  ${selectedBarberId === barber.id ? 'border-amber-500 ring-2 ring-amber-500 ring-opacity-50' : 'border-gray-200 hover:border-amber-300'}
                `}
                onClick={() => handleBarberSelect(barber.id)}
              >
                <img 
                  src={barber.avatar} 
                  alt={barber.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{barber.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{barber.bio.substring(0, 100)}...</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {barber.specialties.slice(0, 2).map((specialty, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                    {barber.specialties.length > 2 && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        +{barber.specialties.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Step 2: Choose Service */}
      {currentStep === 2 && selectedBarber && (
        <div>
          <button 
            onClick={() => setCurrentStep(1)}
            className="flex items-center text-amber-600 hover:text-amber-800 mb-4"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Barber Selection
          </button>
          
          <div className="flex items-center mb-6">
            <img 
              src={selectedBarber.avatar} 
              alt={selectedBarber.name} 
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">Select a Service with {selectedBarber.name}</h2>
              <p className="text-gray-600 text-sm">Choose the service you'd like to book</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <ServiceCard 
                key={service.id}
                service={service}
                isSelected={selectedServiceId === service.id}
                onClick={() => handleServiceSelect(service.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Step 3: Select Date and Time */}
      {currentStep === 3 && selectedBarber && selectedService && (
        <div>
          <button 
            onClick={() => setCurrentStep(2)}
            className="flex items-center text-amber-600 hover:text-amber-800 mb-4"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Service Selection
          </button>
          
          <div className="flex items-center mb-6">
            <img 
              src={selectedBarber.avatar} 
              alt={selectedBarber.name} 
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">Select a Time with {selectedBarber.name}</h2>
              <p className="text-gray-600 text-sm">
                {selectedService.name} ({selectedService.duration} min) - ${selectedService.price}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => handleDateChange(-1)}
                className="flex items-center text-amber-600 hover:text-amber-800"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous Day
              </button>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <span className="font-medium">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
              
              <button 
                onClick={() => handleDateChange(1)}
                className="flex items-center text-amber-600 hover:text-amber-800"
              >
                Next Day
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold mb-4">Available Time Slots</h3>
              
              {timeSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      disabled={!slot.available}
                      onClick={() => slot.available && handleTimeSelect(slot.time)}
                      className={`
                        py-2 px-3 rounded-md text-center transition
                        ${selectedTime === slot.time ? 'bg-amber-600 text-white' : ''}
                        ${slot.available 
                          ? 'hover:bg-amber-100 border border-gray-200' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                      `}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No available time slots for this date.</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Step 4: Confirmation */}
      {currentStep === 4 && selectedBarber && selectedService && selectedTime && (
        <div>
          <button 
            onClick={() => setCurrentStep(3)}
            className="flex items-center text-amber-600 hover:text-amber-800 mb-4"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Time Selection
          </button>
          
          <h2 className="text-xl font-semibold mb-6">Confirm Your Appointment</h2>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-semibold mb-4">Appointment Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-24 text-gray-600">Barber:</div>
                <div className="flex items-center">
                  <img 
                    src={selectedBarber.avatar} 
                    alt={selectedBarber.name} 
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <span className="font-medium">{selectedBarber.name}</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-gray-600">Service:</div>
                <div className="font-medium">{selectedService.name}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-gray-600">Duration:</div>
                <div>{selectedService.duration} minutes</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-gray-600">Price:</div>
                <div className="font-medium">${selectedService.price}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-gray-600">Date:</div>
                <div>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 text-gray-600">Time:</div>
                <div>{selectedTime}</div>
              </div>
              
              {currentUser && (
                <div className="flex items-center">
                  <div className="w-24 text-gray-600">Customer:</div>
                  <div>{currentUser.name}</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleBookAppointment}
              className="flex items-center bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium transition"
            >
              <Check className="h-5 w-5 mr-2" />
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
