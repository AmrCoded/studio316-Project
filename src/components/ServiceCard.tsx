import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  isSelected?: boolean;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected = false, onClick }) => {
  return (
    <div 
      className={`
        border rounded-lg p-4 cursor-pointer transition-all
        ${isSelected 
          ? 'border-amber-500 bg-amber-50' 
          : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'}
      `}
      onClick={onClick}
    >
      <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
      <p className="text-gray-600 text-sm mb-3">{service.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{service.duration} min</span>
        </div>
        
        <div className="flex items-center font-semibold">
          <DollarSign className="h-4 w-4 text-amber-600" />
          <span>${service.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
