import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const size        = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * Apple Touch Icon 180×180 — généré via Next.js ImageResponse (Satori).
 * Reproduit le logo PrêtImmoPro : fond bleu dégradé, maison blanche avec %.
 *
 * Satori ne supporte pas les éléments SVG natifs : on utilise la technique
 * CSS "border trick" pour le triangle du toit.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          width:        180,
          height:       180,
          borderRadius: 36,
          display:      'flex',
          flexDirection: 'column',
          alignItems:   'center',
          justifyContent: 'center',
          gap:          0,
        }}
      >
        {/* Toit — triangle CSS */}
        <div
          style={{
            width:        0,
            height:       0,
            borderLeft:   '62px solid transparent',
            borderRight:  '62px solid transparent',
            borderBottom: '56px solid rgba(255,255,255,0.97)',
            marginBottom: -2,
          }}
        />

        {/* Corps de la maison */}
        <div
          style={{
            width:           100,
            height:          72,
            background:      'rgba(255,255,255,0.97)',
            borderRadius:    4,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}
        >
          <span
            style={{
              fontSize:   46,
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
