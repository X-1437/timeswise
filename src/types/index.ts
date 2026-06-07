export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface UploadFileResponse {
  id: string
  filename: string
  size: number
  row_count: number
  column_names: string[]
  uploaded_at: string
  session_id?: string | null
  inserted_rows: number
}

export interface ChatMessageResponse {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  file_id?: string | null
}

export interface Session {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  backendSessionId?: string | null
  fileId?: string | null
  filename?: string | null
}
