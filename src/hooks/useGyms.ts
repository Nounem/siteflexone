// src/hooks/useGyms.ts
import { useState, useEffect, useCallback } from 'react';
import { Gym, FilterOptions } from '../lib/types';
import gymService from '../services/gymService';

export default function useGyms() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [filteredGyms, setFilteredGyms] = useState<Gym[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({});

  // Charger toutes les salles
  const loadGyms = useCallback(async () => {
    try {
      setIsLoading(true);
      // Initialiser le service si nécessaire
      gymService.initialize();
      
      // Obtenir les salles
      const allGyms = gymService.getAllGyms();
      setGyms(allGyms);
      setFilteredGyms(allGyms);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des salles de sport');
      console.error('Error loading gyms:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les données au montage du composant
  useEffect(() => {
    loadGyms();
  }, [loadGyms]);

  // Filtrer les salles
  const filterGyms = useCallback((options: FilterOptions) => {
    setIsLoading(true);
    try {
      const filtered = gymService.filterGyms(options);
      setFilteredGyms(filtered);
      setCurrentFilters(options);
      setError(null);
    } catch (err) {
      setError('Erreur lors du filtrage des salles de sport');
      console.error('Error filtering gyms:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ajouter une nouvelle salle
  const addGym = useCallback(async (gymData: Omit<Gym, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newGym = gymService.addGym(gymData);
      setGyms(prevGyms => [...prevGyms, newGym]);
      
      // Mettre à jour les salles filtrées si nécessaire
      if (Object.keys(currentFilters).length > 0) {
        filterGyms(currentFilters);
      } else {
        setFilteredGyms(prevFiltered => [...prevFiltered, newGym]);
      }
      
      return newGym;
    } catch (err) {
      setError('Erreur lors de l\'ajout de la salle de sport');
      console.error('Error adding gym:', err);
      throw err;
    }
  }, [currentFilters, filterGyms]);

  // Mettre à jour une salle existante
  const updateGym = useCallback(async (id: string, gymData: Partial<Gym>) => {
    try {
      const updatedGym = gymService.updateGym(id, gymData);
      if (!updatedGym) throw new Error('Salle de sport non trouvée');
      
      setGyms(prevGyms => prevGyms.map(gym => 
        gym.id === id ? updatedGym : gym
      ));
      
      // Mettre à jour les salles filtrées si nécessaire
      if (Object.keys(currentFilters).length > 0) {
        filterGyms(currentFilters);
      } else {
        setFilteredGyms(prevFiltered => prevFiltered.map(gym => 
          gym.id === id ? updatedGym : gym
        ));
      }
      
      return updatedGym;
    } catch (err) {
      setError('Erreur lors de la mise à jour de la salle de sport');
      console.error('Error updating gym:', err);
      throw err;
    }
  }, [currentFilters, filterGyms]);

  // Supprimer une salle
  const deleteGym = useCallback(async (id: string) => {
    try {
      const success = gymService.deleteGym(id);
      if (!success) throw new Error('Salle de sport non trouvée');
      
      setGyms(prevGyms => prevGyms.filter(gym => gym.id !== id));
      setFilteredGyms(prevFiltered => prevFiltered.filter(gym => gym.id !== id));
      
      return success;
    } catch (err) {
      setError('Erreur lors de la suppression de la salle de sport');
      console.error('Error deleting gym:', err);
      throw err;
    }
  }, []);

  // Exporter les salles au format CSV
  const exportGyms = useCallback(() => {
    try {
      return gymService.exportGymsToCsv();
    } catch (err) {
      setError('Erreur lors de l\'exportation des salles de sport');
      console.error('Error exporting gyms:', err);
      throw err;
    }
  }, []);

  // Importer des salles depuis un CSV
  const importGyms = useCallback(async (csvContent: string) => {
    try {
      const importedCount = gymService.importGymsFromCsv(csvContent);
      if (importedCount > 0) {
        await loadGyms(); // Recharger les salles après l'importation
      }
      return importedCount;
    } catch (err) {
      setError('Erreur lors de l\'importation des salles de sport');
      console.error('Error importing gyms:', err);
      throw err;
    }
  }, [loadGyms]);

  // Obtenir une salle par son ID
  const getGymById = useCallback((id: string) => {
    try {
      return gymService.getGymById(id);
    } catch (err) {
      setError('Erreur lors de la récupération de la salle de sport');
      console.error('Error getting gym by ID:', err);
      throw err;
    }
  }, []);

  return {
    gyms,
    filteredGyms,
    isLoading,
    error,
    filterGyms,
    addGym,
    updateGym,
    deleteGym,
    exportGyms,
    importGyms,
    getGymById,
    refreshGyms: loadGyms
  };
}