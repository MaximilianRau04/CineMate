import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateForumPost.css';

const CreateForumPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('GENERAL');
    const [movieId, setMovieId] = useState('');
    const [seriesId, setSeriesId] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    /**
     * Fetches the list of forum categories from the backend.
     * @returns {Promise<void>}
     */
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/forum/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    /**
     * handles the form submission to create a new forum post.
     * @param {*} e  
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError('Titel und Inhalt sind erforderlich');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const postData = {
                title: title.trim(),
                content: content.trim(),
                category: category,
                movieId: movieId || null,
                seriesId: seriesId || null
            };

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/forum/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : undefined
                },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                const createdPost = await response.json();
                navigate(`/forum/post/${createdPost.id}`);
            } else {
                throw new Error('Error creating post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Fehler beim Erstellen des Beitrags');
            setLoading(false);
        }
    };

    /**
     * returns the display name for a given category.
     * @param {*} category 
     * @returns category display name 
     */
    const getCategoryDisplayName = (category) => {
        const categoryMap = {
            'GENERAL': 'Allgemeine Diskussion',
            'MOVIE_DISCUSSION': 'Film-Diskussion',
            'SERIES_DISCUSSION': 'Serien-Diskussion',
            'RECOMMENDATIONS': 'Empfehlungen',
            'REVIEWS': 'Bewertungen',
            'NEWS': 'News & Updates',
            'OFF_TOPIC': 'Off-Topic'
        };
        return categoryMap[category] || category;
    };

    return (
        <div className="create-forum-post">
            <div className="create-post-header">
                <button 
                    className="back-button" 
                    onClick={() => navigate('/forum')}
                >
                    ← Zurück zum Forum
                </button>
                <h1 className="text-white">✍️ Neuen Beitrag erstellen</h1>
            </div>

            <form className="create-post-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Titel *</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Gib deinem Beitrag einen aussagekräftigen Titel..."
                        required
                        maxLength={200}
                    />
                    <div className="char-count">
                        {title.length}/200
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="category">Kategorie *</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {getCategoryDisplayName(cat)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="movieId">Film ID (optional)</label>
                        <input
                            type="text"
                            id="movieId"
                            value={movieId}
                            onChange={(e) => setMovieId(e.target.value)}
                            placeholder="Wenn der Beitrag einen spezifischen Film betrifft..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="seriesId">Serie ID (optional)</label>
                        <input
                            type="text"
                            id="seriesId"
                            value={seriesId}
                            onChange={(e) => setSeriesId(e.target.value)}
                            placeholder="Wenn der Beitrag eine spezifische Serie betrifft..."
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="content">Inhalt *</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Schreibe hier deinen Beitrag..."
                        required
                        rows="12"
                        maxLength={5000}
                    />
                    <div className="char-count">
                        {content.length}/5000
                    </div>
                </div>

                <div className="form-tips">
                    <h3>💡 Tipps für einen guten Beitrag:</h3>
                    <ul>
                        <li>Verwende einen aussagekräftigen Titel</li>
                        <li>Wähle die passende Kategorie</li>
                        <li>Strukturiere deinen Text mit Absätzen</li>
                        <li>Sei respektvoll und konstruktiv</li>
                        <li>Verwende die Spoiler-Warnung bei Bedarf</li>
                    </ul>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => navigate('/forum')}
                    >
                        Abbrechen
                    </button>
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading || !title.trim() || !content.trim()}
                    >
                        {loading ? 'Wird erstellt...' : 'Beitrag erstellen'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateForumPost;
