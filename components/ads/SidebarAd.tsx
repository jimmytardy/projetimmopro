'use client'

import { useEffect, useRef, useState } from 'react'

interface SidebarAdProps {
  slot: string
  side: 'left' | 'right'
}

declare global {
  interface Window { adsbygoogle: unknown[] }
}

const AD_WIDTH  = 160
const AD_HEIGHT = 600

export default function SidebarAd({ slot, side }: SidebarAdProps) {
  const insRef  = useRef<HTMLDivElement>(null)
  const [pushed, setPushed] = useState(false)
  const isDev   = process.env.NODE_ENV !== 'production'

  useEffect(() => {
    if (pushed || isDev || !insRef.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      setPushed(true)
    } catch {
      // AdSense non chargé (bloqueur pub, pré-prod, etc.)
    }
  }, [pushed, isDev])

  return (
    <div
      style={{ width: AD_WIDTH, height: AD_HEIGHT }}
      aria-label={`Publicité ${side === 'left' ? 'gauche' : 'droite'}`}
    >
      {isDev ? (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded text-gray-400 text-xs font-medium gap-1">
          <span className="font-bold">Skyscraper</span>
          <span className="opacity-50 text-[10px] text-center px-1 break-all">{slot}</span>
          <span className="opacity-40">{AD_WIDTH}×{AD_HEIGHT}</span>
        </div>
      ) : (
        <div ref={insRef}>
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: AD_WIDTH, height: AD_HEIGHT }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? 'ca-pub-XXXXXXXXXXXXXXXX'}
            data-ad-slot={slot}
          />
        </div>
      )}
    </div>
  )
}
