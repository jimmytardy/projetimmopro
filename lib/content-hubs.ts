/** Catégories alignées sur le frontmatter MDX `category`. */
export type ArticleCategory = 'Financement' | 'Dossier' | 'Aides' | 'Marché'

export const CONTENT_HUB_SLUGS = ['financement', 'dossier', 'aides', 'marche'] as const
export type ContentHubSlug = (typeof CONTENT_HUB_SLUGS)[number]

export const HUB_TO_CATEGORY: Record<ContentHubSlug, ArticleCategory> = {
  financement: 'Financement',
  dossier: 'Dossier',
  aides: 'Aides',
  marche: 'Marché',
}

/** Liens outils par clé (href logique next-intl). */
export const TOOL_KEY_TO_HREF = {
  loanSimulatorName: '/simulateur-pret',
  borrowingCapacityName: '/capacite-emprunt',
  notaryFeesName: '/frais-notaire',
  earlyRepaymentName: '/remboursement-anticipe',
  fixedVsVariableName: '/taux-fixe-vs-variable',
  ratesByCityName: '/taux-immobilier',
} as const

export type HubToolLabelKey = keyof typeof TOOL_KEY_TO_HREF

/** Outils à mettre en avant sur chaque pilier (clés namespace `tools`). */
export const HUB_TOOL_LABEL_KEYS: Record<ContentHubSlug, readonly HubToolLabelKey[]> = {
  financement: ['loanSimulatorName', 'borrowingCapacityName', 'fixedVsVariableName', 'ratesByCityName'],
  dossier: ['loanSimulatorName', 'borrowingCapacityName', 'notaryFeesName'],
  aides: ['notaryFeesName', 'loanSimulatorName', 'borrowingCapacityName'],
  marche: ['ratesByCityName', 'borrowingCapacityName', 'loanSimulatorName'],
}

export function isContentHubSlug(s: string): s is ContentHubSlug {
  return (CONTENT_HUB_SLUGS as readonly string[]).includes(s)
}
