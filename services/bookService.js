import api from './api';

const handleApiError = (error, defaultMessage) => {
  const message = error.response?.data?.error || error.response?.data?.message || defaultMessage;
  throw new Error(message);
};

const bookService = {
  // Récupérer tous les livres avec options de filtrage et tri
  getAllBooks: async ({
    query = '',
    author = '',
    read,
    favorite,
    theme = '',
    sort = '',
    order = 'asc'
  } = {}) => {
    try {
      const params = {
        ...(query && { q: query }),
        ...(author && { author }),
        ...(read !== undefined && { read }),
        ...(favorite !== undefined && { favorite }),
        ...(theme && { theme }),
        ...(sort && { sort, order })
      };
      const response = await api.get('/books', { params });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors du chargement des livres');
    }
  },

  // Récupérer un livre par ID
  getBookById: async (id) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors du chargement du livre');
    }
  },

  // Créer un nouveau livre
  createBook: async (bookData) => {
    try {
      const response = await api.post('/books', bookData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors de la création du livre');
    }
  },

  // Mettre à jour un livre
  updateBook: async (id, bookData) => {
    try {
      const response = await api.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors de la mise à jour du livre');
    }
  },

  // Supprimer un livre
  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors de la suppression du livre');
    }
  },

  // Toggle statut lu/non lu
  toggleReadStatus: async (id, currentStatus) => {
    try {
      const response = await api.put(`/books/${id}`, { read: !currentStatus });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors du changement de statut');
    }
  },

  // Toggle favori
  toggleFavorite: async (id, currentStatus) => {
    try {
      const response = await api.put(`/books/${id}`, { favorite: !currentStatus });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors du changement de statut favori');
    }
  },

  // Mettre à jour la note
  updateRating: async (id, rating) => {
    try {
      const response = await api.put(`/books/${id}`, { rating });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors de la mise à jour de la note');
    }
  },

  // Récupérer les notes d'un livre
  getBookNotes: async (id) => {
    try {
      const response = await api.get(`/books/${id}/notes`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors du chargement des notes');
    }
  },

  // Ajouter une note à un livre
  addBookNote: async (id, content) => {
    try {
      const response = await api.post(`/books/${id}/notes`, { content });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors de l\'ajout de la note');
    }
  },

  // Obtenir les statistiques
  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors du chargement des statistiques');
    }
  },

  // Réinitialiser les données
  resetData: async () => {
    try {
      const response = await api.post('/reset');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors de la réinitialisation des données');
    }
  }
};

export default bookService;