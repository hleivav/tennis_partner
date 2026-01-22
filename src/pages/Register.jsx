import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, getCurrentUser } from '../services/auth';
import { validateRegistration } from '../utils/validation';


export default function Register() {
  const avatarImages = Array.from({ length: 9 }).map((_, i) => new URL(`../assets/images/spelare${i + 1}.png`, import.meta.url).href);
  const [form, setForm] = useState({ name: '', email: '', phone: '', level: 'Nybörjare', password: '', confirm: '', avatar: avatarImages[0] });
  const [user, setUser] = useState(getCurrentUser());
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);

  // Ensure avatarIndex and form.avatar are always in sync
  React.useEffect(() => {
    if (form.avatar !== avatarImages[avatarIndex]) {
      const idx = avatarImages.indexOf(form.avatar);
      if (idx !== -1 && idx !== avatarIndex) setAvatarIndex(idx);
    }
    // If avatarIndex is out of bounds (e.g. after avatarImages changes), reset
    if (avatarIndex < 0 || avatarIndex >= avatarImages.length) {
      setAvatarIndex(0);
      setForm(f => ({ ...f, avatar: avatarImages[0] }));
    }
  }, [form.avatar, avatarImages, avatarIndex]);
  const navigate = useNavigate();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const v = validateRegistration({ name: form.name, email: form.email, password: form.password, confirm: form.confirm });
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setServerErr('');
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, level: form.level, password: form.password, avatar: form.avatar, seekingPartner: !!form.seekingPartner });
      setUser(getCurrentUser());
      navigate('/');
    } catch (err) {
      setServerErr(err.message);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Registrering</h1>
      <div className="card register-card" style={{ marginTop: 0, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', width: '100%', boxSizing: 'border-box', padding: '2em 1em' }}>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, width: '100%', boxSizing: 'border-box', maxWidth: 400, margin: '0 auto' }}>
          <label>
            Namn
            <input name="name" value={form.name} onChange={onChange} />
            {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
          </label>
          <label>
            E-post
            <input name="email" value={form.email} onChange={onChange} />
            {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
          </label>
          <label>
            Telefon (valfri)
            <input name="phone" value={form.phone} onChange={onChange} />
          </label>

          {/* Avatar selector (single-card carousel with arrows) */}
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>Avatar</label>
            <div className="avatar-row" style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center' }}>
              <button
                type="button"
                aria-label="Föregående avatar"
                onClick={() => setAvatarIndex((prev) => {
                  const next = (prev - 1 + avatarImages.length) % avatarImages.length;
                  setForm((f) => ({ ...f, avatar: avatarImages[next] }));
                  return next;
                })}
                style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 28 }}
              >
                ◀
              </button>
              <div
                className={`avatar-card large ${form.avatar === avatarImages[avatarIndex] ? 'selected' : ''}`}
                onClick={() => { setForm((f) => ({ ...f, avatar: avatarImages[avatarIndex] })); setAvatarIndex(avatarIndex); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setForm((f) => ({ ...f, avatar: avatarImages[avatarIndex] })); setAvatarIndex(avatarIndex); } }}
                style={{ width: 140, height: 140 }}
              >
                <img src={avatarImages[avatarIndex]} alt={`Avatar ${avatarIndex + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <button
                type="button"
                aria-label="Nästa avatar"
                onClick={() => setAvatarIndex((prev) => {
                  const next = (prev + 1) % avatarImages.length;
                  setForm((f) => ({ ...f, avatar: avatarImages[next] }));
                  return next;
                })}
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
              onChange={e => setForm({ ...form, seekingPartner: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            <label htmlFor="seekingPartner" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <img
                src={form.seekingPartner
                  ? new URL('../assets/images/siren_green.svg', import.meta.url).href
                  : new URL('../assets/images/siren_red.svg', import.meta.url).href}
                alt={form.seekingPartner ? 'Grön signal' : 'Röd signal'}
                style={{ width: 32, height: 32, marginRight: 8 }}
              />
              <span>Jag söker partner för den här turnering.</span>
            </label>
          </div>

          <label>
            Nivå
            <select
              name="level"
              value={form.level}
              onChange={onChange}
              title="Förklaring: Om du är bekant med vår gruppspel använd någon av de gruppspelsval som beskriver bäst din nivå. Annars använd en av de andra val."
            >
              <option>Gruppspel grupp1</option>
              <option>Gruppspel grupp2</option>
              <option>Gruppspel grupp3</option>
              <option>Gruppspel grupp4</option>
              <option>Gruppspel grupp5</option>
              <option>Gruppspel grupp6</option>
              <option>Avancerad</option>
              <option>Medel</option>
              <option>Nybörjare</option>
            </select>
          </label>
          <label>
            Lösenord
            <input name="password" type="password" value={form.password} onChange={onChange} />
            {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
          </label>
          <label>
            Upprepa lösenord
            <input name="confirm" type="password" value={form.confirm} onChange={onChange} />
            {errors.confirm && <div style={{ color: 'red' }}>{errors.confirm}</div>}
          </label>
          {serverErr && <div style={{ color: 'red' }}>{serverErr}</div>}
          <div>
            <button type="submit">Spara profil</button>
          </div>
        </form>
      </div>
    </main>
  );
}
