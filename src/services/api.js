// Acceptera en inbjudan
export async function apiAcceptInvitation(invitationId) {
  const res = await fetch(`http://localhost:8080/api/invitations/${invitationId}/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Kunde inte acceptera inbjudan');
  return await res.json();
}

// Ignorera en inbjudan
export async function apiIgnoreInvitation(invitationId) {
  const res = await fetch(`http://localhost:8080/api/invitations/${invitationId}/ignore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Kunde inte ignorera inbjudan');
  return await res.json();
}
// Hämta inbjudningar för en viss mottagare
export async function apiListInvitations(receiverId) {
  const url = `http://localhost:8080/api/invitations?receiverId=${receiverId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Kunde inte hämta inbjudningar');
  return await res.json();
}
// Återställ lösenord via backend
export async function apiResetPassword(token, newPassword) {
  const res = await fetch('http://localhost:8080/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Kunde inte återställa lösenordet');
  }
  return true;
}
// Skickar riktig forgot-password-request till backend
export async function apiForgotPassword(email) {
  const res = await fetch('http://localhost:8080/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Kunde inte skicka återställningslänk');
  }
  return true;
}
// Skickar inbjudan via backend-API
export async function apiSendInvitation(senderId, receiverId) {
  const res = await fetch('http://localhost:8080/api/invitations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderId, receiverId })
  });
  if (!res.ok) throw new Error('Kunde inte skicka inbjudan');
  return true;
}
// Dessa mock-utils tas bort, hanteras nu i backend
// Admin config API (exempel, byt till backend-API om det finns)
export async function apiGetAdminConfig() {
  const res = await fetch('http://localhost:8080/api/admin/config');
  if (!res.ok) throw new Error('Kunde inte hämta admininställningar');
  const data = await res.json();
  // Map backend 'tournamentName' to frontend 'name' for compatibility
  return {
    name: data.tournamentName || data.name || '',
    deadline: data.deadline || ''
  };
}
export async function apiSaveAdminConfig(cfg) {
  // Skicka med id: 1 och rätt fältnamn
  const payload = {
    id: 1,
    tournamentName: cfg.name,
    deadline: cfg.deadline
  };
  const res = await fetch('http://localhost:8080/api/admin/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Kunde inte spara admininställningar');
  const data = await res.json();
  return {
    name: data.tournamentName || data.name || '',
    deadline: data.deadline || ''
  };
}
// Mock-databasfunktioner borttagna

export async function apiRegister(user) {
  const res = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Kunde inte registrera användare');
  }
  return await res.json();
}

export async function apiLogin(email, password) {
  console.log('[api.js] apiLogin: POST', { email, password });
  const res = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.log('[api.js] apiLogin: error response', data);
    throw new Error(data.message || 'Fel e-post eller lösenord');
  }
  const json = await res.json();
  console.log('[api.js] apiLogin: success response', json);
  return json;
}

export async function apiUpdateUser(updated) {
  const res = await fetch('http://localhost:8080/api/users/' + updated.id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  });
  if (!res.ok) throw new Error('Kunde inte uppdatera användare');
  return await res.json();
}

export async function apiGetUserById(id) {
  const res = await fetch('http://localhost:8080/api/users/' + id);
  if (!res.ok) return null;
  return await res.json();
}

export async function apiListUsers() {
  const res = await fetch('http://localhost:8080/api/users');
  if (!res.ok) throw new Error('Kunde inte hämta användarlista');
  return await res.json();
}

// Matches API (exempel, byt till backend-API endpoints)
export async function apiCreateMatch(match) {
  const res = await fetch('http://localhost:8080/api/matches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(match)
  });
  if (!res.ok) throw new Error('Kunde inte skapa match');
  return await res.json();
}
export async function apiListMatches() {
  const res = await fetch('http://localhost:8080/api/matches');
  if (!res.ok) throw new Error('Kunde inte hämta matcher');
  return await res.json();
}
export async function apiGetMatchById(id) {
  const res = await fetch('http://localhost:8080/api/matches/' + id);
  if (!res.ok) return null;
  return await res.json();
}
export async function apiJoinMatch(matchId, userId) {
  const res = await fetch(`http://localhost:8080/api/matches/${matchId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error('Kunde inte gå med i matchen');
  return await res.json();
}

// Password reset tas bort, hanteras nu via backend
