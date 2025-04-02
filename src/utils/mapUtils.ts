import { Map } from 'ol';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';
import Overlay from 'ol/Overlay';
import { Extent } from 'ol/extent';
import { Gym } from '../lib/types';
import { formatPrice } from '../lib/utils';

// Noms uniques pour les listeners d'événements
const CLICK_KEY = 'gym-marker-click';
const HOVER_KEY = 'gym-marker-hover';

// Fonction pour générer des coordonnées aléatoires basées sur la ville
function getRandomCoordinatesForCity(city: string): [number, number] {
  // Coordonnées approximatives de quelques villes françaises
  const cityCoordinates: Record<string, [number, number]> = {
    'Paris': [2.3522, 48.8566],
    'Lyon': [4.8357, 45.7640],
    'Marseille': [5.3698, 43.2965],
    'Toulouse': [1.4442, 43.6047],
    'Nice': [7.2620, 43.7102],
    'Nantes': [-1.5534, 47.2184],
    'Strasbourg': [7.7521, 48.5734],
    'Montpellier': [3.8767, 43.6108],
    'Bordeaux': [-0.5792, 44.8378],
    'Lille': [3.0573, 50.6292]
  };

  // Si la ville est dans notre liste, utiliser ses coordonnées
  if (city in cityCoordinates) {
    const [lon, lat] = cityCoordinates[city];
    // Ajouter une petite variation pour éviter que les marqueurs se superposent
    return [
      lon + (Math.random() - 0.5) * 0.05, 
      lat + (Math.random() - 0.5) * 0.05
    ];
  }

  // Sinon, générer des coordonnées en France
  return [
    2.2137 + (Math.random() - 0.5) * 2, 
    46.2276 + (Math.random() - 0.5) * 2
  ];
}

// Fonction pour ajouter les marqueurs de salles à la carte
export function addGymMarkers(
  map: Map, 
  gyms: Gym[], 
  overlay: Overlay,
  onGymSelect?: (id: string) => void,
  overlayElement?: HTMLElement | null
): VectorSource {
  // Supprimer les anciens marqueurs s'ils existent
  map.getLayers().getArray()
    .filter(layer => layer.get('name') === 'gymMarkers')
    .forEach(layer => map.removeLayer(layer));
  
  // Créer une source de vecteur pour les marqueurs
  const vectorSource = new VectorSource();
  
  // Créer des marqueurs pour chaque salle
  gyms.forEach(gym => {
    // Obtenir des coordonnées basées sur la ville
    const [lon, lat] = getRandomCoordinatesForCity(gym.city);
    const coordinates = fromLonLat([lon, lat]);
    
    // Créer une entité Feature pour le marqueur
    const feature = new Feature({
      geometry: new Point(coordinates),
      name: gym.name,
      gym: gym
    });
    
    // Style pour le marqueur normal
    const normalStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23002875" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
        scale: 1.2
      }),
      text: new Text({
        text: '',  // Pas de texte pour les marqueurs normaux
        offsetY: -20
      })
    });
    
    // Style pour le marqueur sélectionné
    const selectedStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%2361dafb" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
        scale: 1.5
      }),
      text: new Text({
        text: gym.name,
        font: 'bold 12px Calibri,sans-serif',
        fill: new Fill({ color: '#002875' }),
        stroke: new Stroke({ color: '#fff', width: 3 }),
        offsetY: -30,
        padding: [2, 2, 2, 2]
      })
    });
    
    feature.setStyle(normalStyle);
    feature.set('normalStyle', normalStyle);
    feature.set('selectedStyle', selectedStyle);
    feature.set('id', gym.id);  // Stocker l'ID pour faciliter la sélection
    
    vectorSource.addFeature(feature);
  });
  
  // Créer une couche vectorielle avec les marqueurs
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    properties: { name: 'gymMarkers' }
  });
  
  // Ajouter la couche à la carte
  map.addLayer(vectorLayer);
  
  // Ajouter des interactions sur les marqueurs
  if (overlayElement) {
    // Gérer le clic sur un marqueur
    const clickHandler = function(evt: any) {
      // Fermer le popup si on clique ailleurs que sur un marqueur
      let clickedFeature = null;
      
      map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        clickedFeature = feature;
        return true;  // Arrêter l'itération
      });
      
      // Restaurer le style normal pour tous les marqueurs
      vectorSource.getFeatures().forEach(f => {
        f.setStyle(f.get('normalStyle'));
      });
      
      if (clickedFeature && (clickedFeature as Feature).get('gym')) {
        const gym = (clickedFeature as Feature).get('gym') as Gym;
        const coordinates = (clickedFeature as Feature<Point>).getGeometry()?.getCoordinates();
        
        // Appliquer le style sélectionné pour le marqueur cliqué
        (clickedFeature as Feature).setStyle((clickedFeature as Feature).get('selectedStyle'));
        
        // Mettre à jour le contenu HTML de l'overlay
        if (overlayElement) {
          const title = overlayElement.querySelector('h3');
          if (title) title.textContent = gym.name;
          
          const address = overlayElement.querySelector('.gym-address');
          if (address) address.textContent = `${gym.address}, ${gym.zipCode} ${gym.city}`;
          
          const rating = overlayElement.querySelector('.gym-rating span');
          if (rating) {
            if (gym.rating) {
              rating.textContent = `${gym.rating.toFixed(1)}/5`;
              const ratingContainer = overlayElement.querySelector('.gym-rating');
              if (ratingContainer) ratingContainer.classList.remove('hidden');
            } else {
              const ratingContainer = overlayElement.querySelector('.gym-rating');
              if (ratingContainer) ratingContainer.classList.add('hidden');
            }
          }
          
          // Afficher les équipements
          const amenitiesContainer = overlayElement.querySelector('.gym-amenities');
          if (amenitiesContainer) {
            amenitiesContainer.innerHTML = '';
            
            gym.amenities.slice(0, 3).forEach(amenity => {
              const span = document.createElement('span');
              span.className = 'bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded';
              span.textContent = amenity;
              amenitiesContainer.appendChild(span);
            });
            
            if (gym.amenities.length > 3) {
              const span = document.createElement('span');
              span.className = 'bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded';
              span.textContent = `+${gym.amenities.length - 3}`;
              amenitiesContainer.appendChild(span);
            }
          }
          
          // Mettre à jour le prix
          const price = overlayElement.querySelector('.gym-price');
          if (price) {
            const minPrice = Math.min(...gym.plans.map(plan => plan.price));
            price.textContent = `À partir de ${formatPrice(minPrice)}/mois`;
          }
          
          // Mettre à jour le lien
          const link = overlayElement.querySelector('.gym-link') as HTMLAnchorElement;
          if (link) link.href = `/gyms/${gym.id}`;
          
          // Afficher l'overlay
          overlayElement.style.display = 'block';
          overlay.setPosition(coordinates);
          
          // Callback de sélection si fourni
          if (onGymSelect) {
            onGymSelect(gym.id);
          }
        }
      } else {
        // Masquer l'overlay si clic ailleurs
        overlay.setPosition(undefined);
        if (overlayElement) {
          overlayElement.style.display = 'none';
        }
      }
    };
    
    // Changer le curseur lorsqu'on survole un marqueur
    const moveHandler = function(evt: any) {
      const pixel = map.getEventPixel(evt.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    };
    
    // Suppression des anciens gestionnaires (si présents)
    const oldClickHandler = map.get(CLICK_KEY);
    const oldMoveHandler = map.get(HOVER_KEY);
    
    if (oldClickHandler) {
      map.getViewport().removeEventListener('click', oldClickHandler);
    }
    
    if (oldMoveHandler) {
      map.getViewport().removeEventListener('pointermove', oldMoveHandler);
    }
    
    // Ajout des nouveaux gestionnaires
    map.getViewport().addEventListener('click', clickHandler);
    map.getViewport().addEventListener('pointermove', moveHandler);
    
    // Stockage des références aux gestionnaires
    map.set(CLICK_KEY, clickHandler);
    map.set(HOVER_KEY, moveHandler);
  }
  
  return vectorSource;
}

// Centrer la carte sur une salle spécifique
export function centerMapOnGym(map: Map, gym: Gym, zoom = 13, animate = true) {
  // Obtenir des coordonnées basées sur la ville
  const [lon, lat] = getRandomCoordinatesForCity(gym.city);
  const coordinates = fromLonLat([lon, lat]);
  
  const view = map.getView();
  if (animate) {
    view.animate({
      center: coordinates,
      zoom: zoom,
      duration: 500
    });
  } else {
    view.setCenter(coordinates);
    view.setZoom(zoom);
  }
}

// Adapter la vue pour inclure toutes les salles
export function fitMapToGyms(map: Map, source: VectorSource) {
  const features = source.getFeatures();
  if (features.length === 0) return;
  
  const extent = source.getExtent() as Extent;
  
  map.getView().fit(extent, {
    padding: [50, 50, 50, 50],
    maxZoom: 12,
    duration: 500
  });
}

// S'assurer que la carte est visible et correctement dimensionnée
export function ensureMapVisible(map: Map) {
  setTimeout(() => {
    map.updateSize();
  }, 200);
}

// Fonction pour nettoyer les événements de la carte
export function cleanupMap(map: Map) {
  // Vérifier si la carte existe
  if (!map) return;

  try {
    // Supprimer plutôt toutes les couches nommées 'gymMarkers'
    const layers = map.getLayers().getArray();
    const gymLayers = layers.filter(layer => layer.get('name') === 'gymMarkers');
    
    gymLayers.forEach(layer => {
      map.removeLayer(layer);
    });
    
    // Récupérer les gestionnaires d'événements
    const clickHandler = map.get(CLICK_KEY);
    const moveHandler = map.get(HOVER_KEY);
    
    // Supprimer les écouteurs si présents
    if (clickHandler && map.getViewport()) {
      map.getViewport().removeEventListener('click', clickHandler);
    }
    
    if (moveHandler && map.getViewport()) {
      map.getViewport().removeEventListener('pointermove', moveHandler);
    }
    
    // Nettoyer les références
    map.set(CLICK_KEY, undefined);
    map.set(HOVER_KEY, undefined);
  } catch (error) {
    console.error('Erreur lors du nettoyage de la carte:', error);
  }
}