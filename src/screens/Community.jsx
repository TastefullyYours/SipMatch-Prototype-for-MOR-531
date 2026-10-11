import { useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORIES } from '../data/options.js'
import { DRINKS, PRICE_TIERS, TYPE_LABELS } from '../logic/recommend.js'
import {
  MAX_DESC,
  MAX_MESSAGE,
  MAX_NAME,
  createGroup,
  deleteGroup,
  isDemo,
  isMember,
  joinByCode,
  joinGroup,
  leaveGroup,
  nameOf,
  sendMessage,
  setName,
  useCommunity,
} from '../logic/community.js'
import { SaveButton } from '../components/SavedDrink.jsx'
import { BottomBar, Button, Chip, ScreenTitle, SectionLabel, Segmented } from '../components/ui.jsx'

const inputClass = 'w-full rounded-2xl border-2 border-berry/15 bg-white px-4 py-3 outline-none placeholder:text-muted/60 focus:border-berry'

const AVATARS = ['bg-berry-light text-berry', 'bg-gold/25 text-[#8a6412]', 'bg-sand text-ink']
const avatarClass = (id) => AVATARS[[...String(id)].reduce((n, c) => n + c.charCodeAt(0), 0) % AVATARS.length]

function Avatar({ id, name, size = 'h-8 w-8 text-sm' }) {
  return <span className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${size} ${avatarClass(id)}`}>{(name || '?')[0].toUpperCase()}</span>
}

const timeLabel = (at) => {
  const mins = Math.floor((Date.now() - at) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const d = new Date(at)
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return mins < 60 * 24 ? time : `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`
}

const categoryOf = (id) => CATEGORIES.find((c) => c.id === id)

function GuestGate({ onSignUp }) {
  return (
    <div className="mb-5 rounded-3xl bg-gold/15 p-5">
      <p className="font-semibold">Create a free account to join the conversation</p>
      <p className="mt-1 text-sm text-ink/70">You can browse the groups below. Joining, chatting and starting your own needs an account, so people know who they’re talking to.</p>
      <Button className="mt-3" onClick={onSignUp}>
        Create account
      </Button>
    </div>
  )
}

function GroupCard({ group, s, onClick, action }) {
  const last = [...(s.messages[group.id] || [])].reverse().find((m) => !m.system)
  const cat = categoryOf(group.category)
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
      <button onClick={onClick} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-berry-light text-2xl">{group.emoji}</span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate font-display text-base font-bold leading-tight">{group.name}</span>
            {group.visibility === 'private' && <span title="Invite-only">🔒</span>}
          </span>
          <span className="block truncate text-xs text-muted">
            {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
            {cat ? ` · ${cat.label}` : ''}
          </span>
          <span className="mt-0.5 block truncate text-sm text-ink/70">{last ? `${nameOf(s, last.authorId)}: ${last.text || '🍷 shared a drink'}` : group.desc || 'No messages yet'}</span>
        </span>
      </button>
      {action}
    </div>
  )
}

// Community home: your groups, groups to discover, an invite-code box and a "create group" button.
export function CommunityHome({ account, onOpen, onCreate, onSignUp }) {
  const s = useCommunity()
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')

  const mine = s.groups.filter((g) => isMember(g, account))
  const discover = s.groups.filter((g) => !isMember(g, account) && g.visibility === 'open')
  const myName = account ? nameOf(s, account) : ''

  const join = (g) => {
    if (!account) return onSignUp()
    const res = joinGroup(g.id, account)
    if (res.group) onOpen(g.id)
  }
  const submitCode = (e) => {
    e.preventDefault()
    const res = joinByCode(code, account)
    if (res.error) return setCodeError(res.error)
    setCode('')
    setCodeError('')
    onOpen(res.group.id)
  }

  return (
    <>
      <ScreenTitle eyebrow="👥 Community" title="Sip together" sub="Swap tips and finds with people who like what you like. Join a group or start your own." />

      {!account && <GuestGate onSignUp={onSignUp} />}

      {account && (
        <>
          <Button onClick={onCreate}>＋ Create a group</Button>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 text-sm shadow-sm">
            {editingName ? (
              <form
                className="flex w-full items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  setName(account, nameDraft)
                  setEditingName(false)
                }}
              >
                <input autoFocus value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} maxLength={24} aria-label="Display name" className="min-w-0 flex-1 rounded-xl border-2 border-berry/15 px-3 py-1.5 outline-none focus:border-berry" />
                <button className="font-semibold text-berry">Save</button>
              </form>
            ) : (
              <>
                <span className="text-muted">
                  You appear as <b className="text-ink">{myName}</b>
                </span>
                <button
                  onClick={() => {
                    setNameDraft(myName)
                    setEditingName(true)
                  }}
                  className="font-semibold text-berry"
                >
                  Edit
                </button>
              </>
            )}
          </div>

          <SectionLabel hint={`${mine.length}`}>Your groups</SectionLabel>
          {mine.length === 0 ? (
            <div className="rounded-3xl bg-white p-5 text-center shadow-sm">
              <div className="text-3xl">👋</div>
              <p className="mt-1 font-semibold">You haven’t joined a group yet</p>
              <p className="text-sm text-muted">Pick one below or start your own.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {mine.map((g) => (
                <GroupCard key={g.id} group={g} s={s} onClick={() => onOpen(g.id)} />
              ))}
            </div>
          )}
        </>
      )}

      <SectionLabel>Discover groups</SectionLabel>
      {discover.length === 0 ? (
        <p className="rounded-3xl bg-white p-5 text-center text-sm text-muted shadow-sm">You’re in every open group. Start a new one!</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {discover.map((g) => (
            <GroupCard
              key={g.id}
              group={g}
              s={s}
              onClick={() => (account ? onOpen(g.id) : onSignUp())}
              action={
                <button onClick={() => join(g)} className="shrink-0 rounded-full bg-berry-light px-3.5 py-1.5 text-xs font-semibold text-berry hover:bg-berry/15">
                  {account ? 'Join' : 'Sign up'}
                </button>
              }
            />
          ))}
        </div>
      )}

      {account && (
        <>
          <SectionLabel>Have an invite code?</SectionLabel>
          <form onSubmit={submitCode} className="flex gap-2">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase())
                setCodeError('')
              }}
              maxLength={6}
              placeholder="e.g. K7M2QX"
              aria-label="Invite code"
              className={`${inputClass} font-mono uppercase tracking-widest`}
            />
            <button disabled={code.trim().length < 6} className="shrink-0 rounded-2xl bg-berry px-5 font-semibold text-white transition hover:bg-berry-dark disabled:cursor-not-allowed disabled:bg-berry/30">
              Join
            </button>
          </form>
          {codeError && <p className="mt-2 text-sm text-berry">{codeError}</p>}
        </>
      )}

      <p className="mt-6 rounded-2xl bg-gold/15 p-3 text-xs leading-relaxed text-ink/70">
        🧪 Prototype note: groups and chats are saved only in this browser, so they’re shared between accounts on this device (and update live between open tabs), not between different people’s phones. Members marked “demo” are simulated. Please be kind and drink responsibly.
      </p>
    </>
  )
}

const EMOJIS = ['🥂', '🍷', '🍺', '🍸', '🍹', '🥃', '🍾', '🍋', '🌿', '🍇', '🍓', '☕']

// Make a new group.
export function CreateGroup({ account, onCreated }) {
  const [name, setNameValue] = useState('')
  const [emoji, setEmoji] = useState('🥂')
  const [category, setCategory] = useState(null)
  const [desc, setDesc] = useState('')
  const [visibility, setVisibility] = useState('open')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const res = createGroup({ ownerId: account, name, emoji, category, desc, visibility })
    if (res.error) return setError(res.error)
    onCreated(res.group.id)
  }

  return (
    <form onSubmit={submit}>
      <ScreenTitle eyebrow="👥 Community" title="Start a group" sub="Bring together friends or people who love the same drinks." />

      <SectionLabel>Group name</SectionLabel>
      <input
        value={name}
        onChange={(e) => {
          setNameValue(e.target.value)
          setError('')
        }}
        maxLength={MAX_NAME}
        placeholder="e.g. Friday Wine Club"
        aria-label="Group name"
        className={inputClass}
      />
      {error && <p className="mt-2 text-sm text-berry">{error}</p>}

      <SectionLabel>Pick an icon</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {EMOJIS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEmoji(e)}
            aria-pressed={emoji === e}
            aria-label={`Icon ${e}`}
            className={`h-12 w-12 rounded-2xl border-2 text-2xl transition active:scale-95 ${emoji === e ? 'border-berry bg-berry-light' : 'border-transparent bg-white hover:border-berry/30'}`}
          >
            {e}
          </button>
        ))}
      </div>

      <SectionLabel hint="optional">What’s it about?</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Chip key={c.id} label={`${c.emoji} ${c.label}`} selected={category === c.id} onClick={() => setCategory(category === c.id ? null : c.id)} />
        ))}
      </div>

      <SectionLabel hint={`${desc.length}/${MAX_DESC}`}>Description</SectionLabel>
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={MAX_DESC} rows={2} placeholder="What will you talk about?" aria-label="Description" className={`${inputClass} resize-none`} />

      <SectionLabel>Who can join?</SectionLabel>
      <Segmented
        options={[
          { id: 'open', label: '🌍 Open', sub: 'Anyone can find and join' },
          { id: 'private', label: '🔒 Invite-only', sub: 'Join with a code' },
        ]}
        value={visibility}
        onChange={setVisibility}
      />

      <BottomBar>
        <Button disabled={!name.trim()}>Create group</Button>
      </BottomBar>
    </form>
  )
}

function SharedDrink({ drinkId, saved, setSaved }) {
  const drink = DRINKS.find((d) => d.id === drinkId)
  if (!drink) return null
  return (
    <div className="mt-1.5 flex items-center gap-3 rounded-2xl bg-cream p-3 text-ink">
      <span className="text-3xl leading-none">{drink.emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate font-display font-bold leading-tight">{drink.name}</div>
        <div className="text-xs text-muted">
          {TYPE_LABELS[drink.type]} · {PRICE_TIERS[drink.priceTier].symbol}
        </div>
      </div>
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
  )
}

function DrinkPicker({ saved, onPick }) {
  const [q, setQ] = useState('')
  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return DRINKS.filter((d) => saved[d.id]).slice(0, 8)
    return DRINKS.filter((d) => d.name.toLowerCase().includes(term)).slice(0, 8)
  }, [q, saved])
  return (
    <div className="mb-3 rounded-3xl bg-white p-4 shadow-sm">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search drinks to share…" aria-label="Search drinks" className="w-full rounded-xl border-2 border-berry/15 px-3 py-2 text-sm outline-none focus:border-berry" />
      <p className="mb-2 mt-2 text-xs font-semibold uppercase tracking-wider text-muted">{q.trim() ? 'Results' : 'Your saved drinks'}</p>
      {results.length === 0 ? (
        <p className="text-sm text-muted">{q.trim() ? 'No drinks match that.' : 'Nothing saved yet. Search for any drink above.'}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {results.map((d) => (
            <Chip key={d.id} label={`${d.emoji} ${d.name}`} selected={false} onClick={() => onPick(d.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

// A group's chat room, members, invite code and leave/delete controls.
export function GroupChat({ account, groupId, saved, setSaved, onLeft }) {
  const s = useCommunity()
  const group = s.groups.find((g) => g.id === groupId)
  const [text, setText] = useState('')
  const [picker, setPicker] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [copied, setCopied] = useState(false)
  const [confirm, setConfirm] = useState(null) // 'leave' | 'delete'
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const listRef = useRef(null)
  const count = group ? (s.messages[group.id] || []).length : 0

  // Keep the newest message in view (scrolls the chat list only, not the page).
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [count])

  if (!group) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
        <div className="text-4xl">🫥</div>
        <p className="mt-2 font-semibold">This group is gone</p>
        <p className="mt-1 text-sm text-muted">It may have been deleted.</p>
        <Button className="mt-4" onClick={onLeft}>
          Back to Community
        </Button>
      </div>
    )
  }

  const member = isMember(group, account)
  const messages = s.messages[group.id] || []
  const cat = categoryOf(group.category)

  // Not a member yet: show a preview and a way in.
  if (!member) {
    return (
      <>
        <ScreenTitle eyebrow={`👥 ${cat ? cat.label : 'Community'}`} title={`${group.emoji} ${group.name}`} sub={group.desc || undefined} />
        <p className="mb-4 text-sm text-muted">
          {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
          {group.visibility === 'private' ? ' · invite-only' : ''}
        </p>
        {group.visibility === 'open' ? (
          <Button onClick={() => joinGroup(group.id, account)}>Join group</Button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const res = joinByCode(code, account)
              if (res.error) setCodeError(res.error)
            }}
          >
            <input value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeError('') }} maxLength={6} placeholder="Invite code" aria-label="Invite code" className={`${inputClass} font-mono uppercase tracking-widest`} />
            {codeError && <p className="mt-2 text-sm text-berry">{codeError}</p>}
            <Button className="mt-3" disabled={code.trim().length < 6}>
              Join with code
            </Button>
          </form>
        )}
      </>
    )
  }

  const send = (e) => {
    e.preventDefault()
    if (sendMessage(group.id, account, { text })) setText('')
  }
  const shareDrink = (drinkId) => {
    sendMessage(group.id, account, { text: '', drinkId })
    setPicker(false)
  }
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(group.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false) // clipboard blocked: the code is shown on screen to copy by hand
    }
  }

  return (
    <>
      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-berry-light text-2xl">{group.emoji}</span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-xl font-bold leading-tight">{group.name}</h1>
            <button onClick={() => setShowMembers(!showMembers)} aria-expanded={showMembers} className="text-xs font-semibold text-berry">
              {group.members.length} {group.members.length === 1 ? 'member' : 'members'} {showMembers ? '▴' : '▾'}
              {group.visibility === 'private' ? ' · 🔒 invite-only' : ''}
            </button>
          </div>
        </div>
        {group.desc && <p className="mt-2 text-sm text-muted">{group.desc}</p>}

        {showMembers && (
          <div className="mt-3 border-t border-sand pt-3">
            <ul className="flex flex-col gap-2">
              {group.members.map((id) => (
                <li key={id} className="flex items-center gap-2 text-sm">
                  <Avatar id={id} name={nameOf(s, id)} size="h-7 w-7 text-xs" />
                  <span className="font-medium">{nameOf(s, id)}</span>
                  {id === account && <span className="text-xs text-muted">(you)</span>}
                  {isDemo(id) && <span className="rounded-full bg-sand px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted">demo</span>}
                  {id === group.createdBy && <span className="rounded-full bg-gold/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#8a6412]">creator</span>}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-cream px-3 py-2">
              <span className="text-xs text-muted">
                Invite code <b className="ml-1 font-mono text-sm tracking-widest text-ink">{group.code}</b>
              </span>
              <button onClick={copyCode} className="text-xs font-semibold text-berry">
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <div className="mt-3">
              {confirm ? (
                <div className="rounded-2xl bg-berry-light p-3 text-sm">
                  <p className="font-semibold">{confirm === 'delete' ? 'Delete this group for everyone?' : 'Leave this group?'}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        if (confirm === 'delete') deleteGroup(group.id)
                        else leaveGroup(group.id, account)
                        onLeft()
                      }}
                      className="rounded-full bg-berry px-4 py-1.5 text-xs font-semibold text-white"
                    >
                      {confirm === 'delete' ? 'Yes, delete' : 'Yes, leave'}
                    </button>
                    <button onClick={() => setConfirm(null)} className="rounded-full px-4 py-1.5 text-xs font-semibold text-muted hover:bg-white">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => setConfirm('leave')} className="text-xs font-semibold text-muted hover:text-berry">
                    Leave group
                  </button>
                  {group.createdBy === account && (
                    <button onClick={() => setConfirm('delete')} className="text-xs font-semibold text-muted hover:text-berry">
                      Delete group
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div ref={listRef} role="log" aria-live="polite" aria-label={`${group.name} chat`} className="mt-4 flex max-h-[52vh] min-h-[30vh] flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {messages.map((m) => {
          if (m.system) {
            return (
              <p key={m.id} className="text-center text-xs text-muted">
                {m.text}
              </p>
            )
          }
          const mine = m.authorId === account
          const author = nameOf(s, m.authorId)
          return (
            <div key={m.id} className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
              {!mine && <Avatar id={m.authorId} name={author} />}
              <div className={`max-w-[80%] rounded-3xl px-4 py-2.5 shadow-sm ${mine ? 'rounded-br-lg bg-berry text-white' : 'rounded-bl-lg bg-white'}`}>
                {!mine && (
                  <div className="mb-0.5 flex items-center gap-1.5 text-xs font-semibold text-berry">
                    {author}
                    {isDemo(m.authorId) && <span className="rounded-full bg-sand px-1.5 text-[9px] font-semibold uppercase text-muted">demo</span>}
                  </div>
                )}
                {m.text && <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{m.text}</p>}
                {m.drinkId && <SharedDrink drinkId={m.drinkId} saved={saved} setSaved={setSaved} />}
                <div className={`mt-1 text-[10px] ${mine ? 'text-white/70' : 'text-muted'}`}>{timeLabel(m.at)}</div>
              </div>
            </div>
          )
        })}
      </div>

      <BottomBar>
        {picker && <DrinkPicker saved={saved} onPick={shareDrink} />}
        <form onSubmit={send} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPicker(!picker)}
            aria-pressed={picker}
            aria-label="Share a drink"
            title="Share a drink"
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl transition active:scale-95 ${picker ? 'bg-berry text-white' : 'bg-white text-berry shadow-sm'}`}
          >
            🍷
          </button>
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={MAX_MESSAGE} placeholder="Message the group…" aria-label="Message" className={inputClass} />
          <button disabled={!text.trim()} className="h-12 shrink-0 rounded-2xl bg-berry px-5 font-semibold text-white transition hover:bg-berry-dark disabled:cursor-not-allowed disabled:bg-berry/30">
            Send
          </button>
        </form>
      </BottomBar>
    </>
  )
}
