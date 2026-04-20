export interface City {
  slug: string
  nom: string
  departement: string
  tauxMoyen: number
  prixM2: number
  nbCourtiers: number
}

export const CITIES: City[] = [
  { slug: 'paris',      nom: 'Paris',      departement: '75', tauxMoyen: 3.45, prixM2: 9800,  nbCourtiers: 312 },
  { slug: 'lyon',       nom: 'Lyon',       departement: '69', tauxMoyen: 3.52, prixM2: 5200,  nbCourtiers: 156 },
  { slug: 'marseille',  nom: 'Marseille',  departement: '13', tauxMoyen: 3.58, prixM2: 3400,  nbCourtiers: 98  },
  { slug: 'bordeaux',   nom: 'Bordeaux',   departement: '33', tauxMoyen: 3.50, prixM2: 4800,  nbCourtiers: 112 },
  { slug: 'toulouse',   nom: 'Toulouse',   departement: '31', tauxMoyen: 3.48, prixM2: 3900,  nbCourtiers: 134 },
  { slug: 'nantes',     nom: 'Nantes',     departement: '44', tauxMoyen: 3.47, prixM2: 4100,  nbCourtiers: 89  },
  { slug: 'nice',       nom: 'Nice',       departement: '06', tauxMoyen: 3.55, prixM2: 5600,  nbCourtiers: 76  },
  { slug: 'strasbourg', nom: 'Strasbourg', departement: '67', tauxMoyen: 3.51, prixM2: 3600,  nbCourtiers: 67  },
]

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug)
}

export const TAUX_PAR_DUREE: Record<number, number> = {
  10: 3.15,
  15: 3.30,
  20: 3.45,
  25: 3.65,
}
