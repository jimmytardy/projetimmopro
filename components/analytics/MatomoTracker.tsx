'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    _paq: unknown[][]
  }
}

/**
 * MatomoTracker — Suivi d'audience respectueux de la vie privée.
 *
 * ── Pourquoi Matomo plutôt que Google Analytics ? ───────────────────────────
 *  • Auto-hébergeable : les données restent sur votre serveur, aucun transfert
 *    vers des tiers hors UE.
 *  • Exemption CNIL possible : avec la configuration ci-dessous (anonymisation
 *    IP + cookies désactivés), le bandeau de consentement est facultatif
 *    selon les recommandations CNIL du 19 juin 2023.
 *
 * ── Configuration requise côté Matomo ───────────────────────────────────────
 *  1. Anonymisation IP : Paramètres → Vie privée → Anonymiser les IP (masquer 2 octets)
 *  2. Cookies désactivés (ligne disableCookies ci-dessous)
 *  3. Durée de conservation des données : ≤ 13 mois
 *
 * ── Variables d'environnement requises ──────────────────────────────────────
 *  NEXT_PUBLIC_MATOMO_URL      https://analytics.votredomaine.fr  (sans slash final)
 *  NEXT_PUBLIC_MATOMO_SITE_ID  1
 *
 * ── Comportement ────────────────────────────────────────────────────────────
 *  • Le script Matomo est chargé une seule fois au montage du composant.
 *  • Chaque changement de pathname (navigation SPA) déclenche un trackPageView.
 *  • En développement : aucun script chargé, les pushes sont loggés en console.
 *  • Respecte Do Not Track (DNT) du navigateur.
 */
export default function MatomoTracker() {
  const pathname   = usePathname()
  const initialized = useRef(false)

  const matomoUrl    = process.env.NEXT_PUBLIC_MATOMO_URL
  const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID
  const isDev        = process.env.NODE_ENV !== 'production'

  // ── Initialisation (une seule fois) ────────────────────────────────────────
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    if (isDev) {
      console.info('[Matomo] Mode développement — tracking désactivé.')
      return
    }

    if (!matomoUrl || !matomoSiteId) {
      console.warn('[Matomo] NEXT_PUBLIC_MATOMO_URL ou NEXT_PUBLIC_MATOMO_SITE_ID manquant.')
      return
    }

    // Respecter Do Not Track
    if (navigator.doNotTrack === '1' || (window as Window & { doNotTrack?: string }).doNotTrack === '1') {
      console.info('[Matomo] Do Not Track détecté — tracking désactivé.')
      return
    }

    const _paq = (window._paq = window._paq || [])

    _paq.push(['setTrackerUrl',  `${matomoUrl}/matomo.php`])
    _paq.push(['setSiteId',      matomoSiteId])
    _paq.push(['disableCookies'])                    // ← Exemption CNIL
    _paq.push(['setDoNotTrack',  true])
    _paq.push(['enableLinkTracking'])

    // Chargement asynchrone du script Matomo
    const script   = document.createElement('script')
    script.async   = true
    script.src     = `${matomoUrl}/matomo.js`
    script.onerror = () => console.warn('[Matomo] Impossible de charger matomo.js')
    document.head.appendChild(script)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Suivi des changements de page (navigation SPA) ─────────────────────────
  useEffect(() => {
    if (!initialized.current) return

    if (isDev) {
      console.info(`[Matomo] trackPageView → ${pathname}`)
      return
    }

    if (!matomoUrl || !matomoSiteId) return

    const _paq = (window._paq = window._paq || [])
    _paq.push(['setCustomUrl', window.location.href])
    _paq.push(['setDocumentTitle', document.title])
    _paq.push(['trackPageView'])
  }, [pathname, isDev, matomoUrl, matomoSiteId])

  // Composant purement comportemental — aucun rendu DOM
  return null
}
