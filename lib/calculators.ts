/**
 * Fonctions financières pures — PrêtImmoPro
 * Aucun side-effect, aucune dépendance externe.
 */

// ─── Mensualité d'un prêt amortissable ───────────────────────────────────────

export function calculerMensualite(
  capital: number,
  tauxAnnuel: number,
  dureeAns: number
): number {
  const r = tauxAnnuel / 100 / 12
  const n = dureeAns * 12
  if (r === 0) return capital / n
  return (capital * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
}

// ─── Tableau d'amortissement annuel ──────────────────────────────────────────

export interface LigneAmortissement {
  annee: number
  mensualite: number
  capitalRembourse: number
  interetsPaies: number
  capitalRestant: number
}

export function calculerAmortissement(
  capital: number,
  tauxAnnuel: number,
  dureeAns: number
): LigneAmortissement[] {
  const mensualite = calculerMensualite(capital, tauxAnnuel, dureeAns)
  const r = tauxAnnuel / 100 / 12
  const lignes: LigneAmortissement[] = []
  let solde = capital

  for (let annee = 1; annee <= dureeAns; annee++) {
    let capitalAnnee = 0
    let interetsAnnee = 0

    for (let mois = 0; mois < 12; mois++) {
      const interetsMois = solde * r
      const capitalMois = mensualite - interetsMois
      interetsAnnee += interetsMois
      capitalAnnee += capitalMois
      solde = Math.max(0, solde - capitalMois)
    }

    lignes.push({
      annee,
      mensualite,
      capitalRembourse: capitalAnnee,
      interetsPaies: interetsAnnee,
      capitalRestant: solde,
    })
  }

  return lignes
}

// ─── Capacité d'emprunt ───────────────────────────────────────────────────────

export interface ResultatCapacite {
  mensualiteMax: number
  capitalMax: number
  tauxEndettement: number
  depasseSeuilHCSF: boolean
}

export function calculerCapaciteEmprunt(
  revenusNets: number,
  charges: number,
  tauxAnnuel: number,
  dureeAns: number
): ResultatCapacite {
  const mensualiteMax = revenusNets * 0.33 - charges
  const r = tauxAnnuel / 100 / 12
  const n = dureeAns * 12

  let capitalMax = 0
  if (r === 0) {
    capitalMax = mensualiteMax * n
  } else {
    capitalMax = (mensualiteMax * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n))
  }

  const tauxEndettement = ((mensualiteMax + charges) / revenusNets) * 100

  return {
    mensualiteMax: Math.max(0, mensualiteMax),
    capitalMax: Math.max(0, capitalMax),
    tauxEndettement,
    depasseSeuilHCSF: tauxEndettement > 35,
  }
}

// ─── Frais de notaire (barème 2024) ───────────────────────────────────────────

export interface ResultatFraisNotaire {
  droitsMutation: number
  emolumentsNotaire: number
  csi: number
  debours: number
  total: number
  tauxEffectif: number
}

export function calculerFraisNotaire(
  prixAchat: number,
  typeLogement: 'ancien' | 'neuf',
  _departement: string
): ResultatFraisNotaire {
  // Droits de mutation
  const tauxMutation = typeLogement === 'ancien' ? 0.0580665 : 0.00715
  const droitsMutation = prixAchat * tauxMutation

  // Émoluments notaire HT (barème dégressif 2024)
  const calcEmoluments = (prix: number): number => {
    let em = 0
    if (prix <= 6500) {
      em = prix * 0.03945
    } else if (prix <= 17000) {
      em = 6500 * 0.03945 + (prix - 6500) * 0.01627
    } else if (prix <= 60000) {
      em = 6500 * 0.03945 + (17000 - 6500) * 0.01627 + (prix - 17000) * 0.01085
    } else {
      em =
        6500 * 0.03945 +
        (17000 - 6500) * 0.01627 +
        (60000 - 17000) * 0.01085 +
        (prix - 60000) * 0.00814
    }
    return em
  }

  const emolumentsHT = calcEmoluments(prixAchat)
  const emolumentsNotaire = emolumentsHT * 1.2 // TVA 20%

  // Contribution Sécurité Immobilière (0.1% du prix)
  const csi = prixAchat * 0.001

  // Débours (forfait)
  const debours = 800

  const total = droitsMutation + emolumentsNotaire + csi + debours

  return {
    droitsMutation,
    emolumentsNotaire,
    csi,
    debours,
    total,
    tauxEffectif: (total / prixAchat) * 100,
  }
}

// ─── Remboursement anticipé ───────────────────────────────────────────────────

export interface ResultatRemboursementAnticipe {
  economiesInterets: number
  ira: number
  gainNet: number
  nouvelleDuree?: number
  nouvelleMensualite?: number
  delaiRetourIra: number
}

export function calculerRemboursementAnticipe(
  capitalRestant: number,
  mensualiteActuelle: number,
  tauxAnnuel: number,
  dureeRestanteAns: number,
  sommeAnticipee: number,
  mode: 'reduire_duree' | 'reduire_mensualite'
): ResultatRemboursementAnticipe {
  const r = tauxAnnuel / 100 / 12

  // IRA : min(3% du capital remboursé, 6 mensualités × taux mensuel)
  const ira = Math.min(sommeAnticipee * 0.03, 6 * mensualiteActuelle * r)

  const capitalApres = capitalRestant - sommeAnticipee

  // Intérêts totaux avant remboursement anticipé
  const interetsAvant = mensualiteActuelle * dureeRestanteAns * 12 - capitalRestant

  let economiesInterets = 0
  let nouvelleDuree: number | undefined
  let nouvelleMensualite: number | undefined

  if (mode === 'reduire_duree') {
    // On garde la même mensualité, on calcule la nouvelle durée
    if (r === 0) {
      nouvelleDuree = capitalApres / mensualiteActuelle / 12
    } else {
      const n = -Math.log(1 - (capitalApres * r) / mensualiteActuelle) / Math.log(1 + r)
      nouvelleDuree = n / 12
    }
    const interetsApres = mensualiteActuelle * (nouvelleDuree * 12) - capitalApres
    economiesInterets = Math.max(0, interetsAvant - interetsApres)
  } else {
    // On garde la même durée, on calcule la nouvelle mensualité
    nouvelleMensualite = calculerMensualite(capitalApres, tauxAnnuel, dureeRestanteAns)
    const interetsApres = nouvelleMensualite * dureeRestanteAns * 12 - capitalApres
    economiesInterets = Math.max(0, interetsAvant - interetsApres)
  }

  const gainNet = economiesInterets - ira

  // Délai de retour de l'IRA en mois
  const economieMensuelle = economiesInterets / (dureeRestanteAns * 12)
  const delaiRetourIra = economieMensuelle > 0 ? Math.ceil(ira / economieMensuelle) : 0

  return {
    economiesInterets,
    ira,
    gainNet,
    nouvelleDuree,
    nouvelleMensualite,
    delaiRetourIra,
  }
}

// ─── Utilitaire formatage ─────────────────────────────────────────────────────

export function formatEuros(valeur: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(valeur)
}

export function formatPourcent(valeur: number, decimales = 2): string {
  return `${valeur.toFixed(decimales)} %`
}
