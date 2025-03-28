import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const location = useLocation();

  // Fonction pour vérifier si un lien est actif
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Administration</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link
                to="/admin/dashboard"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive('/admin/dashboard') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                <span className="mx-3">Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/gyms"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive('/admin/gyms') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                <span className="mx-3">Salles de sport</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive('/admin/users') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                <span className="mx-3">Utilisateurs</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reviews"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive('/admin/reviews') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                <span className="mx-3">Avis</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/import-export"
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive('/admin/import-export') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                <span className="mx-3">Import / Export</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                {location.pathname.includes('/admin/gyms') && 'Gestion des salles de sport'}
                {location.pathname.includes('/admin/users') && 'Gestion des utilisateurs'}
                {location.pathname.includes('/admin/reviews') && 'Gestion des avis'}
                {location.pathname.includes('/admin/dashboard') && 'Tableau de bord'}
                {location.pathname.includes('/admin/import-export') && 'Import / Export de données'}
              </h2>
              <Link 
                to="/" 
                className="text-blue-600 hover:text-blue-800"
              >
                Retour au site
              </Link>
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;