// Service API pour communiquer avec le backend
// À utiliser à la place du localStorage

import { Memory } from '../types';
import { CommentaireAvecModeration } from '../utils/commentairesManager';

// URL de l'API - Changez-la en fonction de l'environnement
const API_URL = import.meta.env.MODE === 'production'
  ? 'https://mawkzy-subathon-backend.onrender.com/api' // URL de production sur Render
  : 'http://localhost:5000/api'; // URL de développement en local

console.log('Mode:', import.meta.env.MODE);
console.log('API URL:', API_URL);

// Fonction helper pour gérer les erreurs de fetch
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Une erreur est survenue'
    }));
    throw new Error(error.message || 'Une erreur est survenue');
  }
  return response.json();
};

// API pour les souvenirs (memories)
export const memoriesApi = {
  // Récupérer tous les souvenirs
  getAll: async (): Promise<Memory[]> => {
    try {
      const response = await fetch(`${API_URL}/memories`);
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des souvenirs:', error);
      // Fallback sur localStorage si l'API échoue
      const storedMemories = localStorage.getItem('memories');
      return storedMemories ? JSON.parse(storedMemories) : [];
    }
  },

  // Ajouter un nouveau souvenir
  add: async (memory: Omit<Memory, 'id' | 'likes' | 'approved'>): Promise<Memory> => {
    try {
      const response = await fetch(`${API_URL}/memories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memory),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un souvenir:', error);
      throw error;
    }
  },

  // Liker un souvenir
  like: async (id: string): Promise<Memory> => {
    try {
      const response = await fetch(`${API_URL}/memories/${id}/like`, {
        method: 'POST',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors du like d\'un souvenir:', error);
      throw error;
    }
  },

  // Supprimer un souvenir (admin seulement)
  delete: async (id: string, apiKey: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/admin/memories/${id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': apiKey,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la suppression d\'un souvenir:', error);
      throw error;
    }
  },

  // Approuver un souvenir (admin seulement)
  approve: async (id: string, apiKey: string): Promise<Memory> => {
    try {
      const response = await fetch(`${API_URL}/admin/memories/${id}/approve`, {
        method: 'PUT',
        headers: {
          'x-api-key': apiKey,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de l\'approbation d\'un souvenir:', error);
      throw error;
    }
  },
};

// API pour les commentaires
export const commentsApi = {
  // Récupérer tous les commentaires
  getAll: async (): Promise<CommentaireAvecModeration[]> => {
    try {
      const response = await fetch(`${API_URL}/comments`);
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      // Fallback sur localStorage si l'API échoue
      const storedComments = localStorage.getItem('commentaires');
      return storedComments ? JSON.parse(storedComments) : [];
    }
  },

  // Ajouter un nouveau commentaire
  add: async (comment: { auteur: string; message: string }): Promise<CommentaireAvecModeration> => {
    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un commentaire:', error);
      throw error;
    }
  },

  // Approuver un commentaire (admin seulement)
  approve: async (id: string, apiKey: string): Promise<CommentaireAvecModeration> => {
    try {
      const response = await fetch(`${API_URL}/admin/comments/${id}/approve`, {
        method: 'PUT',
        headers: {
          'x-api-key': apiKey,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de l\'approbation d\'un commentaire:', error);
      throw error;
    }
  },

  // Rejeter un commentaire (admin seulement)
  reject: async (id: string, reason: string, apiKey: string): Promise<CommentaireAvecModeration> => {
    try {
      const response = await fetch(`${API_URL}/admin/comments/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ reason }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors du rejet d\'un commentaire:', error);
      throw error;
    }
  },

  // Supprimer un commentaire (admin seulement)
  delete: async (id: string, apiKey: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/admin/comments/${id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': apiKey,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la suppression d\'un commentaire:', error);
      throw error;
    }
  },
};

// API pour l'authentification admin
export const authApi = {
  // Vérifier si une clé API est valide
  validateApiKey: async (apiKey: string): Promise<{ valid: boolean }> => {
    try {
      const response = await fetch(`${API_URL}/admin/validate`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la validation de la clé API:', error);
      return { valid: false };
    }
  },
};

export default {
  memories: memoriesApi,
  comments: commentsApi,
  auth: authApi,
}; 