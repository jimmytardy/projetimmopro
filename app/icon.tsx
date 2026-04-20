import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const size        = { width: 32, height: 32 }
export const contentType = 'image/png'

/**
 * Favicon 32×32 PNG — généré via Next.js ImageResponse.
 * Servi à /icon.png et injecté automatiquement dans le <head>.
 * Compatible tous navigateurs (Chrome, Firefox, Safari).
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background:     'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          width:          32,
          height:         32,
          borderRadius:   6,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            0,
        }}
      >
        {/* Toit — triangle CSS */}
        <div
          style={{
            width:        0,
            height:       0,
            borderLeft:   '11px solid transparent',
            borderRight:  '11px solid transparent',
            borderBottom: '10px solid rgba(255,255,255,0.97)',
            marginBottom: -1,
          }}
        />
        {/* Corps de la maison */}
        <div
          style={{
            width:           18,
            height:          13,
            background:      'rgba(255,255,255,0.97)',
            borderRadius:    1,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}
        >
          <span
            style={{
              fontSize:   9,
              fontWeight: 900,
              color:      '#1e3a8a',
              lineHeight: 1,
            }}
          >
            %
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
