import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Vérifier si un lien est actif
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#002875]">
            FitConnect
          </Link>
          
          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-[#002875] ${isActive('/') ? 'text-[#002875] font-medium' : ''}`}
            >
              Accueil
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-[#002875] focus:outline-none">
                Trouver une salle
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                <Link 
                  to="/find-gym" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Vue liste
                </Link>
                <Link 
                  to="/find-gym-map" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Carte interactive
                </Link>
              </div>
            </div>
            <Link 
              to="/services" 
              className={`text-gray-700 hover:text-[#002875] ${isActive('/services') ? 'text-[#002875] font-medium' : ''}`}
            >
              Services
            </Link>
            <Link 
              to="/contact" 
              className={`text-gray-700 hover:text-[#002875] ${isActive('/contact') ? 'text-[#002875] font-medium' : ''}`}
            >
              Contact
            </Link>
          </nav>
          
          {/* Bouton d'action */}
          <div className="hidden md:block">
            <Link 
              to="/register"
              className="bg-[#002875] text-white px-4 py-2 rounded hover:bg-opacity-90"
            >
              Inscription
            </Link>
          </div>
          
          {/* Bouton mobile menu */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-[#002875] focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pb-4 shadow-lg">
          <nav className="container mx-auto px-4 space-y-3">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-[#002875]"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <div>
              <Link 
                to="/find-gym" 
                className="block py-2 text-gray-700 hover:text-[#002875]"
                onClick={() => setIsMenuOpen(false)}
              >
                Trouver une salle (liste)
              </Link>
              <Link 
                to="/find-gym-map" 
                className="block py-2 text-gray-700 hover:text-[#002875] pl-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Carte interactive
              </Link>
            </div>
            <Link 
              to="/services" 
              className="block py-2 text-gray-700 hover:text-[#002875]"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 text-gray-700 hover:text-[#002875]"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div>
              <Link 
                to="/register"
                className="block py-2 bg-[#002875] text-white px-4 rounded hover:bg-opacity-90 text-center mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Inscription
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;