import React, { useEffect } from 'react';
import { Gym } from '../../lib/types';

interface GymMapProps {
  gyms: Gym[];
  onGymSelect?: (gymId: string) => void;
  selectedGymId?: string;
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
}

const GymMap: React.FC<GymMapProps> = ({
  gyms,
  onGymSelect,
  selectedGymId,
  center = [2.3522, 48.8566], // Default to Paris
  zoom = 6
}) => {
  // Fonction pour obtenir les coordonnées d'une ville
  const getCityCoordinates = (city: string): [number, number] => {
    // Coordonnées approximatives des grandes villes françaises
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

    return cityCoordinates[city] || [2.3522, 48.8566]; // Default to Paris if city not found
  };

  // Si un gymnase est sélectionné, centrer sur sa ville
  useEffect(() => {
    if (selectedGymId) {
      const selectedGym = gyms.find(gym => gym.id === selectedGymId);
      if (selectedGym) {
        // Déclencher un événement pour indiquer que les coordonnées ont changé
        const event = new CustomEvent('gym-selected', { 
          detail: { 
            coordinates: getCityCoordinates(selectedGym.city),
            gymName: selectedGym.name
          } 
        });
        window.dispatchEvent(event);
      }
    }
  }, [selectedGymId, gyms]);

  // Construire l'URL Google Maps centrée sur la France ou la ville sélectionnée
  let mapCenter = center;
  let zoomLevel = zoom;
  
  // Modifier le centre si un gymnase est sélectionné
  if (selectedGymId) {
    const selectedGym = gyms.find(gym => gym.id === selectedGymId);
    if (selectedGym) {
      mapCenter = getCityCoordinates(selectedGym.city);
      zoomLevel = 12; // Zoom plus près pour voir la ville
    }
  }

  // Construire l'URL pour Google Maps
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${mapCenter[1]},${mapCenter[0]}&zoom=${zoomLevel}`;
  
  // Note: La clé API ci-dessus est une clé de démonstration limitée fournie par Google. 
  // Pour une application en production, vous devriez obtenir votre propre clé API.

  return (
    <div className="w-full h-full relative">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        title="Google Maps"
        className="rounded-lg"
      ></iframe>
      
      {/* Overlay avec le nom du gymnase sélectionné */}
      {selectedGymId && (
        <div className="absolute top-4 left-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md">
          <p className="font-medium text-primary">
            {gyms.find(gym => gym.id === selectedGymId)?.name || 'Salle sélectionnée'}
          </p>
          <p className="text-sm text-gray-600">
            {gyms.find(gym => gym.id === selectedGymId)?.city || ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default GymMap;