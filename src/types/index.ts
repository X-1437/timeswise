export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: AssistantAction[] | null
}

export interface AssistantAction {
  type: 'call_tool'
  id: string
  label: string
  tool_name: string
  tool_args: Record<string, unknown>
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
  actions?: AssistantAction[] | null
  tool_calls?: Array<{
    tool_name: string
    tool_args: Record<string, unknown>
    tool_result: string
    timestamp: string
    data_version?: string | null
    artifact_path?: string | null
    warning_flags?: string[] | null
  }> | null
}

export interface PreviewBlock {
  id: string
  title: string
  markdown: string
  createdAt: string
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
  previewBlocks?: PreviewBlock[]
  latestReportUrl?: string | null
  pendingReportDownload?: boolean
}
