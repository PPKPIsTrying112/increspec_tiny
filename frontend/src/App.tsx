import { useState } from 'react'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import ChatPanel from './components/ChatPanel'
import Editor from './components/Editor'
import FileTree from './components/FileTree'

type Panel = 'chat' | 'notes' | 'requirements' | 'files'

export default function App() {
  const [activePanel, setActivePanel] = useState<Panel>('chat')
  const [code, setCode] = useState('# Start coding here')
  const [output, setOutput] = useState('')
  const [projectName, setProjectName] = useState('My Project')
  const [files, setFiles] = useState<Record<string, string>>({
    'main.py': '# Start coding here'
  })
  const [activeFile, setActiveFile] = useState('main.py')

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    setFiles(prev => ({ ...prev, [activeFile]: newCode }))
  }
  const handleFileSelect = (filename: string) => {
    setActiveFile(filename)
    setCode(files[filename])
  }

  const handleFileCreate = (filename: string) => {
    setFiles(prev => ({ ...prev, [filename]: '' }))
    setActiveFile(filename)
    setCode('')
  }

  const handleFileDelete = (filename: string) => {
    if (Object.keys(files).length === 1) return
    const updated = { ...files }
    delete updated[filename]
    setFiles(updated)
    const next = Object.keys(updated)[0]
    setActiveFile(next)
    setCode(updated[next])
  }

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
          <span className="text-xs font-mono text-[#8888a0]">{activeFile}</span>
        </div>
        <div className="flex-1" />
        <button onClick={handleRun} className="bg-[#7c6aff] hover:bg-[#9080ff] text-white text-xs font-bold px-4 py-1.5 rounded-md transition-colors">
          ▶ Run
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />
        
        {activePanel === 'chat' && <ChatPanel activePanel={activePanel} code={code} />}
        {activePanel === 'notes' && <div className="w-72 bg-[#16161a] border-r border-[#2a2a35] p-4 text-white">Notes</div>}
        {activePanel === 'requirements' && <div className="w-72 bg-[#16161a] border-r border-[#2a2a35] p-4 text-white">Requirements</div>}
        {activePanel === 'files' && (
          <FileTree
            projectName={projectName}
            files={files}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
            onFileCreate={handleFileCreate}
            onFileDelete={handleFileDelete}
            onProjectRename={setProjectName}
          />
        )}

        <Editor code={code} onChange={handleCodeChange} output={output} activeFile={activeFile} />      
        </div>
    </div>
  )
}