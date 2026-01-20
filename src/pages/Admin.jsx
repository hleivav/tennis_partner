import React, { useState, useEffect } from 'react';
import '../styles/forms.css';
import { apiGetAdminConfig, apiSaveAdminConfig, deleteAllUsersExceptSuperadmin, apiListUsers } from '../services/api';

export default function Admin() {
  const [form, setForm] = useState({ name: '', deadline: '' });
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    apiGetAdminConfig()
      .then(cfg => {
        setForm({
          name: cfg.name || '',
          deadline: cfg.deadline || '',
        });
        setSaved(cfg);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    apiListUsers().then(setAllUsers);
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.deadline) {
      setError('Fyll i både turneringsnamn och sista anmälningsdag.');
      return;
    }
    try {
      const cfg = await apiSaveAdminConfig(form);
      setSaved(cfg);
      alert('Inställningar sparade');
    } catch (err) {
      setError('Kunde inte spara inställningar.');
    }
  }

  function handleDeleteAllUsers() {
    if (window.confirm('Är du säker på att du vill ta bort ALLA spelare utom superadmin?')) {
      deleteAllUsersExceptSuperadmin();
      setAllUsers([]);
      alert('Alla spelare utom superadmin har tagits bort.');
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Admin</h1>
      <div className="card" style={{ marginTop: 0 }}>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <label>
            Turneringsnamn
            <input name="name" placeholder="Turneringsnamn" value={form.name} onChange={onChange} />
          </label>

          <label>
            Sista anmälningsdag
            <input name="deadline" type="date" value={form.deadline} onChange={onChange} />
          </label>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <div>
            <button type="submit">Spara</button>
          </div>
        </form>
      </div>

      {saved && (
        <section style={{ marginTop: 24 }}>
          <h2>Senast sparade inställningar</h2>
          <div>Turnering: <strong>{saved.name}</strong></div>
          <div>Sista anmälan: <strong>{saved.deadline}</strong></div>
        </section>
      )}

      <div className="card" style={{ marginTop: 24 }}>
        <h2>Alla spelare</h2>
        <ul>
          {allUsers.filter(u => u.email !== 'hleiva@hotmail.com').map(u => (
            <li key={u.id}>{u.name} ({u.email})</li>
          ))}
        </ul>
        <button style={{ background: '#c00', color: '#fff', marginTop: 12 }} onClick={handleDeleteAllUsers}>
          Ta bort alla spelare utom superadmin
        </button>
      </div>
    </main>
  );
}
