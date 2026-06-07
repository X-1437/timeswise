import type { UploadFileResponse, ChatMessageResponse } from '../types'

const API_BASE_URL = 'http://localhost:8000/api/v1'

type ApiEnvelope<T> = {
  success: boolean
  data: T
  message?: string
  error_code?: string | null
}

async function unwrap<T>(response: Response): Promise<T> {
  const json = (await response.json()) as ApiEnvelope<T>
  return json.data
}

export const api = {
  async uploadFile(file: File, sessionId?: string | null): Promise<UploadFileResponse> {
    const formData = new FormData()
    formData.append('file', file)
    if (sessionId) {
      formData.append('session_id', sessionId)
    }

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('文件上传失败')
    }

    return unwrap<UploadFileResponse>(response)
  },

  async sendMessage(
    content: string,
    fileId: string | null = null,
    sessionId?: string | null
  ): Promise<ChatMessageResponse> {
    const response = await fetch(`${API_BASE_URL}/chat/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        session_id: sessionId ?? null,
        fileId,
      }),
    })

    if (!response.ok) {
      throw new Error('消息发送失败')
    }

    return unwrap<ChatMessageResponse>(response)
  },
}
