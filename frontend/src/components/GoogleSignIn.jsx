import { theme } from '../theme'
// use redirect helper to start OAuth flow
import { redirectToGoogle } from '../api/chatApi'

export default function GoogleSignIn() {
  function signIn() {
    try { localStorage.setItem('openChatAfterLogin', '1') } catch {}
    redirectToGoogle()
  }

  return (
    <button onClick={signIn} className="px-3 py-2 rounded-md" style={{ background: theme.colors.primary, color: theme.colors.text }}>
      Login
    </button>
  )
}

