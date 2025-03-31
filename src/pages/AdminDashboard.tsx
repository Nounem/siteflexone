import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import  gymService  from '../services/gymService.ts';
import { Gym } from '../lib/types.ts';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalGyms: 0,
    averagePrice: 0,
    citiesCount: 0,
    topRatedGym: null as Gym | null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const gyms = await gymService.getAllGyms();
        
        if (gyms.length === 0) {
          setStats({
            totalGyms: 0,
            averagePrice: 0,
            citiesCount: 0,
            topRatedGym: null,
          });
          setLoading(false);
          return;
        }

        // Calculer les statistiques
        const totalGyms = gyms.length;
        
        const totalPrice = gyms.reduce((sum, gym) => sum + gym.pricePerMonth, 0);
        const averagePrice = totalPrice / totalGyms;
        
        const cities = new Set(gyms.map(gym => gym.city));
        const citiesCount = cities.size;
        
        const topRatedGym = [...gyms].sort((a, b) => b.rating - a.rating)[0];

        setStats({
          totalGyms,
          averagePrice,
          citiesCount,
          topRatedGym,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total des salles */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500">Total des salles</p>
              <p className="text-2xl font-bold">{stats.totalGyms}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/gyms" className="text-blue-600 hover:underline text-sm">
              Voir toutes les salles →
            </Link>
          </div>
        </div>

        {/* Prix moyen */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500">Prix moyen</p>
              <p className="text-2xl font-bold">{stats.averagePrice.toFixed(2)} €</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-gray-500 text-sm">Abonnement mensuel</span>
          </div>
        </div>

        {/* Nombre de villes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500">Villes couvertes</p>
              <p className="text-2xl font-bold">{stats.citiesCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-gray-500 text-sm">Répartition géographique</span>
          </div>
        </div>

        {/* Salle la mieux notée */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500">Meilleure note</p>
              <p className="text-2xl font-bold">
                {stats.topRatedGym ? `${stats.topRatedGym.rating.toFixed(1)}/5` : 'N/A'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            {stats.topRatedGym ? (
              <Link to={`/gyms/${stats.topRatedGym.id}`} className="text-blue-600 hover:underline text-sm">
                {stats.topRatedGym.name} →
              </Link>
            ) : (
              <span className="text-gray-500 text-sm">Aucune salle notée</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Actions rapides</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/gyms/new" 
            className="flex items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter une salle
          </Link>
          <Link 
            to="/admin/users" 
            className="flex items-center justify-center p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Gérer les utilisateurs
          </Link>
          <Link 
            to="/admin/reviews" 
            className="flex items-center justify-center p-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Voir les avis
          </Link>
        </div>
      </div>

      {/* Salle la plus récente */}
      {stats.totalGyms > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium">Dernière salle ajoutée</h3>
          </div>
          <div className="p-6">
            {stats.topRatedGym && (
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  {stats.topRatedGym.imageUrl ? (
                    <img 
                      src={stats.topRatedGym.imageUrl} 
                      alt={stats.topRatedGym.name} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Pas d'image</span>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-2/3 md:pl-6">
                  <h4 className="text-xl font-medium mb-2">{stats.topRatedGym.name}</h4>
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{stats.topRatedGym.address}, {stats.topRatedGym.zipCode} {stats.topRatedGym.city}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{stats.topRatedGym.rating.toFixed(1)}/5 ({stats.topRatedGym.reviewCount} avis)</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {stats.topRatedGym.description.length > 150
                      ? `${stats.topRatedGym.description.substring(0, 150)}...`
                      : stats.topRatedGym.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stats.topRatedGym.amenities.map(amenity => (
                      <span key={amenity} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <Link 
                      to={`/admin/gyms/${stats.topRatedGym.id}`} 
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Modifier
                    </Link>
                    <Link 
                      to={`/gyms/${stats.topRatedGym.id}`} 
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;