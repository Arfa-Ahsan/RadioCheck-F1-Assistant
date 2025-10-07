import axiosClient from './axiosClient'

export function getGoogleLoginUrl() {
  return `${axiosClient.defaults.baseURL}/google/`
}

export function redirectToGoogle() {
  window.location.href = getGoogleLoginUrl()
}

export function getSessionIdFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('session_id')
  return id
}

export function removeSessionIdFromUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete('session_id')
  window.history.replaceState({}, '', url.toString())
}

export async function createSession() {
  const res = await axiosClient.post('/api/session')
  return res.data
}

export async function sendChat({ sessionId, query }) {
  const res = await axiosClient.post('/api/chat', {
    session_id: sessionId,
    query,
  })
  return res.data
}

export async function listSessions() {
  const res = await axiosClient.get('/api/sessions')
  return res.data
}

export async function getHistory(sessionId) {
  const res = await axiosClient.get(`/api/session/${sessionId}`)
  return res.data
}

export async function deleteSession(sessionId) {
  const res = await axiosClient.delete(`/api/session/${sessionId}`)
  return res.data
}

export async function renameSession(sessionId, title) {
  const res = await axiosClient.put(`/api/session/${sessionId}/rename`, { title })
  return res.data
}

export async function checkSession(sessionId) {
  const res = await axiosClient.get(`/api/check_session/${sessionId}`)
  return res.data
}

export async function whoAmI() {
  const res = await axiosClient.get('/api/me')
  return res.data
}

export async function getProfile() {
  const res = await axiosClient.get('/api/profile')
  return res.data
}

export async function updateProfile(payload) {
  const res = await axiosClient.put('/api/profile', payload)
  return res.data
}

export async function uploadProfilePhoto(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await axiosClient.post('/api/profile/photo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function logout() {
  // backend exposes GET /logout/
  const res = await axiosClient.get('/logout/')
  return res.data
}


