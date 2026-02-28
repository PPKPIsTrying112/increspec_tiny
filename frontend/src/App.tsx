import { useState } from 'react'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import ChatPanel from './components/ChatPanel'
import Editor from './components/Editor'

type Panel = 'chat' | 'notes' | 'requirements'

export default function App() {
  const [activePanel, setActivePanel] = useState<Panel>('chat')
  const [code, setCode] = useState('# Start coding here')
  const [output, setOutput] = useState('')

  const handleRun = async () => {
    const res = await axios.post('http://localhost:8000/execute', { code })
    const { stdout, stderr } = res.data
    setOutput(stdout || stderr)
  }

  return (
    <div className="flex flex-col h-screen bg-[#0e0e10]">
      <div className="h-11 bg-[#16161a] border-b border-[#2a2a35] flex items-center px-4 gap-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#7c6aff] shadow-[0_0_8px_#7c6aff]" />
          <span className="font-bold text-sm tracking-tight text-white">increspec</span>
        </div>
        <div className="flex items-center gap-2 bg-[#1e1e24] border border-[#2a2a35] rounded-md px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80]" />
          <span className="text-xs font-mono text-[#8888a0]">calculator.py</span>
        </div>
        <div className="flex-1" />
        <button
          onClick={handleRun}
          className="bg-[#7c6aff] hover:bg-[#9080ff] text-white text-xs font-bold px-4 py-1.5 rounded-md transition-colors"
        >
          ▶ Run
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />
        <ChatPanel activePanel={activePanel} code={code} />
        <Editor code={code} onChange={setCode} output={output} />
      </div>
    </div>
  )
}