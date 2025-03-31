import React, { useEffect, useRef, useState } from 'react';
import { Gym } from '../../lib/types.ts';
import MapOverlay from './MapOverlay.tsx';

// Importations pour OpenLayers qui seront utilisées lors de l'initialisation
// Nous utilisons des imports dynamiques pour éviter les erreurs si la bibliothèque n'est pas disponible
interface GymMapProps {
  gyms: Gym[];
  onGymSelect?: (id: string) => void;
  className?: string;
  selectedGymId?: number;
}

const GymMap: React.FC<GymMapProps> = ({ 
  gyms, 
  onGymSelect, 
  className,
  selectedGymId
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [isOlLoaded, setIsOlLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState<string | null>(null);

  // Fonction pour mesurer les dimensions du conteneur
  const measureContainer = () => {
    if (mapRef.current) {
      const { clientWidth, clientHeight } = mapRef.current;
      console.log(`Map container dimensions: ${clientWidth}x${clientHeight}`);
      setDimensions({ width: clientWidth, height: clientHeight });
      return { width: clientWidth, height: clientHeight };
    }
    return { width: 0, height: 0 };
  };

  // Chargement dynamique d'OpenLayers
  useEffect(() => {
    const loadOl = async () => {
      try {
        // Tenter de charger dynamiquement OpenLayers
        await import('ol/ol.css').catch(() => {
          console.warn("Impossible de charger le CSS OpenLayers, veuillez installer le package 'ol'");
        });
        setIsOlLoaded(true);
      } catch (err) {
        console.error("Erreur lors du chargement d'OpenLayers:", err);
        setError("Impossible de charger la bibliothèque de cartographie. Veuillez installer OpenLayers avec 'npm install ol'.");
      }
    };

    loadOl();
  }, []);

  // Initialisation de la carte lorsque OpenLayers est chargé
  useEffect(() => {
    if (!isOlLoaded || !mapRef.current || isMapInitialized) return;

    // Initialisation simplifiée pour la démonstration
    const initializeMap = async () => {
      try {
        // Import dynamiques
        const [
          { Map, View },
          { default: TileLayer },
          { default: OSM },
          { default: Overlay },
          { fromLonLat }
        ] = await Promise.all([
          import('ol'),
          import('ol/layer/Tile'),
          import('ol/source/OSM'),
          import('ol/Overlay'),
          import('ol/proj')
        ]);

        // Forcer les dimensions minimales
        if (mapRef.current) {
          mapRef.current.style.width = '100%';
          mapRef.current.style.height = '500px';
          mapRef.current.style.minHeight = '500px';
        }

        // Centre initial sur la France
        const center = fromLonLat([2.2137, 46.2276]);
        const zoom = 5;

        // Créer l'overlay pour les popups
        const overlay = new Overlay({
          element: overlayRef.current!,
          autoPan: true,
          positioning: 'bottom-center',
          offset: [0, -10]
        });

        // Créer l'instance de carte
        const map = new Map({
          target: mapRef.current!,
          layers: [
            new TileLayer({
              source: new OSM()
            })
          ],
          view: new View({
            center,
            zoom,
            maxZoom: 18
          }),
          controls: []
        });

        map.addOverlay(overlay);
        mapInstanceRef.current = map;
        
        setIsMapInitialized(true);
        console.log("Carte initialisée");

        // Ajouter dynamiquement les marqueurs si la carte est initialisée
        if (gyms.length > 0) {
          // Charge dynamiquement les utilitaires de carte
          const mapUtils = await import('../../utils/mapUtils.ts');
          mapUtils.addGymMarkers(map, gyms, overlay, onGymSelect, overlayRef.current);

          // Adapter la vue selon le nombre de gyms
          if (gyms.length === 1) {
            mapUtils.centerMapOnGym(map, gyms[0], 13, false);
          } else if (gyms.length > 1) {
            const vectorSource = map.getLayers().getArray()
              .find(layer => layer.get('name') === 'gymMarkers')?.getSource();
            if (vectorSource) {
              mapUtils.fitMapToGyms(map, vectorSource);
            }
          }

          // Mettre à jour la taille de la carte
          setTimeout(() => {
            map.updateSize();
          }, 100);
        }
      } catch (err) {
        console.error("Erreur lors de l'initialisation de la carte:", err);
        setError("Problème lors de l'initialisation de la carte.");
      }
    };

    // Délai initial pour s'assurer que le DOM est prêt
    const timer = setTimeout(() => {
      initializeMap();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [isOlLoaded, isMapInitialized, gyms, onGymSelect]);

  // Mise à jour des marqueurs lorsque les gyms changent
  useEffect(() => {
    if (!isMapInitialized || !mapInstanceRef.current || !isOlLoaded) return;
    
    const updateMarkers = async () => {
      try {
        // Charge dynamiquement les utilitaires de carte
        const mapUtils = await import('../../utils/mapUtils.ts');
        const map = mapInstanceRef.current;
        
        if (map && gyms.length > 0) {
          const overlay = map.getOverlays().getArray()[0];
          mapUtils.addGymMarkers(map, gyms, overlay, onGymSelect, overlayRef.current);
        }
      } catch (err) {
        console.error("Erreur lors de la mise à jour des marqueurs:", err);
      }
    };
    
    updateMarkers();
  }, [gyms, isMapInitialized, isOlLoaded, onGymSelect]);

  // Mettre à jour la gym sélectionnée
  useEffect(() => {
    if (!selectedGymId || !mapInstanceRef.current || !isMapInitialized || !isOlLoaded) return;
    
    const selectGym = async () => {
      try {
        const mapUtils = await import('../../utils/mapUtils.ts');
        const selectedGym = gyms.find(gym => gym.id === selectedGymId.toString());
        
        if (selectedGym && mapInstanceRef.current) {
          mapUtils.centerMapOnGym(mapInstanceRef.current, selectedGym);
        }
      } catch (err) {
        console.error("Erreur lors de la sélection de gym:", err);
      }
    };
    
    selectGym();
  }, [selectedGymId, gyms, isMapInitialized, isOlLoaded]);

  // Gestion du redimensionnement
  useEffect(() => {
    if (!mapRef.current || !isMapInitialized || !mapInstanceRef.current) return;
    
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current.updateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMapInitialized]);

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Si OpenLayers n'est pas disponible, afficher un message d'erreur
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 p-6 text-center">
        <div>
          <p className="text-red-500 mb-4">{error}</p>
          <p>Pour installer OpenLayers, exécutez :</p>
          <pre className="bg-gray-800 text-white p-2 rounded mt-2">npm install ol</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full flex-1 flex flex-col" 
         style={{ minHeight: "500px" }} 
         data-testid="map-container">
      <div 
        ref={mapRef} 
        className={`w-full h-full flex-1 rounded-lg relative z-10 ${className || ''}`}
        style={{ 
          minHeight: "500px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {!isMapInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#61dafb]"></div>
          </div>
        )}
      </div>
      <MapOverlay ref={overlayRef} />
    </div>
  );
};

export default GymMap;