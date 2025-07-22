import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForumHome.css';

const ForumHome = () => {
    const [posts, setPosts] = useState([]);
    const [pinnedPosts, setPinnedPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    
    const navigate = useNavigate();

    /**
     * Fetches the current user information
     */
    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            const response = await fetch('http://localhost:8080/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setCurrentUser(userData);
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    /**
     * Fetches the available forum categories
     */
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/forum/categories');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    /**
     * Fetches the pinned posts
     */
    const fetchPinnedPosts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/forum/posts/pinned');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPinnedPosts(data);
        } catch (error) {
            console.error('Error fetching pinned posts:', error);
        }
    };

    /**
     * Fetches the forum posts
     */
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            let url = `http://localhost:8080/api/forum/posts?page=${currentPage}&size=10`;
            if (selectedCategory) {
                url += `&category=${selectedCategory}`;
            }
            if (sortBy) {
                url += `&sortBy=${sortBy}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            setPosts(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Fehler beim Laden der Beiträge');
            setLoading(false);
        }
    }, [currentPage, selectedCategory, sortBy]);

    useEffect(() => {
        fetchCategories();
        fetchPinnedPosts();
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    /**
     * Handles the search functionality
     */
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchPosts();
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/forum/posts/search?query=${encodeURIComponent(searchQuery)}&page=${currentPage}&size=10`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            setPosts(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error searching posts:', error);
            setError('Fehler bei der Suche');
            setLoading(false);
        }
    };

    /**
     * Formats date string
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Heute';
        if (diffDays === 2) return 'Gestern';
        if (diffDays <= 7) return `vor ${diffDays - 1} Tagen`;
        
        return date.toLocaleDateString('de-DE');
    };

    /**
     * Returns category display name
     */
    const getCategoryDisplayName = (category) => {
        const categoryMap = {
            'GENERAL': 'Allgemein',
            'MOVIE_DISCUSSION': 'Filme',
            'SERIES_DISCUSSION': 'Serien',
            'RECOMMENDATIONS': 'Empfehlungen',
            'REVIEWS': 'Bewertungen',
            'NEWS': 'News',
            'OFF_TOPIC': 'Off-Topic'
        };
        return categoryMap[category] || category;
    };

    const handleCreatePost = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        navigate('/forum/create-post');
    };

    if (loading && posts.length === 0) {
        return (
            <div className="forum-home">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Lädt...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="forum-home">
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Erneut versuchen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="forum-home">
            {/* Header */}
            <div className="forum-header">
                <h1>Forum</h1>
                <button className="create-btn" onClick={handleCreatePost}>
                    <span>+</span> Neuer Beitrag
                </button>
            </div>

            {/* Search and Filters */}
            <div className="forum-controls">
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Beiträge suchen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="search-input"
                    />
                </div>

                <div className="filters">
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Alle Kategorien</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {getCategoryDisplayName(category)}
                            </option>
                        ))}
                    </select>

                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Neueste</option>
                        <option value="popular">Beliebteste</option>
                        <option value="recent">Aktuelle</option>
                    </select>
                </div>
            </div>

            {/* Pinned Posts */}
            {pinnedPosts.length > 0 && (
                <div className="pinned-section">
                    <h2>Wichtige Beiträge</h2>
                    <div className="posts-grid">
                        {pinnedPosts.map(post => (
                            <div 
                                key={post.id} 
                                className="post-card pinned"
                                onClick={() => navigate(`/forum/post/${post.id}`)}
                            >
                                <div className="post-meta">
                                    <span className="category">
                                        {getCategoryDisplayName(post.category)}
                                    </span>
                                    <span className="pinned-badge">📌</span>
                                </div>
                                <h3>{post.title}</h3>
                                <div className="post-info">
                                    <span>{post.author?.username}</span>
                                    <span>{formatDate(post.createdAt)}</span>
                                    <div className="post-stats">
                                        <span>👍 {post.likesCount || 0}</span>
                                        <span>💬 {post.repliesCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Regular Posts */}
            <div className="posts-section">
                <h2>Alle Beiträge</h2>
                
                {posts.length === 0 ? (
                    <div className="no-posts">
                        <p>Noch keine Beiträge vorhanden.</p>
                        <button onClick={handleCreatePost} className="create-first-btn">
                            Ersten Beitrag erstellen
                        </button>
                    </div>
                ) : (
                    <div className="posts-grid">
                        {posts.map(post => (
                            <div 
                                key={post.id} 
                                className="post-card"
                                onClick={() => navigate(`/forum/post/${post.id}`)}
                            >
                                <div className="post-meta">
                                    <span className="category">
                                        {getCategoryDisplayName(post.category)}
                                    </span>
                                    {post.movieId && <span className="media-tag">🎬</span>}
                                    {post.seriesId && <span className="media-tag">📺</span>}
                                </div>
                                <h3>{post.title}</h3>
                                <p className="post-preview">
                                    {post.content.length > 120 ? 
                                        `${post.content.substring(0, 120)}...` : 
                                        post.content
                                    }
                                </p>
                                <div className="post-info">
                                    <span>{post.author?.username}</span>
                                    <span>{formatDate(post.createdAt)}</span>
                                    <div className="post-stats">
                                        <span>👍 {post.likesCount || 0}</span>
                                        <span>💬 {post.repliesCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            className="page-btn"
                        >
                            ← Zurück
                        </button>
                        <span className="page-info">Seite {currentPage + 1} von {totalPages}</span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="page-btn"
                        >
                            Weiter →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumHome;
