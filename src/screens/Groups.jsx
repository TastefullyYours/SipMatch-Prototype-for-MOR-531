import { useEffect, useReducer, useRef, useState } from 'react'
import { DRINKS, PRICE_TIERS, TYPE_LABELS } from '../logic/recommend.js'
import { RECIPES } from '../data/recipes.js'
import { Recipe } from '../components/DrinkCard.jsx'
import { SaveButton } from '../components/SavedDrink.jsx'
import { Button, ScreenTitle, SectionLabel, Segmented } from '../components/ui.jsx'
import {
  createGroup,
  demoReply,
  displayName,
  getGroup,
  isDemo,
  isMember,
  joinByCode,
  joinGroup,
  leaveGroup,
  listGroups,
  onGroupsChange,
  postMessage,
} from '../logic/groups.js'

const inputClass = 'w-full rounded-2xl border-2 border-berry/15 bg-white px-4 py-3 outline-none placeholder:text-muted/60 focus:border-berry'
const drinkById = (id) => DRINKS.find((d) => d.id === id)
const EMOJIS = ['🍷', '🍺', '🍸', '🍹', '🥂', '🌿', '🍇', '🍋', '🍝', '🌮', '🎉', '☕']

// Re-render when groups change (here or in another tab).
function useGroupsVersion() {
  const [version, bump] = useReducer((x) => x + 1, 0)
  useEffect(() => onGroupsChange(bump), [])
  return [version, bump]
}

function PrivacyBadge({ privacy }) {
  return privacy === 'invite' ? (
    <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[11px] font-semibold text-[#8a6412]">🔒 Invite-only</span>
  ) : (
    <span className="rounded-full bg-berry-light px-2 py-0.5 text-[11px] font-semibold text-berry">🌐 Open</span>
  )
}

const lastLine = (g) => {
  const m = [...g.messages].reverse().find((x) => !x.system)
  if (!m) return 'No messages yet'
  const who = displayName(m.author)
  const drink = m.drinkId && drinkById(m.drinkId)
  return `${who}: ${m.text || ''}${m.text && drink ? ' ' : ''}${drink ? `${drink.emoji} ${drink.name}` : ''}`
}

function GroupRow({ group, account, onOpen, onJoin }) {
  const member = isMember(group, account)
  const locked = group.privacy === 'invite' && !member
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
      <button onClick={() => !locked && onOpen(group.id)} disabled={locked} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-berry-light text-2xl">{group.emoji}</span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold leading-tight">{group.name}</span>
            <PrivacyBadge privacy={group.privacy} />
          </span>
          <span className="mt-0.5 block truncate text-sm text-muted">{locked ? group.about : lastLine(group)}</span>
          <span className="block text-xs text-muted">
            {group.members.length} member{group.members.length === 1 ? '' : 's'}
          </span>
        </span>
      </button>
      {!member && !locked && account && (
        <button onClick={() => onJoin(group.id)} aria-label={`Join ${group.name}`} className="shrink-0 rounded-full bg-berry px-3 py-1.5 text-xs font-semibold text-white hover:bg-berry-dark">
          Join
        </button>
      )}
      {locked && <span className="shrink-0 text-xs font-semibold text-muted">Code needed</span>}
    </div>
  )
}

export function GroupsHome({ account, onOpen, onCreate, onSignUp }) {
  useGroupsVersion()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const groups = listGroups()
  const mine = groups.filter((g) => isMember(g, account))
  const others = groups.filter((g) => !isMember(g, account))

  const join = (id) => {
    joinGroup(id, account)
    onOpen(id)
  }
  const joinCode = (e) => {
    e.preventDefault()
    const { group, error } = joinByCode(code, account)
    if (error) return setError(error)
    onOpen(group.id)
  }

  return (
    <>
      <ScreenTitle eyebrow="👥 Groups" title="Sip with your people" sub="Make a group, chat, and share drinks you found. Open groups anyone can join; invite-only groups need a code." />

      {!account ? (
        <div className="mb-6 rounded-3xl bg-gold/15 p-4 text-sm">
          <p className="font-semibold">Browsing as a guest</p>
          <p className="mt-1 text-ink/70">You can read open groups. Create an account to join, chat and share drinks.</p>
          <Button className="mt-3" onClick={onSignUp}>
            Create an account
          </Button>
        </div>
      ) : (
        <div className="mb-6 grid gap-3 lg:grid-cols-2">
          <Button onClick={onCreate}>＋ Create a group</Button>
          <form onSubmit={joinCode} className="flex gap-2">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase())
                setError('')
              }}
              placeholder="Invite code"
              maxLength={6}
              aria-label="Invite code"
              className={`${inputClass} uppercase tracking-widest`}
            />
            <button type="submit" disabled={code.trim().length < 6} className="shrink-0 rounded-2xl bg-white px-4 font-semibold text-berry ring-2 ring-berry/20 disabled:opacity-40">
              Join
            </button>
          </form>
          {error && <p className="text-sm text-berry lg:col-span-2">{error}</p>}
        </div>
      )}

      {account && (
        <>
          <SectionLabel hint={`${mine.length}`}>Your groups</SectionLabel>
          {mine.length === 0 ? (
            <p className="rounded-3xl bg-white p-5 text-center text-sm text-muted shadow-sm">You're not in any groups yet. Join one below or make your own.</p>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {mine.map((g) => (
                <GroupRow key={g.id} group={g} account={account} onOpen={onOpen} onJoin={join} />
              ))}
            </div>
          )}
        </>
      )}

      <SectionLabel hint="Open to everyone">Discover</SectionLabel>
      <div className="grid gap-3 lg:grid-cols-2">
        {others.map((g) => (
          <GroupRow key={g.id} group={g} account={account} onOpen={onOpen} onJoin={join} />
        ))}
        {others.length === 0 && <p className="text-sm text-muted">You've joined every group on this device.</p>}
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        Prototype note: groups are saved in this browser only, so other accounts on this device see them too. Demo members (marked “demo”) reply automatically.
      </p>
    </>
  )
}

export function CreateGroup({ account, onCreated }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🍷')
  const [about, setAbout] = useState('')
  const [privacy, setPrivacy] = useState('open')
  const submit = (e) => {
    e.preventDefault()
    const group = createGroup({ name, emoji, about, privacy, owner: account })
    onCreated(group.id)
  }
  return (
    <form onSubmit={submit} className="flex flex-1 flex-col">
      <ScreenTitle eyebrow="👥 New group" title="Start a group" sub="For your book club, roommates, or anyone who shares your taste." />

      <SectionLabel>Name</SectionLabel>
      <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="e.g. Friday Wine Night" className={inputClass} />

      <SectionLabel>Icon</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {EMOJIS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEmoji(e)}
            aria-pressed={emoji === e}
            aria-label={`Icon ${e}`}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 text-2xl ${emoji === e ? 'border-berry bg-berry-light' : 'border-transparent bg-white'}`}
          >
            {e}
          </button>
        ))}
      </div>

      <SectionLabel hint="Optional">What's it about?</SectionLabel>
      <input value={about} onChange={(e) => setAbout(e.target.value)} maxLength={90} placeholder="e.g. Cheap reds and good company" className={inputClass} />

      <SectionLabel>Who can join?</SectionLabel>
      <Segmented
        options={[
          { id: 'open', label: '🌐 Open', sub: 'Anyone can join' },
          { id: 'invite', label: '🔒 Invite-only', sub: 'Needs your code' },
        ]}
        value={privacy}
        onChange={setPrivacy}
      />
      <p className="mt-2 text-xs text-muted">Every group gets an invite code you can send to friends.</p>

      <div className="sticky bottom-0 -mx-5 mt-auto bg-gradient-to-t from-cream via-cream to-cream/0 px-5 pb-4 pt-6 lg:-mx-10 lg:px-10">
        <Button type="submit" disabled={!name.trim()}>
          Create group
        </Button>
      </div>
    </form>
  )
}

const time = (iso) => {
  const d = new Date(iso)
  return d.toDateString() === new Date().toDateString()
    ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

// A drink posted into the chat: compact card that opens to the recipe or what to buy.
function DrinkBubble({ drink, saved, setSaved }) {
  const [open, setOpen] = useState(false)
  const recipe = RECIPES[drink.id]
  return (
    <div className="mt-1 w-64 max-w-full overflow-hidden rounded-2xl bg-white text-left text-ink shadow-sm ring-1 ring-berry/10">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center gap-3 p-3 text-left">
        <span className="text-3xl leading-none">{drink.emoji}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted">
            {TYPE_LABELS[drink.type]} · {PRICE_TIERS[drink.priceTier].symbol}
          </span>
          <span className="block font-display font-bold leading-tight">{drink.name}</span>
        </span>
        <span className={`text-muted transition ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      {open && (
        <div className="border-t border-sand p-3 text-sm">
          <p className="text-muted">{drink.style}</p>
          <div className="mt-2">{recipe ? <Recipe recipe={recipe} /> : <p><b>At the store:</b> {drink.lookFor}</p>}</div>
        </div>
      )}
      {setSaved && (
        <div className="px-3 pb-3">
          <SaveButton
            drinkId={drink.id}
            saved={saved}
            onToggle={(id) => {
              const next = { ...saved }
              if (next[id]) delete next[id]
              else next[id] = { rating: 0, note: '' }
              setSaved(next)
            }}
          />
        </div>
      )}
    </div>
  )
}

function Message({ m, mine, saved, setSaved }) {
  if (m.system) return <p className="py-1 text-center text-xs text-muted">{m.text}</p>
  const drink = m.drinkId && drinkById(m.drinkId)
  return (
    <div className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
      <span className="mb-0.5 px-1 text-[11px] text-muted">
        {mine ? 'You' : displayName(m.author)}
        {isDemo(m.author) && <span className="ml-1 rounded bg-sand px-1">demo</span>} · {time(m.at)}
      </span>
      {m.text && <p className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[15px] leading-snug ${mine ? 'rounded-br-md bg-berry text-white' : 'rounded-bl-md bg-white shadow-sm'}`}>{m.text}</p>}
      {drink && <DrinkBubble drink={drink} saved={saved} setSaved={setSaved} />}
    </div>
  )
}

// Bottom-sheet modal (centered on desktop).
export function Sheet({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 sm:items-center" onClick={onClose}>
      <div role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()} className="flex max-h-[80vh] w-full max-w-md flex-col rounded-t-3xl bg-cream p-5 shadow-2xl sm:rounded-3xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full px-2 py-1 text-muted hover:bg-sand">
            ✕
          </button>
        </div>
        <div className="-mx-1 overflow-y-auto px-1">{children}</div>
      </div>
    </div>
  )
}

function DrinkPicker({ saved, onPick, onClose }) {
  const savedIds = Object.keys(saved).filter(drinkById)
  const [tab, setTab] = useState(savedIds.length ? 'saved' : 'all')
  const [q, setQ] = useState('')
  const list = (tab === 'saved' ? savedIds.map(drinkById) : DRINKS).filter((d) => d.name.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <Sheet title="Share a drink" onClose={onClose}>
      <Segmented
        size="sm"
        options={[
          { id: 'saved', label: `♥ Saved (${savedIds.length})` },
          { id: 'all', label: 'All drinks' },
        ]}
        value={tab}
        onChange={setTab}
      />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search drinks" aria-label="Search drinks" className={`${inputClass} mt-3 py-2`} />
      <div className="mt-3 flex flex-col gap-1.5">
        {list.map((d) => (
          <button key={d.id} onClick={() => onPick(d.id)} className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5 text-left hover:ring-2 hover:ring-berry/20">
            <span className="text-2xl">{d.emoji}</span>
            <span className="flex-1">
              <span className="block font-semibold leading-tight">{d.name}</span>
              <span className="text-xs text-muted">{TYPE_LABELS[d.type]}</span>
            </span>
            <span className="text-sm font-semibold text-berry">Share</span>
          </button>
        ))}
        {list.length === 0 && <p className="py-4 text-center text-sm text-muted">{tab === 'saved' && !savedIds.length ? 'No saved drinks yet. Try “All drinks”.' : 'No drinks match that search.'}</p>}
      </div>
    </Sheet>
  )
}

export function GroupChat({ account, groupId, saved, setSaved, onLeft, onSignUp }) {
  const [, bump] = useGroupsVersion()
  const [text, setText] = useState('')
  const [picking, setPicking] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [typing, setTyping] = useState(null)
  const endRef = useRef(null)
  const group = getGroup(groupId)
  const count = group?.messages.length || 0

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [count, typing])

  if (!group) return <p className="text-muted">This group no longer exists.</p>
  const member = isMember(group, account)
  if (group.privacy === 'invite' && !member) return <p className="text-muted">This group is invite-only. Ask a member for the code.</p>

  const send = (message) => {
    postMessage(group.id, { author: account, ...message })
    bump()
    const reply = demoReply(getGroup(group.id), message)
    if (reply) {
      setTyping(reply.author)
      setTimeout(() => {
        postMessage(group.id, reply)
        setTyping(null)
        bump()
      }, 1400)
    }
  }
  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    send({ text })
    setText('')
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-berry-light text-2xl">{group.emoji}</span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold leading-tight">{group.name}</h1>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <PrivacyBadge privacy={group.privacy} />
            <button onClick={() => setShowInfo(!showInfo)} aria-expanded={showInfo} className="font-semibold text-berry hover:underline">
              {group.members.length} member{group.members.length === 1 ? '' : 's'} {showInfo ? '▴' : '▾'}
            </button>
          </div>
        </div>
      </div>

      {showInfo && (
        <div className="mb-3 rounded-3xl bg-white p-4 text-sm shadow-sm">
          {group.about && <p className="mb-2 text-muted">{group.about}</p>}
          <p className="font-semibold">Members</p>
          <p className="mt-1 text-ink/80">{group.members.map((m) => (m === account ? 'You' : displayName(m))).join(', ')}</p>
          {member && (
            <>
              <p className="mt-3 font-semibold">Invite code</p>
              <p className="mt-1 flex items-center gap-2">
                <code className="rounded-xl bg-sand px-3 py-1 text-base font-bold tracking-widest text-berry">{group.code}</code>
                <span className="text-xs text-muted">Send this to a friend. They enter it on the Groups screen.</span>
              </p>
              <button
                onClick={() => {
                  leaveGroup(group.id, account)
                  onLeft()
                }}
                className="mt-4 text-xs font-semibold text-muted underline-offset-2 hover:text-berry hover:underline"
              >
                Leave group
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 rounded-3xl bg-sand/50 p-3" aria-live="polite">
        {group.messages.map((m) => (
          <Message key={m.id} m={m} mine={m.author === account} saved={saved} setSaved={account ? setSaved : null} />
        ))}
        {typing && <p className="text-xs italic text-muted">{displayName(typing)} is typing…</p>}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 -mx-5 bg-gradient-to-t from-cream via-cream to-cream/0 px-5 pb-4 pt-4 lg:-mx-10 lg:px-10">
        {member ? (
          <form onSubmit={submit} className="flex items-center gap-2">
            <button type="button" onClick={() => setPicking(true)} aria-label="Share a drink" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/25 text-xl hover:bg-gold/40">
              🍸
            </button>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message" aria-label="Message" maxLength={500} className={inputClass} />
            <button type="submit" disabled={!text.trim()} className="h-12 shrink-0 rounded-2xl bg-berry px-4 font-semibold text-white disabled:bg-berry/30">
              Send
            </button>
          </form>
        ) : account ? (
          <Button
            onClick={() => {
              joinGroup(group.id, account)
              bump()
            }}
          >
            Join {group.name}
          </Button>
        ) : (
          <Button onClick={onSignUp}>Create an account to chat</Button>
        )}
      </div>

      {picking && (
        <DrinkPicker
          saved={saved}
          onClose={() => setPicking(false)}
          onPick={(drinkId) => {
            setPicking(false)
            send({ drinkId })
          }}
        />
      )}
    </div>
  )
}

// Opened from "👥 Share" on any drink card: pick one of your groups to post it to.
export function ShareToGroup({ account, drinkId, onClose, onShared, onGroups }) {
  const drink = drinkById(drinkId)
  const [note, setNote] = useState('')
  const mine = listGroups().filter((g) => isMember(g, account))
  return (
    <Sheet title={`Share ${drink.emoji} ${drink.name}`} onClose={onClose}>
      {!account ? (
        <p className="text-sm text-muted">Create an account to share drinks into groups.</p>
      ) : mine.length === 0 ? (
        <>
          <p className="text-sm text-muted">You're not in any groups yet.</p>
          <Button className="mt-3" onClick={onGroups}>
            Find or create a group
          </Button>
        </>
      ) : (
        <>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a message (optional)" aria-label="Message" maxLength={500} className={`${inputClass} py-2`} />
          <div className="mt-3 flex flex-col gap-1.5">
            {mine.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  postMessage(g.id, { author: account, text: note, drinkId })
                  onShared(g.id)
                }}
                className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5 text-left hover:ring-2 hover:ring-berry/20"
              >
                <span className="text-2xl">{g.emoji}</span>
                <span className="flex-1 font-semibold">{g.name}</span>
                <span className="text-sm font-semibold text-berry">Send</span>
              </button>
            ))}
          </div>
        </>
      )}
    </Sheet>
  )
}
