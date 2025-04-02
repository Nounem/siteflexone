import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gymService from '../services/gymService';
import { Gym, GymPlan, DayOfWeek } from '../lib/types';
import { v4 as uuidv4 } from 'uuid';

// Valeurs par défaut pour une nouvelle salle
const DEFAULT_GYM: Omit<Gym, "id" | "createdAt" | "updatedAt"> = {
  name: '',
  address: '',
  city: '',
  zipCode: '',
  description: '',
  amenities: [],
  plans: [
    {
      id: uuidv4(),
      name: 'Standard',
      price: 29.99,
      duration: 'monthly',
      features: ['Accès aux machines', 'Vestiaires']
    }
  ],
  images: [],
  openingHours: {
    monday: { open: '08:00', close: '22:00' },
    tuesday: { open: '08:00', close: '22:00' },
    wednesday: { open: '08:00', close: '22:00' },
    thursday: { open: '08:00', close: '22:00' },
    friday: { open: '08:00', close: '22:00' },
    saturday: { open: '09:00', close: '20:00' },
    sunday: { open: '10:00', close: '18:00' },
  },
  contact: {
    phone: '',
    email: '',
    website: ''
  },
  rating: 0,
  reviewCount: 0,
  featured: false
};

const AMENITIES_OPTIONS = [
  { value: 'Musculation', label: 'Musculation' },
  { value: 'Cardio', label: 'Cardio' },
  { value: 'Piscine', label: 'Piscine' },
  { value: 'Sauna', label: 'Sauna' },
  { value: 'Cours collectifs', label: 'Cours collectifs' },
  { value: 'Coach personnel', label: 'Coach personnel' },
  { value: 'Vestiaires', label: 'Vestiaires' },
  { value: 'Parking', label: 'Parking' },
  { value: 'Spa', label: 'Spa' },
  { value: 'Bar protéiné', label: 'Bar protéiné' },
];

const DAYS_OF_WEEK: { id: DayOfWeek, label: string }[] = [
  { id: 'monday', label: 'Lundi' },
  { id: 'tuesday', label: 'Mardi' },
  { id: 'wednesday', label: 'Mercredi' },
  { id: 'thursday', label: 'Jeudi' },
  { id: 'friday', label: 'Vendredi' },
  { id: 'saturday', label: 'Samedi' },
  { id: 'sunday', label: 'Dimanche' },
];

const AdminGymForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gym, setGym] = useState<any>(DEFAULT_GYM);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isNewGym = id === 'new';

  useEffect(() => {
    if (!isNewGym) {
      setLoading(true);
      const existingGym = gymService.getGymById(id as string);
      
      if (existingGym) {
        setGym(existingGym);
        setLoading(false);
      } else {
        setError('Salle de sport non trouvée');
        setLoading(false);
      }
    }
  }, [id, isNewGym]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGym(prevGym => ({ ...prevGym, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGym(prevGym => ({ ...prevGym, [name]: parseFloat(value) }));
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setGym(prevGym => {
      if (checked) {
        return { ...prevGym, amenities: [...prevGym.amenities, value] };
      } else {
        return { ...prevGym, amenities: prevGym.amenities.filter((a: string) => a !== value) };
      }
    });
  };

  const handleOpeningHoursChange = (day: DayOfWeek, type: 'open' | 'close', value: string) => {
    setGym(prevGym => ({
      ...prevGym,
      openingHours: {
        ...prevGym.openingHours,
        [day]: {
          ...prevGym.openingHours[day],
          [type]: value
        }
      }
    }));
  };

  const handleDayClosedChange = (day: DayOfWeek, closed: boolean) => {
    setGym(prevGym => ({
      ...prevGym,
      openingHours: {
        ...prevGym.openingHours,
        [day]: {
          ...prevGym.openingHours[day],
          closed
        }
      }
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGym(prevGym => ({
      ...prevGym,
      contact: {
        ...prevGym.contact,
        [name]: value
      }
    }));
  };

  // Gestion des forfaits
  const addPlan = () => {
    const newPlan: GymPlan = {
      id: uuidv4(),
      name: '',
      price: 0,
      duration: 'monthly',
      features: []
    };
    
    setGym(prevGym => ({
      ...prevGym,
      plans: [...prevGym.plans, newPlan]
    }));
  };

  const updatePlan = (index: number, field: string, value: any) => {
    setGym(prevGym => {
      const updatedPlans = [...prevGym.plans];
      updatedPlans[index] = {
        ...updatedPlans[index],
        [field]: value
      };
      return { ...prevGym, plans: updatedPlans };
    });
  };

  const removePlan = (index: number) => {
    setGym(prevGym => ({
      ...prevGym,
      plans: prevGym.plans.filter((_: any, i: number) => i !== index)
    }));
  };

  const updatePlanFeatures = (index: number, features: string) => {
    setGym(prevGym => {
      const updatedPlans = [...prevGym.plans];
      updatedPlans[index] = {
        ...updatedPlans[index],
        features: features.split(',').map(f => f.trim()).filter(f => f)
      };
      return { ...prevGym, plans: updatedPlans };
    });
  };

  // Gestion des images
  const addImageField = () => {
    setGym(prevGym => ({
      ...prevGym,
      images: [...prevGym.images, '']
    }));
  };

  const updateImage = (index: number, value: string) => {
    setGym(prevGym => {
      const updatedImages = [...prevGym.images];
      updatedImages[index] = value;
      return { ...prevGym, images: updatedImages };
    });
  };

  const removeImage = (index: number) => {
    setGym(prevGym => ({
      ...prevGym,
      images: prevGym.images.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isNewGym) {
        gymService.addGym(gym);
      } else {
        gymService.updateGym(id as string, gym);
      }
      navigate('/admin/gyms');
    } catch (err) {
      setError('Erreur lors de la sauvegarde de la salle de sport');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isNewGym) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isNewGym ? 'Ajouter une nouvelle salle de sport' : 'Modifier la salle de sport'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la salle *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={gym.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center space-x-3 mt-6 md:mt-0">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={gym.featured || false}
                onChange={(e) => setGym({...gym, featured: e.target.checked})}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Mise en avant (salle recommandée)
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={gym.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Adresse */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Adresse</h2>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={gym.address}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Ville *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={gym.city}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                Code postal *
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={gym.zipCode}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Informations de contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={gym.contact.phone}
                onChange={handleContactChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={gym.contact.email}
                onChange={handleContactChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Site web
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={gym.contact.website || ''}
                onChange={handleContactChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Équipements */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Équipements</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AMENITIES_OPTIONS.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`amenity-${option.value}`}
                  name="amenities"
                  value={option.value}
                  checked={gym.amenities.includes(option.value)}
                  onChange={handleAmenityChange}
                  className="h-4 w-4 text-blue-600 mr-2"
                />
                <label htmlFor={`amenity-${option.value}`} className="text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Forfaits */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Forfaits</h2>
            <button
              type="button"
              onClick={addPlan}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Ajouter un forfait
            </button>
          </div>
          
          {gym.plans.length === 0 ? (
            <p className="text-gray-500 italic">Aucun forfait ajouté</p>
          ) : (
            <div className="space-y-6">
              {gym.plans.map((plan: GymPlan, index: number) => (
                <div key={plan.id} className="border rounded p-4 bg-gray-50 relative">
                  <button
                    type="button"
                    onClick={() => removePlan(index)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                    title="Supprimer ce forfait"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du forfait *
                      </label>
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => updatePlan(index, 'name', e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix (€) *
                      </label>
                      <input
                        type="number"
                        value={plan.price}
                        onChange={(e) => updatePlan(index, 'price', parseFloat(e.target.value))}
                        min="0"
                        step="0.01"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Durée *
                      </label>
                      <select
                        value={plan.duration}
                        onChange={(e) => updatePlan(index, 'duration', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="daily">Journalier</option>
                        <option value="weekly">Hebdomadaire</option>
                        <option value="monthly">Mensuel</option>
                        <option value="yearly">Annuel</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Caractéristiques (séparées par des virgules) *
                    </label>
                    <input
                      type="text"
                      value={plan.features.join(', ')}
                      onChange={(e) => updatePlanFeatures(index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Ex: Accès machines, Vestiaires, Cours collectifs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Images</h2>
            <button
              type="button"
              onClick={addImageField}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Ajouter une image
            </button>
          </div>
          
          {gym.images.length === 0 ? (
            <p className="text-gray-500 italic">Aucune image ajoutée</p>
          ) : (
            <div className="space-y-4">
              {gym.images.map((image: string, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    placeholder="URL de l'image (ex: /images/gym1.jpg)"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer cette image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="mt-2 text-sm text-gray-500">
            Note: Pour les images, vous pouvez utiliser des URLs absolues ou des chemins relatifs (ex: /images/gym1.jpg).
          </p>
        </div>

        {/* Horaires d'ouverture */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Horaires d'ouverture</h2>
          
          <div className="space-y-4">
            {DAYS_OF_WEEK.map(day => (
              <div key={day.id} className="grid grid-cols-6 gap-4 items-center">
                <div className="col-span-2 md:col-span-1">
                  <span className="text-sm font-medium">{day.label}</span>
                </div>
                
                <div className="col-span-4 md:col-span-5 flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`closed-${day.id}`}
                      checked={gym.openingHours[day.id].closed || false}
                      onChange={(e) => handleDayClosedChange(day.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 mr-2"
                    />
                    <label htmlFor={`closed-${day.id}`} className="text-sm text-gray-700">
                      Fermé
                    </label>
                  </div>
                  
                  {!gym.openingHours[day.id].closed && (
                    <>
                      <div className="flex-1">
                        <label htmlFor={`open-${day.id}`} className="sr-only">Heure d'ouverture pour {day.label}</label>
                        <input
                          type="time"
                          id={`open-${day.id}`}
                          value={gym.openingHours[day.id].open}
                          onChange={(e) => handleOpeningHoursChange(day.id, 'open', e.target.value)}
                          className="p-2 border border-gray-300 rounded w-full"
                        />
                      </div>
                      <span className="text-gray-500">à</span>
                      <div className="flex-1">
                        <label htmlFor={`close-${day.id}`} className="sr-only">Heure de fermeture pour {day.label}</label>
                        <input
                          type="time"
                          id={`close-${day.id}`}
                          value={gym.openingHours[day.id].close}
                          onChange={(e) => handleOpeningHoursChange(day.id, 'close', e.target.value)}
                          className="p-2 border border-gray-300 rounded w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/gyms')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminGymForm;