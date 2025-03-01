import React from 'react';
import { Scissors, Clock, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <Scissors className="h-8 w-8 text-amber-500 mr-2" />
              <span className="text-xl font-bold">Studio316</span>
            </div>
            <p className="text-gray-400 mb-4">
              Premium barbershop services with skilled professionals dedicated to giving you the perfect look.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-white transition">Book Appointment</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition">My Profile</Link>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-white transition">Services</a>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Classic Haircuts</li>
              <li className="text-gray-400">Modern Fades</li>
              <li className="text-gray-400">Beard Trims</li>
              <li className="text-gray-400">Hot Towel Shaves</li>
              <li className="text-gray-400">Kids Haircuts</li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <span className="text-gray-400">123 Barber Street, Downtown, City, 12345</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-gray-400">(555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div className="text-gray-400">
                  <div>Mon-Fri: 9:00 AM - 8:00 PM</div>
                  <div>Sat: 9:00 AM - 6:00 PM</div>
                  <div>Sun: 10:00 AM - 4:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Studio316 Barbershop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
