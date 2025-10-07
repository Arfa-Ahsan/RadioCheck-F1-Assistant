import { useEffect, useState } from 'react'
import './App.css'
import Landing from './components/Landing'
import ChatAssistant from './components/ChatAssistant'
import { theme } from './theme'
import radioCheckBot from './assets/radio_check.png'

function FloatingChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open chat"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      
    >
      <img src={radioCheckBot} alt="Chat" className="h-16 w-13" />
    </button>
  )
}

export default function App() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    try {
      const flag = localStorage.getItem('openChatAfterLogin')
      if (flag === '1') {
        setOpen(true)
        localStorage.removeItem('openChatAfterLogin')
      }
    } catch {}
  }, [])
  return (
    <div>
      <Landing onOpenChat={() => setOpen(true)} />
      <FloatingChatButton onClick={() => setOpen(true)} />
      <ChatAssistant open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

