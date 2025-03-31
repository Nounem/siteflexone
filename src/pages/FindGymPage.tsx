import { Gym, FilterOptions } from '../lib/types.ts';
import useGyms from '../hooks/useGyms.ts';
import { formatPrice, truncateText, getUniqueCities, getUniqueAmenities } from '../lib/utils.ts';
import { Button } from '../components/ui/button.tsx';
import { Input } from '../components/ui/input.tsx';
import { Checkbox } from '../components/ui/checkbox.tsx';
import { Slider } from '../components/ui/slider.tsx';
import { 
  Search, Filter, MapPin, Star, ChevronDown, X, Dumbbell, 
  SlidersHorizontal, Check, ArrowUpDown 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion.tsx';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select.tsx';


type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'name-asc';

const FindGymPage = () => {
  const { gyms, filteredGyms, filterGyms, isLoading } = useGyms();
  
  // États pour les filtres et la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [cities, setCities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<number>(0);
  
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
  const applyFilters = () => {
    const options: FilterOptions = {};
    
    if (selectedCity) {
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de la page */}
      <div className="bg-navy py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bebas tracking-wide text-white mb-6">
            Trouvez votre salle de sport idéale
          </h1>
          <p className="text-blue-100 mb-8 max-w-2xl">
            Parcourez notre sélection de salles de sport et filtrez selon vos critères pour trouver l'établissement qui correspond à vos besoins.
          </p>
          
          {/* Barre de recherche */}
          <div className="relative max-w-2xl">
            <Input
              type="text"
              placeholder="Rechercher une salle de sport, une ville, un équipement..."
              className="pl-10 pr-4 py-3 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtres (Desktop) */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Filtres</h2>
                {activeFilters > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetFilters}
                    className="text-sm"
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
              
              <Accordion type="multiple" defaultValue={['city', 'amenities', 'price', 'rating']}>
                <AccordionItem value="city">
                  <AccordionTrigger className="text-sm font-medium py-3">Ville</AccordionTrigger>
                  <AccordionContent>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Toutes les villes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toutes les villes</SelectItem>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="amenities">
                  <AccordionTrigger className="text-sm font-medium py-3">Équipements</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center">
                          <Checkbox
                            id={`amenity-${amenity}`}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={() => toggleAmenity(amenity)}
                          />
                          <label
                            htmlFor={`amenity-${amenity}`}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="price">
                  <AccordionTrigger className="text-sm font-medium py-3">Prix mensuel</AccordionTrigger>
                  <AccordionContent>
                    <div className="px-2 pt-5 pb-2">
                      <Slider
                        value={priceRange}
                        min={0}
                        max={200}
                        step={5}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="rating">
                  <AccordionTrigger className="text-sm font-medium py-3">Note minimale</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex space-x-1">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <Button
                          key={rating}
                          variant={minRating > rating ? "default" : "outline"}
                          size="sm"
                          className={`px-3 ${minRating > rating ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'text-gray-500'}`}
                          onClick={() => setMinRating(rating + 1)}
                        >
                          {rating + 1} <Star className="ml-1 h-3 w-3" fill={minRating > rating ? "white" : "none"} />
                        </Button>
                      ))}
                    </div>
                    {minRating > 0 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-sm mt-2 px-0"
                        onClick={() => setMinRating(0)}
                      >
                        Réinitialiser
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          {/* Filtres (Mobile) */}
          <div className="md:hidden mb-4">
            <div className="flex space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres {activeFilters > 0 && `(${activeFilters})`}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filtres</SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Ville</h3>
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Toutes les villes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Toutes les villes</SelectItem>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Équipements</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {amenities.map((amenity) => (
                          <div key={amenity} className="flex items-center">
                            <Checkbox
                              id={`mobile-amenity-${amenity}`}
                              checked={selectedAmenities.includes(amenity)}
                              onCheckedChange={() => toggleAmenity(amenity)}
                            />
                            <label
                              htmlFor={`mobile-amenity-${amenity}`}
                              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Prix mensuel</h3>
                      <div className="px-2 pt-5 pb-2">
                        <Slider
                          value={priceRange}
                          min={0}
                          max={200}
                          step={5}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                        />
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                          <span>{formatPrice(priceRange[0])}</span>
                          <span>{formatPrice(priceRange[1])}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Note minimale</h3>
                      <div className="flex space-x-1">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <Button
                            key={rating}
                            variant={minRating > rating ? "default" : "outline"}
                            size="sm"
                            className={`px-3 ${minRating > rating ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'text-gray-500'}`}
                            onClick={() => setMinRating(rating + 1)}
                          >
                            {rating + 1} <Star className="ml-1 h-3 w-3" fill={minRating > rating ? "white" : "none"} />
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 flex space-x-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={resetFilters}
                      >
                        Réinitialiser
                      </Button>
                      <SheetTrigger asChild>
                        <Button className="flex-1">Appliquer</Button>
                      </SheetTrigger>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <SelectTrigger className="flex-1">
                  <span className="flex items-center">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Trier
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Par défaut</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="rating-desc">Meilleures notes</SelectItem>
                  <SelectItem value="name-asc">Ordre alphabétique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="flex-1">
            {/* Barre d'informations */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <p className="text-gray-600">
                  {displayedGyms.length} résultat{displayedGyms.length !== 1 ? 's' : ''}
                  {selectedCity && ` à ${selectedCity}`}
                </p>
                
                {/* Filtres actifs */}
                {activeFilters > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCity && (
                      <div className="bg-blue-100 text-navy text-xs px-3 py-1 rounded-full flex items-center">
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
                      <div key={amenity} className="bg-blue-100 text-navy text-xs px-3 py-1 rounded-full flex items-center">
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
                      <div className="bg-blue-100 text-navy text-xs px-3 py-1 rounded-full flex items-center">
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
                      <div className="bg-blue-100 text-navy text-xs px-3 py-1 rounded-full flex items-center">
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
                    
                    <button 
                      onClick={resetFilters}
                      className="text-xs text-gray-500 hover:text-navy underline"
                    >
                      Réinitialiser tous les filtres
                    </button>
                  </div>
                )}
              </div>
              
              {/* Options de tri (Desktop) */}
              <div className="hidden md:block">
                <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                  <SelectTrigger className="w-[180px]">
                    <span className="flex items-center">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Trier par
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Par défaut</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="rating-desc">Meilleures notes</SelectItem>
                    <SelectItem value="name-asc">Ordre alphabétique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Liste des salles */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-card p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : displayedGyms.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 mb-6">
                  <Dumbbell className="h-10 w-10 text-navy" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Nous n'avons pas trouvé de salles correspondant à vos critères. Essayez d'ajuster vos filtres ou de réinitialiser la recherche.
                </p>
                <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedGyms.map((gym) => (
                  <Link 
                    key={gym.id}
                    to={`/salle/${gym.id}`}
                    className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden group"
                  >
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      {gym.images && gym.images.length > 0 ? (
                        <img 
                          src={gym.images[0]} 
                          alt={gym.name} 
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-navy">
                          <Dumbbell className="h-12 w-12" />
                        </div>
                      )}
                      {gym.featured && (
                        <div className="absolute top-2 right-2 bg-cyan text-navy py-1 px-3 rounded-full text-xs font-medium">
                          En vedette
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold mb-1">{gym.name}</h3>
                        {gym.rating && (
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm">{gym.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mb-3">
                        <MapPin className="inline h-3.5 w-3.5 mr-1" />
                        {gym.city}
                      </p>
                      <p className="text-gray-600 mb-4">{truncateText(gym.description, 100)}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
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
                      <div className="border-t pt-4">
                        <p className="text-navy font-medium">
                          À partir de {formatPrice(Math.min(...gym.plans.map(plan => plan.price)))} / mois
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindGymPage;