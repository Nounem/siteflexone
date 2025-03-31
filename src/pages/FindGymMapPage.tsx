import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Filter, Star, Search, ChevronDown, Check, 
  ArrowUpDown, Dumbbell, SlidersHorizontal, X 
} from 'lucide-react';
import { formatPrice, truncateText, getUniqueCities, getUniqueAmenities } from '../lib/utils.ts';
import useGyms from '../hooks/useGyms.ts';
import { Gym, FilterOptions } from '../lib/types.ts';
import GymMap from '../components/map/GymMap.tsx';
import SectionTitle from '../components/ui/SectionTitle.tsx';

const FindGymMapPage: React.FC = () => {
  const { gyms, filteredGyms, filterGyms, isLoading } = useGyms();
  
  // États pour les filtres et la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>('default');
  const [cities, setCities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<number>(0);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Récupérer les villes et équipements uniques
  useEffect(() => {
    if (gyms.length > 0) {
      setCities(getUniqueCities(gyms));
      setAmenities(getUniqueAmenities(gyms));
    }
  }, [gyms]);
  
  // Fonction pour mettre à jour le nombre de filtres actifs
  useEffect(() => {
    let count = 0;
    if (selectedCity) count++;
    if (selectedAmenities.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 200) count++;
    if (minRating > 0) count++;
    
    setActiveFilters(count);
  }, [selectedCity, selectedAmenities, priceRange, minRating]);
  
  // Fonction pour appliquer les filtres
  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    const options: FilterOptions = {};
    
    if (selectedCity && selectedCity !== 'all') {
      options.city = selectedCity;
    }
    
    if (selectedAmenities.length > 0) {
      options.amenities = selectedAmenities;
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 200) {
      options.priceRange = {
        min: priceRange[0],
        max: priceRange[1]
      };
    }
    
    if (minRating > 0) {
      options.rating = minRating;
    }
    
    filterGyms(options);
  };
  
  // Appliquer les filtres lorsqu'ils changent
  useEffect(() => {
    applyFilters();
  }, [selectedCity, selectedAmenities, priceRange, minRating]);
  
  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSelectedCity('');
    setSelectedAmenities([]);
    setPriceRange([0, 200]);
    setMinRating(0);
    filterGyms({});
  };
  
  // Fonction pour ajouter/supprimer un équipement de la sélection
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  // Fonction pour trier les salles
  const sortGyms = (gyms: Gym[]): Gym[] => {
    switch (sortOption) {
      case 'price-asc':
        return [...gyms].sort((a, b) => {
          const minPriceA = Math.min(...a.plans.map(plan => plan.price));
          const minPriceB = Math.min(...b.plans.map(plan => plan.price));
          return minPriceA - minPriceB;
        });
      case 'price-desc':
        return [...gyms].sort((a, b) => {
          const minPriceA = Math.min(...a.plans.map(plan => plan.price));
          const minPriceB = Math.min(...b.plans.map(plan => plan.price));
          return minPriceB - minPriceA;
        });
      case 'rating-desc':
        return [...gyms].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'name-asc':
        return [...gyms].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return gyms;
    }
  };
  
  // Filtrer par recherche textuelle
  const filterBySearch = (gyms: Gym[]): Gym[] => {
    if (!searchQuery) return gyms;
    
    const query = searchQuery.toLowerCase();
    return gyms.filter(gym => 
      gym.name.toLowerCase().includes(query) || 
      gym.description.toLowerCase().includes(query) ||
      gym.city.toLowerCase().includes(query) ||
      gym.amenities.some(amenity => amenity.toLowerCase().includes(query))
    );
  };
  
  // Combiner les fonctions de filtrage et de tri
  const displayedGyms = sortGyms(filterBySearch(filteredGyms));

  // Sélectionner une salle
  const handleGymSelect = (gymId: string) => {
    setSelectedGymId(gymId);
    // Trouver la salle sélectionnée
    const selectedGym = displayedGyms.find(gym => gym.id === gymId);
    if (selectedGym) {
      // Peut-être scroll vers la salle dans la liste
      const element = document.getElementById(`gym-${gymId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de la page */}
      <div className="bg-[#002875] py-12 px-4">
        <div className="container mx-auto">
          <SectionTitle 
            title="Trouvez votre salle idéale"
            subtitle="Carte interactive"
            className="text-white"
          />
          
          {/* Barre de recherche */}
          <div className="relative max-w-2xl mx-auto mt-8">
            <input
              type="text"
              placeholder="Rechercher une salle de sport, une ville, un équipement..."
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61dafb]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
      </div>
      
      {/* Barre d'interrupteur liste/carte (mobile) */}
      <div className="bg-white border-b sticky top-0 z-30 md:hidden">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded ${viewMode === 'list' ? 'bg-[#002875] text-white' : 'bg-gray-100'}`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded ${viewMode === 'map' ? 'bg-[#002875] text-white' : 'bg-gray-100'}`}
              >
                Carte
              </button>
            </div>
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="p-2 bg-gray-100 rounded"
            >
              <Filter className="h-5 w-5" />
              {activeFilters > 0 && (
                <span className="absolute top-0 right-0 bg-[#61dafb] text-[#002875] text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtres (Desktop) */}
          <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0 md:sticky md:top-24 h-fit`}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-[#002875]">Filtres</h2>
                {activeFilters > 0 && (
                  <button 
                    onClick={resetFilters}
                    className="text-sm border border-gray-300 px-2 py-1 rounded hover:bg-gray-50"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 text-[#002875]">Ville</h3>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#61dafb]"
                  >
                    <option value="all">Toutes les villes</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3 text-[#002875]">Équipements</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`amenity-${amenity}`}
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="h-4 w-4 text-[#61dafb] focus:ring-[#61dafb]"
                        />
                        <label
                          htmlFor={`amenity-${amenity}`}
                          className="ml-2 text-sm font-medium text-gray-700"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3 text-[#002875]">Prix mensuel</h3>
                  <div className="px-2 pt-5 pb-2">
                    <input 
                      type="range"
                      min="0"
                      max="200"
                      step="5"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-[#61dafb]"
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3 text-[#002875]">Note minimale</h3>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <button
                        key={rating}
                        className={`px-3 py-1 rounded ${minRating > rating ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setMinRating(rating + 1)}
                      >
                        {rating + 1} <Star className="inline-block ml-1 h-3 w-3" fill={minRating > rating ? "white" : "none"} />
                      </button>
                    ))}
                  </div>
                  {minRating > 0 && (
                    <button
                      onClick={() => setMinRating(0)}
                      className="text-sm text-[#002875] mt-2 hover:underline"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
              </div>
              
              {/* Bouton pour fermer les filtres en mobile */}
              <div className="mt-6 md:hidden">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full py-2 bg-[#002875] text-white rounded"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>
          
          {/* Layout flexible pour liste et carte */}
          <div className="flex-1 flex flex-col md:flex-row gap-6 relative">
            {/* Liste des salles */}
            <div className={`${viewMode === 'map' ? 'hidden' : 'block'} md:block ${viewMode === 'list' ? 'w-full' : ''} md:w-1/2 md:max-h-[calc(100vh-200px)] md:overflow-y-auto`}>
              {/* Barre d'informations */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 sticky top-0 z-20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <p className="text-gray-700">
                    {displayedGyms.length} résultat{displayedGyms.length !== 1 ? 's' : ''}
                    {selectedCity && ` à ${selectedCity}`}
                  </p>
                  
                  <div className="flex items-center">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="default">Tri par défaut</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                      <option value="rating-desc">Meilleures notes</option>
                      <option value="name-asc">Ordre alphabétique</option>
                    </select>
                  </div>
                </div>
                
                {/* Filtres actifs */}
                {activeFilters > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCity && (
                      <div className="bg-blue-100 text-[#002875] text-xs px-3 py-1 rounded-full flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {selectedCity}
                        <button 
                          onClick={() => setSelectedCity('')}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    
                    {selectedAmenities.map(amenity => (
                      <div key={amenity} className="bg-blue-100 text-[#002875] text-xs px-3 py-1 rounded-full flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        {amenity}
                        <button 
                          onClick={() => toggleAmenity(amenity)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    {(priceRange[0] > 0 || priceRange[1] < 200) && (
                      <div className="bg-blue-100 text-[#002875] text-xs px-3 py-1 rounded-full flex items-center">
                        <span>{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
                        <button 
                          onClick={() => setPriceRange([0, 200])}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    
                    {minRating > 0 && (
                      <div className="bg-blue-100 text-[#002875] text-xs px-3 py-1 rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {minRating}+
                        <button 
                          onClick={() => setMinRating(0)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                      <div className="flex">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                        <div className="ml-4 flex-1">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayedGyms.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
                  <p className="text-gray-600 mb-4">
                    Nous n'avons pas trouvé de salles correspondant à vos critères.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-[#002875] text-white px-4 py-2 rounded hover:bg-opacity-90"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedGyms.map((gym) => (
                    <div 
                      key={gym.id} 
                      id={`gym-${gym.id}`}
                      className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${selectedGymId === Number(gym.id) ? 'ring-2 ring-[#61dafb]' : ''}`}
                      onClick={() => handleGymSelect(gym.id)}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/3 h-48 sm:h-auto bg-gray-200 relative">
                          {gym.images && gym.images.length > 0 ? (
                            <img 
                              src={gym.images[0]} 
                              alt={gym.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <Dumbbell className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          {gym.featured && (
                            <div className="absolute top-2 right-2 bg-[#61dafb] text-[#002875] py-1 px-3 rounded-full text-xs font-medium">
                              Recommandé
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 sm:w-2/3">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold mb-1 text-[#002875]">{gym.name}</h3>
                            {gym.rating && (
                              <div className="flex items-center text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="ml-1 text-sm">{gym.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-500 text-sm mb-2 flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {gym.address}, {gym.zipCode} {gym.city}
                          </p>
                          
                          <p className="text-gray-600 mb-3">{truncateText(gym.description, 120)}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {gym.amenities.slice(0, 3).map((amenity, i) => (
                              <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                {amenity}
                              </span>
                            ))}
                            {gym.amenities.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                +{gym.amenities.length - 3}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className="text-[#002875] font-medium">
                              À partir de {formatPrice(Math.min(...gym.plans.map(plan => plan.price)))} / mois
                            </p>
                            <Link 
                              to={`/gyms/${gym.id}`}
                              className="bg-[#002875] text-white px-4 py-2 rounded hover:bg-opacity-90 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Voir détails
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Carte */}
            <div 
              className={`${viewMode === 'list' ? 'hidden' : 'block'} md:block ${viewMode === 'map' ? 'w-full' : ''} md:w-1/2 h-[70vh] md:h-[calc(100vh-200px)] sticky top-[100px]`}
            >
              <div className="bg-white rounded-lg shadow-sm p-0 h-full overflow-hidden">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#61dafb]"></div>
                  </div>
                ) : displayedGyms.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center p-6">
                      <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucune salle à afficher sur la carte</p>
                    </div>
                  </div>
                ) : (
                  <GymMap 
                    gyms={displayedGyms} 
                    onGymSelect={handleGymSelect}
                    selectedGymId={selectedGymId || undefined}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindGymMapPage;