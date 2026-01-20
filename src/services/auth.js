import { apiRegister, apiLogin, apiUpdateUser, apiResetPassword } from './api.js';

const CURR_KEY = 'tp_current';
const TOKEN_KEY = 'tp_token';

export async function register(user) {
  // register at mock API and then log in to receive token
  const created = await apiRegister(user);
  const loginRes = await apiLogin(user.email, user.password);
  localStorage.setItem(CURR_KEY, JSON.stringify(loginRes.user));
  localStorage.setItem(TOKEN_KEY, loginRes.token);
  window.dispatchEvent(new Event('storage'));
  return loginRes.user;
}

export async function login(email, password) {
  const res = await apiLogin(email, password);
  localStorage.setItem(CURR_KEY, JSON.stringify(res.user));
  localStorage.setItem(TOKEN_KEY, res.token);
  window.dispatchEvent(new Event('storage'));
  return res.user;
}

export function logout() {
  localStorage.removeItem(CURR_KEY);
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event('storage'));
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURR_KEY));
  } catch (e) {
    return null;
  }
}

export async function updateProfile(updated) {
  const user = await apiUpdateUser(updated);
  localStorage.setItem(CURR_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('storage'));
  return user;
}

// Reset password: generates a simple password on the client-side or accepts one provided by caller
export async function resetPassword(email, newPassword = null) {
  const pw = newPassword || Array.from({ length: 5 }).map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  await apiResetPassword(email, pw);
  return pw;
}
