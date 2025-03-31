import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/globals.css'; // Vérifiez que ce fichier existe et est importé
import './styles/animations.css'; // Ajout des animations
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
