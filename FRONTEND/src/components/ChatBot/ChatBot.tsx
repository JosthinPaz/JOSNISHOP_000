import { useEffect, useRef, useState } from 'react'
import { useToast } from '../../contexts/useToastContext'
import { useNavigate } from 'react-router-dom'

type Message = { from: 'user'|'bot', text: string }

export default function ChatBot(){
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: '¡Hola! Soy el asistente. Pregúntame sobre horarios, envíos, devoluciones o escribe "hablar con soporte" para WhatsApp.' }
  ])
  const [waUrl, setWaUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [waPhone, setWaPhone] = useState<string | null>(null)
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null)
  const { showToast } = useToast()
  const navigate = useNavigate()

  async function send(){
    // Require login before sending to backend
    const token = localStorage.getItem('token')
    if (!token) {
      showToast('Debes iniciar sesión para usar el chatbot. Serás redirigido al login.', 'warning')
      setTimeout(() => navigate('/login'), 1200)
      return
    }

    if(!input.trim()) return
    const userMsg = input.trim()
  // build history including the new user message for context
  const recent = messages.slice(-5)
  const history = [...recent, { from: 'user', text: userMsg }]
  setMessages(m=>[...m, {from:'user', text: userMsg}])
  setLastUserMessage(userMsg)
    setInput('')
    setLoading(true)

    try{
      const API = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000').replace(/\/$/, '');
      const token = localStorage.getItem('token') || ''
      // Try to recover userId from token payload if it's missing in localStorage
      let userId = Number(localStorage.getItem('userId')) || null
      if (!userId && token) {
        try{
          const payloadBase = token.split('.')[1];
          const decoded = JSON.parse(decodeURIComponent(escape(window.atob(payloadBase))));
          if (decoded && decoded.id) {
            userId = Number(decoded.id) || null
            if (userId) localStorage.setItem('userId', String(userId))
          }
        }catch(e){
          // ignore
        }
      }
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      const res = await fetch(`${API}/bot/respond`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ usuario_origen: userId, mensaje: userMsg, history })
      })
      if (!res.ok) {
        // handle unauthorized or other errors gracefully
        if (res.status === 401) {
          showToast('Debes iniciar sesión para usar el chatbot.', 'warning')
          setTimeout(() => navigate('/login'), 1200)
          setMessages(m=>[...m, {from:'bot', text: 'Debes iniciar sesión para usar el chatbot.'}])
          return
        }
        const errData = await res.json().catch(() => ({}))
        const msg = errData.detail || 'Error al contactar al chatbot.'
        setMessages(m=>[...m, {from:'bot', text: msg}])
        return
      }

      const data = await res.json()
      setMessages(m=>[...m, {from:'bot', text: data.texto}])
      if(data.fallback){
        // try to get whatsapp_url from response; if not present, request it from backend
        if(data.whatsapp_url){
          setWaUrl(data.whatsapp_url)
        } else {
          try{
            const res2 = await fetch(`${API}/bot/wa`)
            const d2 = await res2.json()
            setWaUrl(d2.whatsapp_url || null)
            setWaPhone(d2.phone || null)
          }catch{
            setWaUrl(null)
            setWaPhone(null)
          }
        }
      } else {
        setWaUrl(null)
      }
    }catch(err){
      console.error('Error enviando mensaje al bot:', err)
      setMessages(m=>[...m, {from:'bot', text: 'Error de conexión al bot.'}])
    } finally {
      setLoading(false)
    }
  }

  // scroll to bottom when messages or loading change
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!containerRef.current) return
    // small timeout so DOM updates and images/width settle
    setTimeout(() => {
      containerRef.current!.scrollTop = containerRef.current!.scrollHeight
    }, 80)
  }, [messages, loading])

  return (
    <div style={{border:'1px solid #ddd', padding:12, width:320}}>
      <div ref={containerRef} style={{height:200, overflowY:'auto', marginBottom:8}}>
        {messages.map((m,i)=>(
          <div key={i} style={{textAlign: m.from==='user' ? 'right' : 'left', margin:'6px 0'}}>
            <div style={{display:'inline-block', padding:'8px 12px', borderRadius:12, background: m.from==='user' ? '#DCF8C6' : '#F1F0F0'}}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{textAlign:'left', margin:'6px 0'}}>
            <div style={{display:'inline-block', padding:'8px 12px', borderRadius:12, background:'#F1F0F0', fontStyle:'italic', opacity:0.8}}>Escribiendo...</div>
          </div>
        )}
      </div>
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <input value={input} onChange={e=>setInput(e.target.value)} style={{flex:1}} onKeyDown={e=>{ if(e.key === 'Enter') send() }} />
        <div style={{display:'flex', gap:8}}>
          {/* Circular WhatsApp quick button */}
          {(waUrl || waPhone) && (
            <a href={waUrl || (waPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(lastUserMessage || 'Hola, necesito ayuda')}` : '#')} target="_blank" rel="noreferrer">
              <button style={{background:'#25D366', color:'#fff', padding:'10px 12px', borderRadius:24, width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center'}} aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M20.52 3.48A11.78 11.78 0 0 0 12 .5C6.21.5 1.35 4.92.38 10.3c-.7 3.24.06 6.3 2.03 8.6L1 23l4.27-1.12a11.78 11.78 0 0 0 6.73 2.02h.01c5.79 0 10.64-4.42 11.61-9.8.97-5.37-.88-10.1-4.6-12.62zM12 21.5c-1.98 0-3.86-.5-5.5-1.42l-.39-.23-2.53.66.68-2.46-.25-.4A8.52 8.52 0 0 1 3.5 10.3c0-4.7 4.1-8.5 8.5-8.5 2.27 0 4.39.88 6 .98 3.1.3 4.82 3.6 4.25 6.52-.61 3.24-3.66 5.92-7 6.9-.9.3-1.84.45-2.8.45z"/></svg>
              </button>
            </a>
          )}
          <button onClick={send} disabled={loading}>{loading ? '...' : 'Enviar'}</button>
        </div>
      </div>

      <div style={{marginTop:8, display:'flex', gap:8, flexWrap:'wrap'}}>
        <button onClick={()=>{ setInput('¿Cuál es su horario?'); send(); }} style={{padding:'6px 8px', borderRadius:6}}>Horarios</button>
        <button onClick={()=>{ setInput('¿Cuánto tardan los envíos?'); send(); }} style={{padding:'6px 8px', borderRadius:6}}>Envíos</button>
        <button onClick={()=>{ setInput('Quiero ver mis pedidos'); send(); }} style={{padding:'6px 8px', borderRadius:6}}>Ver pedidos</button>
        <button onClick={()=>{ setInput('Quiero hablar con soporte por WhatsApp'); send(); }} style={{padding:'6px 8px', borderRadius:6, background:'#25D366', color:'#fff'}}>Soporte (WhatsApp)</button>
      </div>

      {waUrl && (
        <div style={{marginTop:8, border:'1px solid #eee', padding:8, borderRadius:8, background:'#f7fff7'}}>
          <div style={{marginBottom:6}}>Parece que necesitas atención personalizada. Pulsa el botón para ir a WhatsApp:</div>
          <a href={waUrl} target="_blank" rel="noreferrer">
            <button style={{background:'#25D366', color:'#fff', padding:'8px 12px', borderRadius:6}}>Abrir conversación en WhatsApp</button>
          </a>
        </div>
      )}

      {/* Large contact button below send bar */}
      <div style={{marginTop:12}}>
        {(waUrl || waPhone) && (
          <a href={waUrl || (waPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(lastUserMessage || 'Hola, necesito ayuda')}` : '#')} target="_blank" rel="noreferrer">
            <button style={{width:'100%', background:'#25D366', color:'#fff', padding:'12px 16px', borderRadius:24, fontSize:16}}>Contactanos por WhatsApp</button>
          </a>
        )}
      </div>
    </div>
  )
}
