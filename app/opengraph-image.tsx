import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const alt         = 'PrêtImmoPro — Simulateur de crédit immobilier gratuit'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Image Open Graph 1200×630 — partagée sur Facebook, Twitter/X, WhatsApp, LinkedIn.
 * Construite via Satori (CSS uniquement, pas de SVG natif).
 *
 * Design :
 *  – Fond bleu dégradé (couleurs primary du projet)
 *  – Logo maison+% à gauche
 *  – Titre + baseline à droite
 *  – Bandeau de métriques clés en bas
 */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:     'linear-gradient(135deg, #0f2d6b 0%, #1e3a8a 40%, #1d4ed8 100%)',
          width:          '100%',
          height:         '100%',
          display:        'flex',
          flexDirection:  'column',
          fontFamily:     'system-ui, -apple-system, sans-serif',
          padding:        '0',
          position:       'relative',
        }}
      >
        {/* Décoration géométrique — cercles en transparence */}
        <div style={{
          position:     'absolute',
          top:          -120,
          right:        -120,
          width:         500,
          height:        500,
          borderRadius: '50%',
          background:   'rgba(255,255,255,0.05)',
          display:      'flex',
        }} />
        <div style={{
          position:     'absolute',
          bottom:       -80,
          left:         -80,
          width:         350,
          height:        350,
          borderRadius: '50%',
          background:   'rgba(255,255,255,0.04)',
          display:      'flex',
        }} />

        {/* Contenu principal */}
        <div
          style={{
            flex:           1,
            display:        'flex',
            alignItems:     'center',
            padding:        '60px 80px',
            gap:            64,
          }}
        >
          {/* Logo maison+% */}
          <div
            style={{
              display:         'flex',
              flexDirection:   'column',
              alignItems:      'center',
              flexShrink:      0,
            }}
          >
            {/* Fond blanc arrondi pour le logo */}
            <div style={{
              background:    'white',
              borderRadius:  32,
              width:          160,
              height:         160,
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              justifyContent: 'center',
              boxShadow:     '0 20px 60px rgba(0,0,0,0.3)',
              gap:            0,
            }}>
              {/* Toit */}
              <div style={{
                width:         0,
                height:        0,
                borderLeft:    '52px solid transparent',
                borderRight:   '52px solid transparent',
                borderBottom:  '46px solid #1e3a8a',
                marginBottom:  -2,
              }} />
              {/* Corps */}
              <div style={{
                width:          84,
                height:         62,
                background:     '#1e3a8a',
                borderRadius:   3,
                display:       'flex',
                alignItems:    'center',
                justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontSize: 40, fontWeight: 900, lineHeight: 1 }}>%</span>
              </div>
            </div>

            {/* Nom de la marque */}
            <span style={{
              marginTop:   20,
              color:       'rgba(255,255,255,0.9)',
              fontSize:    22,
              fontWeight:  700,
              letterSpacing: '0.02em',
            }}>
              PrêtImmoPro
            </span>
          </div>

          {/* Texte */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
            <div style={{
              display:      'inline-flex',
              alignSelf:    'flex-start',
              background:   'rgba(255,255,255,0.15)',
              borderRadius: 100,
              padding:      '8px 20px',
              color:        'rgba(255,255,255,0.9)',
              fontSize:     16,
              fontWeight:   600,
              letterSpacing: '0.05em',
            }}>
              SIMULATEUR GRATUIT · 2026
            </div>

            <h1 style={{
              margin:      0,
              color:       'white',
              fontSize:    58,
              fontWeight:  900,
              lineHeight:  1.1,
              letterSpacing: '-0.02em',
            }}>
              Simulez votre prêt immobilier
            </h1>

            <p style={{
              margin:      0,
              color:       'rgba(255,255,255,0.75)',
              fontSize:    26,
              fontWeight:  400,
              lineHeight:  1.4,
            }}>
              Mensualités · Capacité d'emprunt · Frais de notaire · Taux par ville
            </p>
          </div>
        </div>

        {/* Bandeau métriques en bas */}
        <div style={{
          display:       'flex',
          background:    'rgba(255,255,255,0.1)',
          borderTop:     '1px solid rgba(255,255,255,0.15)',
          padding:       '24px 80px',
          gap:           0,
        }}>
          {[
            { value: '5',        label: 'simulateurs gratuits' },
            { value: '100%',     label: 'sans inscription'     },
            { value: 'Live',     label: 'taux en temps réel'   },
            { value: '8 villes', label: 'taux par commune'     },
          ].map(({ value, label }, i) => (
            <div key={label} style={{
              flex:           1,
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              borderRight:    i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none',
              gap:            4,
            }}>
              <span style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>{value}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
