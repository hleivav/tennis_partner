
import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile } from '../services/auth';
import { apiGetUserById, apiListUsers } from '../services/api';
import Modal from '../components/Modal';

const FILTERS = [
  { value: 'new', label: 'Ny inbjudan' },
  { value: 'pending', label: 'Avvaktar' },
  { value: 'accepted', label: 'Accepterade' },
  { value: 'ignored', label: 'Ignorerad' },
];

// Status: 'new', 'pending', 'ignored'

export default function Invitations() {
  const [user, setUser] = useState(null);
  const [invitations, setInvitations] = useState([]); // [{fromId, status}]
  const [players, setPlayers] = useState({}); // id -> user
  const [filter, setFilter] = useState('new');
  const [modal, setModal] = useState({ open: false });

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) return;
    setUser(u);
    setInvitations(u.invitations || []);
    Promise.all((u.invitations || []).map(inv => apiGetUserById(inv.fromId))).then(users => {
      const map = {};
      users.forEach(u => { if (u) map[u.id] = u; });
      setPlayers(map);
    });
  }, []);

  function handleAction(inv, action) {
    if (action === 'accept') {
      setModal({
        open: true,
        type: 'accept',
        inv,
        text: 'Viktigt! Kontakta den här spelaren nu. När du har fått bekräftat att ni ska spela tillsammans se till att ni redigerar er profil så att ni avmarkerar att ni är tillgängliga. Om det är en sådan turnering där det tillåts flera spelare och ni anser att ni behöver fler, avvakta med att avmarkera och fortsätt att söka en annan person.'
      });
    } else if (action === 'pending') {
      setModal({
        open: true,
        type: 'pending',
        inv,
        text: 'Den här spelaren kommer fortfarande att finnas med i din lista tills du väljer att ignorera hen.'
      });
    } else if (action === 'ignore') {
      setModal({
        open: true,
        type: 'ignore',
        inv,
        text: 'Den här spelaren kommer inte längre att visas på din lista. Vill du ignorera hen?',
        confirm: true
      });
    }
  }

  function handleModalOk() {
    if (modal.type === 'ignore') {
      // Ta bort inbjudan från listan
      const updated = invitations.filter(i => i !== modal.inv);
      setInvitations(updated);
      // Spara till profil
      updateProfile({ ...user, invitations: updated });
    } else if (modal.type === 'pending') {
      // Sätt status till 'pending'
      const updated = invitations.map(i => i === modal.inv ? { ...i, status: 'pending' } : i);
      setInvitations(updated);
      updateProfile({ ...user, invitations: updated });
    } else if (modal.type === 'accept') {
      // Sätt status till 'accepted' (eller ta bort från listan om så önskas)
      const updated = invitations.map(i => i === modal.inv ? { ...i, status: 'accepted' } : i);
      setInvitations(updated);
      updateProfile({ ...user, invitations: updated });
    }
    setModal({ open: false });
  }

  function handleModalCancel() {
    setModal({ open: false });
  }

  if (!user) {
    return <main style={{ padding: 20 }}><h1>Inbjudan</h1><p>Du är inte inloggad.</p></main>;
  }

  // Hide invitations from superadmin
  const filtered = invitations.filter(i => {
    if (i.status !== filter) return false;
    const p = players[i.fromId];
    if (!p) return false;
    if (p.email === 'hleiva@hotmail.com') return false;
    return true;
  });

  return (
    <main style={{ padding: 20 }}>
      <h1>Inbjudan</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <div style={{ minWidth: 180, maxWidth: 220, width: '100%' }}>
          <label htmlFor="filter" style={{ display: 'block', textAlign: 'center', marginBottom: 4 }}>Filtrera:</label>
          <select
            id="filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ width: '100%', fontSize: 16, padding: '4px 8px', borderRadius: 6, border: '1.5px solid #aaa', textAlign: 'center' }}
          >
            {FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
      </div>
      {filtered.length === 0 && <div>Inga inbjudningar i denna kategori.</div>}
      {filtered.map((inv, idx) => {
        const p = players[inv.fromId];
        if (!p) return null;
        return (
          <div key={inv.fromId} className="card invitation-card">
            <div className="invitation-card-content">
              <img src={p.avatar} alt="avatar" className="invitation-avatar" />
              <div className="invitation-info">
                <div className="invitation-name">{p.name}</div>
                <div className="invitation-email">{p.email}</div>
                <div className="invitation-phone">{p.phone}</div>
                <div className="invitation-level"><strong>Nivå:</strong> {p.level}</div>
              </div>
            </div>
            <div className="invitation-actions">
              {(filter === 'accepted') ? (
                <>
                  <button onClick={() => handleAction(inv, 'pending')}>Avvakta</button>
                  <button onClick={() => handleAction(inv, 'ignore')}>Ignorera</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleAction(inv, 'accept')}>Acceptera</button>
                  <button onClick={() => handleAction(inv, 'pending')}>Avvakta</button>
                  <button onClick={() => handleAction(inv, 'ignore')}>Ignorera</button>
                </>
              )}
            </div>
          </div>
        );
      })}
      <Modal open={modal.open} onClose={handleModalCancel}>
        <div style={{ marginBottom: 10 }}>
          {modal.type === 'accept' && <h2 style={{ fontSize: 20, margin: 0, marginBottom: 8, color: '#222' }}>Acceptera inbjudan</h2>}
          {modal.type === 'pending' && <h2 style={{ fontSize: 20, margin: 0, marginBottom: 8, color: '#222' }}>Avvakta</h2>}
          {modal.type === 'ignore' && <h2 style={{ fontSize: 20, margin: 0, marginBottom: 8, color: '#222' }}>Ignorera inbjudan</h2>}
        </div>
        <div style={{ whiteSpace: 'pre-line', fontSize: 17, marginBottom: 18, color: '#222' }}>{modal.text}</div>
        {modal.confirm ? (
          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
            <button onClick={handleModalOk}>Ok</button>
            <button onClick={handleModalCancel}>Avbryt</button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleModalOk}>Stäng</button>
          </div>
        )}
      </Modal>
    </main>
  );
}
