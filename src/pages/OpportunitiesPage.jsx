import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Briefcase, MapPin, DollarSign, Clock, Plus, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const OpportunitiesPage = () => {
  const { currentUser, loginWithGoogle } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState('Full-time');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'opportunities'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Automatically seed 4 initial opportunities if database is empty
        console.log("Seeding initial opportunities...");
        const seedJobs = [
          { title: "Senior React Developer", company: "TechNova", type: "Full-time", location: "Remote", salary: "$120k/yr", posterUid: "system", posterName: "ProCircle Team", createdAt: new Date().toISOString(), saves: [] },
          { title: "Lead UI/UX Designer", company: "Creative Minds", type: "Contract", location: "New York, NY", salary: "$60/hr", posterUid: "system", posterName: "ProCircle Team", createdAt: new Date(Date.now() - 86400000).toISOString(), saves: [] },
          { title: "Technical Co-founder", company: "Stealth Web3 Startup", type: "Co-founder", location: "San Francisco, CA", salary: "Equity", posterUid: "system", posterName: "ProCircle Team", createdAt: new Date(Date.now() - 172800000).toISOString(), saves: [] },
          { title: "Freelance Technical Writer", company: "Growth Agency", type: "Freelance", location: "Remote", salary: "$45/hr", posterUid: "system", posterName: "ProCircle Team", createdAt: new Date(Date.now() - 259200000).toISOString(), saves: [] }
        ];
        try {
          for (const job of seedJobs) {
            await addDoc(collection(db, 'opportunities'), job);
          }
        } catch (error) {
          console.error("Error seeding opportunities:", error);
        }
      } else {
        setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
      setLoading(false);
    }, (error) => {
      console.error("Error loading opportunities:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!currentUser) return loginWithGoogle();

    try {
      await addDoc(collection(db, 'opportunities'), {
        title,
        company,
        type,
        location,
        salary,
        posterUid: currentUser.uid,
        posterName: currentUser.displayName,
        createdAt: new Date().toISOString(),
        saves: []
      });
      setShowPostModal(false);
      // Reset form
      setTitle(''); setCompany(''); setType('Full-time'); setLocation(''); setSalary('');
    } catch (error) {
      console.error("Error posting opportunity:", error);
      alert("Failed to post opportunity. Please check Firestore permissions if 'opportunities' collection is restricted.");
    }
  };

  const toggleSave = async (jobId, savesArray) => {
    if (!currentUser) return loginWithGoogle();
    
    const jobRef = doc(db, 'opportunities', jobId);
    const isSaved = savesArray?.includes(currentUser.uid);
    try {
      if (isSaved) {
        await updateDoc(jobRef, { saves: arrayRemove(currentUser.uid) });
      } else {
        await updateDoc(jobRef, { saves: arrayUnion(currentUser.uid) });
      }
    } catch (error) {
      console.error("Error saving job", error);
    }
  };

  return (
    <div className="container py-8 mt-8 min-h-[60vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Opportunities</h1>
          <p className="text-secondary">Find your next job, freelance gig, or co-founder.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto items-center">
          <input type="text" placeholder="Search roles..." className="input-base flex-1 md:w-64" />
          <button className="btn btn-primary" onClick={() => {
            if (!currentUser) loginWithGoogle();
            else setShowPostModal(true);
          }}>
            <Plus size={18} /> Post
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-secondary py-16">Loading opportunities...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.length === 0 && (
            <div className="glass-card text-center text-secondary py-16">
              No opportunities posted yet. Be the first to share one!
            </div>
          )}
          {jobs.map(job => {
            const isSaved = currentUser ? job.saves?.includes(currentUser.uid) : false;
            const postedDate = job.createdAt ? new Date(job.createdAt) : new Date();

            return (
              <div key={job.id} className="glass-card hover:border-accent-primary transition-all duration-300 animate-fade-in relative group">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gradient">{job.title}</h3>
                    <p className="text-secondary font-medium mb-3">{job.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-secondary">
                      <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {job.location || 'Any'}</span>
                      <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary || 'Negotiable'}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {formatDistanceToNow(postedDate)} ago</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button 
                      className={`btn btn-secondary ${isSaved ? 'text-accent-primary border-accent-primary' : ''}`}
                      onClick={() => toggleSave(job.id, job.saves || [])}
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => alert(`Application sent to ${job.company}!`)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg relative animate-fade-in p-6 pt-8 bg-bg-surface-elevated">
            <button 
              className="absolute top-4 right-4 text-secondary hover:text-white"
              onClick={() => setShowPostModal(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Create Opportunity</h2>
            
            <form onSubmit={handlePostJob} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Job Title <span className="text-error">*</span></label>
                <input required type="text" className="input-base" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior React Developer" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Company / Client <span className="text-error">*</span></label>
                <input required type="text" className="input-base" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. TechNova" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <select className="input-base" value={type} onChange={e => setType(e.target.value)}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                    <option>Co-founder</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Location</label>
                  <input type="text" className="input-base" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Remote" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Salary/Rate</label>
                <input type="text" className="input-base" value={salary} onChange={e => setSalary(e.target.value)} placeholder="e.g. $120k/yr or $50/hr" />
              </div>
              
              <button type="submit" className="btn btn-primary mt-4 w-full h-12">Post to Network</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesPage;
