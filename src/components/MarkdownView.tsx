import type { ReactNode } from 'react'
import './MarkdownView.css'

const BASE_URL = 'http://localhost:8000'

function linkify(text: string): ReactNode[] {
  const pattern = /(https?:\/\/[^\s]+|\/api\/v1\/[^\s]+)/g
  const parts = text.split(pattern)
  return parts.map((part, idx) => {
    if (!part) return null
    if (part.startsWith('http://') || part.startsWith('https://') || part.startsWith('/api/v1/')) {
      const href = part.startsWith('/api/v1/') ? `${BASE_URL}${part}` : part
      return (
        <a key={idx} href={href} target="_blank" rel="noreferrer">
          {part}
        </a>
      )
    }
    return <span key={idx}>{part}</span>
  })
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

  return <div className="md-root">{nodes}</div>
}
