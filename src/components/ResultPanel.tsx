import './ResultPanel.css'
import { MarkdownView } from './MarkdownView'
import type { PreviewBlock } from '../types'

interface ResultPanelProps {
  isOpen: boolean
  onToggle: () => void
  width: number
  currentFilename?: string | null
  previewBlocks?: PreviewBlock[]
  hasReport: boolean
  canDownloadReport: boolean
  onDownloadReport: () => void
  isDownloading?: boolean
}

export function ResultPanel({
  isOpen,
  onToggle,
  width,
  currentFilename,
  previewBlocks,
  hasReport,
  canDownloadReport,
  onDownloadReport,
  isDownloading = false,
}: ResultPanelProps) {
  const blocks = previewBlocks ?? []
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

      <div className="result-content">
        {blocks.length > 0 ? (
          <div className="result-history">
            {blocks.map((b) => (
              <div key={b.id} className="result-block">
                <div className="result-block-header">
                  <div className="result-block-title">{b.title}</div>
                  <div className="result-block-time">{new Date(b.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="result-block-body">
                  <MarkdownView text={b.markdown} />
                </div>
              </div>
            ))}
          </div>
        ) : (
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
            <p className="placeholder-description">
              {currentFilename ? `当前数据集：${currentFilename}` : '当前未绑定数据集，请先上传 CSV。'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="result-footer">
        <button className="export-btn" onClick={onDownloadReport} disabled={!canDownloadReport || isDownloading}>
          <span className="material-symbols-outlined">download</span>
          {isDownloading ? '处理中...' : hasReport ? '下载分析报告' : '生成并下载报告'}
        </button>
      </div>
    </aside>
  )
}
