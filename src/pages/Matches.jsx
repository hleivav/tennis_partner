import React, { useEffect, useState } from 'react';
import { listMatches, createMatch as createMatchSvc, joinMatch } from '../services/matches';
import { getCurrentUser } from '../services/auth';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ datetime: '', place: '', maxParticipants: 4 });
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(null);

  const user = getCurrentUser();

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    setLoading(true);
    const m = await listMatches();
    setMatches(m);
    setLoading(false);
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onCreate(e) {
    e.preventDefault();
    setError('');
    try {
      setCreating(true);
      await createMatchSvc({ datetime: form.datetime, place: form.place, maxParticipants: Number(form.maxParticipants) });
      setForm({ datetime: '', place: '', maxParticipants: 4 });
      await fetchMatches();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function onJoin(matchId) {
    if (!user) return alert('Logga in för att gå med');
    try {
      setJoining(matchId);
      await joinMatch(matchId, user.id);
      await fetchMatches();
    } catch (err) {
      alert(err.message);
    } finally {
      setJoining(null);
    }
  }

  return (
    <main className="container">
      <h1 className="center">Matcher</h1>
      <section className="section">
        <h2>Skapa match</h2>
        <form onSubmit={onCreate} className="form-card">
          <label>
            Datum & tid
            <input name="datetime" type="datetime-local" value={form.datetime} onChange={onChange} required />
          </label>
          <label>
            Plats
            <input name="place" value={form.place} onChange={onChange} required />
          </label>
          <label>
            Max deltagare
            <input name="maxParticipants" type="number" min={2} max={20} value={form.maxParticipants} onChange={onChange} />
          </label>
          {error && <div className="error-text">{error}</div>}
          <button type="submit" className="btn primary" disabled={creating}>{creating ? <span className="spinner" /> : 'Skapa'}</button>
        </form>
      </section>

      <section>
        <h2>Tillgängliga matcher</h2>
        {loading ? (
          <p>Hämtar matcher…</p>
        ) : matches.length === 0 ? (
          <p>Inga matcher än.</p>
        ) : (
          <div className="matches-list">
            {matches.map((m) => (
              <article key={m.id} className="match-card">
                <div>
                  <strong>{new Date(m.datetime).toLocaleString()}</strong>
                </div>
                <div>Plats: {m.place}</div>
                <div>Spelare: {m.participants?.length || 0} / {m.maxParticipants || '—'}</div>
                <div className="actions">
                  <button className="btn primary" onClick={() => onJoin(m.id)} disabled={joining === m.id || (user && m.participants && m.participants.includes(user.id))}>
                    {joining === m.id ? <span className="spinner" /> : (user ? (m.participants && m.participants.includes(user.id) ? 'Du är med' : 'Gå med') : 'Logga in för att gå med')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
