import { useState, useEffect } from 'react'
import './App.css'
import ChatInput from './components/ChatInput'
import ChatMessage from './components/ChatMessage'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { ResultPanel } from './components/ResultPanel'
import { api } from './services/api'
import type { AssistantAction, Message, PreviewBlock, Session } from './types'

const BACKEND_BASE_URL = 'http://localhost:8000'

function App() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isResultPanelOpen, setIsResultPanelOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [resultPanelWidth, setResultPanelWidth] = useState(380)
  const [isDraggingLeft, setIsDraggingLeft] = useState(false)
  const [isDraggingRight, setIsDraggingRight] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const currentSession = sessions.find((s) => s.id === currentSessionId)

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const createSession = () => {
    const newSession: Session = {
      id: generateId(),
      title: '新会话',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      backendSessionId: null,
      fileId: null,
      filename: null,
      previewBlocks: [],
      latestReportUrl: null,
      pendingReportDownload: false,
    }
    setSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    return newSession.id
  }

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const toggleResultPanel = () => {
    setIsResultPanelOpen((prev) => !prev)
  }

  const handleLeftDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingLeft(true)
  }

  const handleRightDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingRight(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingLeft) {
        const newWidth = Math.max(200, Math.min(500, e.clientX))
        setSidebarWidth(newWidth)
      }
      if (isDraggingRight) {
        const newWidth = Math.max(200, Math.min(500, window.innerWidth - e.clientX))
        setResultPanelWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsDraggingLeft(false)
      setIsDraggingRight(false)
    }

    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingLeft, isDraggingRight])

  const updateSession = (sessionId: string, update: Partial<Session>) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, ...update } : session
      )
    )
  }

  const generateSessionTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find((m) => m.role === 'user')
    if (firstUserMessage) {
      return firstUserMessage.content.slice(0, 20) + (firstUserMessage.content.length > 20 ? '...' : '')
    }
    return '新会话'
  }

  const extractReportUrl = (text: string): string | null => {
    const match = (text || '').match(/\/api\/v1\/sessions\/[^\s]+\/report\/download/g)
    return match && match[0] ? match[0] : null
  }

  const toolTitle = (toolName?: string | null): string => {
    switch (toolName) {
      case 'upload_data':
        return '文件确认'
      case 'eda_analysis':
        return 'EDA 分析'
      case 'preprocessing':
        return '数据清洗/预处理'
      case 'feature_analysis':
        return '特征分析'
      case 'naive_forecast':
        return '朴素预测'
      case 'export_markdown':
        return '分析报告'
      default:
        return toolName || '结果'
    }
  }

  const handleSendMessage = async (
    content: string,
    options?: { autoDownloadReport?: boolean },
    action?: AssistantAction | null
  ) => {
    const targetSessionId = currentSessionId ?? createSession()
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    const sessionSnapshot = sessions.find((s) => s.id === targetSessionId)
    const currentMessages = sessionSnapshot?.messages || []
    const newMessages = [...currentMessages, userMessage]

    updateSession(targetSessionId, {
      messages: newMessages,
      title: generateSessionTitle(newMessages),
      updatedAt: new Date(),
    })

    setIsSending(true)

    try {
      const backendSessionId = sessionSnapshot?.backendSessionId ?? null
      const uploadedFileId = sessionSnapshot?.fileId ?? null
      const response = await api.sendMessage(content, uploadedFileId, backendSessionId, action ?? null)

      const assistantMessage: Message = {
        id: generateId(),
        role: response.role,
        content: response.content,
        timestamp: new Date(),
        actions: response.actions ?? null,
      }

      const finalMessages = [...newMessages, assistantMessage]

      const nowIso = new Date().toISOString()
      const toolName = response.tool_calls?.[0]?.tool_name ?? null
      const reportUrl = extractReportUrl(response.content)

      let previewTitle = response.actions && response.actions.length > 0 ? '需要确认' : toolTitle(toolName)
      let previewMarkdown = response.content
      if (reportUrl) {
        const url = `${BACKEND_BASE_URL}${reportUrl}?format=md`
        const md = await fetch(url).then((r) => r.text())
        previewTitle = '分析报告'
        previewMarkdown = md
      }

      const block: PreviewBlock = {
        id: generateId(),
        title: previewTitle,
        markdown: previewMarkdown,
        createdAt: nowIso,
      }

      if (options?.autoDownloadReport && reportUrl) {
        window.open(`${BACKEND_BASE_URL}${reportUrl}`, '_blank', 'noopener,noreferrer')
      }

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== targetSessionId) return s
          const blocks = s.previewBlocks ?? []
          return {
            ...s,
            messages: finalMessages,
            title: generateSessionTitle(finalMessages),
            updatedAt: new Date(),
            backendSessionId: response.session_id,
            previewBlocks: [...blocks, block],
            latestReportUrl: reportUrl ? reportUrl : s.latestReportUrl ?? null,
            pendingReportDownload: false,
          }
        })
      )
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '抱歉，发生了错误，请稍后重试。',
        timestamp: new Date(),
      }

      const finalMessages = [...newMessages, errorMessage]
      updateSession(targetSessionId, {
        messages: finalMessages,
        title: generateSessionTitle(finalMessages),
        updatedAt: new Date(),
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleAssistantAction = async (action: AssistantAction) => {
    if (isSending) return
    await handleSendMessage(action.label, undefined, action)
  }

  const handleFileUpload = async (file: File) => {
    const targetSessionId = currentSessionId ?? createSession()
    const sessionSnapshot = sessions.find((s) => s.id === targetSessionId)

    try {
      const backendSessionId = sessionSnapshot?.backendSessionId ?? null
      const response = await api.uploadFile(file, backendSessionId)

      const systemMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `文件 ${response.filename} 上传成功！现在您可以问我关于这个文件的问题了。`,
        timestamp: new Date(),
      }

      const currentMessages = sessionSnapshot?.messages || []
      const newMessages = [...currentMessages, systemMessage]

      updateSession(targetSessionId, {
        messages: newMessages,
        title: generateSessionTitle(newMessages),
        updatedAt: new Date(),
        fileId: response.id,
        filename: response.filename,
        backendSessionId: response.session_id ?? sessionSnapshot?.backendSessionId ?? null,
        previewBlocks: [],
        latestReportUrl: null,
        pendingReportDownload: false,
      })
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '文件上传失败，请重试。',
        timestamp: new Date(),
      }

      const currentMessages = sessionSnapshot?.messages || []
      const newMessages = [...currentMessages, errorMessage]

      updateSession(targetSessionId, {
        messages: newMessages,
        title: generateSessionTitle(newMessages),
        updatedAt: new Date(),
      })
    }
  }

  const handleExportReport = async () => {
    const targetSession = sessions.find((s) => s.id === currentSessionId)
    if (!targetSession?.fileId) {
      const sessionId = currentSessionId ?? createSession()
      const currentMessages = sessions.find((s) => s.id === sessionId)?.messages || []
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '请先上传 CSV 文件后再导出报告。',
        timestamp: new Date(),
      }
      updateSession(sessionId, {
        messages: [...currentMessages, assistantMessage],
        updatedAt: new Date(),
      })
      return
    }

    const reportUrl = targetSession.latestReportUrl
    if (reportUrl) {
      window.open(`${BACKEND_BASE_URL}${reportUrl}`, '_blank', 'noopener,noreferrer')
      return
    }

    await handleSendMessage('把这次分析导出成报告', { autoDownloadReport: true })
  }

  useEffect(() => {
    if (!initialized && sessions.length === 0) {
      createSession()
      setInitialized(true)
    }
  }, [sessions.length, initialized])

  return (
    <div className={`app-container ${isDraggingLeft || isDraggingRight ? 'resizing' : ''}`}>
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onCreateSession={() => {
          createSession()
        }}
        onSelectSession={selectSession}
        isOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        width={sidebarWidth}
      />
      
      {isSidebarOpen && (
        <div 
          className="resizer resizer-left"
          onMouseDown={handleLeftDragStart}
        />
      )}

      <div className={`main-content ${!isSidebarOpen ? 'sidebar-collapsed' : ''} ${!isResultPanelOpen ? 'result-panel-collapsed' : ''}`}>
        <Header />

        <div className="chat-container">
          {/* Decorative Background Elements */}
          <div className="bg-decorative bg-decorative-1"></div>
          <div className="bg-decorative bg-decorative-2"></div>

          <div className="chat-wrapper">
            <div className="messages-container">
              {(!currentSession || currentSession.messages.length === 0) && (
                <div className="welcome-message">
                  <div className="welcome-content animate-float">
                    <div className="welcome-emoji">👋</div>
                    <h2 className="welcome-title">欢迎使用鸿溯</h2>
                    <p className="welcome-subtitle">您可以直接上传数据或输入问题开始分析</p>
                  </div>
                </div>
              )}
              {currentSession?.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onAction={handleAssistantAction}
                  actionsDisabled={isSending}
                />
              ))}
              {isSending && (
                <div className="loading-message">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>

            <div className="input-area">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                disabled={isSending}
                onFileUpload={handleFileUpload}
              />
              <div className="input-footer">
                <p className="footer-text">鸿溯 AI 助手为您提供智能建议。分析结果仅供参考。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isResultPanelOpen && (
        <div 
          className="resizer resizer-right"
          onMouseDown={handleRightDragStart}
        />
      )}

      <ResultPanel
        isOpen={isResultPanelOpen}
        onToggle={toggleResultPanel}
        width={resultPanelWidth}
        currentFilename={currentSession?.filename ?? null}
        previewBlocks={currentSession?.previewBlocks ?? []}
        hasReport={Boolean(currentSession?.latestReportUrl)}
        canDownloadReport={Boolean(currentSession?.fileId) && !isSending}
        onDownloadReport={() => {
          void handleExportReport()
        }}
        isDownloading={isSending}
      />
    </div>
  )
}

export default App
