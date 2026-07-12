import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { MessageSquare, Send, Loader2, Bot, User } from 'lucide-react'

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hi there! I'm the Verdantis AI assistant. I have access to your latest ESG metrics. How can I help you today?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', {
        message: userMessage,
        history: history
      }, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setMessages(prev => [...prev, { role: 'model', content: response.data.data.reply }])
        setHistory(response.data.data.history)
      }
    } catch (error) {
      console.error("Chat failed", error)
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto w-full bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-ink-100 flex items-center gap-3 bg-brand-50 shrink-0">
        <div className="p-2 bg-brand-100 rounded-lg">
          <MessageSquare className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h2 className="font-bold text-ink-900 leading-tight">Verdantis Assistant</h2>
          <p className="text-xs text-ink-500">Always-on ESG expert</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-ink-100' : 'bg-brand-600'
            }`}>
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-ink-600" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-ink-50 text-ink-900 rounded-tr-sm' 
                : 'bg-brand-50/50 border border-brand-100 text-ink-800 rounded-tl-sm'
            }`}>
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-brand-50/50 border border-brand-100 rounded-2xl rounded-tl-sm p-4 flex items-center justify-center min-w-[60px]">
              <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-ink-100 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about emissions, policies, or how to improve..."
            className="w-full px-5 py-3.5 pr-14 rounded-xl border border-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-[15px]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
