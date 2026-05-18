import { useState, useEffect } from 'react'
import { getStats } from '../../utils/api'

const MOOD_EMOJIS = ['😢','😔','😕','😐','🙂','😊','😄','🤩','🥰','🌟']

function MoodBar({ value, max = 10, color }) {
  return (
    <div style={{ background: 'var(--border)', borderRadius: 4, height: 8, overflow: 'hidden', flex: 1 }}>
      <div style={{
        height: '100%', borderRadius: 4,
        width: `${(value / max) * 100}%`,
        background: color,
        transition: 'width 0.8s ease'
      }} />
    </div>
  )
}

function StatCard({ icon, label, value, sublabel, color = 'var(--sage)' }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: 'DM Serif Display, serif' }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>{label}</div>
      {sublabel && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sublabel}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats().then(data => {
      setStats(data.stats)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
      <p>Loading your data...</p>
    </div>
  )

  if (!stats || Object.keys(stats).length === 0) return (
    <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
      <h3 style={{ marginBottom: 8 }}>No data yet</h3>
      <p>Start journaling to see your mood trends here!</p>
    </div>
  )

  const avgMood = stats.average_mood || 0
  const moodColor = avgMood >= 7 ? 'var(--sage)' : avgMood >= 4 ? 'var(--warm)' : '#C0776B'
  const sentiment = stats.sentiment_dist || {}
  const sentimentTotal = Object.values(sentiment).reduce((a, b) => a + b, 0) || 1

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, marginBottom: 4 }}>Your Mood <span className="serif-italic">Trends</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Track your emotional patterns over time</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon={MOOD_EMOJIS[Math.round(avgMood) - 1] || '😐'} label="Average Mood" value={`${avgMood}/10`} sublabel="Overall score" color={moodColor} />
        <StatCard icon="📝" label="Total Entries" value={stats.total_entries || 0} sublabel="Journal logs" />
        <StatCard icon="🔥" label="Day Streak" value={stats.streak || 0} sublabel="Consecutive days" color="var(--warm)" />
      </div>

      {stats.weekly_trend && stats.weekly_trend.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 20 }}>
            RECENT DAILY AVERAGES
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
            {stats.weekly_trend.map((day, i) => {
              const height = `${(day.avg / 10) * 100}%`
              const c = day.avg >= 7 ? 'var(--sage)' : day.avg >= 4 ? 'var(--warm)' : '#C0776B'
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{day.avg}</div>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ width: '100%', background: c, borderRadius: '6px 6px 0 0', height: height, minHeight: 4, opacity: 0.8 }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 20 }}>
          SENTIMENT BREAKDOWN
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'positive', label: 'Positive entries', color: 'var(--sage)', emoji: '😊' },
            { key: 'neutral', label: 'Neutral entries', color: 'var(--lavender)', emoji: '😐' },
            { key: 'negative', label: 'Low entries', color: '#C0776B', emoji: '😔' },
          ].map(({ key, label, color, emoji }) => {
            const count = sentiment[key] || 0
            const pct = Math.round((count / sentimentTotal) * 100)
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18, width: 24 }}>{emoji}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', width: 120 }}>{label}</span>
                <MoodBar value={count} max={sentimentTotal} color={color} />
                <span style={{ fontSize: 13, fontWeight: 600, color, width: 40, textAlign: 'right' }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 16 }}>
          MOOD SCALE REFERENCE
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {MOOD_EMOJIS.map((emoji, i) => {
            const score = i + 1
            const isAvg = Math.round(avgMood) === score
            const c = score >= 7 ? 'var(--sage)' : score >= 4 ? 'var(--warm)' : '#C0776B'
            return (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '8px 12px', borderRadius: 10,
                background: isAvg ? 'var(--sage-pale)' : 'transparent',
                border: isAvg ? '1.5px solid var(--sage-light)' : '1.5px solid transparent',
                flex: '1 0 60px'
              }}>
                <span style={{ fontSize: isAvg ? 24 : 18 }}>{emoji}</span>
                <span style={{ fontSize: 11, fontWeight: isAvg ? 700 : 400, color: isAvg ? c : 'var(--text-muted)' }}>{score}</span>
              </div>
            )
          })}
        </div>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>
          Your average: <strong style={{ color: moodColor }}>{avgMood}/10</strong>
        </p>
      </div>
    </div>
  )
}