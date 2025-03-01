import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Scissors className="h-8 w-8 text-amber-500 mr-2" />
              <span className="text-xl font-bold">Studio316</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-gray-800 transition">Home</Link>
            <Link to="/booking" className="px-3 py-2 rounded-md hover:bg-gray-800 transition">Book Now</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="px-3 py-2 rounded-md hover:bg-gray-800 transition">My Profile</Link>
                {currentUser?.isAdmin && (
                  <Link to="/admin" className="px-3 py-2 rounded-md bg-amber-600 hover:bg-amber-700 transition">Admin</Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md hover:bg-gray-800 transition">Login</Link>
                <Link to="/register" className="px-3 py-2 rounded-md bg-amber-600 hover:bg-amber-700 transition">Sign Up</Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md hover:bg-gray-800 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/booking" 
              className="block px-3 py-2 rounded-md hover:bg-gray-800 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Now
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md hover:bg-gray-800 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </div>
                </Link>
                {currentUser?.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block px-3 py-2 rounded-md bg-amber-600 hover:bg-amber-700 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-3 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md hover:bg-gray-800 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md bg-amber-600 hover:bg-amber-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
