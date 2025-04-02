import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Fonction pour vérifier si l'écran est mobile (< 768px)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Vérifier lors du chargement initial
    checkMobile();

    // Ajouter un écouteur d'événement pour le redimensionnement
    window.addEventListener('resize', checkMobile);

    // Nettoyer l'écouteur d'événement
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}

export default useIsMobile;