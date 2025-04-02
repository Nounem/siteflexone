// useToast.tsx
import { useState, useCallback } from 'react';

// Types pour les toasts
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

interface ToastOptions {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

// Hook pour gérer les toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, action, variant = 'default' }: ToastOptions) => {
    const id = Date.now().toString();
    const newToast = { id, title, description, action, variant };
    
    setToasts((currentToasts) => [...currentToasts, newToast]);
    
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    toast,
    dismiss
  };
}

// Créer un contexte et un provider pour le toast
export const toast = (options: ToastOptions) => {
  // Cette fonction est utilisée pour simuler l'utilisation directe de toast
  // Si vous utilisez un contexte, vous pourriez implémenter cela différemment
  console.warn('toast() appelé directement - en production, cela devrait utiliser un contexte');
  return '';
};