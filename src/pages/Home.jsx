
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import { getCurrentUser } from '../services/auth';
import { apiGetUserById } from '../services/api';
import '../styles/home.css';
import '../App.css';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Listen for login modal event
  useEffect(() => {
    function onOpen() {
      setShowLogin(true);
    }
    window.addEventListener('open-login-modal', onOpen);
    return () => window.removeEventListener('open-login-modal', onOpen);
  }, []);

  // Check for new invitations on login
  useEffect(() => {
    const curr = getCurrentUser();
    setUser(curr);
    if (!curr) {
      setShowEnvelope(false);
      return;
    }
    // Fetch fresh user data to check for new invitations
    apiGetUserById(curr.id).then(freshUser => {
      if ((freshUser?.invitations || []).some(inv => inv.status === 'new')) {
        setShowEnvelope(true);
      } else {
        setShowEnvelope(false);
      }
    });
    // Listen for storage changes (e.g., after accepting/ignoring invitations)
    function onStorage() {
      const curr = getCurrentUser();
      setUser(curr);
      if (!curr) {
        setShowEnvelope(false);
        return;
      }
      apiGetUserById(curr.id).then(freshUser => {
        if ((freshUser?.invitations || []).some(inv => inv.status === 'new')) {
          setShowEnvelope(true);
        } else {
          setShowEnvelope(false);
        }
      });
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Hide envelope after animation (1.2s)
  useEffect(() => {
    if (showEnvelope) {
      const timer = setTimeout(() => setShowEnvelope(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [showEnvelope]);

  return (
    <main className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-content">
        <h1>Välkommen till tennispartner</h1>
        <p>När du har hittat din tennispartner anmäl er via hemsidan.</p>
        <div className="actions">
          <button className="register" onClick={() => navigate('/register')}>Registrera dig</button>
          <button className="login" onClick={() => setShowLogin(true)}>Logga in</button>
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showEnvelope && (
        <div style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          pointerEvents: 'none',
        }}>
          <span className="envelope-flyin" aria-label="Nya inbjudningar">
            <svg width="80" height="56" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="20" rx="4" fill="#fffbe6" stroke="#e6b800" strokeWidth="2"/>
              <polyline points="2,2 14,14 26,2" fill="none" stroke="#e6b800" strokeWidth="2"/>
            </svg>
          </span>
        </div>
      )}
    </main>
  );
}
