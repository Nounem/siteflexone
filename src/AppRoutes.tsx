import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Pages publiques
import HomePage from './pages/HomePage';
import FindGymPage from './pages/FindGymPage';
import FindGymMapPage from './pages/FindGymMapPage'; // Nouvelle page avec carte
import GymDetailPage from './pages/GymDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Pages d'administration
import AdminPage from './pages/AdminPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminGymList from './pages/AdminGymList';
import AdminGymForm from './pages/AdminGymForm';
import AdminImportExport from './pages/AdminImportExport';

const AppRoutes: React.FC = () => {
  // À remplacer par une véritable logique d'authentification
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
      {/* Routes publiques avec Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/find-gym" element={<FindGymPage />} />
        <Route path="/find-gym-map" element={<FindGymMapPage />} /> {/* Nouvelle route */}
        <Route path="/gyms/:id" element={<GymDetailPage />} />
      </Route>
      
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