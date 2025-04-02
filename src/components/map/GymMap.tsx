import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import { Vector as VectorSource } from 'ol/source';
import { Gym } from '../../lib/types';
import { addGymMarkers, fitMapToGyms, centerMapOnGym, ensureMapVisible, cleanupMap } from '../../utils/mapUtils';

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
  zoom = 5
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const overlayInstance = useRef<Overlay | null>(null);
  const sourceInstance = useRef<VectorSource | null>(null);
  const gymsRef = useRef<Gym[]>(gyms);
  const initializedRef = useRef<boolean>(false);

  // Mémoiser la fonction onGymSelect
  const handleGymSelect = useCallback((gymId: string) => {
    if (onGymSelect) {
      onGymSelect(gymId);
    }
  }, [onGymSelect]);

  // Initialisation unique de la carte
  useEffect(() => {
    if (!mapRef.current || initializedRef.current) return;

    console.log('Initialisation de la carte');
    initializedRef.current = true;

    // Create overlay for gym info
    const popupOverlay = new Overlay({
      element: popupRef.current!,
      autoPan: {
        animation: {
          duration: 250
        }
      }
    });

    // Create map
    const olMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom
      }),
      controls: []
    });

    // Add overlay to map
    olMap.addOverlay(popupOverlay);

    mapInstance.current = olMap;
    overlayInstance.current = popupOverlay;

    // Cleanup function
    return () => {
      console.log('Nettoyage de la carte');
      if (olMap) {
        cleanupMap(olMap);
        olMap.setTarget(undefined);
      }
    };
  }, []); // Dépendances vides pour s'exécuter une seule fois

  // Mettre à jour les marqueurs lorsque les gymnases changent
  useEffect(() => {
    const map = mapInstance.current;
    const overlay = overlayInstance.current;
    
    if (!map || !overlay || !popupRef.current || gyms.length === 0) return;

    // Vérifier si les gymnases ont changé (comparaison simple par longueur)
    const hasGymsChanged = gyms.length !== gymsRef.current.length;
    
    if (!hasGymsChanged && sourceInstance.current) {
      return; // Éviter de recréer les marqueurs si rien n'a changé
    }
    
    console.log('Mise à jour des marqueurs');
    gymsRef.current = [...gyms];
    
    const vectorSource = addGymMarkers(
      map,
      gyms,
      overlay,
      handleGymSelect,
      popupRef.current
    );

    sourceInstance.current = vectorSource;

    // Fit map to all gyms
    fitMapToGyms(map, vectorSource);

    // Make sure map is properly sized
    ensureMapVisible(map);
  }, [gyms, handleGymSelect]);

  // Center map on selected gym
  useEffect(() => {
    const map = mapInstance.current;
    
    if (!map || !selectedGymId || !gyms.length) return;

    const selectedGym = gyms.find(gym => gym.id === selectedGymId);
    if (selectedGym) {
      console.log('Centrage sur la salle sélectionnée');
      centerMapOnGym(map, selectedGym);
    }
  }, [selectedGymId, gyms]);

  // Handle window resize
  useEffect(() => {
    const map = mapInstance.current;
    
    const handleResize = () => {
      if (map) {
        ensureMapVisible(map);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // S'exécute une seule fois

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full"></div>
      
      {/* Popup overlay */}
      <div 
        ref={popupRef} 
        className="absolute bg-white rounded-lg shadow-lg p-3 min-w-[200px] max-w-[300px] hidden"
      >
        <div className="triangle absolute bottom-[-10px] left-[50%] ml-[-10px] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
        
        <h3 className="text-md font-semibold mb-1 text-navy"></h3>
        <p className="text-gray-500 text-xs mb-2 gym-address"></p>
        
        <div className="gym-rating flex items-center text-yellow-500 mb-2">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span className="ml-1 text-xs"></span>
        </div>
        
        <div className="gym-amenities flex flex-wrap gap-1 mb-2">
          {/* Amenities will be added dynamically */}
        </div>
        
        <p className="text-navy font-medium text-sm gym-price mb-2"></p>
        
        <a href="#" className="gym-link block text-center text-sm bg-navy text-white px-2 py-1 rounded hover:bg-opacity-90">
          Voir détails
        </a>
      </div>
    </div>
  );
};

export default GymMap;