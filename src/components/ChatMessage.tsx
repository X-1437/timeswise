import './ChatMessage.css'
import type { AssistantAction, Message } from '../types'
import { MarkdownView } from './MarkdownView'

interface ChatMessageProps {
  message: Message
  onAction?: (action: AssistantAction) => void
  actionsDisabled?: boolean
}

const ChatMessage = ({ message, onAction, actionsDisabled = false }: ChatMessageProps) => {
  const isUser = message.role === 'user'
  const actions = !isUser ? message.actions ?? null : null

  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-role">
            {isUser ? '用户' : '鸿溯助手'}
          </span>
          <span className="message-time">
            {message.timestamp.toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="message-text">
          <MarkdownView text={message.content} />
        </div>
        {actions && actions.length > 0 && (
          <div className="message-actions">
            {actions.map((a) => (
              <button
                key={a.id}
                type="button"
                className="message-action-btn"
                onClick={() => onAction?.(a)}
                disabled={actionsDisabled}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
