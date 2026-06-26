import { describe, it, expect } from 'vitest'
import { isValidEmail } from './email'

describe('isValidEmail', () => {
  it('accepts a standard email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })
  it('accepts email with subdomain', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true)
  })
  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })
  it('rejects missing @', () => {
    expect(isValidEmail('userexample.com')).toBe(false)
  })
  it('rejects missing domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })
  it('rejects missing TLD', () => {
    expect(isValidEmail('user@example')).toBe(false)
  })
  it('rejects whitespace only', () => {
    expect(isValidEmail('   ')).toBe(false)
  })
  it('rejects multiple @ signs', () => {
    expect(isValidEmail('user@@example.com')).toBe(false)
  })
  it('accepts email with surrounding whitespace', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true)
  })
})
