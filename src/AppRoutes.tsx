import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages publiques
import HomePage from './pages/HomePage.tsx';
import FindGymPage from './pages/FindGymPage.tsx';
import GymDetailPage from './pages/GymDetailPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx'; // Verify the file exists at this path or adjust the path to match the actual file location

// Pages d'administration
import AdminPage from './pages/AdminPage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdminGymList from './pages/AdminGymList.tsx';
import AdminGymForm from './pages/AdminGymForm.tsx';
import AdminImportExport from './pages/AdminImportExport.tsx';

// Context d'authentification (à implémenter)
//import { useAuth } from '../contexts/AuthContext';

const AppRoutes: React.FC = () => {
  // À remplacer par une véritable logique d'authentification
 // const isAdmin = localStorage.getItem('user_role') === 'admin';
 const isAdmin = true; 

  // Composant de protection pour les routes administratives
  const AdminRoute = ({ children }: { children: React.ReactElement }) => {
    if (!isAdmin) {
      // Rediriger vers la page d'accueil si l'utilisateur n'est pas administrateur
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<HomePage />} />
      <Route path="/find-gym" element={<FindGymPage />} />
      <Route path="/gyms/:id" element={<GymDetailPage />} />
      
      {/* Routes administratives */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute children={<AdminPage />} />
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="gyms" element={<AdminGymList />} />
        <Route path="gyms/:id" element={<AdminGymForm />} />
        <Route path="gyms/new" element={<AdminGymForm />} />
        {/* Routes pour les utilisateurs et les avis à implémenter ultérieurement */}
        <Route path="users" element={<div className="p-6">Gestion des utilisateurs (à implémenter)</div>} />
        <Route path="reviews" element={<div className="p-6">Gestion des avis (à implémenter)</div>} />
        <Route path="import-export" element={<AdminImportExport />} />
      </Route>
      
      {/* Route 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;