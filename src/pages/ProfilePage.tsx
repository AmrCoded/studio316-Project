import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Phone, Mail, Scissors, Calendar, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../contexts/AppointmentContext';
import AppointmentCard from '../components/AppointmentCard';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { getUserAppointments, barbers, services, cancelAppointment } = useAppointments();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const userAppointments = getUserAppointments();
  const now = new Date();
  
  const upcomingAppointments = userAppointments.filter(app => {
    const appointmentDate = new Date(`${app.date}T${app.time}`);
    return appointmentDate > now && app.status !== 'cancelled';
  });
  
  const pastAppointments = userAppointments.filter(app => {
    const appointmentDate = new Date(`${app.date}T${app.time}`);
    return appointmentDate <= now || app.status === 'cancelled';
  });
  
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId);
    } catch (error) {
      toast.error('Failed to cancel appointment');
      console.error(error);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your profile and appointments
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="bg-amber-100 p-3 rounded-full mr-4">
                <User className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{currentUser?.name}</h2>
                <p className="text-gray-600">Customer</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span>{currentUser?.email}</span>
              </div>
              
              {currentUser?.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{currentUser.phone}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold mb-2">Account Settings</h3>
              <button className="text-amber-600 hover:text-amber-800 text-sm">
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Scissors className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-semibold">Preferred Barber</h3>
            </div>
            
            {currentUser?.preferredBarberId ? (
              <div className="flex items-center">
                {barbers.map(barber => 
                  barber.id === currentUser.preferredBarberId && (
                    <div key={barber.id} className="flex items-center">
                      <img 
                        src={barber.avatar} 
                        alt={barber.name} 
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium">{barber.name}</div>
                        <button className="text-amber-600 hover:text-amber-800 text-sm">
                          Change
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div>
                <p className="text-gray-600 text-sm mb-2">
                  You haven't selected a preferred barber yet.
                </p>
                <button className="text-amber-600 hover:text-amber-800 text-sm">
                  Select Preferred Barber
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'upcoming' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming Appointments
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'past' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('past')}
              >
                Past Appointments
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'upcoming' && (
                <>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map(appointment => {
                        const appointmentBarber = barbers.find(b => b.id === appointment.barberId);
                        const appointmentService = services.find(s => s.id === appointment.serviceId);
                        
                        if (!appointmentBarber || !appointmentService) return null;
                        
                        return (
                          <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            barber={appointmentBarber}
                            service={appointmentService}
                            onCancel={() => handleCancelAppointment(appointment.id)}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                      <p className="text-gray-600 mb-4">You don't have any upcoming appointments scheduled.</p>
                      <a 
                        href="/booking" 
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                      >
                        Book an Appointment
                      </a>
                    </div>
                  )}
                </>
              )}
              
              {activeTab === 'past' && (
                <>
                  {pastAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {pastAppointments.map(appointment => {
                        const appointmentBarber = barbers.find(b => b.id === appointment.barberId);
                        const appointmentService = services.find(s => s.id === appointment.serviceId);
                        
                        if (!appointmentBarber || !appointmentService) return null;
                        
                        return (
                          <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            barber={appointmentBarber}
                            service={appointmentService}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No past appointments</h3>
                      <p className="text-gray-600">You don't have any past appointment history.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
