import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gymService from '../services/gymService.ts';
import { Gym } from '../lib/types';

const AdminGymList: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadGyms();
  }, []);

  const loadGyms = () => {
    setLoading(true);
    try {
      // Initialiser le service si nécessaire (chargement des données de démo)
      gymService.initialize();
      
      // Récupérer toutes les salles
      const allGyms = gymService.getAllGyms();
      setGyms(allGyms);
    } catch (err) {
      setError('Erreur lors du chargement des salles de sport');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = (id: string) => {
    try {
      const success = gymService.deleteGym(id);
      if (success) {
        loadGyms();
      } else {
        setError("Impossible de supprimer cette salle de sport");
      }
      setDeleteConfirm(null);
    } catch (err) {
      setError('Erreur lors de la suppression de la salle de sport');
      console.error(err);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      // Si on clique sur le même champ, on inverse la direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Sinon, on change de champ et on commence par ascendant
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtrer et trier les salles
  const filteredAndSortedGyms = React.useMemo(() => {
    let filtered = [...gyms];
    
    // Filtrer par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(gym => 
        gym.name.toLowerCase().includes(term) || 
        gym.city.toLowerCase().includes(term) ||
        gym.address.toLowerCase().includes(term)
      );
    }
    
    // Trier
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'city':
          comparison = a.city.localeCompare(b.city);
          break;
        case 'price':
          // Trier par le prix le plus bas de chaque salle
          const priceA = a.plans.length > 0 ? Math.min(...a.plans.map(p => p.price)) : 0;
          const priceB = b.plans.length > 0 ? Math.min(...b.plans.map(p => p.price)) : 0;
          comparison = priceA - priceB;
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [gyms, searchTerm, sortField, sortDirection]);
  
  // Helper pour afficher les flèches de tri
  const getSortIcon = (field: string) => {
    if (field !== sortField) return null;
    
    return sortDirection === 'asc' 
      ? <span className="ml-1">↑</span> 
      : <span className="ml-1">↓</span>;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">Gestion des salles de sport</h1>
        <div className="flex space-x-2">
          <Link 
            to="/admin/import-export" 
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            title="Importer ou exporter des salles au format CSV"
          >
            Import / Export
          </Link>
          <Link 
            to="/admin/gyms/new" 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Ajouter une salle
          </Link>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Rechercher</label>
            <input
              type="text"
              id="search"
              placeholder="Rechercher par nom, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <Link 
            to="/admin/gyms" 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-center"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm('');
              setSortField('name');
              setSortDirection('asc');
            }}
          >
            Réinitialiser
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      {filteredAndSortedGyms.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded shadow">
          {searchTerm ? (
            <p>Aucune salle ne correspond à votre recherche.</p>
          ) : (
            <>
              <p>Aucune salle de sport n'a été ajoutée.</p>
              <Link 
                to="/admin/gyms/new" 
                className="mt-2 inline-block text-blue-600 hover:underline"
              >
                Ajoutez votre première salle
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Nom {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('city')}
                  >
                    <div className="flex items-center">
                      Ville {getSortIcon('city')}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left">Contact</th>
                  <th 
                    className="py-3 px-4 text-right cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center justify-end">
                      Prix min. {getSortIcon('price')}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-center cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center justify-center">
                      Note {getSortIcon('rating')}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedGyms.map((gym) => (
                  <tr key={gym.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          {gym.images && gym.images.length > 0 ? (
                            <img 
                              src={gym.images[0]} 
                              alt={gym.name} 
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <Link to={`/admin/gyms/${gym.id}`} className="text-blue-600 hover:underline font-medium">
                            {gym.name}
                          </Link>
                          {gym.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Recommandé
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm">{gym.city}</div>
                        <div className="text-xs text-gray-500">{gym.zipCode}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">{gym.contact.phone}</div>
                      <div className="text-xs text-gray-500">{gym.contact.email}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {gym.plans && gym.plans.length > 0 ? (
                        <div>
                          <div className="text-sm font-medium">
                            {Math.min(...gym.plans.map(p => p.price)).toFixed(2)} €
                          </div>
                          <div className="text-xs text-gray-500">
                            {gym.plans.length} forfait{gym.plans.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Pas de forfait</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {gym.rating ? (
                        <div className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1">{gym.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {deleteConfirm === gym.id ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => confirmDelete(gym.id)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center space-x-2">
                          <Link
                            to={`/admin/gyms/${gym.id}`}
                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            title="Modifier"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <Link
                            to={`/gyms/${gym.id}`}
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                            title="Voir"
                            target="_blank"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(gym.id)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            title="Supprimer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 border-t">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{filteredAndSortedGyms.length}</span> salle(s) sur <span className="font-medium">{gyms.length}</span> au total
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGymList;