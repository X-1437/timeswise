import './Header.css'

interface HeaderProps {
}

export function Header({}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-title-container">
          <div className="header-title-row">
            <span className="header-app-name">鸿溯</span>
            <span className="header-divider"></span>
            <span className="header-subtitle">时间序列数据分析助手</span>
          </div>
        </div>
      </div>
      <div className="header-right">
        <button className="header-icon-btn notification-btn">
          <span className="material-symbols-outlined">notifications</span>
          <span className="notification-dot"></span>
        </button>
        <button className="header-icon-btn">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
      </div>
    </header>
  )
}
