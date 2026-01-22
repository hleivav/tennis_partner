import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
import { getCurrentUser, logout } from '../services/auth';
import { apiGetUserById, apiListInvitations } from '../services/api';

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [hasNewInvitations, setHasNewInvitations] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userNow = getCurrentUser();
    console.log('[NavBar] useEffect[]: initial user =', userNow);
    console.log('[NavBar] useEffect[]: localStorage CURR_KEY =', localStorage.getItem('tp_current'));
    setUser(userNow);
    const onAuthChange = () => {
      const u = getCurrentUser();
      console.log('[NavBar] onAuthChange: user =', u);
      console.log('[NavBar] onAuthChange: localStorage CURR_KEY =', localStorage.getItem('tp_current'));
      setUser(u);
    };
    const onStorage = () => {
      const u = getCurrentUser();
      console.log('[NavBar] onStorage: user =', u);
      console.log('[NavBar] onStorage: localStorage CURR_KEY =', localStorage.getItem('tp_current'));
      setUser(u);
    };
    window.addEventListener('authchange', onAuthChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('authchange', onAuthChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    console.log('[NavBar] user state changed:', user);
    console.log('[NavBar] localStorage snapshot:', {...window.localStorage});
    console.log('[NavBar] user state changed: localStorage CURR_KEY =', localStorage.getItem('tp_current'));
  }, [user]);

  useEffect(() => {
    async function checkInvitations() {
      if (!user) return;
      try {
        const invitations = await apiListInvitations(user.id);
        setHasNewInvitations(invitations.some(inv => !inv.status || inv.status === 'new'));
      } catch (e) {
        setHasNewInvitations(false);
      }
    }
    checkInvitations();
  }, [user]);

  function handleLogout() {
    logout();
    setUser(null);
    navigate('/');
    setOpen(false);
  }

  function closeAndNavigate(to) {
    setOpen(false);
    navigate(to);
  }

  return (
    <header className="site-header">
      <div className="inner">
        <img src={logo} alt="TennisPartner" className="logo" />
        <button className="hamburger" aria-controls="main-nav" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{color:'currentColor'}}><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <nav id="main-nav" className={`site-nav ${open ? 'open' : ''}`} aria-label="Huvudnavigering">
          <Link to="/" onClick={() => setOpen(false)}>Hem</Link>
          {user && user.role === 'SUPERADMIN' && (
            <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>
          )}
          {!user && (
            <Link to="/register" onClick={() => setOpen(false)}>Registrering</Link>
          )}
          <Link to="/search" onClick={() => setOpen(false)}>Sök medspelare</Link>
          <Link to="/invitations" onClick={() => setOpen(false)} style={{ position: 'relative', display: 'inline-block' }}>
            Inbjudan
          </Link>
          {user && hasNewInvitations && (
            <button
              type="button"
              style={{
                position: 'absolute',
                left: 90, // adjust as needed to appear under the menu
                top: 48, // adjust as needed to appear under the menu
                zIndex: 20,
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                cursor: 'pointer',
                transition: 'opacity 0.3s',
              }}
              onClick={e => { e.stopPropagation(); navigate('/invitations'); }}
              title="Visa inbjudningar"
              aria-label="Visa inbjudningar"
            >
              <span className="envelope-flyin" style={{animation: 'none'}}>
                <svg width="36" height="26" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="28" height="20" rx="4" fill="#fffbe6" stroke="#e6b800" strokeWidth="2"/>
                  <polyline points="2,2 14,14 26,2" fill="none" stroke="#e6b800" strokeWidth="2"/>
                </svg>
              </span>
            </button>
          )}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)}>{user.name}</Link>
              <button onClick={handleLogout} style={{ background: '#fff', color: '#1A2A80', border: '1px solid #ccc', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}>Logga ut</button>
            </>
          ) : (
            <button className="login-button" onClick={() => { setOpen(false); navigate('/'); setTimeout(() => window.dispatchEvent(new Event('open-login-modal')), 50); }}>Logga in</button>
          )}
        </nav>
      </div>
    </header>
  );
}
