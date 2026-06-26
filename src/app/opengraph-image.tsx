import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Seekvana — Learn AI, clearly'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#FAF8F3' }}>
        <div style={{ height: 8, background: '#C9633F', width: '100%' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="28" stroke="#C9633F" strokeWidth="3" fill="none"/>
            <line x1="30" y1="4" x2="30" y2="18" stroke="#C9633F" strokeWidth="3"/>
            <line x1="30" y1="42" x2="30" y2="56" stroke="#C9633F" strokeWidth="3"/>
            <line x1="4" y1="30" x2="18" y2="30" stroke="#C9633F" strokeWidth="3"/>
            <line x1="42" y1="30" x2="56" y2="30" stroke="#C9633F" strokeWidth="3"/>
          </svg>
          <div style={{ fontSize: 72, fontWeight: 700, color: '#1C1B19', fontFamily: 'serif', marginTop: 24 }}>Seekvana</div>
          <div style={{ fontSize: 32, color: '#6F6B62', fontFamily: 'sans-serif', marginTop: 16 }}>Learn AI, clearly.</div>
        </div>
        <div style={{ height: 60, background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#C9633F', fontSize: 24, fontFamily: 'sans-serif' }}>seekvana.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
