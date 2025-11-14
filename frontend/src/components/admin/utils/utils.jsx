import { useState } from 'react';

/**
 * A custom hook to handle API calls with token-based authentication.
 * It provides methods for GET, POST, PUT, and DELETE requests.
 * @returns {Object} 
 */
export const useApi = () => {
    const token = localStorage.getItem("token");
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
 * A custom hook to manage application data.
 * It provides methods to load movies, series, users, reviews, seasons, and episodes.
 * It also handles loading states and API interactions.
 * @returns {Object}
 */
export const useAppData = () => {
    const [data, setData] = useState({
        movies: [],
        series: [],
        users: [],
        reviews: [],
        seasons: [],
        episodes: [],
        reviewUsers: {},
        actors: [],
        directors: []
    });
    const [loading, setLoading] = useState(false);
    const api = useApi();

    // Load initial data from the API
    const loadData = async () => {
        setLoading(true);
        try {
            const [movies, series, users, reviews, actors, directors] = await Promise.all([
                api.get('/movies'),
                api.get('/series'),
                api.get('/users'),
                api.get('/reviews'),
                api.get('/actors'),
                api.get('/directors')
            ]);

            // Load review users
            const reviewUsers = {};
            await Promise.all(
                reviews.map(async (review) => {
                    try {
                        const user = await api.get(`/reviews/${review.id}/user`);
                        reviewUsers[review.id] = user;
                    } catch (error) {
                        console.error(`Error loading user for review ${review.id}:`, error);
                        reviewUsers[review.id] = { username: 'Unbekannt' };
                    }
                })
            );

            setData(prev => ({ ...prev, movies, series, users, reviews, reviewUsers, actors, directors }));
        } catch (error) {
            console.error("Error loading data:", error);
        }
        setLoading(false);
    };

    /**
     * fetches seasons for a given series ID.
     * @param {*} seriesId 
     */
    const loadSeasons = async (seriesId) => {
        try {
            const seasons = await api.get(`/series/${seriesId}/seasons`);
            setData(prev => ({ ...prev, seasons }));
        } catch (error) {
            console.error("Error loading seasons:", error);
        }
    };

    /**
     * loads episodes for a given series ID and season number.
     * @param {*} seriesId 
     * @param {*} seasonNumber 
     */
    const loadEpisodes = async (seriesId, seasonNumber) => {
        try {
            const episodes = await api.get(`/series/${seriesId}/seasons/${seasonNumber}/episodes`);
            setData(prev => ({ ...prev, episodes }));
        } catch (error) {
            console.error("Error loading episodes:", error);
        }
    };

    /**
     * assigns an actor to a movie.
     * @param {*} movieId 
     * @param {*} actorId 
     * @returns {boolean} 
     */
    const assignActorToMovie = async (movieId, actorId) => {
        try {
            await api.post(`/movies/${movieId}/actors/${actorId}`);
            return true;
        } catch (error) {
            console.error("Error assigning actor to movie:", error);
            return false;
        }
    };

    /**
     * removes an actor from a movie.
     * @param {*} movieId 
     * @param {*} actorId 
     * @returns {boolean} 
     */
    const removeActorFromMovie = async (movieId, actorId) => {
        try {
            await api.delete(`/movies/${movieId}/actors/${actorId}`);
            return true;
        } catch (error) {
            console.error("Error removing actor from movie:", error);
            return false;
        }
    };

    /**
     * assigns an actor to a series.
     * @param {*} movieId 
     * @param {*} actorId 
     * @returns {boolean} 
     */
    const assignActorToSeries = async (seriesId, actorId) => {
        try {
            await api.post(`/series/${seriesId}/actors/${actorId}`);
            return true;
        } catch (error) {
            console.error("Error assigning actor to series:", error);
            return false;
        }
    };

    /**
     * removes an actor from a series.
     * @param {*} movieId 
     * @param {*} actorId 
     * @returns {boolean} 
     */
    const removeActorFromSeries = async (seriesId, actorId) => {
        try {
            await api.delete(`/series/${seriesId}/actors/${actorId}`);
            return true;
        } catch (error) {
            console.error("Error removing actor from series:", error);
            return false;
        }
    };


    /**
     * assigns a director to a movie.
     * @param {*} movieId 
     * @param {*} directorId 
     * @returns {boolean}
     */
    const assignDirectorToMovie = async (movieId, directorId) => {
        try {
            await api.post(`/movies/${movieId}/directors/${directorId}`);
            return true;
        } catch (error) {
            console.error("Error assigning director to movie:", error);
            return false;
        }
    };

    /**
     * assigns a director to a series.
     * @param {*} seriesId
     * @param {*} directorId
     * @returns {boolean}
     */
    const assignDirectorToSeries = async (seriesId, directorId) => {
        try {
            await api.post(`/series/${seriesId}/directors/${directorId}`);
            return true;
        } catch (error) {
            console.error("Error assigning director to series:", error);
            return false;
        }
    };

    /**
     * removes a director from a movie.
     * @param {*} movieId
     * @param {*} directorId
     * @returns {boolean}
     */
    const removeDirectorFromSeries = async (seriesId, directorId) => {
        try {
            await api.delete(`/series/${seriesId}/directors/${directorId}`);
            return true;
        } catch (error) {
            console.error("Error removing director from series:", error);
            return false;
        }
    };

    /**
     * Deletes a user by ID.
     * @param {number} userId 
     * @returns {boolean}
     */
    const deleteUser = async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            setData(prev => ({
                ...prev,
                users: prev.users.filter(user => user.id !== userId)
            }));
            return true;
        } catch (error) {
            console.error("Error deleting user:", error);
            return false;
        }
    };

    return {
        data,
        setData,
        loading,
        loadData,
        loadSeasons,
        loadEpisodes,
        api,
        assignActorToMovie,
        removeActorFromMovie,
        assignActorToSeries,
        removeActorFromSeries,
        assignDirectorToMovie,
        assignDirectorToSeries,
        removeDirectorFromSeries,
        deleteUser
    };
};


// Formats a timestamp to a human-readable date string
export const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('de-DE');
};

// Formats a timestamp for use in an input field
export const formatDateForInput = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(parseInt(timestamp));
    return date.toISOString().split('T')[0];
};

// List of genres for content filtering
export const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
    "Romance", "Science Fiction", "Thriller", "War", "Western"
];
