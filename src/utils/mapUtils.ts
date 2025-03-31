import { Map } from 'ol';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';
import Overlay from 'ol/Overlay';
import { Extent } from 'ol/extent';
import { Gym } from '../lib/types.ts';
import { formatPrice } from '../lib/utils.ts';

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
    // Créer les coordonnées (simulation - normalement ces données viendraient de l'API)
    // Pour un vrai projet, vous auriez des coordonnées lon/lat dans vos données
    // Ici nous créons des coordonnées aléatoires autour de la France
    const lon = 2.2137 + (Math.random() - 0.5) * 2;
    const lat = 46.2276 + (Math.random() - 0.5) * 2;
    
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
        src: 'https://cdn-icons-png.flaticon.com/512/25/25613.png', // Remplacer par votre propre icône
        scale: 0.05,
        color: '#002875'
      }),
      text: new Text({
        text: gym.name,
        font: '12px Calibri,sans-serif',
        fill: new Fill({ color: '#000' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
        offsetY: -20,
        padding: [2, 2, 2, 2]
      })
    });
    
    // Style pour le marqueur sélectionné
    const selectedStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://cdn-icons-png.flaticon.com/512/25/25613.png',
        scale: 0.07,
        color: '#61dafb'
      }),
      text: new Text({
        text: gym.name,
        font: 'bold 12px Calibri,sans-serif',
        fill: new Fill({ color: '#002875' }),
        stroke: new Stroke({ color: '#fff', width: 3 }),
        offsetY: -20,
        padding: [2, 2, 2, 2]
      })
    });
    
    feature.setStyle(normalStyle);
    feature.set('normalStyle', normalStyle);
    feature.set('selectedStyle', selectedStyle);
    
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
    map.on('click', function(evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
      });
      
      if (feature && feature.get('gym')) {
        const gym = feature.get('gym') as Gym;
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        
        // Mettre à jour le contenu de l'overlay
        if (overlayElement) {
          // Restaurer le style normal pour tous les marqueurs
          vectorSource.getFeatures().forEach(f => {
            f.setStyle(f.get('normalStyle'));
          });
          
          // Appliquer le style sélectionné pour le marqueur cliqué
          feature.setStyle(feature.get('selectedStyle'));
          
          // Mettre à jour le contenu HTML de l'overlay
          const title = overlayElement.querySelector('h3');
          if (title) title.textContent = gym.name;
          
          const address = overlayElement.querySelector('.gym-address');
          if (address) address.textContent = `${gym.city}, ${gym.zipCode}`;
          
          const rating = overlayElement.querySelector('.gym-rating span');
          if (rating) {
            if (gym.rating) {
              rating.textContent = `${gym.rating.toFixed(1)}/5`;
              overlayElement.querySelector('.gym-rating')?.classList.remove('hidden');
            } else {
              overlayElement.querySelector('.gym-rating')?.classList.add('hidden');
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
    });
    
    // Changer le curseur lorsqu'on survole un marqueur
    map.on('pointermove', function(evt) {
      const pixel = map.getEventPixel(evt.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
  }
  
  return vectorSource;
}

// Centrer la carte sur une salle spécifique
export function centerMapOnGym(map: Map, gym: Gym, zoom = 13, animate = true) {
  // Simulation - normalement ces données viendraient de l'API
  const lon = 2.2137 + (Math.random() - 0.5) * 2;
  const lat = 46.2276 + (Math.random() - 0.5) * 2;
  
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
  map.updateSize();
}