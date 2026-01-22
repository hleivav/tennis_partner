
import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile } from '../services/auth';

const LEVELS = [
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

export default function Profile() {
  // Only include avatar images that actually exist (filter out broken URLs)
  const avatarImages = Array.from({ length: 9 }).map((_, i) => {
    try {
      return new URL(`../assets/images/spelare${i + 1}.png`, import.meta.url).href;
    } catch {
      return null;
    }
  }).filter(Boolean);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    level: LEVELS[LEVELS.length - 1],
    avatar: avatarImages[0],
    seekingPartner: false,
    password: '',
  });
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setUser(getCurrentUser());
    // Ingen mockad storage-lyssnare behövs längre
  }, []);

  useEffect(() => {
    if (user) {
      // Only update form if values are actually different
      const newForm = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        level: user.level || LEVELS[LEVELS.length - 1],
        avatar: user.avatar || avatarImages[0],
        seekingPartner: !!user.seekingPartner,
        password: user.password || '',
      };
      const isFormDifferent = Object.keys(newForm).some(
        key => form[key] !== newForm[key]
      );
      if (isFormDifferent) {
        setForm(newForm);
      }
      const newAvatarIndex = user.avatar ? avatarImages.indexOf(user.avatar) : 0;
      if (avatarIndex !== newAvatarIndex) {
        setAvatarIndex(newAvatarIndex);
      }
      setDirty(false);
    }
  }, [user]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => {
      const next = { ...f, [name]: type === 'checkbox' ? checked : value };
      setDirty(true);
      return next;
    });
  }

  function onAvatarChange(nextIdx) {
    setAvatarIndex(nextIdx);
    setForm(f => ({ ...f, avatar: avatarImages[nextIdx] }));
    setDirty(true);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // Only send fields backend expects: id, name, email, password, role, phone, level, avatar, seekingPartner
      const payload = {
        id: user.id,
        name: form.name,
        email: form.email,
        password: form.password,
        role: user.role, // keep role unchanged unless you want to allow editing
        phone: form.phone,
        level: form.level,
        avatar: form.avatar,
        seekingPartner: form.seekingPartner
      };
      const updated = await updateProfile(payload);
      setUser(updated);
      setDirty(false);
      alert('Profil sparad');
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Profil</h1>
        <p>Du är inte inloggad.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 20, minHeight: '100vh', boxSizing: 'border-box' }}>
      <h1>Profil</h1>
      <div
        className="card profile-card"
        style={{
          marginTop: 0,
          maxWidth: 480,
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          boxSizing: 'border-box',
          padding: '2em 1em',
        }}
      >
        <form
          onSubmit={save}
          style={{
            display: 'grid',
            gap: 16,
            width: '100%',
            boxSizing: 'border-box',
            maxWidth: 400,
            margin: '0 auto',
          }}
        >
          <label>
            Namn
            <input name="name" value={form.name} onChange={onChange} />
          </label>
          <label>
            E-post
            <input name="email" value={form.email} onChange={onChange} />
          </label>
          <label>
            Telefon
            <input name="phone" value={form.phone} onChange={onChange} />
          </label>
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>Avatar</label>
            <div className="avatar-row" style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center' }}>
              <button
                type="button"
                aria-label="Föregående avatar"
                onClick={() => onAvatarChange((avatarIndex - 1 + avatarImages.length) % avatarImages.length)}
                style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 28 }}
              >
                ◀
              </button>
              <div
                className={`avatar-card large selected`}
                style={{ width: 140, height: 140 }}
                role="button"
                tabIndex={0}
                onClick={() => onAvatarChange(avatarIndex)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onAvatarChange(avatarIndex); }}
              >
                <img src={avatarImages[avatarIndex]} alt={`Avatar ${avatarIndex + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <button
                type="button"
                aria-label="Nästa avatar"
                onClick={() => onAvatarChange((avatarIndex + 1) % avatarImages.length)}
                style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 28 }}
              >
                ▶
              </button>
            </div>
          </div>
          <div className="checkbox-row" style={{ alignItems: 'center' }}>
            <input
              id="seekingPartner"
              type="checkbox"
              name="seekingPartner"
              checked={!!form.seekingPartner}
              onChange={onChange}
              style={{ marginRight: 8 }}
            />
            <label htmlFor="seekingPartner" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span>Jag söker partner för den här turnering.</span>
            </label>
          </div>
          <label>
            Nivå
            <select name="level" value={form.level} onChange={onChange}>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
          <label>
            Lösenord
            <input name="password" type="password" value={form.password} onChange={onChange} />
          </label>
          <div>
            <button type="submit" disabled={!dirty || saving} style={{ opacity: !dirty || saving ? 0.6 : 1 }}>Spara</button>
          </div>
        </form>
      </div>
    </main>
  );
}
