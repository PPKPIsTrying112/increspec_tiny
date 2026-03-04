import MonacoEditor from '@monaco-editor/react'

interface EditorProps {
  code: string
  onChange: (code: string) => void
  output: string
  activeFile: string
}

export default function Editor({ code, onChange, output, activeFile }: EditorProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-[#2a2a35] bg-[#16161a] px-4 py-2 text-sm text-[#8888a0] font-mono flex-shrink-0">
        {activeFile}
      </div>
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={v => onChange(v || '')}
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
      <div className="h-36 border-t border-[#2a2a35] bg-[#16161a] flex flex-col flex-shrink-0">
        <div className="px-4 py-1.5 border-b border-[#2a2a35]">
          <span className="text-[10px] font-bold tracking-widest text-[#555568] uppercase">Output</span>
        </div>
        <pre className="flex-1 overflow-auto p-4 font-mono text-xs text-[#8888a0] leading-relaxed">
          {output || '// Hit Run to execute your code'}
        </pre>
      </div>
    </div>
  )
}