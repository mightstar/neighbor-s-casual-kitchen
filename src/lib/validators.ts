export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return null;
}

export function validateSignup(input: {
  name: string;
  email: string;
  password: string;
}) {
  if (!input.name.trim() || input.name.trim().length < 2) {
    return "Please enter your name.";
  }
  if (!isValidEmail(input.email)) {
    return "Please enter a valid email.";
  }
  return validatePassword(input.password);
}

export function validateLogin(input: { email: string; password: string }) {
  if (!isValidEmail(input.email)) {
    return "Please enter a valid email.";
  }
  if (!input.password) {
    return "Please enter your password.";
  }
  return null;
}

export function validateReservation(input: {
  tableId: string;
  date: string;
  start: string;
  durationMinutes: number;
  partySize: number;
  name: string;
  phone: string;
}) {
  if (!input.tableId) return "Choose a table on the floor plan.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) return "Choose a date.";
  if (!/^\d{2}:\d{2}$/.test(input.start)) return "Choose a start time.";
  if (![60, 90, 120].includes(input.durationMinutes)) {
    return "Choose 60, 90, or 120 minutes.";
  }
  if (!Number.isInteger(input.partySize) || input.partySize < 1 || input.partySize > 6) {
    return "Party size must be between 1 and 6.";
  }
  if (!input.name.trim()) return "Enter a name for the reservation.";
  if (!input.phone.trim() || input.phone.replace(/\D/g, "").length < 10) {
    return "Enter a phone number so we can reach you.";
  }
  return null;
}
