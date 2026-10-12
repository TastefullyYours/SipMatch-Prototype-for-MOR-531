// Groups and group chat, stored in this browser's localStorage (no server). Every account on this
// device sees the same groups, so you can demo two people by logging in as each. The seeded groups
// come with scripted demo members who reply when you post.

const GROUPS_KEY = 'sipmatch.groups.v1'

function read() {
  try {
    const raw = window.localStorage.getItem(GROUPS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function write(groups) {
  try {
    window.localStorage.setItem(GROUPS_KEY, JSON.stringify(groups))
  } catch {
    // storage blocked: changes last until the page closes
  }
  memory = groups
}

const now = () => new Date().toISOString()
const ago = (mins) => new Date(Date.now() - mins * 60000).toISOString()
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
// Invite codes skip look-alike characters (0/O, 1/I/L).
const newCode = () => Array.from({ length: 6 }, () => 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 31)]).join('')

export const displayName = (email) => (email ? email.split('@')[0] : 'Guest')

// Demo members: posts from them are scripted, not real people.
const BOT = (name) => `${name}@demo.sipmatch`
export const isDemo = (author) => author.endsWith('@demo.sipmatch')

function seed() {
  const msg = (author, mins, text, drinkId) => ({ id: uid(), author: BOT(author), at: ago(mins), text, drinkId })
  return [
    {
      id: 'gin-lovers',
      emoji: '🌿',
      name: 'Gin Lovers',
      about: 'Botanical nerds unite. G&Ts, martinis and the bottles worth buying.',
      privacy: 'open',
      code: 'GINGIN',
      owner: BOT('maya'),
      members: [BOT('maya'), BOT('dev'), BOT('sam')],
      createdAt: ago(9000),
      messages: [
        msg('maya', 240, 'Welcome! Share your favorite gin drink and what you had it with.'),
        msg('dev', 200, 'Made these for taco night. Grapefruit + lime with carnitas was unreal.', 'paloma'),
        msg('sam', 190, 'Wait, a Paloma is tequila though 😂'),
        msg('dev', 185, 'Fine. Classic answer then:', 'french-75'),
      ],
    },
    {
      id: 'natural-wine',
      emoji: '🍇',
      name: 'Natural Wine',
      about: 'Funky, fresh, low-intervention. Beginners very welcome.',
      privacy: 'open',
      code: 'FUNKY7',
      owner: BOT('lena'),
      members: [BOT('lena'), BOT('jo')],
      createdAt: ago(8000),
      messages: [
        msg('lena', 600, 'Chilled reds are the move this week. Anyone tried a light Pinot slightly cold?', 'pinot-noir'),
        msg('jo', 560, 'Yes! Did it with mushroom pasta. Very good.'),
      ],
    },
    {
      id: 'hoppy-hour',
      emoji: '🍺',
      name: 'Hoppy Hour',
      about: 'IPAs, lagers & everything between.',
      privacy: 'open',
      code: 'HOPS42',
      owner: BOT('rico'),
      members: [BOT('rico'), BOT('ava'), BOT('dev')],
      createdAt: ago(7000),
      messages: [
        msg('rico', 90, 'Game day snack plan: wings + something crisp.', 'mexican-lager'),
        msg('ava', 80, 'IPA with wings or bust 🔥', 'ipa'),
      ],
    },
    {
      id: 'usc-supper-club',
      emoji: '🍝',
      name: 'MOR 531 Supper Club',
      about: 'Invite-only potluck crew. Ask a member for the code.',
      privacy: 'invite',
      code: 'SUPPER',
      owner: BOT('maya'),
      members: [BOT('maya'), BOT('jo')],
      createdAt: ago(5000),
      messages: [
        msg('maya', 1440, 'Friday potluck! I’m bringing lasagna. Who’s on drinks?'),
        msg('jo', 1400, 'Me. Thinking this:', 'chianti'),
      ],
    },
  ]
}

let memory = null
export function listGroups() {
  if (!memory) memory = read() || seed()
  return memory
}

export const getGroup = (id) => listGroups().find((g) => g.id === id) || null
export const isMember = (group, email) => !!email && group.members.includes(email)

function save(id, change) {
  const groups = listGroups().map((g) => (g.id === id ? change(g) : g))
  write(groups)
  return groups.find((g) => g.id === id)
}

export function createGroup({ name, emoji, about, privacy, owner }) {
  const group = {
    id: uid(),
    emoji,
    name: name.trim(),
    about: about.trim(),
    privacy,
    code: newCode(),
    owner,
    members: [owner],
    createdAt: now(),
    messages: [{ id: uid(), system: true, at: now(), text: `${displayName(owner)} created the group` }],
  }
  write([group, ...listGroups()])
  return group
}

const systemMsg = (text) => ({ id: uid(), system: true, at: now(), text })

// Open groups can be joined from the list; invite-only groups need their code.
export function joinGroup(id, email) {
  return save(id, (g) => (g.members.includes(email) ? g : { ...g, members: [...g.members, email], messages: [...g.messages, systemMsg(`${displayName(email)} joined`)] }))
}

export function joinByCode(code, email) {
  const group = listGroups().find((g) => g.code === code.trim().toUpperCase())
  if (!group) return { error: 'No group on this device has that code. Check it and try again.' }
  return { group: joinGroup(group.id, email) }
}

export function leaveGroup(id, email) {
  return save(id, (g) => ({ ...g, members: g.members.filter((m) => m !== email), messages: [...g.messages, systemMsg(`${displayName(email)} left`)] }))
}

export function postMessage(id, { author, text = '', drinkId = null }) {
  return save(id, (g) => ({ ...g, messages: [...g.messages, { id: uid(), author, at: now(), text: text.trim(), drinkId }] }))
}

// A scripted reply from one of the group's demo members (none in groups without demo members).
const REPLIES_TO_DRINK = ['Ooh, adding that to my list 📝', 'Great pick. Tried it last month, so good.', 'Saving this one ♥', 'What are you having it with?', 'Never tried it! Worth it?']
const REPLIES_TO_TEXT = ['Ha, agreed!', 'Love that 🙌', 'Ooh tell me more', 'Same here', 'Cheers to that 🥂']
export function demoReply(group, message) {
  const bots = group.members.filter(isDemo)
  if (!bots.length) return null
  const pool = message.drinkId ? REPLIES_TO_DRINK : REPLIES_TO_TEXT
  const n = group.messages.length
  return { author: bots[n % bots.length], text: pool[n % pool.length] }
}

// Keep other tabs in sync.
export function onGroupsChange(callback) {
  const handler = (e) => {
    if (e.key !== GROUPS_KEY) return
    memory = null
    callback()
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}
