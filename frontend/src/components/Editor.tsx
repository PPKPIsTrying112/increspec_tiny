import Editor from '@monaco-editor/react'

export default function EditorPanel() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      {/* FILE TAB */}
      <div className="border-b border-[#2a2a35] bg-[#16161a] px-4 py-2 text-sm text-[#8888a0] font-mono flex-shrink-0">
        calculator.py
      </div>

      {/* EDITOR */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="python"
          defaultValue="# Start coding here"
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: 'JetBrains Mono, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16 },
          }}
        />
      </div>

      {/* OUTPUT PANEL */}
      <div className="h-36 border-t border-[#2a2a35] bg-[#16161a] flex flex-col flex-shrink-0">
        <div className="px-4 py-1.5 border-b border-[#2a2a35] flex items-center gap-3">
          <span className="text-[10px] font-bold tracking-widest text-[#555568] uppercase">Output</span>
        </div>
        <pre className="flex-1 overflow-auto p-4 font-mono text-xs text-[#8888a0] leading-relaxed">
          // Hit Run to execute your code
        </pre>
      </div>

    </div>
  )
}