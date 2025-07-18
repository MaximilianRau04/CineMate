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

    useEffect(() => {
        fetchPost();
        fetchReplies();
        fetchSubscriptionStatus();
        fetchCurrentUser();
    }, [postId, currentPage]);

    /**
     * Fetches the forum post details by postId.
     * @returns {Promise<void>}
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
            setError('Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetches the replies for the current post.
     * @returns {Promise<void>}
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
     * Fetches the subscription status for the current user.
     * @returns {Promise<void>}
     */
    const fetchSubscriptionStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/forum/posts/${postId}/subscription-status`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : undefined
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSubscriptionStatus(data);
            }
        } catch (error) {
            console.error('Error fetching subscription status:', error);
        }
    };

    /**
     * Fetches the current user data.
     * @returns {Promise<void>}
     */
    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:8080/api/user/current', {
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
     * Handles the subscription toggle for the post.
     * @returns {Promise<void>}
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
     * Handles the reply submission to the post.
     * @param {*} e  
     */
    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/forum/posts/${postId}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : undefined
                },
                body: JSON.stringify({
                    content: replyContent
                })
            });

            if (response.ok) {
                setReplyContent('');
                fetchReplies();
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    /**
     * Handles the like toggle for the post.
     * @returns {Promise<void>}
     */
    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/forum/posts/${postId}/like`, {
                method: 'POST',
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

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!post) return <div className="not-found">Post not found</div>;

    return (
        <div className="forum-post-detail">
            <div className="post-header">
                <h1>{post.title}</h1>
                <div className="post-meta">
                    <span className="author">By {post.author.username}</span>
                    <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="category">{post.category}</span>
                    {post.pinned && <span className="pinned">📌 Pinned</span>}
                    {post.locked && <span className="locked">🔒 Locked</span>}
                </div>
                <div className="post-stats">
                    <span className="likes">{post.likes} likes</span>
                    <span className="replies">{post.replyCount} replies</span>
                    <span className="views">{post.views} views</span>
                </div>
            </div>

            <div className="post-content">
                <p>{post.content}</p>
            </div>

            <div className="post-actions">
                {currentUser && (
                    <>
                        <button 
                            className={`like-btn ${post.likedByCurrentUser ? 'liked' : ''}`}
                            onClick={handleLike}
                        >
                            👍 {post.likedByCurrentUser ? 'Unlike' : 'Like'}
                        </button>
                        <button 
                            className={`subscribe-btn ${subscriptionStatus.isSubscribed ? 'subscribed' : ''}`}
                            onClick={handleSubscribe}
                        >
                            {subscriptionStatus.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                        </button>
                    </>
                )}
            </div>

            <div className="subscription-info">
                <p className="text-white">{subscriptionStatus.subscriberCount} subscribers</p>
            </div>

            <div className="replies-section">
                <h3>Replies ({replies.length})</h3>
                
                {currentUser && !post.locked && (
                    <form onSubmit={handleReplySubmit} className="reply-form">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your reply..."
                            className="reply-input"
                            rows={4}
                        />
                        <button type="submit" className="submit-reply">Submit Reply</button>
                    </form>
                )}

                <div className="replies-list">
                    {replies.map(reply => (
                        <div key={reply.id} className="reply">
                            <div className="reply-header">
                                <span className="reply-author">{reply.author.username}</span>
                                <span className="reply-date">{new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="reply-content">
                                <p>{reply.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage + 1} of {totalPages}</span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumPostDetail;
