// Community groups and group chat. Prototype-grade: everything lives in this browser's localStorage, so
// groups and messages are shared between accounts on the same device (and live-sync between open tabs),
// but not between different people's devices. A real launch needs a backend for that.
//
// The four starter groups include "demo members" (ids starting with "demo:") who post a few seed messages
// and reply to you, so the chat feels alive in a class demo. The UI labels them as demo members.

import { useSyncExternalStore } from 'react'

const KEY = 'sipmatch.community.v1'
export const MAX_MESSAGE = 500
export const MAX_NAME = 40
export const MAX_DESC = 140
const MAX_MESSAGES_PER_GROUP = 200

export const isDemo = (id) => typeof id === 'string' && id.startsWith('demo:')

const DEMO_PEOPLE = {
  'demo:maya': 'Maya',
  'demo:jordan': 'Jordan',
  'demo:priya': 'Priya',
  'demo:sam': 'Sam',
  'demo:lee': 'Lee',
}

// ---- storage (same guarded approach as accounts.js) ----
function readRaw() {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function writeRaw(value) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value))
    return true
  } catch {
    return false // storage blocked or full: the community still works for this page view
  }
}

// ---- starter content ----
function seed() {
  const now = Date.now()
  const min = 60 * 1000
  const msg = (n, authorId, text, minsAgo) => ({ id: `seed-${n}`, authorId, text, at: now - minsAgo * min })
  const groups = [
    { id: 'gin-lovers', name: 'Gin Lovers', emoji: '🌿', category: 'spirits', desc: 'Botanical nerds unite. Tonics, garnishes and gin cocktails.', visibility: 'open', code: 'GINLOV', createdBy: 'demo:maya', members: ['demo:maya', 'demo:jordan', 'demo:sam'] },
    { id: 'natural-wine', name: 'Natural Wine', emoji: '🍇', category: 'wine', desc: 'Funky, fresh, low-intervention bottles under $25.', visibility: 'open', code: 'NATWIN', createdBy: 'demo:priya', members: ['demo:priya', 'demo:lee', 'demo:maya'] },
    { id: 'hoppy-hour', name: 'Hoppy Hour', emoji: '🍺', category: 'beer', desc: 'IPAs, lagers and everything between. What are you pouring?', visibility: 'open', code: 'HOPPYH', createdBy: 'demo:sam', members: ['demo:sam', 'demo:jordan', 'demo:lee'] },
    { id: 'home-mixologists', name: 'Home Mixologists', emoji: '🍹', category: 'cocktails', desc: 'Cocktails with what you already have in the cabinet.', visibility: 'open', code: 'MIXHOM', createdBy: 'demo:jordan', members: ['demo:jordan', 'demo:priya', 'demo:maya'] },
  ]
  const messages = {
    'gin-lovers': [
      msg(1, 'demo:maya', 'Welcome! Current obsession: a G&T with a strip of grapefruit peel instead of lime 🍋', 95),
      msg(2, 'demo:jordan', 'Ooh, trying that tonight. Any tonic you swear by?', 70),
      msg(3, 'demo:sam', 'Anything with less sugar. Lets the botanicals actually show up.', 52),
    ],
    'natural-wine': [
      msg(1, 'demo:priya', 'Anyone found a good pet-nat that isn’t too funky for a first try?', 180),
      msg(2, 'demo:lee', 'Start with something labelled “clean” or “crisp”. Funk comes later 😄', 140),
    ],
    'hoppy-hour': [
      msg(1, 'demo:sam', 'Friday question: hazy IPA or crisp lager with tacos?', 240),
      msg(2, 'demo:lee', 'Lager. Hazy IPAs fight with the salsa.', 200),
      msg(3, 'demo:jordan', 'Counterpoint: a hoppy pale ale cuts through carnitas beautifully.', 160),
    ],
    'home-mixologists': [
      msg(1, 'demo:jordan', 'Rule one: fresh citrus, always. Rule two: measure everything.', 300),
      msg(2, 'demo:priya', 'What’s the easiest cocktail for a first-timer with only 3 ingredients?', 260),
    ],
  }
  return { v: 1, groups, messages, names: { ...DEMO_PEOPLE } }
}

function load() {
  const raw = readRaw()
  if (raw && raw.v === 1 && Array.isArray(raw.groups)) return { ...raw, names: { ...DEMO_PEOPLE, ...raw.names }, messages: raw.messages || {} }
  const fresh = seed()
  writeRaw(fresh)
  return fresh
}

// ---- tiny external store so React screens re-render on any change (including from another tab) ----
let state = load()
const listeners = new Set()
const emit = () => listeners.forEach((l) => l())
const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const getSnapshot = () => state

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      state = load()
      emit()
    }
  })
}

function commit(next) {
  state = next
  writeRaw(state)
  emit()
}

export const useCommunity = () => useSyncExternalStore(subscribe, getSnapshot)

// ---- helpers ----
const rid = (p) => `${p}-${Date.now().toString(36)}${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I so codes are easy to read out loud
const makeCode = (taken) => {
  for (;;) {
    const code = [...crypto.getRandomValues(new Uint8Array(6))].map((b) => CODE_CHARS[b % CODE_CHARS.length]).join('')
    if (!taken.some((g) => g.code === code)) return code
  }
}

// Default display name from an email: "sam.lee@usc.edu" → "Sam Lee". The email itself is never shown to others.
export function defaultName(email) {
  const local = (email || 'guest').split('@')[0].replace(/[._-]+/g, ' ').trim()
  return local.replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 24) || 'Guest'
}
export const nameOf = (s, id) => s.names[id] || (isDemo(id) ? 'Member' : defaultName(id))

export const isMember = (group, id) => !!id && group.members.includes(id)

const withMessage = (s, gid, m) => ({
  ...s,
  messages: { ...s.messages, [gid]: [...(s.messages[gid] || []), m].slice(-MAX_MESSAGES_PER_GROUP) },
})
const system = (text) => ({ id: rid('sys'), system: true, text, at: Date.now() })

// ---- actions ----
export function setName(id, name) {
  const clean = name.trim().slice(0, 24)
  if (!clean) return
  commit({ ...state, names: { ...state.names, [id]: clean } })
}

export function createGroup({ ownerId, name, emoji, category, desc, visibility }) {
  const clean = name.trim().slice(0, MAX_NAME)
  if (!clean) return { error: 'Give your group a name.' }
  const group = {
    id: rid('g'),
    name: clean,
    emoji: emoji || '🥂',
    category: category || null,
    desc: desc.trim().slice(0, MAX_DESC),
    visibility: visibility === 'private' ? 'private' : 'open',
    code: makeCode(state.groups),
    createdBy: ownerId,
    members: [ownerId],
  }
  let next = { ...state, groups: [group, ...state.groups] }
  next = withMessage(next, group.id, system(`${nameOf(state, ownerId)} created ${group.name}. Say hi 👋`))
  commit(next)
  return { group }
}

export function joinGroup(gid, userId) {
  const group = state.groups.find((g) => g.id === gid)
  if (!group) return { error: 'That group no longer exists.' }
  if (group.visibility === 'private' && !isMember(group, userId)) return { error: 'This group is invite-only. Enter its invite code to join.' }
  if (isMember(group, userId)) return { group }
  const groups = state.groups.map((g) => (g.id === gid ? { ...g, members: [...g.members, userId] } : g))
  commit(withMessage({ ...state, groups }, gid, system(`${nameOf(state, userId)} joined`)))
  return { group: { ...group, members: [...group.members, userId] } }
}

export function joinByCode(code, userId) {
  const wanted = code.trim().toUpperCase()
  const group = state.groups.find((g) => g.code === wanted)
  if (!wanted || !group) return { error: 'No group matches that code. Check it and try again.' }
  if (isMember(group, userId)) return { group }
  const groups = state.groups.map((g) => (g.id === group.id ? { ...g, members: [...g.members, userId] } : g))
  commit(withMessage({ ...state, groups }, group.id, system(`${nameOf(state, userId)} joined`)))
  return { group: { ...group, members: [...group.members, userId] } }
}

export function leaveGroup(gid, userId) {
  const group = state.groups.find((g) => g.id === gid)
  if (!group || !isMember(group, userId)) return
  const members = group.members.filter((m) => m !== userId)
  // A group nobody is left in disappears. Starter groups always keep their demo members.
  if (members.length === 0) return deleteGroup(gid)
  const groups = state.groups.map((g) => (g.id === gid ? { ...g, members } : g))
  commit(withMessage({ ...state, groups }, gid, system(`${nameOf(state, userId)} left`)))
}

export function deleteGroup(gid) {
  const messages = { ...state.messages }
  delete messages[gid]
  commit({ ...state, groups: state.groups.filter((g) => g.id !== gid), messages })
}

export function sendMessage(gid, authorId, { text = '', drinkId = null }) {
  const group = state.groups.find((g) => g.id === gid)
  const clean = text.trim().slice(0, MAX_MESSAGE)
  if (!group || !isMember(group, authorId) || (!clean && !drinkId)) return false
  commit(withMessage(state, gid, { id: rid('m'), authorId, text: clean, drinkId, at: Date.now() }))
  if (group.members.some(isDemo)) scheduleDemoReply(gid)
  return true
}

// ---- demo members reply so a solo demo still feels like a community ----
const REPLIES = {
  spirits: ['Love that. Have you tried it with a splash of soda and a twist?', 'Good call. I’d go a little lighter on the pour, honestly.', 'Adding that to my shopping list 📝'],
  wine: ['Ooh, that sounds lovely. Slightly chilled is the trick for me.', 'Good pick! Look for a lower price tier first; it’s a great way to experiment.', 'Saving this one for the weekend 🍷'],
  beer: ['Solid choice. I’d pair that with something salty.', 'Agreed! Drink it cold, but not frozen.', 'Now I want one. Thanks a lot 😄'],
  cocktails: ['Fresh citrus makes all the difference here.', 'Nice! Try shaking it a bit longer for more chill.', 'Okay, making that this weekend 🍹'],
  any: ['Love this group already 🙌', 'Great point!', 'Anyone have a go-to food pairing for that?'],
}
const replying = new Set()
function scheduleDemoReply(gid) {
  if (replying.has(gid)) return
  replying.add(gid)
  window.setTimeout(
    () => {
      replying.delete(gid)
      const group = state.groups.find((g) => g.id === gid)
      const demos = group ? group.members.filter(isDemo) : []
      if (!demos.length) return
      const bank = REPLIES[group.category] || REPLIES.any
      const authorId = demos[Math.floor(Math.random() * demos.length)]
      const text = bank[Math.floor(Math.random() * bank.length)]
      commit(withMessage(state, gid, { id: rid('m'), authorId, text, drinkId: null, at: Date.now() }))
    },
    1200 + Math.random() * 1200,
  )
}
