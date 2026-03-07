import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'

export default function RequirementsPanel() {
  const [markdown, setMarkdown] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1]
      const res = await axios.post('http://localhost:8000/parse-requirements', {
        pdf_base64: base64
      })
      console.log(res.data)  // add this line
    const md = res.data.markdown
    setIsLoading(false)

      setMarkdown(md)

    }
    reader.readAsDataURL(file)
  }

  

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center text-[#555568] text-sm">
      Extracting tasks...
    </div>
  )

if (!markdown) return (
  <div style={{background: 'red', padding: '16px', color: 'white'}}>
    <p>Upload your assignment</p>
    <button onClick={() => fileInputRef.current?.click()}>
      Upload PDF
    </button>
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf"
      className="hidden"
      onChange={handleUpload}
    />
  </div>
)
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2a35]">
        <span className="text-[10px] text-[#555568] uppercase tracking-widest">Requirements</span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-[11px] text-[#7c6aff] hover:text-[#9080ff]"
          >
            {isEditing ? 'Preview' : 'Edit'}
          </button>
          <button
            onClick={() => { setMarkdown(''); fileInputRef.current?.click() }}
            className="text-[11px] text-[#555568] hover:text-white"
          >
            Re-upload
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* content */}
      <div className="flex-1 overflow-y-auto p-3">
        {isEditing ? (
          <textarea
            className="w-full h-full bg-transparent text-white text-sm font-mono outline-none resize-none leading-relaxed"
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
          />
        ) : (
        <div className="text-white text-sm">
        <ReactMarkdown>
            {markdown}
        </ReactMarkdown>
        </div>
        )}
      </div>
    </div>
  )
  
}