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
     * @returns {Promise<void>}
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
     * Fetches the available forum categories from the backend.
     * @returns {Promise<void>}
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
     * Fetches the pinned posts from the backend.
     * @returns {Promise<void>}
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
     * Fetches the forum posts based on selected category, sort option, and pagination.
     * @returns {Promise<void>}
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
     * handles the search functionality for forum posts.
     * @returns {Promise<void>}
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
     * formats the date string to a readable format.
     * @param {*} dateString 
     * @returns formatted date string 
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    const handleCreatePost = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        navigate('/forum/create-post');
    };

    if (loading) {
        return (
            <div className="forum-home">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Beiträge werden geladen...</p>
                </div>
            </div>
        );
    }

    if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Fehler</h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

    return (
        <div className="forum-home">
            <div className="forum-header">
                <h1>🎬 CineMate Forum</h1>
                <p>Diskutiere mit anderen über Filme und Serien</p>
                {currentUser && (
                    <div className="user-welcome">
                        Willkommen zurück, <strong>{currentUser.username}</strong>! 👋
                    </div>
                )}
            </div>

            <div className="forum-controls">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Beiträge durchsuchen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch}>🔍</button>
                </div>

                <div className="filter-controls">
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
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
                    >
                        <option value="">Neuste zuerst</option>
                        <option value="popular">Beliebteste</option>
                        <option value="recent">Kürzlich aktiv</option>
                    </select>

                    <button 
                        className="create-post-btn"
                        onClick={handleCreatePost}
                    >
                        ➕ Neuer Beitrag
                    </button>
                </div>
            </div>

            {/* Pinned Posts */}
            {pinnedPosts.length > 0 && (
                <div className="pinned-posts">
                    <h2>📌 Angepinnte Beiträge</h2>
                    <div className="posts-list">
                        {pinnedPosts.map(post => (
                            <div key={post.id} className="post-item pinned">
                                <div className="post-header">
                                    <h3 onClick={() => navigate(`/forum/post/${post.id}`)}>{post.title}</h3>
                                    <span className="post-category">{getCategoryDisplayName(post.category)}</span>
                                </div>
                                <div className="post-meta">
                                    <span className="post-author">von {post.author?.username || 'Unbekannter Autor'}</span>
                                    <span className="post-date">{formatDate(post.createdAt)}</span>
                                    <div className="post-stats">
                                        <span>👍 {post.likesCount}</span>
                                        <span>💬 {post.repliesCount}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Regular Posts */}
            <div className="forum-posts">
                <h2 className="text-white">💬 Alle Beiträge</h2>
                {posts.length === 0 ? (
                    <div className="no-posts">
                        <p>Keine Beiträge gefunden.</p>
                        <button onClick={handleCreatePost}>
                            Ersten Beitrag erstellen
                        </button>
                    </div>
                ) : (
                    <div className="posts-list">
                        {posts.map(post => (
                            <div key={post.id} className="post-item">
                                <div className="post-header">
                                    <h3 onClick={() => navigate(`/forum/post/${post.id}`)}>{post.title}</h3>
                                    <span className="post-category">{getCategoryDisplayName(post.category)}</span>
                                </div>
                                <div className="post-content-preview">
                                    {post.content.length > 200 ? 
                                        `${post.content.substring(0, 200)}...` : 
                                        post.content
                                    }
                                </div>
                                <div className="post-meta">
                                    <span className="post-author">von {post.author?.username || 'Unbekannter Autor'}</span>
                                    <span className="post-date">{formatDate(post.createdAt)}</span>
                                    <div className="post-stats">
                                        <span>👍 {post.likesCount}</span>
                                        <span>💬 {post.repliesCount}</span>
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
                        >
                            ◀ Zurück
                        </button>
                        <span>Seite {currentPage + 1} von {totalPages}</span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                        >
                            Weiter ▶
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumHome;
