import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import './MarkdownView.css'

const BASE_URL = 'http://localhost:8000'

function resolveUrl(url: string) {
  return url.startsWith('/api/v1/') ? `${BASE_URL}${url}` : url
}

function renderInline(text: string): ReactNode[] {
  // 处理内联 Markdown：**bold**、`code`、URL
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s)]+|\/api\/v1\/[^\s)]+)/g
  const parts = text.split(pattern)
  const matches = text.match(pattern) || []

  const result: ReactNode[] = []
  parts.forEach((part, idx) => {
    if (part) {
      result.push(<span key={`t-${idx}`}>{part}</span>)
    }
    if (matches[idx]) {
      const m = matches[idx]
      if (m.startsWith('**') && m.endsWith('**')) {
        // 加粗
        result.push(<strong key={`b-${idx}`}>{m.slice(2, -2)}</strong>)
      } else if (m.startsWith('`') && m.endsWith('`')) {
        // 行内代码
        result.push(<code key={`c-${idx}`} className="md-inline-code">{m.slice(1, -1)}</code>)
      } else {
        // URL（http/https 或 /api/v1/ 路径）
        const href = resolveUrl(m)
        result.push(
          <a key={`a-${idx}`} href={href} target="_blank" rel="noreferrer">
            {m}
          </a>
        )
      }
    }
  })

  return result.length ? result : [<span key="empty">{text}</span>]
}

function linkify(text: string): ReactNode[] {
  return renderInline(text)
}

function isTableHeader(line: string, nextLine: string | undefined) {
  if (!line.includes('|')) return false
  if (!nextLine) return false
  const t = nextLine.trim()
  return t.includes('|') && t.replace(/\|/g, '').trim().match(/^-{3,}\s*:?(-{0,}\s*:?)?$/) !== null
}

function parseTableRow(line: string): string[] {
  const raw = line.trim()
  const s = raw.startsWith('|') ? raw.slice(1) : raw
  const s2 = s.endsWith('|') ? s.slice(0, -1) : s
  return s2.split('|').map((c) => c.trim())
}

function parseAlignments(sepLine: string): Array<'left' | 'center' | 'right'> {
  const cells = parseTableRow(sepLine)
  return cells.map((c) => {
    const t = c.replace(/\s/g, '')
    const left = t.startsWith(':')
    const right = t.endsWith(':')
    if (left && right) return 'center'
    if (right) return 'right'
    return 'left'
  })
}

function headingLevel(line: string): number | null {
  const match = line.match(/^(#{1,6})\s+(.*)$/)
  return match ? match[1].length : null
}

export function MarkdownView({ text }: { text: string }) {
  const lines = (text || '').replace(/\r\n/g, '\n').split('\n')
  const nodes: ReactNode[] = []
  const [modal, setModal] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    if (!modal) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [modal])

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) {
      i += 1
      continue
    }

    if (line.startsWith('```')) {
      const buf: string[] = []
      i += 1
      while (i < lines.length && !lines[i].startsWith('```')) {
        buf.push(lines[i])
        i += 1
      }
      i += 1
      nodes.push(
        <pre key={`code-${i}`} className="md-pre">
          <code>{buf.join('\n')}</code>
        </pre>
      )
      continue
    }

    const level = headingLevel(line)
    if (level) {
      const content = line.replace(/^#{1,6}\s+/, '')
      const className = level === 1 ? 'md-h1' : level === 2 ? 'md-h2' : 'md-h3'
      const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'
      nodes.push(
        <Tag key={`h-${level}-${i}`} className={className}>
          {linkify(content)}
        </Tag>
      )
      i += 1
      continue
    }

    const imgMatch = line.trim().match(/^!\[(.*?)]\((.*?)\)$/)
    if (imgMatch) {
      const alt = imgMatch[1] || 'image'
      const src = resolveUrl(imgMatch[2] || '')
      nodes.push(
        <div key={`img-${i}`} className="md-img-wrap">
          <img
            className="md-img"
            src={src}
            alt={alt}
            loading="lazy"
            role="button"
            tabIndex={0}
            onClick={() => setModal({ src, alt })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setModal({ src, alt })
            }}
          />
          <div className="md-img-actions">
            <a href={src} target="_blank" rel="noreferrer">
              在新标签页打开
            </a>
          </div>
        </div>
      )
      i += 1
      continue
    }

    if (isTableHeader(line, lines[i + 1])) {
      const header = parseTableRow(lines[i])
      const aligns = parseAlignments(lines[i + 1] || '')
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim()) {
        if (!lines[i].includes('|')) break
        rows.push(parseTableRow(lines[i]))
        i += 1
      }
      nodes.push(
        <div key={`table-${i}`} className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>
                {header.map((h, idx) => (
                  <th key={idx} style={{ textAlign: aligns[idx] || 'left' }}>
                    {linkify(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, rIdx) => (
                <tr key={rIdx}>
                  {header.map((_, cIdx) => (
                    <td key={cIdx} style={{ textAlign: aligns[cIdx] || 'left' }}>
                      {linkify(r[cIdx] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2))
        i += 1
      }
      nodes.push(
        <ul key={`ul-${i}`} className="md-ul">
          {items.map((t, idx) => (
            <li key={idx}>{linkify(t)}</li>
          ))}
        </ul>
      )
      continue
    }

    const buf: string[] = []
    while (i < lines.length && lines[i].trim() && !headingLevel(lines[i]) && !lines[i].startsWith('- ') && !lines[i].startsWith('```')) {
      if (isTableHeader(lines[i], lines[i + 1])) break
      buf.push(lines[i])
      i += 1
    }
    if (buf.length === 0) {
      i += 1
      continue
    }
    nodes.push(
      <p key={`p-${i}`} className="md-p">
        {linkify(buf.join('\n'))}
      </p>
    )
  }

  return (
    <div className="md-root">
      {nodes}
      {modal ? (
        <div
          className="md-img-modal"
          role="dialog"
          aria-label="图片预览"
          onClick={() => setModal(null)}
        >
          <div className="md-img-modal-inner" onClick={(e) => e.stopPropagation()}>
            <img className="md-img-modal-img" src={modal.src} alt={modal.alt} />
            <div className="md-img-modal-actions">
              <button className="md-img-modal-close" onClick={() => setModal(null)}>
                关闭
              </button>
              <a href={modal.src} target="_blank" rel="noreferrer" className="md-img-modal-open">
                在新标签页打开
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
