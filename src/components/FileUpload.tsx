import { useRef, useState } from 'react'
import './FileUpload.css'

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      setUploadStatus('❌ 请选择CSV文件！')
      setTimeout(() => setUploadStatus(null), 3000)
      return
    }

    setIsUploading(true)
    setUploadStatus('⏳ 正在上传...')
    
    try {
      await onFileUpload(file)
      setUploadStatus(`✅ 文件 ${file.name} 上传成功！`)
    } catch (error) {
      setUploadStatus('❌ 文件上传失败，请重试')
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadStatus(null), 3000)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="file-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button
        className="upload-button"
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        {isUploading ? '📤 上传中...' : '📁 选择CSV文件'}
      </button>
      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.startsWith('✅') ? 'success' : uploadStatus.startsWith('❌') ? 'error' : 'loading'}`}>
          {uploadStatus}
        </div>
      )}
    </div>
  )
}

export default FileUpload
