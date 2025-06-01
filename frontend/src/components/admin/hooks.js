import { useState, useEffect } from "react";

/**
 * Custom hook für API-Aufrufe mit Token-basierter Authentifizierung
 */
const useApi = () => {
  // WICHTIG: In der echten Anwendung localStorage verwenden
  // Hier wird ein Mock-Token verwendet, da localStorage in Artifacts nicht verfügbar ist
  const token = "mock-token"; // localStorage.getItem("token");
  const baseURL = "http://localhost:8080/api";

  const apiCall = async (endpoint, options = {}) => {
    const url = `${baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  };

  return {
    get: (endpoint) => apiCall(endpoint),
    post: (endpoint, data) => apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    put: (endpoint, data) => apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' })
  };
};

/**
 * Custom hook für Anwendungsdaten-Management
 */
const useAppData = () => {
  const [data, setData] = useState({
    movies: [],
    series: [],
    users: [],
    reviews: [],
    seasons: [],
    episodes: [],
    reviewUsers: {}
  });
  const [loading, setLoading] = useState(false);
  const api = useApi();

  const loadData = async () => {
    setLoading(true);
    try {
      const [movies, series, users, reviews] = await Promise.all([
        api.get('/movies'),
        api.get('/series'),
        api.get('/users'),
        api.get('/reviews')
      ]);

      setData(prev => ({ ...prev, movies, series, users, reviews }));
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const loadSeasons = async (seriesId) => {
    try {
      const seasons = await api.get(`/series/${seriesId}/seasons`);
      setData(prev => ({ ...prev, seasons }));
    } catch (error) {
      console.error("Error loading seasons:", error);
    }
  };

  const loadEpisodes = async (seriesId, seasonNumber) => {
    try {
      const episodes = await api.get(`/series/${seriesId}/seasons/${seasonNumber}/episodes`);
      setData(prev => ({ ...prev, episodes }));
    } catch (error) {
      console.error("Error loading episodes:", error);
    }
  };

  return { data, setData, loading, loadData, loadSeasons, loadEpisodes, api };
};

/**
 * Custom hook für Modal-States
 */
const useAdminModals = () => {
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    seasons: false,
    addSeason: false,
    editSeason: false,
    episodes: false,
    addEpisode: false,
    editEpisode: false
  });

  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  const closeAllModals = () => {
    setModals({
      add: false,
      edit: false,
      seasons: false,
      addSeason: false,
      editSeason: false,
      episodes: false,
      addEpisode: false,
      editEpisode: false
    });
  };

  return { modals, openModal, closeModal, closeAllModals };
};

/**
 * Custom hook für Form-States
 */
const useAdminForms = () => {
  const [forms, setForms] = useState({
    newContent: {
      title: "", description: "", genre: "", releaseDate: "",
      type: "movie", duration: "", posterUrl: "", country: "", trailerUrl: ""
    },
    editingContent: null,
    selectedSeries: null,
    selectedSeason: null,
    newSeason: { seasonNumber: "", trailerUrl: "" },
    editingSeason: null,
    newEpisode: { 
      episodeNumber: "", title: "", description: "", 
      duration: "", releaseDate: "", posterUrl: "" 
    },
    editingEpisode: null
  });

  const updateForm = (formName, data) => {
    setForms(prev => ({ ...prev, [formName]: data }));
  };

  const resetForm = (formName) => {
    const initialValues = {
      newContent: {
        title: "", description: "", genre: "", releaseDate: "",
        type: "movie", duration: "", posterUrl: "", country: "", trailerUrl: ""
      },
      newSeason: { seasonNumber: "", trailerUrl: "" },
      newEpisode: { 
        episodeNumber: "", title: "", description: "", 
        duration: "", releaseDate: "", posterUrl: "" 
      }
    };

    if (initialValues[formName]) {
      setForms(prev => ({ ...prev, [formName]: initialValues[formName] }));
    } else {
      setForms(prev => ({ ...prev, [formName]: null }));
    }
  };

  const resetAllForms = () => {
    setForms({
      newContent: {
        title: "", description: "", genre: "", releaseDate: "",
        type: "movie", duration: "", posterUrl: "", country: "", trailerUrl: ""
      },
      editingContent: null,
      selectedSeries: null,
      selectedSeason: null,
      newSeason: { seasonNumber: "", trailerUrl: "" },
      editingSeason: null,
      newEpisode: { 
        episodeNumber: "", title: "", description: "", 
        duration: "", releaseDate: "", posterUrl: "" 
      },
      editingEpisode: null
    });
  };

  return { forms, updateForm, resetForm, resetAllForms };
};

/**
 * Custom hook für alle CRUD-Operationen
 */
const useAdminOperations = () => {
  const { api } = useAppData();

  // Content Operations
  const addContent = async (contentData, loadDataCallback) => {
    try {
      const endpoint = contentData.type === "movie" ? "movies" : "series";
      const data = { ...contentData };

      if (data.releaseDate) {
        data.releaseDate = new Date(data.releaseDate).getTime();
      }

      await api.post(`/${endpoint}`, data);
      await loadDataCallback();
      return true;
    } catch (error) {
      console.error("Error adding content:", error);
      return false;
    }
  };

  const updateContent = async (contentData, loadDataCallback) => {
    try {
      const endpoint = contentData.type === "movie" ? "movies" : "series";
      const data = { ...contentData };

      if (data.releaseDate) {
        data.releaseDate = new Date(data.releaseDate).getTime();
      }

      await api.put(`/${endpoint}/${data.id}`, data);
      await loadDataCallback();
      return true;
    } catch (error) {
      console.error("Error updating content:", error);
      return false;
    }
  };

  const deleteContent = async (id, type, loadDataCallback) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diesen Inhalt löschen möchten?")) {
      return false;
    }

    try {
      const endpoint = type === "movie" ? "movies" : "series";
      await api.delete(`/${endpoint}/${id}`);
      await loadDataCallback();
      return true;
    } catch (error) {
      console.error("Error deleting content:", error);
      return false;
    }
  };

  // Season Operations
  const addSeason = async (seriesId, seasonData, loadSeasonsCallback) => {
    try {
      await api.post(`/series/${seriesId}/seasons`, seasonData);
      await loadSeasonsCallback();
      return true;
    } catch (error) {
      console.error("Error adding season:", error);
      return false;
    }
  };

  const updateSeason = async (seriesId, seasonData, loadSeasonsCallback) => {
    try {
      await api.put(`/series/${seriesId}/seasons/${seasonData.seasonNumber}`, seasonData);
      await loadSeasonsCallback();
      return true;
    } catch (error) {
      console.error("Error updating season:", error);
      return false;
    }
  };

  const deleteSeason = async (seriesId, seasonNumber, loadSeasonsCallback) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diese Staffel löschen möchten?")) {
      return false;
    }

    try {
      await api.delete(`/series/${seriesId}/seasons/${seasonNumber}`);
      await loadSeasonsCallback();
      return true;
    } catch (error) {
      console.error("Error deleting season:", error);
      return false;
    }
  };

  // Episode Operations
  const addEpisode = async (seriesId, seasonNumber, episodeData, loadEpisodesCallback) => {
    try {
      const data = { ...episodeData };
      if (data.releaseDate) {
        data.releaseDate = new Date(data.releaseDate).getTime();
      }

      await api.post(`/series/${seriesId}/seasons/${seasonNumber}/episodes`, data);
      await loadEpisodesCallback();
      return true;
    } catch (error) {
      console.error("Error adding episode:", error);
      return false;
    }
  };

  const updateEpisode = async (seriesId, seasonNumber, episodeData, loadEpisodesCallback) => {
    try {
      const data = { ...episodeData };
      if (data.releaseDate) {
        data.releaseDate = new Date(data.releaseDate).getTime();
      }

      await api.put(`/series/${seriesId}/seasons/${seasonNumber}/episodes/${data.episodeNumber}`, data);
      await loadEpisodesCallback();
      return true;
    } catch (error) {
      console.error("Error updating episode:", error);
      return false;
    }
  };

  const deleteEpisode = async (seriesId, seasonNumber, episodeNumber, loadEpisodesCallback) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diese Episode löschen möchten?")) {
      return false;
    }

    try {
      await api.delete(`/series/${seriesId}/seasons/${seasonNumber}/episodes/${episodeNumber}`);
      await loadEpisodesCallback();
      return true;
    } catch (error) {
      console.error("Error deleting episode:", error);
      return false;
    }
  };

  // Review Operations
  const deleteReview = async (reviewId, loadDataCallback) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      await loadDataCallback();
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      return false;
    }
  };

  return {
    // Content
    addContent,
    updateContent,
    deleteContent,
    // Season
    addSeason,
    updateSeason,
    deleteSeason,
    // Episode
    addEpisode,
    updateEpisode,
    deleteEpisode,
    // Review
    deleteReview
  };
};

export { useApi, useAppData, useAdminModals, useAdminForms, useAdminOperations };