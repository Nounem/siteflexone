import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button.tsx';
import { 
  MapPin, Phone, Mail, Globe, Clock, Check, Star, ChevronRight, 
  ChevronLeft, Dumbbell, ArrowLeft, Share2, X 
} from 'lucide-react';
import { Badge } from '../components/ui/badge.tsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs.tsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion.tsx';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog.tsx';
import { Carousel } from '../components/ui/carousel.tsx';
import { Gym, Plan } from '../lib/types.ts';
import useGyms from '../hooks/useGyms.ts';
import { formatPrice, formatTime } from '../lib/utils.ts';

const GymDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGymById, isLoading } = useGyms();
  const [gym, setGym] = useState<Gym | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);

  useEffect(() => {
    if (id) {
      const gymData = getGymById(id);
      if (gymData) {
        setGym(gymData);
      } else {
        // Rediriger si la salle n'existe pas
        navigate('/404');
      }
    }
  }, [id, getGymById, navigate]);

  // Fonction pour partager la page
  const sharePage = () => {
    if (navigator.share) {
      navigator.share({
        title: gym?.name || 'FitConnect - Salle de sport',
        text: `Découvrez ${gym?.name} sur FitConnect !`,
        url: window.location.href,
      }).catch((error) => console.log('Erreur de partage:', error));
    } else {
      // Fallback si l'API Web Share n'est pas disponible
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Lien copié dans le presse-papier'))
        .catch((error) => console.log('Erreur de copie:', error));
    }
  };

  // Afficher un état de chargement
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-pulse space-y-6 w-full max-w-4xl">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-72 bg-gray-200 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Afficher un message si la salle n'existe pas
  if (!gym) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4">Salle non trouvée</h2>
          <p className="text-gray-600 mb-8">La salle que vous recherchez n'existe pas ou a été supprimée.</p>
          <Link to="/trouver-une-salle">
            <Button>Retour à la liste des salles</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Bouton retour et titre mobile */}
      <div className="bg-white py-4 shadow-sm sticky top-16 z-10 md:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-lg font-semibold truncate">{gym.name}</h1>
            <Button variant="ghost" size="icon" onClick={sharePage}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Galerie d'images */}
      <div className="bg-gray-100 relative">
        <div className="container mx-auto">
          <div className="hidden md:block pt-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <nav className="flex items-center text-sm text-gray-500">
                <Link to="/" className="hover:text-primary">Accueil</Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <Link to="/trouver-une-salle" className="hover:text-primary">Salles de sport</Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="text-gray-900">{gym.name}</span>
              </nav>
            </div>
          </div>

          <div 
            className="relative h-64 md:h-96 overflow-hidden rounded-none md:rounded-xl cursor-pointer" 
            onClick={() => setShowImageDialog(true)}
          >
            {gym.images && gym.images.length > 0 ? (
              <Carousel 
                images={gym.images} 
                imageClassName="transition-transform duration-300 hover:scale-105"
                className="h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-primary">
                <Dumbbell className="h-24 w-24 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Titre et notation */}
            <div className="hidden md:flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-semibold mb-2 text-primary animate-fade-in">{gym.name}</h1>
                <div className="flex items-center text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{gym.address}, {gym.zipCode} {gym.city}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="sm" onClick={sharePage}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>

            <div className="md:hidden mb-6">
              <h1 className="text-2xl font-semibold mb-2 text-primary">{gym.name}</h1>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{gym.address}, {gym.zipCode} {gym.city}</span>
              </div>
            </div>

            {/* Notation */}
            {gym.rating && (
              <div className="flex items-center mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{gym.rating}</span>
                  <span className="mx-1">/</span>
                  <span>5</span>
                </div>
                {gym.reviews && (
                  <span className="text-gray-500 text-sm ml-2">
                    ({gym.reviews.length} avis)
                  </span>
                )}
              </div>
            )}

            {/* Onglets d'informations */}
            <Tabs defaultValue="description" className="mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 mb-6">
                <TabsTrigger 
                  value="description" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="amenities" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
                >
                  Équipements
                </TabsTrigger>
                <TabsTrigger 
                  value="schedule" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
                >
                  Horaires
                </TabsTrigger>
                {gym.reviews && gym.reviews.length > 0 && (
                  <TabsTrigger 
                    value="reviews" 
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
                  >
                    Avis
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="description" className="mt-0">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{gym.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gym.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="mt-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Lundi</span>
                    {gym.openingHours.monday.closed ? (
                      <span className="text-red-500">Fermé</span>
                    ) : (
                      <span>{formatTime(gym.openingHours.monday.open)} - {formatTime(gym.openingHours.monday.close)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Mardi</span>
                    {gym.openingHours.tuesday.closed ? (
                      <span className="text-red-500">Fermé</span>
                    ) : (
                      <span>{formatTime(gym.openingHours.tuesday.open)} - {formatTime(gym.openingHours.tuesday.close)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Mercredi</span>
                    {gym.openingHours.wednesday.closed ? (
                      <span className="text-red-500">Fermé</span>
                    ) : (
                      <span>{formatTime(gym.openingHours.wednesday.open)} - {formatTime(gym.openingHours.wednesday.close)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Jeudi</span>
                    {gym.openingHours.thursday.closed ? (
                      <span className="text-red-500">Fermé</span>
                    ) : (
                      <span>{formatTime(gym.openingHours.thursday.open)} - {formatTime(gym.openingHours.thursday.close)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Vendredi</span>
                    {gym.openingHours.friday.closed ? (
                      <span className="text-red-500">Fermé</span>
                    ) : (
                      <span>{formatTime(gym.openingHours.friday.open)} - {formatTime(gym.openingHours.friday.close)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Samedi</span>
                    {gym.openingHours.saturday.closed ? (
                      <span className="text-red-500">Fermé</span>
                    ) : (
                      <span>{formatTime(gym.openingHours.saturday.open)} - {formatTime(gym.openingHours.saturday.close)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Dimanche</span>
                    {gym.openingHours.sunday.closed ? (
                      <span className="text-red-500">Fermé</span>
                    ) : (
                      <span>{formatTime(gym.openingHours.sunday.open)} - {formatTime(gym.openingHours.sunday.close)}</span>
                    )}
                  </div>
                </div>
              </TabsContent>

              {gym.reviews && gym.reviews.length > 0 && (
                <TabsContent value="reviews" className="mt-0">
                  <div className="space-y-6">
                    {gym.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <p className="text-gray-500 text-sm">
                              {new Date(review.date).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-24 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-xl font-semibold mb-6 text-primary">Forfaits</h2>
              
              <div className="space-y-4">
                {gym.plans.map((plan: Plan, index) => (
                  <div 
                    key={plan.id} 
                    className="border rounded-lg p-4 transition-all hover:border-primary hover:shadow-md transform hover:-translate-y-1"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <Badge variant={plan.name.toLowerCase().includes('premium') ? 'default' : 'outline'}>
                        {plan.duration === 'monthly' ? 'Mensuel' : 
                         plan.duration === 'yearly' ? 'Annuel' : 'Journalier'}
                      </Badge>
                    </div>
                    <p className="text-2xl font-semibold text-primary mb-3">
                      {formatPrice(plan.price)}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        {plan.duration === 'monthly' ? '/ mois' : 
                         plan.duration === 'yearly' ? '/ an' : '/ jour'}
                      </span>
                    </p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-6 pt-6">
                <h3 className="font-semibold mb-4">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <a href={`tel:${gym.contact.phone}`} className="hover:text-primary transition-colors">
                      {gym.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <a href={`mailto:${gym.contact.email}`} className="hover:text-primary transition-colors">
                      {gym.contact.email}
                    </a>
                  </div>
                  {gym.contact.website && (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-gray-500 mr-3" />
                      <a 
                        href={gym.contact.website.startsWith('http') ? gym.contact.website : `https://${gym.contact.website}`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-primary transition-colors"
                      >
                        Site web
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <Button className="w-full mt-6 bg-primary hover:bg-blue-900 text-white">
                Contacter la salle
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de galerie d'images */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl w-11/12 p-0 overflow-hidden">
          <DialogHeader className="absolute top-2 right-2 z-10">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-black/20 text-white hover:bg-black/40 hover:text-white rounded-full"
              onClick={() => setShowImageDialog(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="h-[80vh] relative">
            {gym.images && gym.images.length > 0 ? (
              <Carousel 
                images={gym.images} 
                className="h-full"
                autoSlide={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-primary">
                <Dumbbell className="h-24 w-24" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GymDetailPage;