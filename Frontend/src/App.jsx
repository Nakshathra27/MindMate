import { useState } from 'react'
import JournalPage from './pages/JournalPage'
import DashboardPage from './pages/DashboardPage'
import ChatPage from './pages/ChatPage'
import InsightsPage from './pages/InsightsPage'

const NAV_ITEMS = [
  { id: 'journal', label: 'Journal', icon: '✍️' },
  { id: 'dashboard', label: 'Trends', icon: '📊' },
  { id: 'insights', label: 'Insights', icon: '🔮' },
  { id: 'chat', label: 'MindMate AI', icon: '💬' },
]

export default function App() {
  const [page, setPage] = useState('journal')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        background: 'white',
        borderBottom: '1px solid var(--border)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 12px rgba(44,62,53,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--sage), var(--lavender))',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18
          }}>🧠</div>
          <div>
            <h1 style={{ fontSize: 20, color: 'var(--text)', lineHeight: 1.1 }}>MindMate</h1>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              YOUR AI MENTAL WELLNESS COMPANION
            </p>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: 4 }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: page === item.id ? 600 : 400,
                background: page === item.id ? 'var(--sage-pale)' : 'transparent',
                color: page === item.id ? 'var(--sage)' : 'var(--text-muted)',
                border: page === item.id ? '1.5px solid var(--sage-light)' : '1.5px solid transparent',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main style={{ flex: 1, maxWidth: 900, width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {page === 'journal' && <JournalPage />}
        {page === 'dashboard' && <DashboardPage />}
        {page === 'insights' && <InsightsPage />}
        {page === 'chat' && <ChatPage />}
      </main>

      <footer style={{
        textAlign: 'center', padding: '16px',
        color: 'var(--text-muted)', fontSize: 12,
        borderTop: '1px solid var(--border)'
      }}>
        MindMate is not a replacement for professional mental health care.
        If you're in crisis, please contact a professional or call a helpline.
      </footer>
    </div>
  )
}