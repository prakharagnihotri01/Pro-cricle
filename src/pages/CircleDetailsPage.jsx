import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { 
  doc, onSnapshot, collection, query, orderBy, 
  addDoc, serverTimestamp, updateDoc, arrayRemove, increment 
} from 'firebase/firestore';
import { Send, ArrowLeft, Users } from 'lucide-react';

const CircleDetailsPage = () => {
  const { circleId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [circle, setCircle] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Fetch Circle Details
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'circles', circleId), (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setCircle(data);
        // Kick out if not member
        if (currentUser && data.members && !data.members.includes(currentUser.uid)) {
          navigate('/circles');
        }
      } else {
        navigate('/circles');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [circleId, currentUser, navigate]);

  // Fetch Messages
  useEffect(() => {
    const q = query(collection(db, `circles/${circleId}/messages`), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
    return () => unsubscribe();
  }, [circleId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, `circles/${circleId}/messages`), {
        uid: currentUser.uid,
        name: currentUser.displayName || 'ProCircle Member',
        avatar: currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`,
        text: newMessage,
        createdAt: new Date().toISOString()
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const handleLeaveCircle = async () => {
    if (!window.confirm("Are you sure you want to leave this circle?")) return;
    try {
      await updateDoc(doc(db, 'circles', circleId), {
        members: arrayRemove(currentUser.uid),
        memberCount: increment(-1)
      });
      navigate('/circles');
    } catch (error) {
      console.error("Error leaving", error);
    }
  };

  if (loading) return <div className="container py-16 text-center">Loading Circle...</div>;
  if (!circle) return null;

  return (
    <div className="container py-8 mt-8 flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 glass-card py-4 px-6">
        <div className="flex items-center gap-4">
          <Link to="/circles" className="btn-icon bg-surface"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-bold text-gradient">{circle.name}</h1>
            <p className="text-sm text-secondary flex items-center gap-1">
              <Users size={14} /> {circle.memberCount || 0} Members
            </p>
          </div>
        </div>
        <button className="btn btn-secondary text-error" onClick={handleLeaveCircle}>
          Leave Circle
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden p-0 relative">
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-surface" style={{ maxHeight: '60vh' }}>
          {messages.length === 0 && (
            <div className="text-center text-secondary my-auto pb-10">
              Welcome to the {circle.name} circle! Be the first to send a message.
            </div>
          )}
          
          {messages.map(msg => {
            const isMe = currentUser && msg.uid === currentUser.uid;
            return (
              <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <img src={msg.avatar} alt="avatar" className="w-8 h-8 rounded-full flex-shrink-0 mt-1" />
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-secondary mb-1 px-1">{msg.name}</span>
                  <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-accent-primary text-white rounded-tr-sm' : 'bg-surface-elevated text-white rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-bg-dark border-t border-glass">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text" 
              className="input-base flex-1" 
              placeholder="Message your circle..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CircleDetailsPage;
