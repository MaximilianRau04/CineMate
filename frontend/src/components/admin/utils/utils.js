import { useState } from 'react';

/**
 * A custom hook to handle API calls with token-based authentication.
 * It provides methods for GET, POST, PUT, and DELETE requests.
 * @returns 
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

export const useAppData = () => {
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

    // Load initial data from the API
    const loadData = async () => {
        setLoading(true);
        try {
            const [movies, series, users, reviews] = await Promise.all([
                api.get('/movies'),
                api.get('/series'),
                api.get('/users'),
                api.get('/reviews')
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

            setData(prev => ({ ...prev, movies, series, users, reviews, reviewUsers }));
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

    return { data, setData, loading, loadData, loadSeasons, loadEpisodes, api };
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

export const genres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
  "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
  "Romance", "Science Fiction", "Thriller", "War", "Western"
];
