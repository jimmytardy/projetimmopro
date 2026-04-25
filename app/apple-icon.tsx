import { ImageResponse } from 'next/og'

export const size        = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * Apple Touch Icon 180×180 PNG — SVG du Logo embarqué en data URI dans ImageResponse.
 * Rendu pixel-perfect identique au composant Logo.tsx.
 */
export default function AppleIcon() {
  const s = 180
  const r = Math.round(s * 0.2)
  const cx = s / 2
  const roofTop   = s * 0.10
  const roofMid   = s * 0.52
  const roofLeft  = s * 0.08
  const roofRight = s * 0.92
  const bodyLeft  = s * 0.18
  const bodyRight = s * 0.82
  const bodyBottom= s * 0.92
  const percentY  = bodyBottom - (bodyBottom - roofMid) * 0.18
  const fontSize  = s * 0.32

  const svg = `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e3a8a"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
    </defs>
    <rect width="${s}" height="${s}" rx="${r}" ry="${r}" fill="url(#g)"/>
    <polygon points="${cx},${roofTop} ${roofRight},${roofMid} ${roofLeft},${roofMid}" fill="rgba(255,255,255,0.97)"/>
    <rect x="${bodyLeft}" y="${roofMid - 1}" width="${bodyRight - bodyLeft}" height="${bodyBottom - roofMid + 1}" rx="${s * 0.03}" fill="rgba(255,255,255,0.97)"/>
    <text x="${cx}" y="${percentY}" text-anchor="middle" dominant-baseline="auto" font-size="${fontSize}" font-weight="900" font-family="Arial Black, Arial, sans-serif" fill="#1e3a8a">%</text>
  </svg>`

  const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`

  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={dataUri} width={s} height={s} alt="" />
    ),
    { ...size },
  )
}
