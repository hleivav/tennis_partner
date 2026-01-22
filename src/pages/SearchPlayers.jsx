import React, { useEffect, useState } from 'react';
import { apiListUsers, apiSendInvitation, apiGetUserById } from '../services/api';
import { getCurrentUser } from '../services/auth';


const LEVELS = [
  'Samtliga',
  'Gruppspel grupp1',
  'Gruppspel grupp2',
  'Gruppspel grupp3',
  'Gruppspel grupp4',
  'Gruppspel grupp5',
  'Gruppspel grupp6',
  'Avancerad',
  'Medel',
  'Nybörjare',
];

export default function SearchPlayers() {
  const [users, setUsers] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('Samtliga');
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState([]); // id på valda spelare
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [invitedIds, setInvitedIds] = useState([]);

  // Ingen mockad storage-lyssnare behövs längre

  useEffect(() => {
    if (!currentUser) return;
    apiListUsers().then(list => {
      // Visa inte dig själv
      setUsers(list.filter(u => u.id !== currentUser.id));
      console.log('Alla användare:', list);
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    async function fetchInvited() {
      // Hämta aktuell användare från "servern" för att få senaste id
      const freshUser = await apiGetUserById(currentUser.id);
      // Hämta alla användare som fått inbjudan från denna användare
      const ids = (freshUser && freshUser.invitationsSent) ? freshUser.invitationsSent : [];
      // Alternativt: gå igenom alla användare och kolla om de har en inbjudan från currentUser
      const all = await apiListUsers();
      const invited = all.filter(u => (u.invitations || []).some(inv => inv.fromId === currentUser.id)).map(u => u.id);
      setInvitedIds(invited);
    }
    fetchInvited();
  }, [currentUser, chosen]);

  // Om inte inloggad, visa meddelande och returnera direkt
  if (!currentUser) {
    return <main style={{ padding: 20 }}><h1>Sök spelare</h1><p>Du är inte inloggad.</p></main>;
  }

  // Filtrera användare: visa alla utom dig själv
  const filtered = users.filter(u =>
    u.seekingPartner &&
    (!nameFilter || u.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
    (levelFilter === 'Samtliga' || u.level === levelFilter)
  );
  const curr = filtered[index] || null;

  async function handleChoose() {
    if (!curr) return;
    // Skicka inbjudan till mottagaren
    try {
      await apiSendInvitation(currentUser.id, curr.id);
      alert('Inbjudan skickad!');
    } catch (e) {
      alert('Kunde inte skicka inbjudan: ' + e.message);
    }
    setChosen(prev =>
      prev.includes(curr.id)
        ? prev.filter(id => id !== curr.id) // avmarkera om redan vald
        : [...prev, curr.id] // annars markera
    );
    // Här skulle man i riktig app även skapa/ta bort en inbjudan i databasen
  }

  function handlePrev() {
    setIndex(i => (i - 1 + filtered.length) % filtered.length);
  }
  function handleNext() {
    setIndex(i => (i + 1) % filtered.length);
  }

  // Om index är utanför filtrerat, nollställ
  useEffect(() => { if (index >= filtered.length) setIndex(0); }, [filtered.length]);

  return (
    <main style={{ padding: 20 }}>
      <h1>Sök medspelare</h1>
      <div className="card" style={{ marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <form style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 24, justifyContent: 'center' }} onSubmit={e => e.preventDefault()}>
          <div>
            <label htmlFor="nameSearch" style={{ paddingLeft: 2, paddingBottom: 4, display: 'inline-block' }}>Sök spelare med namn</label><br />
            <input
              id="nameSearch"
              type="text"
              placeholder="Skriv namnet eller delar av namnet."
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
              style={{ minWidth: 140, maxWidth: 220, width: '100%' }}
            />
          </div>
          <div>
            <label htmlFor="levelSort">Sortera per nivå</label><br />
            <select id="levelSort" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </form>
        {filtered.length === 0 ? (
          <div>Inga spelare hittades.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <button type="button" onClick={handlePrev} style={{ fontSize: 28, background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>◀</button>
              <div className={`avatar-card large${chosen.includes(curr.id) ? ' selected' : ''}${invitedIds.includes(curr.id) ? ' invited' : ''}`} style={{ width: 140, height: 140, border: invitedIds.includes(curr.id) ? '5px solid gold' : undefined }}>
                <img src={curr.avatar} alt={`Avatar`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <button type="button" onClick={handleNext} style={{ fontSize: 28, background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>▶</button>
            </div>
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: 22 }}>{curr.name}</div>
              <div style={{ color: '#888' }}>{curr.email}</div>
              <div style={{ color: '#888' }}>{curr.phone}</div>
              <div><strong>Nivå:</strong> {curr.level}</div>
            </div>
            <button type="button" onClick={handleChoose} style={{ marginTop: 16, background: chosen.includes(curr.id) ? '#7A85C1' : '#1A2A80', color: '#fff', borderRadius: 8, padding: '10px 18px', fontWeight: 600 }}>
              {chosen.includes(curr.id) ? 'Avmarkera' : 'Välj mig'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
