// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Dumbbell, Users, Briefcase, CheckCircle, Zap, Star } from 'lucide-react';
import useGyms from '../hooks/useGyms.ts';
import { Gym } from '../lib/types.ts';
import { truncateText, formatPrice } from '../lib/utils.ts';
import { Button } from '../components/ui/button.tsx';
import { Carousel } from '../components/ui/carousel.tsx';

const HomePage = () => {
  const { gyms, isLoading } = useGyms();
  const [featuredGyms, setFeaturedGyms] = useState<Gym[]>([]);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  useEffect(() => {
    if (gyms.length > 0) {
      // Sélectionnez quelques salles à mettre en avant (par exemple, les salles avec featured=true ou les 3 premières)
      const featured = gyms.filter(gym => gym.featured).slice(0, 3);
      setFeaturedGyms(featured.length > 0 ? featured : gyms.slice(0, 3));
      
      // Extraire les images pour le carousel
      const allImages = gyms.flatMap(gym => gym.images || []).filter(Boolean);
      if (allImages.length > 0) {
        setCarouselImages(allImages.slice(0, 5)); // Limiter à 5 images pour le carousel
      } else {
        // Images par défaut si aucune n'est disponible
        setCarouselImages([
          'https://via.placeholder.com/1200x600?text=FitConnect',
          'https://via.placeholder.com/1200x600?text=Trouvez+votre+salle+idéale',
          'https://via.placeholder.com/1200x600?text=Des+équipements+de+qualité'
        ]);
      }
    }
  }, [gyms]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section avec Carousel */}
      <section className="relative py-12 bg-gradient-to-r from-primary to-navy overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bebas tracking-wide text-white mb-6 animate-fade-in">
                Trouvez la salle de sport idéale en quelques clics
              </h1>
              <p className="text-xl text-blue-100 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                FitConnect met en relation les sportifs avec les meilleures salles de sport, adaptées à leurs besoins et à leur budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Link to="/trouver-une-salle">
                  <Button size="lg" className="w-full sm:w-auto bg-secondary text-primary hover:bg-white">
                    Trouver une salle
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/services/professionnels">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                    Référencer votre salle
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block h-96 rounded-lg overflow-hidden shadow-xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Carousel images={carouselImages} />
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute -bottom-24 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,256L48,261.3C96,267,192,277,288,261.3C384,245,480,203,576,192C672,181,768,203,864,213.3C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Carousel mobile */}
      <div className="lg:hidden px-4 py-6 bg-gray-50">
        <div className="h-64 rounded-lg overflow-hidden shadow-md">
          <Carousel images={carouselImages} />
        </div>
      </div>

      {/* Comment ça marche */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Comment ça marche</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              FitConnect simplifie la recherche et la réservation de salles de sport tout en aidant les professionnels à développer leur clientèle.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 animate-fade-in transform hover:-translate-y-1 hover:scale-105 transition-transform">
              <div className="bg-blue-50 h-16 w-16 flex items-center justify-center rounded-full text-primary mb-6">
                <Dumbbell className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Trouvez</h3>
              <p className="text-gray-600">
                Recherchez et filtrez parmi notre sélection de salles de sport pour trouver celle qui correspond le mieux à vos critères.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 animate-fade-in transform hover:-translate-y-1 hover:scale-105 transition-transform" style={{ animationDelay: '0.2s' }}>
              <div className="bg-blue-50 h-16 w-16 flex items-center justify-center rounded-full text-primary mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Comparez</h3>
              <p className="text-gray-600">
                Comparez les tarifs, les équipements et les avis pour faire le meilleur choix selon vos besoins et votre budget.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 animate-fade-in transform hover:-translate-y-1 hover:scale-105 transition-transform" style={{ animationDelay: '0.4s' }}>
              <div className="bg-blue-50 h-16 w-16 flex items-center justify-center rounded-full text-primary mb-6">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Réservez</h3>
              <p className="text-gray-600">
                Contactez directement la salle ou réservez en ligne pour commencer votre parcours fitness sans attendre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Salles en vedette */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Salles en vedette</h2>
            <Link to="/trouver-une-salle" className="text-primary font-medium flex items-center hover:underline group">
              Voir toutes les salles <ArrowRight className="ml-2 h-4 w-4 group-hover:animate-slide-right" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredGyms.map((gym, index) => (
                <Link 
                  key={gym.id}
                  to={`/gyms/${gym.id}`}
                  className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group animate-fade-in transform hover:-translate-y-2 hover:scale-102"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {gym.images && gym.images.length > 0 ? (
                      <img 
                        src={gym.images[0]} 
                        alt={gym.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-primary">
                        <Dumbbell className="h-12 w-12" />
                      </div>
                    )}
                    {gym.featured && (
                      <div className="absolute top-2 right-2 bg-secondary text-primary py-1 px-3 rounded-full text-xs font-medium">
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
                    <p className="text-gray-500 text-sm mb-3">{gym.city}</p>
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
                      <p className="text-primary font-medium group-hover:text-secondary transition-colors">
                        À partir de {formatPrice(Math.min(...gym.plans.map(plan => plan.price)))} / mois
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pour qui ? */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Pour qui ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre plateforme s'adresse à tous les acteurs du fitness et du bien-être.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-xl transform transition-transform hover:scale-105 hover:shadow-lg">
              <div className="text-primary mb-4">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pour les particuliers</h3>
              <p className="text-gray-700 mb-6">
                Trouvez facilement la salle de sport qui correspond à vos besoins, votre emplacement et votre budget.
              </p>
              <Link to="/services/particuliers">
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                  En savoir plus
                </Button>
              </Link>
            </div>
            <div className="bg-blue-50 p-8 rounded-xl transform transition-transform hover:scale-105 hover:shadow-lg">
              <div className="text-primary mb-4">
                <Dumbbell className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pour les professionnels</h3>
              <p className="text-gray-700 mb-6">
                Référencez votre salle de sport et augmentez votre visibilité pour attirer de nouveaux clients.
              </p>
              <Link to="/services/professionnels">
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                  En savoir plus
                </Button>
              </Link>
            </div>
            <div className="bg-blue-50 p-8 rounded-xl transform transition-transform hover:scale-105 hover:shadow-lg">
              <div className="text-primary mb-4">
                <Briefcase className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pour les entreprises</h3>
              <p className="text-gray-700 mb-6">
                Offrez des avantages fitness à vos employés et améliorez leur bien-être au travail.
              </p>
              <Link to="/services/entreprises">
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Ce qu'ils disent de nous</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les témoignages de nos utilisateurs et partenaires.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                  <span className="text-lg font-semibold">JD</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">Julien Dupont</h4>
                  <p className="text-sm text-gray-500">Membre depuis 6 mois</p>
                </div>
              </div>
              <div className="flex text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600">
                "Grâce à FitConnect, j'ai trouvé la salle de sport parfaite à 5 minutes de chez moi. Le processus de recherche était simple et efficace !"
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                  <span className="text-lg font-semibold">SL</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">Sophie Laurent</h4>
                  <p className="text-sm text-gray-500">Propriétaire de salle</p>
                </div>
              </div>
              <div className="flex text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600">
                "Depuis que nous avons rejoint FitConnect, notre nombre d'inscriptions a augmenté de 30%. Une plateforme incontournable pour les professionnels du fitness !"
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                  <span className="text-lg font-semibold">MR</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">Marc Rodriguez</h4>
                  <p className="text-sm text-gray-500">DRH</p>
                </div>
              </div>
              <div className="flex text-yellow-500 mb-3">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <Star className="h-4 w-4 text-gray-300" />
              </div>
              <p className="text-gray-600">
                "Nous proposons maintenant des abonnements de sport à nos employés via FitConnect. Le processus est simple et nos équipes sont ravies !"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">Prêt à trouver votre salle de sport idéale ?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-blue-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Rejoignez FitConnect dès aujourd'hui et découvrez les meilleures salles de sport près de chez vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-slow">
            <Link to="/trouver-une-salle">
              <Button size="lg" className="w-full sm:w-auto bg-secondary text-primary hover:bg-white">
                Trouver une salle maintenant
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;