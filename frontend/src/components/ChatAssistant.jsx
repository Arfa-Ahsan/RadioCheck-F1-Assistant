import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { theme } from '../theme'
import { listSessions, createSession, deleteSession, renameSession, sendChat, getHistory, getSessionIdFromUrl, removeSessionIdFromUrl, whoAmI, redirectToGoogle, logout } from '../api/chatApi'
import ProfileModal from './ProfileModal'
import GoogleSignIn from './GoogleSignIn'


export default function ChatAssistant({ open, onClose }) {
  const [sessionId, setSessionId] = useState(null)
  const [sessionsList, setSessionsList] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [menuOpenFor, setMenuOpenFor] = useState(null)
  const [modal, setModal] = useState({ type: null, sessionId: null, titleInput: '' })
  const [me, setMe] = useState(null)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const userInitial = (me?.user?.user_name || me?.user?.email || '?').charAt(0).toUpperCase()
  const suggestions = [
    'Who won the Singapore Grand Prix 2025?',
    'Give Top 5 driver standings',
    'Show me the highlights of Monaco GP 2024',
    'Latest constructor standings',
  ]

  useEffect(() => {
    if (!open) return
    ;(async () => {
      const m = await whoAmI()
      setMe(m)
    })()
    const urlSession = getSessionIdFromUrl()
    if (urlSession) {
      handleSelectSession(urlSession)
      removeSessionIdFromUrl()
    } else {
      refreshSessions()
    }
  }, [open])

  async function refreshSessions() {
    try {
      const list = await listSessions()
      // hide sessions without a title until first message sets it
      const visible = (list || []).filter((s) => s.name && s.name !== 'Unnamed Session')
      setSessionsList(visible)
    } catch (e) {
      setSessionsList([])
    }
  }

  async function ensureSession() {
    if (sessionId) return sessionId
    const created = await createSession()
    const newId = created.session_id
    setSessionId(newId)
    await refreshSessions()
    const hist = await getHistory(newId)
    setMessages(hist.messages || [])
    return newId
  }

  async function handleSend() {
    // If user is not logged in, do not send (UI prevents typing too)
    if (!me?.logged_in) return
    if (!input.trim()) return
    
    // Frontend validation for length
    const trimmedInput = input.trim()
    if (trimmedInput.length < 1) {
      return
    }
    if (trimmedInput.length > 2000) {
      setMessages((prev) => [...prev, { 
        role: 'agent', 
        content: 'Your message is too long. Please keep it under 2000 characters.' 
      }])
      return
    }
    
    let currentId = sessionId
    if (!currentId) {
      const created = await createSession()
      currentId = created.session_id
      setSessionId(currentId)
      await refreshSessions()
    }
    const userMsg = { role: 'user', content: trimmedInput }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsSending(true)
    try {
      const res = await sendChat({ sessionId: currentId, query: userMsg.content })
      setMessages((prev) => [...prev, { role: 'agent', content: res.response }])
      await refreshSessions()
    } catch (e) {
      // Display backend error message if available
      const errorMsg = e.response?.data?.error || 'Something went wrong. Try again.'
      setMessages((prev) => [...prev, { role: 'agent', content: errorMsg }])
    } finally {
      setIsSending(false)
    }
  }

  async function handleSuggestionClick(text) {
    setInput(text)
    // send immediately as a message
    // mimic pressing Enter
    const prev = input
    try {
      // ensure input state is the suggestion for handleSend
      await new Promise((r) => setTimeout(r, 0))
      await handleSend()
    } finally {
      // no-op
    }
  }

  async function handleSelectSession(id) {
    setSessionId(id)
    const hist = await getHistory(id)
    setMessages(hist.messages || [])
    setMenuOpenFor(null)
  }

  async function handleDeleteSession(id) {
    await deleteSession(id)
    if (id === sessionId) {
      setSessionId(null)
      setMessages([])
    }
    await refreshSessions()
    setMenuOpenFor(null)
  }

  async function handleRenameSession(id) {
    setModal({ type: 'rename', sessionId: id, titleInput: '' })
    setMenuOpenFor(null)
  }

  async function handleNewChatClick() {
    const me = await whoAmI()
    if (!me?.logged_in) {
      // require login before starting a new chat
      redirectToGoogle()
      return
    }
    // Prepare a fresh draft chat; do not create a session yet
    setSessionId(null)
    setMessages([])
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-end md:items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => { setMenuOpenFor(null); setAvatarMenuOpen(false) }}>
      <div className="w-full md:w-[900px] h-[90vh] md:h-[70vh] rounded-t-2xl md:rounded-2xl overflow-hidden" style={{ background: theme.colors.chatBg, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'slideUp .25s ease' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ background: theme.colors.gray }}>
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen) }} 
              className="md:hidden h-8 w-8 flex items-center justify-center rounded"
              style={{ background: '#1E1E1E', color: theme.colors.text }}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" />
              </svg>
            </button>
            <span className="text-lg font-semibold" style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}>F1 Assistant</span>
          </div>
          <div className="flex items-center gap-2">
            {!me?.logged_in ? (
              <GoogleSignIn />
            ) : (
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setAvatarMenuOpen((v) => !v) }} className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: '#1E1E1E', color: theme.colors.text }} title={me?.user?.user_name}>
                  {me?.user?.photo_url ? (
                    <img src={me.user.photo_url} alt="avatar" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <span className="text-sm">{userInitial}</span>
                  )}
                </button>
                {avatarMenuOpen && (
                  <div className="absolute right-0 mt-2 rounded-lg text-sm" style={{ zIndex: 60, background: '#1E1E1E', color: theme.colors.text, boxShadow: '0 6px 16px rgba(0,0,0,0.4)' }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => { setModal({ type: 'profile', sessionId: null, titleInput: '' }); setAvatarMenuOpen(false) }} className="block px-4 py-2 w-full text-left hover:opacity-90">Profile settings</button>
                    <button onClick={async () => { await logout(); setAvatarMenuOpen(false); const m = await whoAmI(); setMe(m) }} className="block px-4 py-2 w-full text-left hover:opacity-90">Logout</button>
                  </div>
                )}
              </div>
            )}
            <button onClick={onClose} aria-label="Close" className="h-8 w-8 rounded-full flex items-center justify-center text-xl" style={{ background: theme.colors.dark, color: theme.colors.text }}>
              ×
            </button>
          </div>
        </div>
        <div className="flex h-[calc(100%-48px)] relative">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar - Responsive */}
          <aside 
            className={`
              fixed md:relative top-0 left-0 h-full w-64 md:w-60 
              border-r overflow-auto z-50 md:z-auto
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
            style={{ 
              borderColor: '#1f1f1f', 
              background: theme.colors.chatBg,
              paddingTop: sidebarOpen ? '60px' : '0'  // Add padding on mobile when open to avoid header overlap
            }}
          >
            {/* Close button for mobile */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center text-xl"
              style={{ background: theme.colors.dark, color: theme.colors.text }}
              aria-label="Close sidebar"
            >
              ×
            </button>
            
            <div className="p-3">
              <div className="text-sm mb-2" style={{ color: theme.colors.subtext }}>Chat History</div>
              <button onClick={handleNewChatClick} className="w-full px-3 py-2 rounded" style={{ background: theme.colors.primary, color: theme.colors.text }}>
                + New Chat
              </button>
            </div>
            <ul>
              {sessionsList.map((s) => (
                <li key={s.session_id} className="px-3 py-2 flex items-center justify-between hover:opacity-90 relative" style={{ cursor: 'pointer', color: theme.colors.text, position: 'relative', zIndex: menuOpenFor === s.session_id ? 100 : 1 }}>
                  <span onClick={() => { handleSelectSession(s.session_id); setSidebarOpen(false) }} className="truncate pr-6">{s.name}</span>
                  <button aria-label="More" onClick={(e) => { e.stopPropagation(); setMenuOpenFor(menuOpenFor === s.session_id ? null : s.session_id) }} className="px-2">
                    ⋮
                  </button>
                  {menuOpenFor === s.session_id && (
                    <div 
                      className="absolute right-2 top-full mt-1 rounded-lg text-sm whitespace-nowrap" 
                      style={{ 
                        zIndex: 101, 
                        background: '#2B2B2B', 
                        color: '#FFFFFF', 
                        boxShadow: '0 10px 24px rgba(0,0,0,0.6)', 
                        border: '1px solid #3a3a3a',
                        minWidth: '160px'
                      }} 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => handleRenameSession(s.session_id)} className="block px-4 py-2 w-full text-left hover:bg-[#3a3a3a] transition-colors">Rename Chat</button>
                      <div style={{ height: 1, background: '#3a3a3a' }} />
                      <button onClick={() => setModal({ type: 'delete', sessionId: s.session_id, titleInput: '' })} className="block px-4 py-2 w-full text-left hover:bg-[#3a3a3a] transition-colors" style={{ color: '#FF7A7A' }}>Delete Chat</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </aside>
          <main className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto p-4 space-y-3" id="chat-scroll">
              {messages.length === 0 && (
                <div className="h-full min-h-full flex items-center justify-center">
                  <div>
                    {!me?.logged_in ? (
                      <div className="text-center">
                        <div className="text-sm mb-3" style={{ color: theme.colors.subtext, fontWeight: 600 }}>You must sign in to use the bot.</div>
                        <div style={{ color: theme.colors.subtext }}>Please sign in using the button in the top-right to start chatting.</div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm mb-3 text-center px-4" style={{ color: theme.colors.subtext }}>Try asking:</div>
                        <div className="flex flex-wrap gap-2 justify-center px-4 max-w-xl mx-auto">
                          {suggestions.map((s, i) => (
                            <button 
                              key={i} 
                              onClick={() => handleSuggestionClick(s)} 
                              className="px-3 py-2 rounded-full text-xs md:text-sm hover:opacity-90 transition-opacity" 
                              style={{ background: '#1E1E1E', color: theme.colors.text }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              {messages.map((m, idx) => (
                <MessageBubble key={idx} role={m.role} content={m.content} />
              ))}
              {isSending && <TypingBubble />}
            </div>
            <div className="p-3 flex gap-2 border-t" style={{ borderColor: '#1f1f1f' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder={me?.logged_in ? 'Ask about F1…' : 'Sign in to start chatting'}
                className="flex-1 px-3 py-2 rounded text-sm md:text-base"
                style={{ background: '#1A1A1A', color: theme.colors.text, outline: 'none' }}
                disabled={!me?.logged_in}
              />
              <button 
                onClick={handleSend} 
                className="px-3 md:px-4 py-2 rounded text-sm md:text-base whitespace-nowrap" 
                style={{ background: theme.colors.primary, color: theme.colors.text }} 
                disabled={!me?.logged_in}
              >
                Send
              </button>
            </div>
          </main>
        </div>
      </div>
      {modal.type && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-[90%] max-w-md rounded-xl p-4" style={{ background: '#1E1E1E', color: theme.colors.text, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            {modal.type === 'rename' && (
              <div>
                <h3 className="text-lg mb-3">Rename Chat</h3>
                <input
                  autoFocus
                  value={modal.titleInput}
                  onChange={(e) => setModal({ ...modal, titleInput: e.target.value })}
                  placeholder="Enter new name"
                  className="w-full px-3 py-2 rounded mb-4"
                  style={{ background: '#2A2A2A', color: theme.colors.text, outline: 'none' }}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal({ type: null, sessionId: null, titleInput: '' })} className="px-3 py-2 rounded" style={{ background: theme.colors.dark, color: theme.colors.text }}>Cancel</button>
                  <button
                    onClick={async () => {
                      const name = (modal.titleInput || '').trim()
                      if (!name) return
                      await renameSession(modal.sessionId, name)
                      await refreshSessions()
                      setModal({ type: null, sessionId: null, titleInput: '' })
                    }}
                    className="px-3 py-2 rounded"
                    style={{ background: theme.colors.primary, color: '#000000' }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
            {modal.type === 'delete' && (
              <div>
                <h3 className="text-lg mb-3">Delete Chat</h3>
                <p className="mb-4" style={{ color: theme.colors.subtext }}>Do you really want to delete this chat?</p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal({ type: null, sessionId: null, titleInput: '' })} className="px-3 py-2 rounded" style={{ background: theme.colors.dark, color: theme.colors.text }}>Cancel</button>
                  <button
                    onClick={async () => {
                      await handleDeleteSession(modal.sessionId)
                      setModal({ type: null, sessionId: null, titleInput: '' })
                    }}
                    className="px-3 py-2 rounded"
                    style={{ background: theme.colors.primary, color: '#000000' }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
            {modal.type === 'profile' && (
              <ProfileModal open={true} onClose={(updated) => {
                setModal({ type: null, sessionId: null, titleInput: '' })
                if (updated) {
                  // refresh user info
                  whoAmI().then(setMe)
                }
              }} />
            )}
          </div>
        </div>
      )}
      <style>
        {`@keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}
      </style>
    </div>
  )
}



function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  const bg = isUser ? theme.colors.primary : '#1E1E1E';
  const color = isUser ? '#000000' : theme.colors.text;
  const align = isUser ? 'justify-end' : 'justify-start';

  // Split content into main and sources
  let mainText = content;
  let sources = null;
  const sourcesMatch = content.match(/\*\*Sources:\*\*(.*)$/s);
  if (sourcesMatch) {
    mainText = content.slice(0, sourcesMatch.index).trim();
    // Extract links from the sources section
    const linksRaw = sourcesMatch[1];
    // Match all [text](url) patterns
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    const links = [];
    const seen = new Set();
    while ((match = linkRegex.exec(linksRaw)) !== null) {
      if (!seen.has(match[2])) {
        links.push({ text: match[1], url: match[2] });
        seen.add(match[2]);
      }
    }
    sources = links;
  }

  // For agent messages with sources, show LLM response and a link to reveal sources
  const [showSources, setShowSources] = useState(false);
  if (!isUser && sources && sources.length > 0) {
    return (
      <div className={`flex ${align}`}>
        <div className="max-w-[75%] px-3 py-2 rounded-xl shadow-sm" style={{ background: bg, color, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
          <div style={{ textAlign: 'left' }}>
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} style={{ color: '#4EA1FF', textDecoration: 'underline', wordBreak: 'break-all' }} target="_blank" rel="noopener noreferrer" />
                ),
                ul: ({ node, ...props }) => <ul style={{ marginLeft: 18, marginBottom: 8 }} {...props} />,
                ol: ({ node, ...props }) => <ol style={{ marginLeft: 18, marginBottom: 8 }} {...props} />,
                li: ({ node, ...props }) => <li style={{ marginBottom: 2 }} {...props} />,
                strong: ({ node, ...props }) => <strong style={{ fontWeight: 600 }} {...props} />,
                p: ({ node, ...props }) => <p style={{ marginBottom: 8 }} {...props} />,
                br: () => <br />,
              }}
            >
              {mainText}
            </ReactMarkdown>
          </div>
          {!showSources ? (
            <div style={{ marginTop: 12, textAlign: 'left' }}>
              <a
                href="#show-sources"
                onClick={e => { e.preventDefault(); setShowSources(true); }}
                style={{
                  color: '#4EA1FF',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 500,
                  fontSize: 14
                }}
              >
                View Sources
              </a>
            </div>
          ) : (
            <div style={{ marginTop: 12, textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <span
                  onClick={() => setShowSources(false)}
                  title="Back"
                  style={{ cursor: 'pointer', color: '#4EA1FF', display: 'inline-flex', alignItems: 'center', marginRight: 6 }}
                  role="button"
                  tabIndex={0}
                >
                  {/* Flowbite Heroicons left arrow SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 20, height: 20, marginRight: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </span>
                <span style={{ fontWeight: 600, color: theme.colors.text }}>Sources:</span>
              </div>
              {sources.map((src, i) => (
                <div key={i} style={{ marginBottom: 4 }}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: '#4EA1FF', wordBreak: 'break-all', textDecoration: 'underline' }}>{src.text}</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: user or agent without sources
  return (
    <div className={`flex ${align}`}>
      <div className="max-w-[75%] px-3 py-2 rounded-xl shadow-sm" style={{ background: bg, color, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
        <div style={{ textAlign: 'left' }}>
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} style={{ color: '#4EA1FF', textDecoration: 'underline', wordBreak: 'break-all' }} target="_blank" rel="noopener noreferrer" />
              ),
              ul: ({ node, ...props }) => <ul style={{ marginLeft: 18, marginBottom: 8 }} {...props} />,
              ol: ({ node, ...props }) => <ol style={{ marginLeft: 18, marginBottom: 8 }} {...props} />,
              li: ({ node, ...props }) => <li style={{ marginBottom: 2 }} {...props} />,
              strong: ({ node, ...props }) => <strong style={{ fontWeight: 600 }} {...props} />,
              p: ({ node, ...props }) => <p style={{ marginBottom: 8 }} {...props} />,
              br: () => <br />,
            }}
          >
            {mainText}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="px-3 py-2 rounded-xl" style={{ background: '#1E1E1E', color: theme.colors.text }}>
        <span className="inline-block animate-pulse">⭮</span> typing…
      </div>
    </div>
  )
}


