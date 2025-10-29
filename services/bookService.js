import api from './api';

const handleApiError = (error, defaultMessage) => {
  const message = error.response?.data?.error || error.response?.data?.message || defaultMessage;
  throw new Error(message);
};

const bookService = {
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

  getBookById: async (id) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors du chargement du livre');
    }
  },

  createBook: async (bookData) => {
    try {
      const { coverImage, ...payload } = bookData;
      const response = await api.post('/books', payload);
      const created = response.data;

      if (coverImage && created && created.id) {
        try {
          await api.put(`/books/${created.id}/cover`, { coverImage });
          const refreshed = await api.get(`/books/${created.id}`);
          return refreshed.data;
        } catch (err) {
          return created;
        }
      }

      return created;
    } catch (error) {
      handleApiError(error, 'Erreur lors de la création du livre');
    }
  },

  updateBook: async (id, bookData) => {
    try {
      const { coverImage, ...payload } = bookData;
      const response = await api.put(`/books/${id}`, payload);
      const updated = response.data;

      if (coverImage) {
        try {
          await api.put(`/books/${id}/cover`, { coverImage });
          const refreshed = await api.get(`/books/${id}`);
          return refreshed.data;
        } catch (err) {
          return updated;
        }
      }

      return updated;
    } catch (error) {
      handleApiError(error, 'Erreur lors de la mise à jour du livre');
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors de la suppression du livre');
    }
  },

  toggleReadStatus: async (id, currentStatus) => {
    try {
      const response = await api.put(`/books/${id}`, { read: !currentStatus });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors du changement de statut');
    }
  },

  toggleFavorite: async (id, currentStatus) => {
    try {
      const response = await api.put(`/books/${id}`, { favorite: !currentStatus });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors du changement de statut favori');
    }
  },

  updateRating: async (id, rating) => {
    try {
      const response = await api.put(`/books/${id}`, { rating });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors de la mise à jour de la note');
    }
  },

  getBookNotes: async (id) => {
    try {
      const response = await api.get(`/books/${id}/notes`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors du chargement des notes');
    }
  },

  addBookNote: async (id, content) => {
    try {
      const response = await api.post(`/books/${id}/notes`, { content });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors de l\'ajout de la note');
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors du chargement des statistiques');
    }
  },

  getBookCover: async (id) => {
    try {
      const response = await api.get(`/books/${id}/cover`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors du chargement de la couverture');
    }
  },

  setBookCover: async (id, base64Image) => {
    try {
      const response = await api.put(`/books/${id}/cover`, { coverImage: base64Image });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors de l\'upload de la couverture');
    }
  },

  deleteBookCover: async (id) => {
    try {
      const response = await api.delete(`/books/${id}/cover`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Erreur lors de la suppression de la couverture');
    }
  },

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