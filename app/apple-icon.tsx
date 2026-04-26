import { ImageResponse } from 'next/og'

export const size        = { width: 180, height: 180 }
export const contentType = 'image/png'
export const runtime = 'edge'

/**
 * Apple Touch Icon 180×180 PNG — SVG du Logo embarqué en data URI dans ImageResponse.
 * Rendu pixel-perfect identique au composant Logo.tsx.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          borderRadius: 36,
          fontSize: 84,
          fontWeight: 900,
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        %
      </div>
    ),
    { ...size },
  )
}
