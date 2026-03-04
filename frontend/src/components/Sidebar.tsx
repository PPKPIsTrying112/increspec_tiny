import { MessageSquare, BookOpen, ClipboardList, FolderOpen } from 'lucide-react'

type Panel = 'chat' | 'notes' | 'requirements' | 'files'

interface SidebarProps {
  activePanel: Panel
  onPanelChange: (panel: Panel) => void
}

export default function Sidebar({ activePanel, onPanelChange }: SidebarProps) {
  return (
    <div className="flex flex-col items-center w-12 h-full bg-[#16161a] border-r border-[#2a2a35] py-3 gap-2">
      <button
      onClick={() => onPanelChange('files')}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
        ${activePanel === 'files' ? 'bg-[#26262e] text-white' : 'text-[#555568] hover:bg-[#26262e] hover:text-white'}`}
    >
      <FolderOpen size={18} />
    </button>

      <button
        onClick={() => onPanelChange('chat')}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
          ${activePanel === 'chat' ? 'bg-[#26262e] text-white' : 'text-[#555568] hover:bg-[#26262e] hover:text-white'}`}
      >
        <MessageSquare size={18} />
      </button>
      <button
        onClick={() => onPanelChange('requirements')}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
          ${activePanel === 'requirements' ? 'bg-[#26262e] text-white' : 'text-[#555568] hover:bg-[#26262e] hover:text-white'}`}
      >
        <ClipboardList size={18} />
      </button>
      <button
        onClick={() => onPanelChange('notes')}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
          ${activePanel === 'notes' ? 'bg-[#26262e] text-white' : 'text-[#555568] hover:bg-[#26262e] hover:text-white'}`}
      >
        <BookOpen size={18} />
      </button>


    </div>
  )
}