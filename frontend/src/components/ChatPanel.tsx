import { useState } from 'react'
import axios from 'axios'
import { Panel, Message } from '../types/index'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatPanelProps {
  activePanel: Panel
  code: string
}

export default function ChatPanel({ activePanel, code }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hey! Write some code and I can help guide you through it.' }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return

    const userMsg: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsThinking(true)

    const res = await axios.post('http://localhost:8000/chat', {
      messages: newMessages,
      mode: 'walkthrough',
      code
    })

    setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }])
    setIsThinking(false)
  }

  return (
    <div className="w-72 h-full bg-[#16161a] border-r border-[#2a2a35] flex flex-col">
      {activePanel === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col gap-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-[#555568] uppercase tracking-widest">
                  {m.role === 'user' ? 'You' : 'Mentor'}
                </span>
                <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed max-w-[85%] ${
                  m.role === 'user'
                    ? 'bg-[#26262e] text-[#8888a0]'
                    : 'bg-[#1e1e24] border border-[#2a2a35] text-white'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex flex-col gap-1 items-start">
                <span className="text-[10px] text-[#555568] uppercase tracking-widest">Mentor</span>
                <div className="px-3 py-2 rounded-xl bg-[#1e1e24] border border-[#2a2a35] text-[#555568] text-sm">
                  thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#2a2a35] flex gap-2">
            <textarea
              className="flex-1 bg-[#1e1e24] border border-[#2a2a35] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555568] outline-none resize-none focus:border-[#7c6aff] transition-colors"
              placeholder="Ask anything..."
              rows={2}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }}}
            />
            <button
              onClick={sendMessage}
              className="w-9 h-9 bg-[#7c6aff] rounded-lg flex items-center justify-center text-white hover:bg-[#9080ff] transition-colors self-end"
            >
              →
            </button>
          </div>
        </>
      )}

      {activePanel === 'notes' && (
        <div className="p-4 text-white">Notes panel</div>
      )}
      {activePanel === 'requirements' && (
        <div className="p-4 text-white">Requirements panel</div>
      )}
    </div>
  )
}