import React, { useState } from 'react';
import { login, resetPassword } from '../services/auth';

export default function LoginModal({ onClose }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      await login((form.email || '').trim(), form.password);
      onClose();
    } catch (error) {
      setErr(error.message);
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
      const newPw = await resetPassword(form.email);
      setMsg(`Ett nytt lösenord har skickats till ${form.email} (simulerat): ${newPw}`);
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
