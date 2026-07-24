import { useState, useRef } from 'react'
import './ChatInput.css'

interface ChatInputProps {
  onSendMessage: (content: string) => void
  disabled?: boolean
  onFileUpload?: (file: File) => void
}

export default function ChatInput({ onSendMessage, disabled = false, onFileUpload }: ChatInputProps) {
  const [input, setInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onFileUpload) {
      onFileUpload(file)
      // 清空文件输入以允许再次选择同一文件
      e.target.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="input-wrapper">
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-container">
          {/* Upload Button */}
          <div className="upload-trigger">
            <button
              type="button"
              className="upload-btn"
              onClick={handleUploadClick}
            >
              <span className="material-symbols-outlined">add_circle</span>
            </button>
            <input
              type="file"
              accept=".csv"
              className="file-input-hidden"
              onChange={handleFileSelect}
              ref={fileInputRef}
            />
          </div>
          
          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您想分析的内容，或上传 CSV 文件..."
            disabled={disabled}
            className="chat-input"
          />
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className={`send-btn ${input.trim() ? 'active' : ''}`}
          >
            <span className="send-text">发送</span>
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </form>
    </div>
  )
}
