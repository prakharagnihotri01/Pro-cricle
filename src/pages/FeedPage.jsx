import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { auth, db } from '../lib/firebase';
import { 
  collection, query, orderBy, onSnapshot, addDoc, 
  updateDoc, deleteDoc, doc, arrayUnion, arrayRemove
} from 'firebase/firestore';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './FeedPage.css';

const FeedPage = () => {
  const { currentUser, loginWithGoogle } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [activeOptionsPostId, setActiveOptionsPostId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch posts from Firestore
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setErrorMsg('');
    }, (error) => {
      console.error("Firestore Snapshot Error:", error);
      if (error.code === 'permission-denied') {
        setErrorMsg("Permission Denied: Please update your Firestore Database Rules to allow read/write.");
      } else if (error.message.includes('index')) {
        setErrorMsg("Firestore Index missing: Please click the link in the console to generate it.");
      } else {
        setErrorMsg(`Error loading posts: ${error.message}`);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, 'posts'), {
        author: {
          uid: currentUser.uid,
          name: currentUser.displayName || 'ProCircle Member',
          avatar: currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`,
          title: 'Professional'
        },
        content: newPostContent,
        likes: [],
        comments: [],
        shares: 0,
        createdAt: new Date().toISOString() // Using ISO string prevents the null pending issue
      });
      setNewPostContent('');
      setErrorMsg('');
    } catch (error) {
      console.error("Error creating post", error);
      if (error.code === 'permission-denied') {
        alert("Permission Denied: Please update your Firestore rules to allow writes!");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const toggleLike = async (postId, currentLikes) => {
    if (!currentUser) return loginWithGoogle();

    const postRef = doc(db, 'posts', postId);
    const isLiked = currentLikes.includes(currentUser.uid);

    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid)
        });
      }
    } catch (error) {
      console.error("Error updating likes", error);
    }
  };

  const handleReshare = async (postId, currentShares) => {
    if (!currentUser) return loginWithGoogle();

    const postRef = doc(db, 'posts', postId);
    try {
      await updateDoc(postRef, {
        shares: currentShares + 1
      });
    } catch (error) {
      console.error("Error reshaping", error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setActiveOptionsPostId(null);
    } catch (error) {
      console.error("Error deleting post", error);
      alert("Failed to delete post. You may not have permission.");
    }
  };

  const toggleCommentSection = (postId) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
    } else {
      setActiveCommentPostId(postId);
      setNewComment('');
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim() || !currentUser) return;

    const postRef = doc(db, 'posts', postId);
    const commentData = {
      id: Date.now().toString(),
      uid: currentUser.uid,
      name: currentUser.displayName || 'User',
      avatar: currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`,
      text: newComment,
      createdAt: new Date().toISOString()
    };

    try {
      await updateDoc(postRef, {
        comments: arrayUnion(commentData)
      });
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  return (
    <div className="feed-container container">
      <div className="feed-layout">
        
        {/* Left Sidebar (Profile Widget) */}
        <aside className="feed-sidebar left-sidebar">
          {currentUser ? (
             <div className="glass-card profile-widget">
               <div className="profile-cover"></div>
               <img src={currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`} alt="Profile" className="profile-avatar-large" />
               <h3 className="profile-name text-lg font-bold mt-2">{currentUser.displayName || 'ProCircle User'}</h3>
               <p className="profile-title text-secondary text-sm">Professional at ProCircle</p>
               
               <div className="profile-stats mt-4">
                 <div className="stat-row">
                   <span className="text-secondary text-sm">Profile views</span>
                   <span className="font-semibold text-accent">142</span>
                 </div>
                 <div className="stat-row">
                   <span className="text-secondary text-sm">Connections</span>
                   <span className="font-semibold text-accent">380</span>
                 </div>
               </div>
             </div>
          ) : (
            <div className="glass-card text-center py-6">
              <h3 className="mb-2 font-semibold">Join the conversation</h3>
              <p className="text-secondary text-sm mb-4">Sign in to interact with your network.</p>
              <button className="btn btn-primary" onClick={loginWithGoogle}>Sign In with Google</button>
            </div>
          )}
        </aside>

        {/* Main Feed Column */}
        <div className="feed-main">
          
          {errorMsg && (
            <div className="bg-surface-elevated text-error p-4 rounded-md mb-6 border border-error">
              {errorMsg}
            </div>
          )}

          {/* Create Post Section */}
          {currentUser && (
            <div className="glass-card create-post-card mb-6">
              <div className="create-post-header flex items-center gap-3 mb-4">
                <img src={currentUser.photoURL || 'https://via.placeholder.com/40'} alt="Avatar" className="avatar" />
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="Share your thoughts, projects, or opportunities..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') handleCreatePost(e) }}
                />
              </div>
              <div className="create-post-actions flex justify-between items-center">
                <div className="action-buttons flex gap-2">
                  <button className="btn-icon"><span className="text-sm">📷 Media</span></button>
                  <button className="btn-icon"><span className="text-sm">📅 Event</span></button>
                </div>
                <button 
                  className="btn btn-primary btn-sm flex items-center gap-2" 
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                >
                  Post <Send size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Posts Feed */}
          <div className="posts-list flex flex-col gap-6">
            {posts.length === 0 && !errorMsg ? (
              <div className="glass-card text-center text-secondary py-8">
                No posts yet. Be the first to post!
              </div>
            ) : null}

            {posts.map(post => {
              const isLiked = currentUser ? post.likes?.includes(currentUser.uid) : false;
              // Safely handle timestamp fallback
              const createdAtDate = post.createdAt ? new Date(post.createdAt) : new Date();

              return (
                <div key={post.id} className="glass-card post-card animate-fade-in">
                  {/* Post Header */}
                  <div className="post-header flex justify-between items-center mb-4">
                    <div className="flex gap-3 items-center">
                      <img src={post.author.avatar} alt={post.author.name} className="avatar" />
                      <div>
                        <h4 className="font-semibold text-sm">{post.author.name}</h4>
                        <p className="text-xs text-secondary">{post.author.title}</p>
                        <p className="text-xs text-secondary mt-1">{formatDistanceToNow(createdAtDate)} ago</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button 
                        className="btn-icon" 
                        onClick={() => setActiveOptionsPostId(activeOptionsPostId === post.id ? null : post.id)}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      
                      {/* Post Options Dropdown */}
                      {activeOptionsPostId === post.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-surface-elevated border border-glass rounded-md shadow-lg z-10 glass">
                          {currentUser && currentUser.uid === post.author.uid ? (
                            <button 
                              className="w-full text-left px-4 py-2 text-sm text-error hover:bg-surface transition-colors"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete Post
                            </button>
                          ) : (
                            <button 
                              className="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-surface transition-colors"
                              onClick={() => setActiveOptionsPostId(null)}
                            >
                              Report Post
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="post-content text-sm mb-4">
                    {post.content}
                  </div>

                  {/* Post Stats */}
                  <div className="post-stats flex justify-between text-xs text-secondary pb-3 mb-3 border-b border-glass gap-4">
                    <span>{post.likes?.length || 0} Likes</span>
                    <div className="flex gap-3">
                      <span>{post.comments?.length || 0} Comments</span>
                      <span>{post.shares || 0} Reshares</span>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="post-actions flex justify-between">
                    <button 
                      className={`btn-icon flex-1 flex justify-center gap-2 rounded-md ${isLiked ? 'text-accent-secondary' : ''}`}
                      onClick={() => toggleLike(post.id, post.likes || [])}
                    >
                      <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                      <span className="font-medium">Like</span>
                    </button>
                    <button 
                      className="btn-icon flex-1 flex justify-center gap-2 rounded-md"
                      onClick={() => toggleCommentSection(post.id)}
                    >
                      <MessageCircle size={20} />
                      <span className="font-medium">Comment</span>
                    </button>
                    <button 
                      className="btn-icon flex-1 flex justify-center gap-2 rounded-md"
                      onClick={() => handleReshare(post.id, post.shares || 0)}
                    >
                      <Share2 size={20} />
                      <span className="font-medium">Reshare</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {activeCommentPostId === post.id && (
                    <div className="comments-section mt-4 pt-4 border-t border-glass">
                      {currentUser ? (
                        <div className="flex gap-2 mb-4">
                          <img src={currentUser.photoURL || 'https://via.placeholder.com/32'} className="avatar w-8 h-8" alt="Me" />
                          <div className="flex-1 flex gap-2">
                            <input 
                              type="text" 
                              className="input-base flex-1 py-1 px-3 text-sm h-10" 
                              placeholder="Add a comment..." 
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              onKeyDown={(e) => { if(e.key === 'Enter') handleAddComment(post.id) }}
                            />
                            <button 
                              className="btn btn-primary h-10 px-3"
                              onClick={() => handleAddComment(post.id)}
                            >
                              <Send size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-secondary text-sm mb-4">Sign in to leave a comment.</p>
                      )}

                      <div className="comments-list flex flex-col gap-3">
                        {post.comments && post.comments.map(c => (
                          <div key={c.id} className="comment-item flex gap-2 bg-surface p-2 rounded-lg">
                            <img src={c.avatar || 'https://via.placeholder.com/32'} className="avatar w-8 h-8" alt={c.name} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{c.name}</span>
                                <span className="text-xs text-secondary">{formatDistanceToNow(new Date(c.createdAt))} ago</span>
                              </div>
                              <p className="text-sm mt-1">{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar (Trending/News) */}
        <aside className="feed-sidebar right-sidebar">
          <div className="glass-card trending-widget">
            <h3 className="font-bold mb-4">Trending on ProCircle</h3>
            <ul className="trending-list flex flex-col gap-4">
              <li>
                <p className="text-sm font-medium">#React19 is finally here</p>
                <p className="text-xs text-secondary">8,432 posts</p>
              </li>
              <li>
                <p className="text-sm font-medium">Top freelance platforms in 2026</p>
                <p className="text-xs text-secondary">5,120 posts</p>
              </li>
              <li>
                <p className="text-sm font-medium">AI driving structural coding</p>
                <p className="text-xs text-secondary">12.5k posts</p>
              </li>
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default FeedPage;
