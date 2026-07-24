import type { Session } from '../types'
import './Sidebar.css'

interface SidebarProps {
  sessions: Session[]
  currentSessionId: string | null
  onCreateSession: () => void
  onSelectSession: (sessionId: string) => void
  isOpen: boolean
  onToggleSidebar: () => void
  width: number
}

export function Sidebar({
  sessions,
  currentSessionId,
  onCreateSession,
  onSelectSession,
  isOpen,
  onToggleSidebar,
  width
}: SidebarProps) {
  return (
    <aside 
      className={`sidebar ${!isOpen ? 'collapsed' : ''}`}
      style={{ width: isOpen ? width : 80 }}
    >
      <div className="sidebar-content">
        {/* Logo Area */}
        <div className="logo-area">
          <div className="logo-icon">
            <span className="material-symbols-outlined">timeline</span>
          </div>
          <div className="logo-text-container">
            <span className="logo-title">鸿溯</span>
            <span className="logo-subtitle">时间序列分析</span>
          </div>
          <button 
            className="sidebar-collapse-btn" 
            onClick={onToggleSidebar}
            title={isOpen ? "收起侧边栏" : "展开侧边栏"}
          >
            <span className="material-symbols-outlined">
              {isOpen ? 'menu_open' : 'menu'}
            </span>
          </button>
        </div>

        {/* CTA Action */}
        <div className="cta-section">
          <button className="new-session-btn" onClick={onCreateSession}>
            <span className="btn-icon">+ 新建会话</span>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        {/* Navigation Lists */}
        <div className="session-list-container">
          <div className="session-label">最近会话</div>
          
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`session-item ${
                currentSessionId === session.id ? 'active' : ''}`}
              onClick={() => onSelectSession(session.id)}
            >
              <div className="session-item-inner">
                <span className="material-symbols-outlined">history</span>
                <div className="session-info">
                  <span className="session-title">{session.title}</span>
                  <span className="session-date">{new Date(session.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="sidebar-footer">
          <div className="settings-btn">
            <span className="material-symbols-outlined">settings</span>
            <span>设置</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
