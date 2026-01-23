
import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile } from '../services/auth';
import { apiGetUserById, apiListUsers, apiListInvitations, apiAcceptInvitation, apiIgnoreInvitation, apiPendingInvitation } from '../services/api';
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
    // Hämta inbjudningar från backend
    apiListInvitations(u.id).then(invList => {
      setInvitations(invList);
      // Hämta avsändarens info för varje inbjudan
      Promise.all(invList.map(inv => inv.sender && inv.sender.id ? apiGetUserById(inv.sender.id) : null)).then(users => {
        const map = {};
        users.forEach(user => { if (user) map[user.id] = user; });
        setPlayers(map);
      });
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
    } else if (action === 'delete') {
      setModal({
        open: true,
        type: 'delete',
        inv,
        text: 'Vill du ta bort denna inbjudan permanent?',
        confirm: true
      });
    }
  }

  function handleModalOk() {
    const refreshInvitations = async () => {
      const invList = await apiListInvitations(user.id);
      setInvitations(invList);
      window.dispatchEvent(new CustomEvent('invitationsChanged'));
    };
    if (modal.type === 'ignore') {
      apiIgnoreInvitation(modal.inv.id).then(refreshInvitations);
    } else if (modal.type === 'pending') {
      // Sätt status till pending i backend
      apiPendingInvitation(modal.inv.id).then(() => {
        apiListInvitations(user.id).then(invList => {
          setInvitations(invList);
          window.dispatchEvent(new CustomEvent('invitationsChanged'));
        });
      });
    } else if (modal.type === 'accept') {
      apiAcceptInvitation(modal.inv.id).then(refreshInvitations);
    } else if (modal.type === 'delete') {
      // Ta bort inbjudan helt (om det finns stöd i backend, lägg till endpoint!)
      const updated = invitations.filter(i => i !== modal.inv);
      setInvitations(updated);
      updateProfile({ ...user, invitations: updated });
      window.dispatchEvent(new CustomEvent('invitationsChanged'));
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
  // Visa alla inbjudningar om status är null eller saknas
  const filtered = invitations.filter(i => {
    // Om status är null, visa som "new"
    let status = i.status || 'new';
    status = typeof status === 'string' ? status.toLowerCase() : status;
    if (status !== filter) return false;
    const p = players[i.sender.id];
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
        const p = players[inv.sender.id];
        if (!p) return null;
        return (
          <div key={inv.id} className="card invitation-card">
            <div className="invitation-card-content">
              <img src={p.avatar} alt="avatar" className="invitation-avatar" />
              <div className="invitation-info">
                <div className="invitation-name">{p.name}</div>
                <div className="invitation-email">{p.email}</div>
                <div className="invitation-phone">{p.phone}</div>
                <div className="invitation-level"><strong>Nivå:</strong> {p.level}</div>
                <div className="invitation-status"><strong>Status:</strong> {inv.status || 'ny'}</div>
                <div className="invitation-date"><strong>Skapad:</strong> {inv.createdAt ? inv.createdAt : 'okänt'}</div>
              </div>
            </div>
            <div className="invitation-actions">
              {filter === 'ignored' ? (
                <button onClick={() => handleAction(inv, 'delete')}>Ta bort</button>
              ) : filter === 'accepted' ? (
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
            <button onClick={handleModalOk}>{modal.type === 'delete' ? 'Ta bort' : 'Ok'}</button>
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
