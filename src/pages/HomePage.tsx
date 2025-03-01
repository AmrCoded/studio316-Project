import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Calendar, Star, Clock, ChevronRight } from 'lucide-react';
import BarberShopFloor from '../components/BarberShopFloor';
import { useAppointments } from '../contexts/AppointmentContext';

const HomePage: React.FC = () => {
  const { services, barbers } = useAppointments();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Premium Haircuts & Grooming at Studio316
              </h1>
              <p className="text-gray-300 text-lg mb-8">
                Experience the art of barbering with our skilled professionals. 
                Book your appointment today and elevate your style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/booking" 
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium transition flex items-center justify-center"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Now
                </Link>
                <a 
                  href="#shop-floor" 
                  className="border border-white hover:bg-white hover:text-gray-900 text-white px-6 py-3 rounded-md font-medium transition flex items-center justify-center"
                >
                  View Availability
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Barbershop" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Shop Floor Section */}
      <section id="shop-floor" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Barber Shop Floor</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              View our barber shop layout and check the real-time availability of our barbers. 
              Click on a chair to see more details and book an appointment.
            </p>
          </div>
          
          <BarberShopFloor />
          
          <div className="mt-8 text-center">
            <Link 
              to="/booking" 
              className="inline-flex items-center text-amber-600 hover:text-amber-800 font-medium"
            >
              View Full Schedule
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a wide range of premium barbering services to keep you looking your best.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="font-bold text-xl">${service.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Barbers Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Barbers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team of skilled professionals is dedicated to providing you with the best grooming experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {barbers.map(barber => (
              <div key={barber.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                <img 
                  src={barber.avatar} 
                  alt={barber.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{barber.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{barber.bio}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {barber.specialties.map((specialty, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <Link 
                    to={`/barber/${barber.id}`}
                    className="text-amber-600 hover:text-amber-800 font-medium flex items-center"
                  >
                    View Schedule
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Best haircut I've ever had! Mike really took the time to understand what I wanted and delivered perfectly."
              </p>
              <div className="font-semibold">- James Wilson</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The online booking system is so convenient. I love being able to see which barbers are available in real-time."
              </p>
              <div className="font-semibold">- Michael Thompson</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Sarah is amazing with beard trims! The hot towel service is a game-changer. Highly recommend Studio316."
              </p>
              <div className="font-semibold">- Robert Davis</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for a Fresh Look?</h2>
          <p className="text-amber-100 max-w-2xl mx-auto mb-8">
            Book your appointment today and experience the Studio316 difference.
          </p>
          <Link 
            to="/booking" 
            className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 rounded-md font-medium transition inline-flex items-center"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Book Your Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
