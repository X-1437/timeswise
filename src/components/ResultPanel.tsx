import './ResultPanel.css'

interface ResultPanelProps {
  isOpen: boolean
  onToggle: () => void
  width: number
}

export function ResultPanel({ isOpen, onToggle, width }: ResultPanelProps) {
  return (
    <aside 
      className={`result-panel ${!isOpen ? 'collapsed' : ''}`}
      style={{ width: isOpen ? width : 80 }}
    >
      {/* Header */}
      <div className="result-header">
        <div className="result-header-inner">
          <div className="result-icon-container">
            <span className="material-symbols-outlined">dashboard</span>
          </div>
          <span className="result-title">结果预览</span>
        </div>
        <button 
          className="result-toggle-btn" 
          onClick={onToggle}
          title={isOpen ? "收起结果面板" : "展开结果面板"}
        >
          <span className="material-symbols-outlined">
            {isOpen ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* Placeholder Empty State */}
      <div className="result-content">
        <div className="result-placeholder">
          <div className="placeholder-illustration">
            <div className="illustration-bg"></div>
            <div className="illustration-main">
              <span className="material-symbols-outlined">monitoring</span>
            </div>
            <div className="illustration-secondary">
              <span className="material-symbols-outlined">insights</span>
            </div>
            <div className="illustration-tertiary">
              <span className="material-symbols-outlined">bar_chart</span>
            </div>
          </div>
          <h3 className="placeholder-title">分析结果将在此处显示</h3>
          <p className="placeholder-description">
            上传数据或提问以生成可视化报告。我们将通过智能算法为您提取趋势与规律。
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="result-footer">
        <button className="export-btn">
          <span className="material-symbols-outlined">download</span>
          导出预览报告
        </button>
      </div>
    </aside>
  )
}
