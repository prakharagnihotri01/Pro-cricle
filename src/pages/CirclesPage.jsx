import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, onSnapshot, doc, addDoc, updateDoc, arrayUnion, arrayRemove, setDoc, increment } from 'firebase/firestore';
import { Users, Code, PenTool, Hash, Plus, X } from 'lucide-react';

const STATIC_CIRCLES = [
  { id: '1', name: 'Frontend Masters', category: 'Development', memberCount: 1240, description: 'Discuss React, Vue, CSS and everything frontend.' },
  { id: '2', name: 'UI/UX Innovators', category: 'Design', memberCount: 850, description: 'For designers who focus on user experience and clean interfaces.' },
  { id: '3', name: 'Startup Founders', category: 'Business', memberCount: 2100, description: 'Connect with co-founders and discuss startup growth.' },
  { id: '4', name: 'Tech Writers', category: 'Content', memberCount: 430, description: 'Share tips on technical writing and documentation.' },
];

const getIcon = (category) => {
  switch (category) {
    case 'Development': return <Code />;
    case 'Design': return <PenTool />;
    case 'Business': return <Users />;
    default: return <Hash />;
  }
};

const CirclesPage = () => {
  const { currentUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [circleName, setCircleName] = useState('');
  const [circleCategory, setCircleCategory] = useState('Development');
  const [circleDesc, setCircleDesc] = useState('');

  // Fetch or Seed Circles
  useEffect(() => {
    const seedCirclesIfEmpty = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'circles'));
        if (querySnapshot.empty) {
          console.log("Seeding initial circles...");
          for (const circle of STATIC_CIRCLES) {
            await setDoc(doc(db, 'circles', circle.id), {
              ...circle,
              members: [] // Array of UIDs
            });
          }
        }
      } catch (error) {
        console.error("Error checking/seeding circles", error);
        setErrorMsg("Failed to access Circles database. Please check Firestore Rules.");
      }
    };

    seedCirclesIfEmpty().then(() => {
      const q = query(collection(db, 'circles'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const circlesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCircles(circlesData);
        setLoading(false);
      }, (error) => {
        console.error("Snapshot error on circles", error);
        setErrorMsg("Missing Permissions or Index for Circles.");
        setLoading(false);
      });
      return unsubscribe;
    });

  }, []);

  const handleToggleJoin = async (circle) => {
    if (!currentUser) return loginWithGoogle();

    const isMember = circle.members?.includes(currentUser.uid);
    const circleRef = doc(db, 'circles', circle.id);

    try {
      if (isMember) {
        // Leave Circle
        await updateDoc(circleRef, {
          members: arrayRemove(currentUser.uid),
          memberCount: increment(-1)
        });
      } else {
        // Join Circle
        await updateDoc(circleRef, {
          members: arrayUnion(currentUser.uid),
          memberCount: increment(1)
        });
      }
    } catch (error) {
      console.error("Error joining/leaving circle:", error);
      alert("Failed to update membership. Make sure you have write permissions.");
    }
  };

  const handleCreateCircle = async (e) => {
    e.preventDefault();
    if (!currentUser) return loginWithGoogle();

    try {
      const docRef = await addDoc(collection(db, 'circles'), {
        name: circleName,
        category: circleCategory,
        description: circleDesc,
        members: [currentUser.uid], // Automatically join the creator
        memberCount: 1,
        createdAt: new Date().toISOString()
      });
      setShowCreateModal(false);
      // Reset form
      setCircleName('');
      setCircleCategory('Development');
      setCircleDesc('');
      navigate(`/circles/${docRef.id}`);
    } catch (error) {
      console.error("Error creating circle", error);
      alert("Failed to create circle. Please check database permissions.");
    }
  };

  return (
    <div className="container py-8 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Discover Circles</h1>
          <p className="text-secondary">Join communities that align with your professional goals.</p>
        </div>
        <button className="btn btn-primary w-full-mobile" onClick={() => {
          if (!currentUser) loginWithGoogle();
          else setShowCreateModal(true);
        }}>
          <Plus size={18} /> Create Circle
        </button>
      </div>

      {errorMsg && (
        <div className="bg-surface-elevated text-error p-4 rounded-md mb-6 border border-error">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center text-secondary py-12">Loading circles...</div>
      ) : (
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {circles.map(circle => {
            const isMember = currentUser ? circle.members?.includes(currentUser.uid) : false;
            
            return (
              <div key={circle.id} className="glass-card flex flex-col h-full animate-fade-in">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center text-accent-primary">
                    {getIcon(circle.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{circle.name}</h3>
                    <span className="text-xs text-secondary bg-surface-elevated px-2 py-1 rounded-full">{circle.category}</span>
                  </div>
                </div>
                
                <p className="text-sm text-secondary mb-6 flex-1">{circle.description}</p>
                
                <div className="flex justify-between items-center mt-auto border-t border-glass pt-4">
                  <span className="text-sm font-medium">{circle.memberCount?.toLocaleString() || 0} members</span>
                  {isMember ? (
                    <button 
                      className="btn btn-sm rounded-md btn-secondary"
                      onClick={() => navigate(`/circles/${circle.id}`)}
                    >
                      Enter Circle
                    </button>
                  ) : (
                    <button 
                      className="btn btn-sm rounded-md btn-primary"
                      onClick={() => handleToggleJoin(circle)}
                    >
                      Join Circle
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Circle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md relative animate-fade-in p-6 pt-8 bg-surface-elevated">
            <button 
              className="absolute top-4 right-4 text-secondary hover:text-white"
              onClick={() => setShowCreateModal(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Create a Circle</h2>
            
            <form onSubmit={handleCreateCircle} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Circle Name <span className="text-error">*</span></label>
                <input required type="text" className="input-base" value={circleName} onChange={e => setCircleName(e.target.value)} placeholder="e.g. AI Researchers" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <select className="input-base" value={circleCategory} onChange={e => setCircleCategory(e.target.value)}>
                  <option>Development</option>
                  <option>Design</option>
                  <option>Business</option>
                  <option>Content</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description <span className="text-error">*</span></label>
                <textarea 
                  required 
                  className="input-base min-h-[100px] resize-none" 
                  value={circleDesc} 
                  onChange={e => setCircleDesc(e.target.value)} 
                  placeholder="Describe what your community is about..."
                />
              </div>
              
              <button type="submit" className="btn btn-primary mt-4 w-full h-12">Launch Circle</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CirclesPage;
