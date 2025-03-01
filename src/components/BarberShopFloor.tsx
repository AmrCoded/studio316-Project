import React, { useState } from 'react';
import BarberChair from './BarberChair';
import { Barber } from '../types';
import { useAppointments } from '../contexts/AppointmentContext';

const BarberShopFloor: React.FC = () => {
  const { barbers } = useAppointments();
  const [expandedBarberId, setExpandedBarberId] = useState<string | null>(null);
  
  const handleBarberClick = (barberId: string) => {
    setExpandedBarberId(expandedBarberId === barberId ? null : barberId);
  };
  
  return (
    <div className="relative w-full h-[500px] bg-gray-100 rounded-lg border border-gray-300 overflow-hidden">
      {/* Shop Background */}
      <div className="absolute inset-0 p-4">
        {/* Shop Elements */}
        <div className="absolute top-0 left-0 w-full h-12 bg-gray-800 flex items-center justify-center">
          <span className="text-white font-semibold">Reception</span>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-600 font-semibold">Waiting Area</span>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-5 w-10 h-20 bg-gray-300 rounded"></div>
        <div className="absolute top-20 right-5 w-10 h-20 bg-gray-300 rounded"></div>
        <div className="absolute bottom-24 left-1/4 w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="absolute bottom-24 right-1/4 w-8 h-8 bg-gray-300 rounded-full"></div>
        
        {/* Legend */}
        <div className="absolute top-2 right-2 bg-white p-2 rounded shadow-sm text-xs">
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span>On Break</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
            <span>Off Duty</span>
          </div>
        </div>
      </div>
      
      {/* Barber Chairs */}
      {barbers.map(barber => (
        <BarberChair 
          key={barber.id} 
          barber={barber} 
          onClick={() => handleBarberClick(barber.id)}
        />
      ))}
    </div>
  );
};

export default BarberShopFloor;
