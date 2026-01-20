// Send an invitation from one user to another
export async function apiSendInvitation(fromUserId, toUserId) {
  const db = readDb();
  const fromUser = db.users.find(u => u.id === fromUserId);
  const toUser = db.users.find(u => u.id === toUserId);
  if (!fromUser || !toUser) throw new Error('User not found');
  if (!toUser.invitations) toUser.invitations = [];
  // Avoid duplicate invitations
  if (!toUser.invitations.some(inv => inv.fromId === fromUserId)) {
    toUser.invitations.push({ fromId: fromUserId, status: 'new' });
    writeDb(db);
  }
  return true;
}
// Utility: Delete all users except superadmin
export function deleteAllUsersExceptSuperadmin() {
  const db = readDb();
  if (db.users) {
    db.users = db.users.filter(u => u.email === 'hleiva@hotmail.com');
    writeDb(db);
  }
}
// Utility: Clear all invitations for all users
export function clearAllInvitations() {
  const db = readDb();
  if (db.users) {
    db.users.forEach(u => { u.invitations = []; });
    writeDb(db);
  }
}
// Admin config API
export async function apiGetAdminConfig() {
  await delay(150);
  const db = readDb();
  if (!db.adminConfig) db.adminConfig = { name: '', deadline: '' };
  return { ...db.adminConfig };
}

export async function apiSaveAdminConfig(cfg) {
  await delay(150);
  const db = readDb();
  db.adminConfig = { ...cfg };
  writeDb(db);
  return { ...db.adminConfig };
}
const DB_KEY = 'tp_db';

function readDb() {
  try {
    const raw = localStorage.getItem(DB_KEY) || JSON.stringify({ users: [] });
    const db = JSON.parse(raw);
    if (!db.users) db.users = [];

    // Ensure superadmin always exists and has correct password
    const idx = db.users.findIndex(u => u.email === 'hleiva@hotmail.com');
    if (idx === -1) {
      db.users.push({
        id: 9999,
        name: 'Superadmin',
        email: 'hleiva@hotmail.com',
        phone: '070-000 00 00',
        level: 'Avancerad',
        avatar: new URL('../assets/images/spelare1.png', import.meta.url).href,
        seekingPartner: false,
        password: 'superadmin',
        invitations: [],
      });
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } else if (db.users[idx].password !== 'superadmin') {
      db.users[idx].password = 'superadmin';
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    }

    return db;
  } catch (e) {
    return { users: [] };
  }
}

function writeDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function delay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function apiRegister(user) {
  await delay(400);
  const db = readDb();
  const normalizedEmail = (user.email || '').trim().toLowerCase();
  if (db.users.find((u) => (u.email || '').trim().toLowerCase() === normalizedEmail)) {
    const err = new Error('En användare med denna e-post finns redan');
    err.code = 'EMAIL_EXISTS';
    throw err;
  }
  const newUser = { ...user, id: Date.now(), email: normalizedEmail };
  db.users.push(newUser);
  writeDb(db);
  const { password, ...publicUser } = newUser;
  return publicUser;
}

export async function apiLogin(email, password) {
  await delay(250);
  const db = readDb();
  const normalizedEmail = (email || '').trim().toLowerCase();
  console.log('DEBUG apiLogin: users=', db.users, 'loginEmail=', normalizedEmail, 'loginPassword=', password);
  const user = db.users.find((u) => ((u.email || '').trim().toLowerCase() === normalizedEmail) && u.password === password);
  if (!user) {
    console.log('DEBUG apiLogin: Ingen matchande användare hittades');
    throw new Error('Fel e-post eller lösenord');
  }
  const { password: pw, ...publicUser } = user;
  const token = btoa(JSON.stringify({ id: user.id, t: Date.now() }));
  return { user: publicUser, token };
}

export async function apiUpdateUser(updated) {
  await delay(200);
  const db = readDb();
  const idx = db.users.findIndex((u) => u.id === updated.id);
  if (idx === -1) throw new Error('Användare hittades inte');
  db.users[idx] = { ...db.users[idx], ...updated };
  writeDb(db);
  const { password, ...publicUser } = db.users[idx];
  return publicUser;
}

export async function apiGetUserById(id) {
  const db = readDb();
  const user = db.users.find((u) => u.id === id);
  if (!user) return null;
  const { password, ...publicUser } = user;
  return publicUser;
}

export async function apiListUsers() {
  const db = readDb();
  return db.users.map(({ password, ...u }) => u);
}

// Matches API
export async function apiCreateMatch(match) {
  await delay(200);
  const db = readDb();
  if (!db.matches) db.matches = [];
  const newMatch = { ...match, id: Date.now(), participants: [] };
  db.matches.push(newMatch);
  writeDb(db);
  return newMatch;
}

export async function apiListMatches() {
  await delay(150);
  const db = readDb();
  return (db.matches || []).map((m) => ({ ...m }));
}

export async function apiGetMatchById(id) {
  const db = readDb();
  const m = (db.matches || []).find((x) => x.id === id);
  if (!m) return null;
  return { ...m };
}

export async function apiJoinMatch(matchId, userId) {
  await delay(150);
  const db = readDb();
  if (!db.matches) db.matches = [];
  const idx = db.matches.findIndex((m) => m.id === matchId);
  if (idx === -1) throw new Error('Match hittades inte');
  const match = db.matches[idx];
  if (!match.participants) match.participants = [];
  if (match.participants.includes(userId)) throw new Error('Du är redan med i matchen');
  if (match.maxParticipants && match.participants.length >= match.maxParticipants) throw new Error('Matchen är full');
  match.participants.push(userId);
  db.matches[idx] = match;
  writeDb(db);
  return { ...match };
}

// Password reset (mocked): sets a new password for the user with the given email
export async function apiResetPassword(email, newPassword) {
  await delay(150);
  const db = readDb();
  const idx = db.users.findIndex((u) => u.email === email);
  if (idx === -1) throw new Error('Ingen användare med denna e-post');
  db.users[idx].password = newPassword;
  writeDb(db);
  return true;
}
