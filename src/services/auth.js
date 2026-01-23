import { apiRegister, apiLogin, apiUpdateUser, apiForgotPassword } from './api.js';

const CURR_KEY = 'tp_current';
const TOKEN_KEY = 'tp_token';



export async function register(user) {
  // Registrera och logga in mot backend
  await apiRegister(user);
  return await login(user.email, user.password);
}

export async function login(email, password) {
  const res = await apiLogin(email, password);
  // Hantera både {user, token} och direkt user-objekt
  const user = res.user || res;
  const token = res.token;
  if (user) {
    localStorage.setItem(CURR_KEY, JSON.stringify(user));
  }
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  window.dispatchEvent(new Event('authchange'));
  return user;
}

export function logout() {
  try {
    localStorage.removeItem(CURR_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
  window.dispatchEvent(new Event('authchange'));
}

export function getCurrentUser() {
  try {
    const stored = localStorage.getItem(CURR_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      return user;
    } else {
    }
  } catch (e) {
  }
  return null;
}

export async function updateProfile(updated) {
  const user = await apiUpdateUser(updated);
  if (user) localStorage.setItem(CURR_KEY, JSON.stringify(user));
  return user;
}

// Skickar riktig forgot-password-request till backend
export async function forgotPassword(email) {
  await apiForgotPassword(email);
  return true;
}
