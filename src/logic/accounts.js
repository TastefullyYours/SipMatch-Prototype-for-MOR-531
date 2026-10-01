// Demo accounts stored in this browser's localStorage. No server: an account exists only on the
// device/browser where it was created. Passwords are salted + SHA-256 hashed (never stored as typed),
// but this is prototype-grade, not production security. Don't reuse a real password.

const USERS_KEY = 'sipmatch.users.v1'
const SESSION_KEY = 'sipmatch.session.v1'

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
function write(key, value) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false // storage blocked (private mode, full, disabled)
  }
}

const norm = (email) => email.trim().toLowerCase()

async function hash(password, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const storageAvailable = () => write('sipmatch.test', 1) && write('sipmatch.test', null)

export async function createAccount({ email, phone, birthday, password }) {
  const users = read(USERS_KEY, {})
  const key = norm(email)
  if (users[key]) return { error: 'An account with that email already exists on this device. Try logging in.' }
  const salt = crypto.getRandomValues(new Uint32Array(4)).join('-')
  const user = { email: key, phone: phone.trim(), birthday, salt, hash: await hash(password, salt), createdAt: new Date().toISOString() }
  users[key] = user
  if (!write(USERS_KEY, users)) return { error: 'This browser is blocking storage, so accounts can’t be saved. Try continuing as a guest.' }
  write(SESSION_KEY, key)
  return { user }
}

export async function logIn(email, password) {
  const user = read(USERS_KEY, {})[norm(email)]
  if (!user || user.hash !== (await hash(password, user.salt))) return { error: 'Email or password doesn’t match an account on this device.' }
  write(SESSION_KEY, user.email)
  return { user }
}

export function logOut() {
  write(SESSION_KEY, null)
}

export function currentUser() {
  const email = read(SESSION_KEY, null)
  return email ? read(USERS_KEY, {})[email] || null : null
}

// Save app data (profile, saved drinks, …) onto the signed-in user's record.
export function updateUser(email, patch) {
  const users = read(USERS_KEY, {})
  if (!users[email]) return
  users[email] = { ...users[email], ...patch }
  write(USERS_KEY, users)
}
