import React, { useState, useRef } from 'react';
import gymService from '../../../services/gymService';

const CsvImportForm: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const csvContent = await readFileAsText(file);
      const importedCount = gymService.importGymsFromCsv(csvContent);
      
      setUploadResult({
        success: true,
        message: `${importedCount} salle(s) importée(s) avec succès.`
      });
      
      // Réinitialiser le champ de fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      setUploadResult({
        success: false,
        message: `Erreur lors de l'importation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Impossible de lire le fichier'));
        }
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsText(file);
    });
  };

  const handleExportClick = () => {
    const csvContent = gymService.exportGymsToCsv();
    
    // Créer un blob et un lien pour télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `gyms-export-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Import/Export CSV</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Importer des salles</h3>
          <p className="text-gray-600 mb-4">
            Téléchargez un fichier CSV contenant vos salles. Le fichier doit avoir les colonnes suivantes:
            ID, Nom, Adresse, Ville, Code Postal, Description, Équipements, Forfaits, Contact, Évaluation.
          </p>
          
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              disabled={isUploading}
            />
            
            {isUploading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
            )}
          </div>
          
          {uploadResult && (
            <div className={`mt-3 p-3 rounded ${uploadResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {uploadResult.message}
            </div>
          )}
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-2">Exporter les salles</h3>
          <p className="text-gray-600 mb-4">
            Téléchargez toutes vos salles au format CSV pour les sauvegarder ou les modifier dans un tableur.
          </p>
          
          <button
            onClick={handleExportClick}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Exporter en CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default CsvImportForm;