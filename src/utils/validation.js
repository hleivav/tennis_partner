export function validateEmail(email) {
  if (!email) return 'E-post saknas';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? null : 'Ogiltig e-postadress';
}

export function validatePassword(pw) {
  if (!pw) return 'Lösenord saknas';
  if (pw.length < 5) return 'Lösenord måste vara minst 5 tecken';
  return null;
}

export function validateRegistration({ name, email, password, confirm }) {
  const errors = {};
  if (!name) errors.name = 'Förnamn&efternamn saknas';
  const e = validateEmail(email);
  if (e) errors.email = e;
  const p = validatePassword(password);
  if (p) errors.password = p;
  if (password !== confirm) errors.confirm = 'Lösenorden matchar inte';
  return errors;
}
