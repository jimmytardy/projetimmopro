'use client'

import { useEffect, useRef, useState } from 'react'

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'leaderboard' | 'skyscraper'
  className?: string
}

const MIN_HEIGHTS: Record<string, number> = {
  leaderboard: 90,
  rectangle: 250,
  skyscraper: 600,
  auto: 100,
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const minHeight = MIN_HEIGHTS[format]
  const isDev = process.env.NODE_ENV !== 'production'

  useEffect(() => {
    if (isDev) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [isDev])

  useEffect(() => {
    if (!isVisible || isDev || isLoaded) return

    try {
      const adsbygoogle = window.adsbygoogle || []
      adsbygoogle.push({})
      setIsLoaded(true)
    } catch {
      // AdSense non disponible
    }
  }, [isVisible, isDev, isLoaded])

  if (isDev) {
    return (
      <div
        ref={containerRef}
        className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded text-gray-400 text-sm font-medium ${className}`}
        style={{ minHeight }}
      >
        AdSense [{format}] — slot: {slot}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className} style={{ minHeight }}>
      {isVisible && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? 'ca-pub-XXXXXXXXXXXXXXXX'}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  )
}
