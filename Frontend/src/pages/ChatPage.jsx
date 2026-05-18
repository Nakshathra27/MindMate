import { useState, useRef, useEffect } from 'react'
import { chat } from '../../utils/api'

const STARTER_PROMPTS = [
  "I'm feeling overwhelmed today",
  "Help me find calm right now",
  "What coping strategies can I try?",
  "I need to vent about something",
]

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi, I'm MindMate 💚 I'm here to listen and support you. How are you feeling right now? You can share anything — this is a safe space.",
      time: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')

    const userMessage = { role: 'user', text: msg, time: new Date() }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const data = await chat(msg)
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data.reply,
        time: new Date()
      }])
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "I'm having trouble connecting right now. Please make sure the backend is running. 🔌",
        time: new Date(),
        isError: true
      }])
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: 500 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 28, marginBottom: 4 }}>MindMate <span className="serif-italic">AI Chat</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Powered by Claude — your empathetic AI companion</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 10 }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 32, height: 32, flexShrink: 0, background: 'linear-gradient(135deg, var(--sage), var(--lavender))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧠</div>
            )}
            <div style={{
              maxWidth: '70%', padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? 'var(--sage)' : 'white',
              color: msg.role === 'user' ? 'white' : 'var(--text)',
              boxShadow: '0 2px 12px rgba(44,62,53,0.08)',
              border: '1px solid transparent',
            }}>
              <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0 }}>{msg.text}</p>
              <p style={{ fontSize: 10, marginTop: 4, opacity: 0.6, color: msg.role === 'user' ? 'white' : 'var(--text-muted)' }}>
                {msg.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--sage), var(--lavender))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧠</div>
            <div style={{ padding: '12px 18px', borderRadius: '18px 18px 18px 4px', background: 'white', border: '1px solid var(--border)', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--sage)', opacity: 0.6, animation: `bounce 1s ${delay}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {STARTER_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => sendMessage(p)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, background: 'var(--sage-pale)', color: 'var(--sage)', border: '1px solid var(--sage-light)', fontWeight: 500 }}>
              {p}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Share what's on your mind... (Enter to send)" style={{ flex: 1, minHeight: 48, maxHeight: 120, borderRadius: 12, resize: 'none', lineHeight: 1.5 }} disabled={loading} />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{ width: 48, height: 48, borderRadius: 12, fontSize: 20, background: input.trim() && !loading ? 'var(--sage)' : 'var(--border)', color: 'white', flexShrink: 0 }}>➤</button>
      </div>

      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`}</style>
    </div>
  )
}