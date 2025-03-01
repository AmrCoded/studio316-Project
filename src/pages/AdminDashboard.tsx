import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Scissors, Calendar, Clock, BarChart3, Settings, ChevronDown, ChevronUp, Edit, Trash } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../contexts/AppointmentContext';
import { format, parseISO } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { barbers, services, appointments, updateBarberStatus } = useAppointments();
  const [activeTab, setActiveTab] = useState<'overview' | 'barbers' | 'services' | 'appointments'>('overview');
  const [expandedBarber, setExpandedBarber] = useState<string | null>(null);
  
  // Redirect if not logged in or not admin
  if (!isAuthenticated || !currentUser?.isAdmin) {
    return <Navigate to="/" />;
  }
  
  const toggleBarberExpand = (barberId: string) => {
    setExpandedBarber(expandedBarber === barberId ? null : barberId);
  };
  
  const handleStatusChange = (barberId: string, status: 'available' | 'occupied' | 'break' | 'off') => {
    updateBarberStatus(barberId, status);
  };
  
  // Calculate some stats for the overview
  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(app => app.status === 'confirmed').length;
  const cancelledAppointments = appointments.filter(app => app.status === 'cancelled').length;
  const todayAppointments = appointments.filter(app => app.date === format(new Date(), 'yyyy-MM-dd')).length;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage your barbershop, barbers, services, and appointments
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="font-semibold">Dashboard Menu</div>
            </div>
            
            <nav className="p-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center p-3 rounded-md ${
                  activeTab === 'overview' ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                <span>Overview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('barbers')}
                className={`w-full flex items-center p-3 rounded-md ${
                  activeTab === 'barbers' ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50'
                }`}
              >
                <Users className="h-5 w-5 mr-3" />
                <span>Barbers</span>
              </button>
              
              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center p-3 rounded-md ${
                  activeTab === 'services' ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50'
                }`}
              >
                <Scissors className="h-5 w-5 mr-3" />
                <span>Services</span>
              </button>
              
              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full flex items-center p-3 rounded-md ${
                  activeTab === 'appointments' ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-5 w-5 mr-3" />
                <span>Appointments</span>
              </button>
              
              <button
                className="w-full flex items-center p-3 rounded-md hover:bg-gray-50"
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-2xl font-bold">{totalAppointments}</span>
                  </div>
                  <div className="text-gray-600">Total Appointments</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <span className="text-2xl font-bold">{confirmedAppointments}</span>
                  </div>
                  <div className="text-gray-600">Confirmed Appointments</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <Trash className="h-6 w-6 text-red-600" />
                    </div>
                    <span className="text-2xl font-bold">{cancelledAppointments}</span>
                  </div>
                  <div className="text-gray-600">Cancelled Appointments</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-amber-600" />
                    </div>
                    <span className="text-2xl font-bold">{todayAppointments}</span>
                  </div>
                  <div className="text-gray-600">Today's Appointments</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold mb-4">Barber Status</h3>
                  
                  <div className="space-y-4">
                    {barbers.map(barber => (
                      <div key={barber.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={barber.avatar} 
                            alt={barber.name} 
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <div className="font-medium">{barber.name}</div>
                            <div className="text-sm text-gray-600">
                              {barber.specialties[0]}, {barber.specialties[1]}...
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            barber.status === 'available' ? 'bg-green-500' :
                            barber.status === 'occupied' ? 'bg-red-500' :
                            barber.status === 'break' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-sm">
                            {barber.status === 'available' ? 'Available' :
                             barber.status === 'occupied' ? 'Occupied' :
                             barber.status === 'break' ? 'On Break' : 'Off Duty'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold mb-4">Recent Appointments</h3>
                  
                  <div className="space-y-4">
                    {appointments.slice(0, 5).map(appointment => {
                      const appointmentBarber = barbers.find(b => b.id === appointment.barberId);
                      const appointmentService = services.find(s => s.id === appointment.serviceId);
                      
                      if (!appointmentBarber || !appointmentService) return null;
                      
                      return (
                        <div key={appointment.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded-full mr-3">
                              <Calendar className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">{appointmentService.name}</div>
                              <div className="text-sm text-gray-600">
                                {format(parseISO(`${appointment.date}T${appointment.time}`), 'MMM d, h:mm a')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <img 
                              src={appointmentBarber.avatar} 
                              alt={appointmentBarber.name} 
                              className="w-8 h-8 rounded-full object-cover mr-2"
                            />
                            <span className="text-sm">{appointmentBarber.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Barbers Tab */}
          {activeTab === 'barbers' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Manage Barbers</h2>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Add New Barber
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium">
                  <div className="col-span-2">Barber</div>
                  <div>Status</div>
                  <div>Specialties</div>
                  <div>Actions</div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {barbers.map(barber => (
                    <div key={barber.id}>
                      <div className="grid grid-cols-5 gap-4 p-4 items-center">
                        <div className="col-span-2 flex items-center">
                          <img 
                            src={barber.avatar} 
                            alt={barber.name} 
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <div className="font-medium">{barber.name}</div>
                            <div className="text-sm text-gray-600 truncate max-w-xs">
                              {barber.bio.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <select
                            value={barber.status}
                            onChange={(e) => handleStatusChange(barber.id, e.target.value as any)}
                            className="border border-gray-300 rounded-md text-sm p-1"
                          >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="break">On Break</option>
                            <option value="off">Off Duty</option>
                          </select>
                        </div>
                        
                        <div>
                          <div className="flex flex-wrap gap-1">
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
                                +{barber.specialties.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            className="p-1 text-gray-600 hover:text-gray-800"
                            onClick={() => toggleBarberExpand(barber.id)}
                          >
                            {expandedBarber === barber.id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {expandedBarber === barber.id && (
                        <div className="p-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Barber Details</h4>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-gray-600 text-sm">Full Bio:</span>
                                  <p className="text-sm">{barber.bio}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600 text-sm">All Specialties:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
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
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Chair Position</h4>
                              <div className="flex items-center space-x-4">
                                <div>
                                  <span className="text-gray-600 text-sm">X Position:</span>
                                  <input 
                                    type="number" 
                                    value={barber.position.x}
                                    className="block w-20 border border-gray-300 rounded-md text-sm p-1 mt-1"
                                  />
                                </div>
                                <div>
                                  <span className="text-gray-600 text-sm">Y Position:</span>
                                  <input 
                                    type="number" 
                                    value={barber.position.y}
                                    className="block w-20 border border-gray-300 rounded-md text-sm p-1 mt-1"
                                  />
                                </div>
                                <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-md text-sm">
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Manage Services</h2>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Add New Service
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium">
                  <div className="col-span-2">Service</div>
                  <div>Duration</div>
                  <div>Price</div>
                  <div>Actions</div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {services.map(service => (
                    <div key={service.id} className="grid grid-cols-5 gap-4 p-4 items-center">
                      <div className="col-span-2">
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-600">{service.description}</div>
                      </div>
                      
                      <div>{service.duration} min</div>
                      
                      <div>${service.price}</div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800">
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Manage Appointments</h2>
                <div className="flex space-x-2">
                  <select className="border border-gray-300 rounded-md text-sm p-2">
                    <option value="all">All Appointments</option>
                    <option value="today">Today</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                  <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Create Appointment
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium">
                  <div>Date & Time</div>
                  <div>Customer</div>
                  <div>Barber</div>
                  <div>Service</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {appointments.map(appointment => {
                    const appointmentBarber = barbers.find(b => b.id === appointment.barberId);
                    const appointmentService = services.find(s => s.id === appointment.serviceId);
                    
                    if (!appointmentBarber || !appointmentService) return null;
                    
                    return (
                      <div key={appointment.id} className="grid grid-cols-6 gap-4 p-4 items-center">
                        <div>
                          <div className="font-medium">
                            {format(parseISO(`${appointment.date}T${appointment.time}`), 'MMM d, yyyy')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {format(parseISO(`${appointment.date}T${appointment.time}`), 'h:mm a')}
                          </div>
                        </div>
                        
                        <div>Customer #{appointment.userId.replace('user', '')}</div>
                        
                        <div className="flex items-center">
                          <img 
                            src={appointmentBarber.avatar} 
                            alt={appointmentBarber.name} 
                            className="w-8 h-8 rounded-full object-cover mr-2"
                          />
                          <span>{appointmentBarber.name}</span>
                        </div>
                        
                        <div>{appointmentService.name}</div>
                        
                        <div>
                          <span className={`
                            text-xs px-2 py-1 rounded-full
                            ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'}
                          `}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-800">
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
