import { useEffect, useState } from 'react'
import { theme } from '../theme'
import { getProfile, updateProfile, uploadProfilePhoto } from '../api/chatApi'

export default function ProfileModal({ open, onClose }) {
  const [profile, setProfile] = useState(null)
  const [favoriteDriver, setFavoriteDriver] = useState('')
  const [favoriteTeam, setFavoriteTeam] = useState('')
  const [uploading, setUploading] = useState(false)

  const drivers = [
    'Max Verstappen',
    'Liam Lawson',
    'Charles Leclerc',
    'Lewis Hamilton',
    'Lando Norris',
    'Oscar Piastri',
    'George Russell',
    'Andrea Kimi Antonelli',
    'Fernando Alonso',
    'Lance Stroll',
    'Pierre Gasly',
    'Jack Doohan',
    'Oliver Bearman',
    'Esteban Ocon',
    'Nico Hülkenberg',
    'Gabriel Bortoleto',
    'Yuki Tsunoda',
    'Isack Hadjar',
    'Alex Albon',
    'Carlos Sainz',
    "Franco Colapinto",
  ]

  const teams = [
    'Red Bull Racing',
    'Ferrari',
    'McLaren',
    'Mercedes',
    'Aston Martin',
    'Alpine',
    'Haas',
    'Sauber',
    'Racing Bulls',
    'Williams',
  ]

  useEffect(() => {
    if (!open) return
    ;(async () => {
      const p = await getProfile()
      setProfile(p)
      setFavoriteDriver(p.favorite_driver || '')
      setFavoriteTeam(p.favorite_team || '')
    })()
  }, [open])

  async function handleSave() {
    await updateProfile({ favorite_driver: favoriteDriver, favorite_team: favoriteTeam })
    onClose(true)
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg']
    if (!allowed.includes(file.type)) {
      alert('Only PNG, JPG, JPEG allowed')
      return
    }
    setUploading(true)
    try {
      const res = await uploadProfilePhoto(file)
      setProfile((prev) => ({ ...prev, photo_url: res.photo_url }))
    } finally {
      setUploading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-[90%] max-w-lg rounded-xl p-5" style={{ background: '#1E1E1E', color: theme.colors.text, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl" style={{ fontFamily: theme.fonts.heading }}>Profile</h3>
          <button onClick={() => onClose(false)} aria-label="Close" className="text-2xl leading-none">×</button>
        </div>
        {!profile && (
          <div className="py-16 text-center" style={{ color: theme.colors.subtext }}>Loading profile…</div>
        )}
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 flex flex-col items-center gap-3">
              <div className="h-20 w-20 rounded-full overflow-hidden flex items-center justify-center" style={{ background: '#2A2A2A' }}>
                {profile.photo_url ? (
                  <img src={profile.photo_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl">
                    {(profile.user_name || profile.email || '?').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="px-4 py-2 rounded-md cursor-pointer" style={{ background: theme.colors.primary, color: '#000000' }}>
                {uploading ? 'Uploading…' : 'Upload Photo'}
                <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleFileChange} disabled={uploading} />
              </label>
            </div>
            <div className="md:col-span-2 space-y-3">
              <div>
                <div className="text-sm mb-1" style={{ color: theme.colors.subtext }}>Name</div>
                <div className="font-medium">{profile.user_name}</div>
              </div>
              <div>
                <div className="text-sm mb-1" style={{ color: theme.colors.subtext }}>Email</div>
                <div className="font-medium">{profile.email}</div>
              </div>
              <div>
                <div className="text-sm mb-1" style={{ color: theme.colors.subtext }}>Favorite Driver</div>
                <select value={favoriteDriver} onChange={(e) => setFavoriteDriver(e.target.value)} className="w-full px-3 py-2 rounded" style={{ background: '#2A2A2A', color: theme.colors.text, outline: 'none' }}>
                  <option value="">Choose a driver</option>
                  {drivers.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-sm mb-1" style={{ color: theme.colors.subtext }}>Favorite Team</div>
                <select value={favoriteTeam} onChange={(e) => setFavoriteTeam(e.target.value)} className="w-full px-3 py-2 rounded" style={{ background: '#2A2A2A', color: theme.colors.text, outline: 'none' }}>
                  <option value="">Choose a team</option>
                  {teams.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        {profile && (
          <div className="flex justify-end gap-2 mt-5">
            <button onClick={() => onClose(false)} className="px-3 py-2 rounded" style={{ background: theme.colors.dark, color: theme.colors.text }}>Cancel</button>
            <button onClick={handleSave} className="px-3 py-2 rounded" style={{ background: theme.colors.primary, color: '#000000' }}>Save</button>
          </div>
        )}
      </div>
    </div>
  )
}


