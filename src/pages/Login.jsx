
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();


  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login((form.email || '').trim(), form.password);
      navigate('/');
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Logga in</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
        <label>
          E-post
          <input name="email" value={form.email} onChange={onChange} />
        </label>
        <label>
          Lösenord
          <input name="password" type="password" value={form.password} onChange={onChange} />
        </label>
        {err && <div style={{ color: 'red' }}>{err}</div>}
        <div>
          <button type="submit">Logga in</button>
        </div>
      </form>
    </main>
  );
} 
