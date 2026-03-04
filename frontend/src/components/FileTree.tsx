import { useState } from 'react'
import { FilePlus, Trash2 } from 'lucide-react'

interface FileTreeProps {
  projectName: string
  files: Record<string, string>
  activeFile: string
  onFileSelect: (filename: string) => void
  onFileCreate: (filename: string) => void
  onFileDelete: (filename: string) => void
  onProjectRename: (name: string) => void
}

export default function FileTree({
  projectName,
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onProjectRename
}: FileTreeProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = () => {
    if (!newFileName.trim()) return
    onFileCreate(newFileName.trim())
    setNewFileName('')
    setIsCreating(false)
  }

  return (
    <div className="w-72 h-full bg-[#16161a] border-r border-[#2a2a35] flex flex-col">
      
      {/* PROJECT NAME */}
      <div className="px-4 py-3 border-b border-[#2a2a35]">
        {isRenaming ? (
          <input
            autoFocus
            className="w-full bg-[#1e1e24] border border-[#7c6aff] rounded px-2 py-1 text-sm text-white outline-none"
            value={projectName}
            onChange={e => onProjectRename(e.target.value)}
            onBlur={() => setIsRenaming(false)}
            onKeyDown={e => e.key === 'Enter' && setIsRenaming(false)}
          />
        ) : (
          <div
            className="text-sm font-bold text-white cursor-pointer hover:text-[#7c6aff] transition-colors"
            onClick={() => setIsRenaming(true)}
          >
            📁 {projectName}
          </div>
        )}
      </div>

      {/* FILES LIST */}
      <div className="flex-1 overflow-y-auto py-2">
        {Object.keys(files).map(filename => (
          <div
            key={filename}
            className={`flex items-center justify-between px-4 py-1.5 cursor-pointer group transition-colors
              ${activeFile === filename ? 'bg-[#26262e] text-white' : 'text-[#8888a0] hover:bg-[#1e1e24] hover:text-white'}`}
            onClick={() => onFileSelect(filename)}
          >
            <span className="text-sm font-mono">{filename}</span>
            <button
              onClick={e => { e.stopPropagation(); onFileDelete(filename) }}
              className="opacity-0 group-hover:opacity-100 text-[#555568] hover:text-red-400 transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        {/* NEW FILE INPUT */}
        {isCreating && (
          <div className="px-4 py-1.5">
            <input
              autoFocus
              className="w-full bg-[#1e1e24] border border-[#7c6aff] rounded px-2 py-1 text-sm text-white font-mono outline-none"
              placeholder="filename.py"
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreate()
                if (e.key === 'Escape') setIsCreating(false)
              }}
              onBlur={() => setIsCreating(false)}
            />
          </div>
        )}
      </div>

      {/* ADD FILE BUTTON */}
      <div className="p-3 border-t border-[#2a2a35]">
        <button
          onClick={() => setIsCreating(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#555568] hover:text-white hover:bg-[#1e1e24] transition-colors text-sm"
        >
          <FilePlus size={14} />
          New file
        </button>
      </div>
    </div>
  )
}