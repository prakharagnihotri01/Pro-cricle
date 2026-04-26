import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import FeedPage from './pages/FeedPage';
import CirclesPage from './pages/CirclesPage';
import CircleDetailsPage from './pages/CircleDetailsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import HelpCenterPage from './pages/HelpCenterPage';
import Footer from './components/Footer';
import { AuthProvider } from './lib/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/circles" element={<CirclesPage />} />
              <Route path="/circles/:circleId" element={<CircleDetailsPage />} />
              <Route path="/opportunities" element={<OpportunitiesPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
