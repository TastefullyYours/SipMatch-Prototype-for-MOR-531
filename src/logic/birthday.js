import { ageFrom } from '../data/options.js'

// Birthday parsing helpers for the typed MM/DD/YYYY field.

export const todayISO = () => new Date().toISOString().slice(0, 10)

// "MM/DD/YYYY" ⇄ "YYYY-MM-DD". Returns null unless it's a real calendar date.
export function toISO(text) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text)
  if (!m) return null
  const [, mm, dd, yyyy] = m
  const d = new Date(Date.UTC(+yyyy, +mm - 1, +dd))
  if (d.getUTCFullYear() !== +yyyy || d.getUTCMonth() !== +mm - 1 || d.getUTCDate() !== +dd) return null
  return `${yyyy}-${mm}-${dd}`
}
export const fromISO = (iso) => (iso ? `${iso.slice(5, 7)}/${iso.slice(8, 10)}/${iso.slice(0, 4)}` : '')

// Keep only digits and add the slashes as the user types: 0520 → 05/20.
export function formatTyped(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/')
}

// Parse the typed text into { iso, valid, age }.
export function readBirthday(text) {
  const iso = toISO(text)
  const valid = !!iso && iso <= todayISO() && iso >= '1900-01-01'
  return { iso, valid, age: valid ? ageFrom(iso) : null }
}
