import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ForumPostDetail.css';

const ForumPostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [replies, setReplies] = useState([]);
    const [subscriptionStatus, setSubscriptionStatus] = useState({ isSubscribed: false, subscriberCount: 0 });
    const [replyContent, setReplyContent] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [submittingReply, setSubmittingReply] = useState(false);

    useEffect(() => {
        fetchPost();
        fetchReplies();
        fetchSubscriptionStatus();
        fetchCurrentUser();
    }, [postId, currentPage]);

    /**
     * Fetches the forum post details
     * @return {Promise<void>} - Resolves when the post data is fetched
     * @throws {Error} - If fetching post data fails
     */
    const fetchPost = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/forum/posts/${postId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch post');
            }
            const data = await response.json();
            setPost(data);
        } catch (error) {
            console.error('Error fetching post:', error);
            setError('Beitrag konnte nicht geladen werden');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetches replies for the post
     * @param {number} currentPage - The current page number
     * @returns {Promise<void>} - Resolves when replies are fetched
     * @throws {Error} - If fetching replies fails
     */
    const fetchReplies = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/forum/posts/${postId}/replies?page=${currentPage}&size=10`);
            if (!response.ok) {
                throw new Error('Failed to fetch replies');
            }
            const data = await response.json();
            setReplies(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    /**
     * Fetches subscription status
     * @return {Promise<void>} - Resolves when subscription status is fetched
     * @throws {Error} - If fetching subscription status fails
     */
    const fetchSubscriptionStatus = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/forum/posts/${postId}/subscription-status`);
            if (response.ok) {
                const data = await response.json();
                setSubscriptionStatus(data);
            }
        } catch (error) {
            console.error('Error fetching subscription status:', error);
        }
    };

    /**
     * Fetches current user information
     * @return {Promise<void>} - Resolves when current user data is fetched
     * @throws {Error} - If fetching current user fails
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
     * Handles subscription toggle
     * @returns {Promise<void>} - Resolves when subscription status is toggled
     * @throws {Error} - If toggling subscription fails
     */
    const handleSubscribe = async () => {
        try {
            const method = subscriptionStatus.isSubscribed ? 'DELETE' : 'POST';
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/forum/posts/${postId}/subscribe`, {
                method: method,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : undefined
                }
            });
            
            if (response.ok) {
                fetchSubscriptionStatus();
            }
        } catch (error) {
            console.error('Error toggling subscription:', error);
        }
    };

    /**
     * Handles reply submission
     * @param {React.FormEvent} e - The form submission event
     * @returns {Promise<void>} - Resolves when the reply is submitted
     */
    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim() || submittingReply) return;

        setSubmittingReply(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/forum/posts/${postId}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : undefined
                },
                body: JSON.stringify({ content: replyContent.trim() })
            });

            if (response.ok) {
                setReplyContent('');
                fetchReplies();
                fetchPost(); 
            } else {
                throw new Error('Failed to submit reply');
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
        } finally {
            setSubmittingReply(false);
        }
    };

    /**
     * Handles like toggle
     * @returns {Promise<void>} - Resolves when like status is toggled
     * @throws {Error} - If toggling like fails
     */
    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            const method = post.likedByCurrentUser ? 'DELETE' : 'POST';
            const response = await fetch(`http://localhost:8080/api/forum/posts/${postId}/like`, {
                method: method,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : undefined
                }
            });
            
            if (response.ok) {
                fetchPost();
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    /**
     * Formats date to readable format
     * @param {string} dateString - The date string to format
     * @returns {string} - Formatted date string
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Heute';
        if (diffDays === 2) return 'Gestern';
        if (diffDays <= 7) return `vor ${diffDays - 1} Tagen`;
        
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric'
        });
    };

    /**
     * Returns category display name
     * @param {string} category - The category key
     * @returns {string} - The display name for the category
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

    if (loading) {
        return (
            <div className="forum-detail">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Lädt...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="forum-detail">
                <div className="error-container">
                    <p>{error || 'Beitrag nicht gefunden'}</p>
                    <button onClick={() => navigate('/forum')}>
                        Zurück zum Forum
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="forum-detail modern-forum-detail">
            {/* Hero Header */}
            <div className="detail-hero">
                <div className="hero-content">
                    <div className="hero-header">
                        <button className="modern-back-btn" onClick={() => navigate('/forum')}>
                            <span className="back-icon">←</span>
                            <span>Zurück zum Forum</span>
                        </button>
                        <div className="post-category-badge">
                            {getCategoryDisplayName(post.category)}
                        </div>
                    </div>
                    <h1 className="hero-title">{post.title}</h1>
                    <div className="hero-meta">
                        <div className="author-section">
                            <div className="author-avatar">
                                {post.author.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="author-details">
                                <span className="author-name">{post.author.username}</span>
                                <span className="post-date">{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                        <div className="post-badges">
                            {post.pinned && <span className="status-badge pinned">📌 Angepinnt</span>}
                            {post.locked && <span className="status-badge locked">🔒 Gesperrt</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-wrapper">
                {/* Post Content */}
                <div className="main-post-card">
                    <div className="post-content">
                        <p>{post.content}</p>
                    </div>
                    
                    <div className="post-interactions">
                        <div className="interaction-buttons">
                            {currentUser && (
                                <>
                                    <button 
                                        className={`interaction-btn like-btn ${post.likedByCurrentUser ? 'active' : ''}`}
                                        onClick={handleLike}
                                    >
                                        <span className="btn-icon">👍</span>
                                        <span className="btn-text">{post.likes || 0}</span>
                                    </button>
                                    <button 
                                        className={`interaction-btn subscribe-btn ${subscriptionStatus.isSubscribed ? 'active' : ''}`}
                                        onClick={handleSubscribe}
                                    >
                                        <span className="btn-icon">{subscriptionStatus.isSubscribed ? '🔔' : '🔕'}</span>
                                        <span className="btn-text">
                                            {subscriptionStatus.isSubscribed ? 'Abonniert' : 'Abonnieren'}
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="post-stats">
                            <div className="stat-item">
                                <span className="stat-icon">💬</span>
                                <span>{replies.length} Antworten</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-icon">👁️</span>
                                <span>{post.views || 0} Aufrufe</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reply Form */}
                {currentUser && !post.locked && (
                    <div className="reply-form-card">
                        <h4>Antwort schreiben</h4>
                        <form onSubmit={handleReplySubmit}>
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Schreibe deine Antwort..."
                                rows="4"
                                className="reply-textarea"
                                required
                            />
                            <div className="reply-form-actions">
                                <button 
                                    type="submit" 
                                    className="submit-reply-btn"
                                    disabled={submittingReply || !replyContent.trim()}
                                >
                                    {submittingReply ? 'Wird gesendet...' : 'Antwort senden'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Replies Section */}
                <div className="replies-section">
                    <div className="replies-header">
                        <h3>Antworten <span className="replies-count">({replies.length})</span></h3>
                    </div>
                    
                    <div className="replies-list">
                        {replies.length === 0 ? (
                            <div className="empty-replies">
                                <div className="empty-icon">💬</div>
                                <h4>Noch keine Antworten</h4>
                                <p>Sei der erste, der auf diesen Beitrag antwortet!</p>
                            </div>
                        ) : (
                            replies.map(reply => (
                                <div key={reply.id} className="reply-card">
                                    <div className="reply-header">
                                        <div className="reply-author-section">
                                            <div className="reply-avatar">
                                                {reply.author.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="reply-author-info">
                                                <span className="reply-author-name">{reply.author.username}</span>
                                                <span className="reply-date">{formatDate(reply.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="reply-content">
                                        <p>{reply.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className="pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                            >
                                ← Zurück
                            </button>
                            <span className="pagination-info">
                                Seite {currentPage + 1} von {totalPages}
                            </span>
                            <button 
                                className="pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage === totalPages - 1}
                            >
                                Weiter →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForumPostDetail;
