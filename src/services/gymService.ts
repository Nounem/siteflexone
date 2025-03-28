// src/services/gymService.ts
import { Gym, FilterOptions } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

// Simuler une base de données locale avec localStorage
const STORAGE_KEY = "fitness-broker-gyms";

// Fonction pour obtenir les salles depuis le stockage local
const getGymsFromStorage = (): Gym[] => {
  const gymsJson = localStorage.getItem(STORAGE_KEY);
  if (!gymsJson) return [];
  
  try {
    const gyms = JSON.parse(gymsJson);
    // Convertir les chaînes de date en objets Date
    return gyms.map((gym: any) => ({
      ...gym,
      createdAt: new Date(gym.createdAt),
      updatedAt: new Date(gym.updatedAt)
    }));
  } catch (error) {
    console.error("Error parsing gyms from localStorage:", error);
    return [];
  }
};

// Fonction pour enregistrer les salles dans le stockage local
const saveGymsToStorage = (gyms: Gym[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gyms));
};

// Charger les données initiales si le stockage est vide
const initializeGyms = (): void => {
  const existingGyms = getGymsFromStorage();
  if (existingGyms.length === 0) {
    // Données de démonstration
    const sampleGyms: Gym[] = [
      {
        id: uuidv4(),
        name: "FitnessPro Paris",
        address: "123 Avenue des Champs-Élysées",
        city: "Paris",
        zipCode: "75008",
        description: "Une salle de sport moderne avec des équipements de pointe au cœur de Paris.",
        amenities: ["Piscine", "Sauna", "Cours collectifs", "Coach personnel", "Parking"],
        plans: [
          {
            id: uuidv4(),
            name: "Basic",
            price: 29.99,
            duration: "monthly",
            features: ["Accès aux machines", "Vestiaires"]
          },
          {
            id: uuidv4(),
            name: "Premium",
            price: 49.99,
            duration: "monthly",
            features: ["Accès aux machines", "Vestiaires", "Cours collectifs", "Sauna"]
          }
        ],
        images: ["/images/gym1.jpg", "/images/gym1-2.jpg"],
        openingHours: {
          monday: { open: "06:00", close: "22:00" },
          tuesday: { open: "06:00", close: "22:00" },
          wednesday: { open: "06:00", close: "22:00" },
          thursday: { open: "06:00", close: "22:00" },
          friday: { open: "06:00", close: "22:00" },
          saturday: { open: "08:00", close: "20:00" },
          sunday: { open: "09:00", close: "18:00" }
        },
        contact: {
          phone: "01 23 45 67 89",
          email: "contact@fitnesspro.fr",
          website: "https://fitnesspro.fr"
        },
        rating: 4.5,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: "MuscleZone Lyon",
        address: "45 Rue de la République",
        city: "Lyon",
        zipCode: "69002",
        description: "Spécialiste de la musculation avec des équipements professionnels.",
        amenities: ["Musculation", "Cardio", "Coach personnel"],
        plans: [
          {
            id: uuidv4(),
            name: "Standard",
            price: 24.99,
            duration: "monthly",
            features: ["Accès aux machines", "Vestiaires"]
          },
          {
            id: uuidv4(),
            name: "Pro",
            price: 39.99,
            duration: "monthly",
            features: ["Accès aux machines", "Vestiaires", "Coach personnel"]
          }
        ],
        images: ["/images/gym2.jpg"],
        openingHours: {
          monday: { open: "07:00", close: "22:00" },
          tuesday: { open: "07:00", close: "22:00" },
          wednesday: { open: "07:00", close: "22:00" },
          thursday: { open: "07:00", close: "22:00" },
          friday: { open: "07:00", close: "22:00" },
          saturday: { open: "09:00", close: "18:00" },
          sunday: { closed: true, open: "", close: "" }
        },
        contact: {
          phone: "04 56 78 90 12",
          email: "info@musclezone.fr"
        },
        rating: 4.2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    saveGymsToStorage(sampleGyms);
  }
};

// Service pour gérer les salles de sport
const gymService = {
  // Initialiser les données
  initialize: () => {
    initializeGyms();
  },
  
  // Récupérer toutes les salles
  getAllGyms: (): Gym[] => {
    return getGymsFromStorage();
  },
  
  // Récupérer une salle par son ID
  getGymById: (id: string): Gym | undefined => {
    const gyms = getGymsFromStorage();
    return gyms.find(gym => gym.id === id);
  },
  
  // Ajouter une nouvelle salle
  addGym: (gymData: Omit<Gym, "id" | "createdAt" | "updatedAt">): Gym => {
    const gyms = getGymsFromStorage();
    
    const newGym: Gym = {
      ...gymData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    gyms.push(newGym);
    saveGymsToStorage(gyms);
    
    return newGym;
  },
  
  // Mettre à jour une salle existante
  updateGym: (id: string, gymData: Partial<Gym>): Gym | undefined => {
    const gyms = getGymsFromStorage();
    const gymIndex = gyms.findIndex(gym => gym.id === id);
    
    if (gymIndex === -1) return undefined;
    
    const updatedGym = {
      ...gyms[gymIndex],
      ...gymData,
      updatedAt: new Date()
    };
    
    gyms[gymIndex] = updatedGym;
    saveGymsToStorage(gyms);
    
    return updatedGym;
  },
  
  // Supprimer une salle
  deleteGym: (id: string): boolean => {
    const gyms = getGymsFromStorage();
    const updatedGyms = gyms.filter(gym => gym.id !== id);
    
    if (updatedGyms.length === gyms.length) return false;
    
    saveGymsToStorage(updatedGyms);
    return true;
  },
  
  // Filtrer les salles selon des critères
  filterGyms: (options: FilterOptions): Gym[] => {
    let gyms = getGymsFromStorage();
    
    if (options.city) {
      gyms = gyms.filter(gym => 
        gym.city.toLowerCase().includes(options.city!.toLowerCase()));
    }
    
    if (options.amenities && options.amenities.length > 0) {
      gyms = gyms.filter(gym => 
        options.amenities!.every(amenity => 
          gym.amenities.includes(amenity)
        )
      );
    }
    
    if (options.priceRange) {
      gyms = gyms.filter(gym => {
        // Vérifier si au moins un forfait correspond à la fourchette de prix
        return gym.plans.some(plan => 
          plan.price >= options.priceRange!.min && 
          plan.price <= options.priceRange!.max
        );
      });
    }
    
    if (options.rating) {
      gyms = gyms.filter(gym => 
        (gym.rating || 0) >= options.rating!);
    }
    
    return gyms;
  },
  
  // Exporter les salles au format CSV
  exportGymsToCsv: (): string => {
    const gyms = getGymsFromStorage();
    const headers = "ID,Nom,Adresse,Ville,Code Postal,Description,Équipements,Forfaits,Contact,Évaluation";
    
    const rows = gyms.map(gym => {
      return [
        gym.id,
        `"${gym.name}"`,
        `"${gym.address}"`,
        `"${gym.city}"`,
        gym.zipCode,
        `"${gym.description.replace(/"/g, '""')}"`,
        `"${gym.amenities.join(', ')}"`,
        `"${gym.plans.map(p => `${p.name}: ${p.price}€`).join('; ')}"`,
        `"${gym.contact.email} / ${gym.contact.phone}"`,
        gym.rating || "N/A"
      ].join(',');
    });
    
    return [headers, ...rows].join('\n');
  },
  
  // Importer des salles depuis un fichier CSV
  importGymsFromCsv: (csvContent: string): number => {
    const lines = csvContent.split('\n');
    if (lines.length <= 1) return 0;
    
    const headers = lines[0].split(',');
    const gyms = getGymsFromStorage();
    let importedCount = 0;
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',');
        if (values.length < 5) continue; // Skip invalid lines
        
        // Exemple simplifié d'importation
        const newGym: Gym = {
          id: uuidv4(),
          name: values[1].replace(/^"|"$/g, ''),
          address: values[2].replace(/^"|"$/g, ''),
          city: values[3].replace(/^"|"$/g, ''),
          zipCode: values[4],
          description: values[5]?.replace(/^"|"$/g, '') || "",
          amenities: values[6]?.replace(/^"|"$/g, '').split(', ') || [],
          plans: [{
            id: uuidv4(),
            name: "Standard",
            price: 29.99,
            duration: "monthly",
            features: ["Accès standard"]
          }],
          images: [],
          openingHours: {
            monday: { open: "08:00", close: "20:00" },
            tuesday: { open: "08:00", close: "20:00" },
            wednesday: { open: "08:00", close: "20:00" },
            thursday: { open: "08:00", close: "20:00" },
            friday: { open: "08:00", close: "20:00" },
            saturday: { open: "09:00", close: "18:00" },
            sunday: { closed: true, open: "", close: "" }
          },
          contact: {
            phone: "",
            email: ""
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        gyms.push(newGym);
        importedCount++;
      } catch (error) {
        console.error(`Error importing line ${i}:`, error);
      }
    }
    
    if (importedCount > 0) {
      saveGymsToStorage(gyms);
    }
    
    return importedCount;
  }
};

export default gymService;