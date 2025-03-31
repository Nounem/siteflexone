// src/components/layout/Layout.tsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button.tsx';
import { cn } from '../../lib/utils.ts';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="font-bebas text-2xl font-bold text-navy">FitConnect</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Accueil
            </Link>
            <Link 
              to="/find-gym" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/find-gym") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Trouver une salle
            </Link>
            <div className="relative group">
              <button className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link to="/services/particuliers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Pour les particuliers
                  </Link>
                  <Link to="/services/professionnels" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Pour les professionnels
                  </Link>
                  <Link to="/services/entreprises" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Pour les entreprises
                  </Link>
                </div>
              </div>
            </div>
            <Link 
              to="/a-propos" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/a-propos") ? "text-primary" : "text-muted-foreground"
              )}
            >
              À propos
            </Link>
            <Link 
              to="/contact" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/contact") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                Administration
              </Button>
            </Link>
            <Button size="sm">Connexion</Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 bg-white">
            <div className="container space-y-1">
              <Link
                to="/"
                className={cn(
                  "block py-2 px-3 rounded-md text-base font-medium hover:bg-gray-100",
                  isActive("/") ? "bg-gray-100 text-primary" : "text-gray-900"
                )}
                onClick={closeMenu}
              >
                Accueil
              </Link>
              <Link
                to="/find-gym"
                className={cn(
                  "block py-2 px-3 rounded-md text-base font-medium hover:bg-gray-100",
                  isActive("/find-gym") ? "bg-gray-100 text-primary" : "text-gray-900"
                )}
                onClick={closeMenu}
              >
                Trouver une salle
              </Link>
              <div className="py-2 px-3">
                <button className="flex items-center w-full text-left text-base font-medium text-gray-900">
                  Services
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="pl-4 mt-1 space-y-1">
                  <Link
                    to="/services/particuliers"
                    className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    Pour les particuliers
                  </Link>
                  <Link
                    to="/services/professionnels"
                    className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    Pour les professionnels
                  </Link>
                  <Link
                    to="/services/entreprises"
                    className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    Pour les entreprises
                  </Link>
                </div>
              </div>
              <Link
                to="/a-propos"
                className={cn(
                  "block py-2 px-3 rounded-md text-base font-medium hover:bg-gray-100",
                  isActive("/a-propos") ? "bg-gray-100 text-primary" : "text-gray-900"
                )}
                onClick={closeMenu}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className={cn(
                  "block py-2 px-3 rounded-md text-base font-medium hover:bg-gray-100",
                  isActive("/contact") ? "bg-gray-100 text-primary" : "text-gray-900"
                )}
                onClick={closeMenu}
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/admin"
                  className="block py-2 px-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Administration
                </Link>
                <button
                  className="w-full text-left block py-2 px-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Connexion
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center space-x-2">
                <span className="font-bebas text-xl font-bold text-navy">FitConnect</span>
              </Link>
              <p className="mt-3 text-sm text-gray-600">
                La plateforme qui connecte les salles de sport avec les sportifs.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-900 mb-3">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-gray-900">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link to="/find-gym" className="text-gray-600 hover:text-gray-900">
                    Trouver une salle
                  </Link>
                </li>
                <li>
                  <Link to="/a-propos" className="text-gray-600 hover:text-gray-900">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-900 mb-3">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/services/particuliers" className="text-gray-600 hover:text-gray-900">
                    Pour les particuliers
                  </Link>
                </li>
                <li>
                  <Link to="/services/professionnels" className="text-gray-600 hover:text-gray-900">
                    Pour les professionnels
                  </Link>
                </li>
                <li>
                  <Link to="/services/entreprises" className="text-gray-600 hover:text-gray-900">
                    Pour les entreprises
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-900 mb-3">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/mentions-legales" className="text-gray-600 hover:text-gray-900">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link to="/confidentialite" className="text-gray-600 hover:text-gray-900">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/conditions" className="text-gray-600 hover:text-gray-900">
                    Conditions d'utilisation
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} FitConnect. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;