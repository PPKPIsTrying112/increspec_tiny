import Editor from '@monaco-editor/react'

export default function EditorPanel() {
  return (
    <div className="flex-1 h-full bg-[#0e0e10] flex flex-col">
      <div className="border-b border-[#2a2a35] bg-[#16161a] px-4 py-2 text-sm text-[#8888a0] font-mono">
        calculator.py
      </div>
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
    </div>
  )
}