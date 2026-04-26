interface LogoProps {
  /** Taille du carré de l'icône en pixels (défaut : 32) */
  size?: number
  /** Afficher le nom "PrêtImmoPro" à côté de l'icône */
  showName?: boolean
  /** Couleur du texte du nom (défaut : couleur primary Tailwind via classe) */
  nameColor?: string
  /** Classes CSS supplémentaires sur le wrapper */
  className?: string
}

/**
 * Logo PrêtImmoPro — icône SVG inline + nom de marque optionnel.
 *
 * Design identique au favicon (app/icon.tsx) :
 *  – Fond carré arrondi, dégradé bleu #1e3a8a → #2563eb
 *  – Maison blanche (toit triangle + corps rectangle)
 *  – Symbole % bleu marine dans le corps
 *
 * SVG inline = aucune requête réseau, rendu instantané.
 */
export default function Logo({ size = 32, showName = true, nameColor, className = '' }: LogoProps) {
  const r = Math.round(size * 0.2)           // border-radius ~20 %
  const cx = size / 2                        // centre horizontal

  // Toit : triangle centré, pointe à 10 % du haut
  const roofTop  = size * 0.10
  const roofMid  = size * 0.52               // base du toit / haut du corps
  const roofLeft = size * 0.08
  const roofRight= size * 0.92

  // Corps : rectangle sous le toit
  const bodyLeft  = size * 0.18
  const bodyRight = size * 0.82
  const bodyBottom= size * 0.92

  // % centré dans le corps
  const percentY = bodyBottom - (bodyBottom - roofMid) * 0.18
  const fontSize = size * 0.32

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* Fond arrondi */}
        <rect width={size} height={size} rx={r} ry={r} fill="url(#logo-grad)" />

        {/* Toit */}
        <polygon
          points={`${cx},${roofTop} ${roofRight},${roofMid} ${roofLeft},${roofMid}`}
          fill="rgba(255,255,255,0.97)"
        />

        {/* Corps */}
        <rect
          x={bodyLeft}
          y={roofMid - 1}
          width={bodyRight - bodyLeft}
          height={bodyBottom - roofMid + 1}
          rx={size * 0.03}
          fill="rgba(255,255,255,0.97)"
        />

        {/* Symbole % */}
        <text
          x={cx}
          y={percentY}
          textAnchor="middle"
          dominantBaseline="auto"
          fontSize={fontSize}
          fontWeight="900"
          fontFamily="Arial Black, Arial, Helvetica, sans-serif"
          fill="#1e3a8a"
        >
          %
        </text>
      </svg>

      {showName && (
        <span
          className={nameColor ? '' : 'text-primary-700'}
          style={{ fontSize: size * 0.5, fontWeight: 700, lineHeight: 1, color: nameColor }}
        >
          PrêtImmoPro
        </span>
      )}
    </div>
  )
}