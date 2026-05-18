import { useState, useEffect } from 'react'
import { logMood, getLogs } from '../../utils/api'

const MOOD_EMOJIS = ['😢', '😔', '😕', '😐', '🙂', '😊', '😄', '🤩', '🥰', '🌟']
const MOOD_LABELS = ['Terrible', 'Very Low', 'Low', 'Neutral', 'Okay',
                     'Good', 'Great', 'Excellent', 'Amazing', 'Perfect']

const PROMPT_SUGGESTIONS = [
  "What's the biggest thing on my mind today?",
  "What am I grateful for right now?",
  "What's draining my energy lately?",
  "What would make tomorrow better?",
  "How did my body feel today?",
]

export default function JournalPage() {
  const [text, setText] = useState('')
  const [moodScore, setMoodScore] = useState(5)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')

  useEffect(() => { fetchLogs() }, [])

  const fetchLogs = async () => {
    try {
      const data = await getLogs()
      setLogs(data.logs.slice(-10).reverse())
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async () => {
    if (!text.trim()) { setError('Please write something first 💭'); return }
    setError('')
    setLoading(true)
    try {
      await logMood({ text, mood_score: moodScore })
      setSuccess(true)
      setText('')
      setMoodScore(5)
      fetchLogs()
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError('Could not save. Is the backend running?')
    }
    setLoading(false)
  }

  const moodColor = moodScore >= 7 ? 'var(--sage)' : moodScore >= 4 ? 'var(--warm)' : '#C0776B'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, marginBottom: 4 }}>
          How are you feeling <span className="serif-italic">today?</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{today}</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 16 }}>
          MOOD SCALE
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <span style={{ fontSize: 36 }}>{MOOD_EMOJIS[moodScore - 1]}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: moodColor }}>
                {moodScore}/10
              </span>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                {MOOD_LABELS[moodScore - 1]}
              </span>
            </div>
            <input
              type="range" min="1" max="10" value={moodScore}
              onChange={e => setMoodScore(Number(e.target.value))}
              style={{
                width: '100%', height: 6, borderRadius: 3,
                accentColor: moodColor, border: 'none', padding: 0,
                background: `linear-gradient(to right, ${moodColor} ${(moodScore-1)/9*100}%, var(--border) 0)`
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {MOOD_EMOJIS.map((emoji, i) => (
            <button
              key={i}
              onClick={() => setMoodScore(i + 1)}
              style={{
                background: 'transparent', padding: '4px',
                fontSize: moodScore === i + 1 ? 22 : 16,
                opacity: moodScore === i + 1 ? 1 : 0.5,
                border: 'none', borderRadius: 8,
                transform: moodScore === i + 1 ? 'translateY(-2px)' : 'none'
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.07em', color: 'var(--text-muted)' }}>
            JOURNAL ENTRY
          </p>
          <select
            onChange={e => e.target.value && setText(e.target.value)}
            value=""
            style={{
              border: '1px solid var(--border)', borderRadius: 8,
              padding: '4px 8px', fontSize: 12, color: 'var(--text-muted)',
              background: 'white', cursor: 'pointer', width: 'auto'
            }}
          >
            <option value="">💡 Try a prompt...</option>
            {PROMPT_SUGGESTIONS.map((p, i) => <option key={i} value={p}>{p}</option>)}
          </select>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write freely... this is your safe space. No one else sees this."
          style={{ minHeight: 140, fontSize: 15, lineHeight: 1.7 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {text.length > 0 ? `${text.split(' ').filter(Boolean).length} words` : 'Start writing...'}
          </span>
          {error && <span style={{ color: '#C0776B', fontSize: 13 }}>{error}</span>}
          {success && <span style={{ color: 'var(--sage)', fontSize: 13, fontWeight: 600 }}>✓ Saved!</span>}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%', padding: '14px',
          background: loading ? 'var(--sage-light)' : 'var(--sage)',
          color: 'white', borderRadius: 12, fontSize: 15, fontWeight: 600,
          letterSpacing: '0.03em', marginBottom: 32,
          boxShadow: loading ? 'none' : '0 4px 14px rgba(124,158,140,0.35)'
        }}
      >
        {loading ? '✨ Analyzing your entry...' : '💾 Save Entry'}
      </button>

      {logs.length > 0 && (
        <div>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Recent <span className="serif-italic">entries</span></h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {logs.map(log => (
              <div key={log.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{MOOD_EMOJIS[log.mood_score - 1]}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{log.mood_score}/10</span>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 20,
                      background: log.sentiment?.label === 'positive' ? 'var(--sage-pale)' :
                                  log.sentiment?.label === 'negative' ? '#FDECEA' : 'var(--lavender-pale)',
                      color: log.sentiment?.label === 'positive' ? 'var(--sage)' :
                             log.sentiment?.label === 'negative' ? '#C0776B' : 'var(--lavender)',
                      fontWeight: 600
                    }}>
                      {log.sentiment?.label || 'neutral'}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {log.text.length > 120 ? log.text.slice(0, 120) + '...' : log.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {logs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
          <p style={{ fontSize: 16 }}>Your journal is empty. Write your first entry above!</p>
        </div>
      )}
    </div>
  )
}