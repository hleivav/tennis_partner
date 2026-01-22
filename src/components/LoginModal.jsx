import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, forgotPassword } from '../services/auth';

export default function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    console.log('[LoginModal] onSubmit called', form);
    setErr('');
    setMsg('');
    try {
      const user = await login((form.email || '').trim(), form.password);
      console.log('[LoginModal] login() return:', user);
      console.log('[LoginModal] localStorage snapshot after login:', {...window.localStorage});
      setMsg('Inloggning lyckades!');
      setTimeout(() => {
        setMsg('');
        onClose();
        navigate('/');
      }, 700);
    } catch (error) {
      setErr(error.message || 'Fel e-post eller lösenord');
    }
  }

  async function onForgot() {
    setErr('');
    setMsg('');
    if (!form.email) {
      setErr('Ange din e-postadress för att återställa lösenordet.');
      return;
    }
    try {
      await forgotPassword(form.email);
      setMsg(`Om e-postadressen är registrerad har en återställningslänk skickats till ${form.email}.`);
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal-content">
        <h2 style={{ marginTop: 0 }}>Logga in</h2>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
          <label>
            E-postadress
            <input name="email" type="email" placeholder="Din e-post" value={form.email} onChange={onChange} />
          </label>
          <label>
            Lösenord
            <input name="password" type="password" placeholder="Ditt lösenord" value={form.password} onChange={onChange} />
          </label>
          {err && <div style={{ color: 'salmon' }}>{err}</div>}
          {msg && <div style={{ color: 'lightgreen' }}>{msg}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button type="submit">Logga in</button>
            <button type="button" onClick={onForgot}>Glömt lösenord?</button>
            <button type="button" onClick={onClose} style={{ marginLeft: 'auto' }}>Stäng</button>
          </div>
        </form>
      </div>
    </div>
  );
}
