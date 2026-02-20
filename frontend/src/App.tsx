import Sidebar from './components/Sidebar'
import ChatPanel from './components/ChatPanel'
import Editor from './components/Editor'

import { useState } from 'react'

type Panel = 'chat' | 'notes' | 'requirements'

export default function App() {
  const [activePanel, setActivePanel] = useState<Panel>('chat')

  return (
    <div className="flex h-screen bg-[#0e0e10]">
      <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />
      <ChatPanel activePanel={activePanel} />
      <Editor />
    </div>
  )
}