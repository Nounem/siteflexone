import React from 'react';
import CsvImportForm from '../components/features/admin/CsvImportForm';

const AdminImportExport: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Import & Export de données</h1>
      
      <div className="space-y-8">
        <CsvImportForm />
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Format du fichier CSV</h3>
              <p className="text-gray-600">
                Pour importer correctement vos salles, assurez-vous que votre fichier CSV respecte le format suivant:
              </p>
              <div className="mt-2 p-3 bg-gray-50 rounded overflow-x-auto">
                <code className="text-sm">
                  ID,Nom,Adresse,Ville,Code Postal,Description,Équipements,Forfaits,Contact,Évaluation
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Exemple de ligne</h3>
              <div className="mt-2 p-3 bg-gray-50 rounded overflow-x-auto">
                <code className="text-sm whitespace-nowrap">
                  "",FitCenter,"123 Rue Principale","Paris",75001,"Salle de sport moderne","Musculation, Cardio, Sauna","Standard: 29.99€; Premium: 49.99€","contact@fitcenter.fr / 01 23 45 67 89",4.7
                </code>
              </div>
              <p className="text-gray-600 mt-2">
                Notez que les champs contenant des virgules doivent être entourés de guillemets doubles.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Conseils d'utilisation</h3>
              <ul className="list-disc pl-5 mt-2 text-gray-600 space-y-1">
                <li>Laissez le champ ID vide pour créer de nouvelles salles</li>
                <li>Vous pouvez modifier le CSV exporté dans Excel ou Google Sheets</li>
                <li>Pour mettre à jour des salles existantes, incluez leur ID dans le fichier</li>
                <li>Les équipements doivent être séparés par des virgules et entourés de guillemets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminImportExport;