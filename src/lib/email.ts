export function isValidEmail(email: string): boolean {
  if (!email) return false
  return /^[^\s@]+@[^@\s]+\.[^@\s]+$/.test(email.trim())
}
