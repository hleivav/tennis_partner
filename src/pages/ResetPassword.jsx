
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiResetPassword } from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    console.log('[ResetPassword] token:', token);
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!password || password.length < 4) {
      setError('Lösenordet måste vara minst 4 tecken.');
      return;
    }
    if (password !== confirm) {
      setError('Lösenorden matchar inte.');
      return;
    }
    try {
      await apiResetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (e) {
      setError(e.message || 'Kunde inte återställa lösenordet.');
    }
  }

  if (!token) {
    return (
      <main style={{padding: 20}}>
        <h1>Ogiltig länk</h1>
        <p>Ingen token angiven i URL:en. Kontrollera att du klickat på rätt länk från mejlet.</p>
      </main>
    );
  }

  return (
    <main style={{padding: 20, maxWidth: 400, margin: '0 auto'}}>
      <h1>Återställ lösenord</h1>
      <div style={{marginBottom: 16, fontSize: 14, color: '#666'}}>
        <strong>Token:</strong> {token}
      </div>
      {success ? (
        <p>Lösenordet är nu uppdaterat! Du skickas till startsidan...</p>
      ) : (
        <form onSubmit={handleSubmit} style={{display: 'grid', gap: 16}}>
          <label>
            Nytt lösenord
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </label>
          <label>
            Bekräfta lösenord
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </label>
          {error && <div style={{color: 'red'}}>{error}</div>}
          <button type="submit">Spara nytt lösenord</button>
        </form>
      )}
    </main>
  );
}
