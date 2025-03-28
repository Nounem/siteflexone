import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
      <p className="mb-6 text-gray-600">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <Link 
        to="/" 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;