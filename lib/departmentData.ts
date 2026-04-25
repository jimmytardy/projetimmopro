/**
 * Données par département français (96 départements métropolitains + Corse).
 * Utilisées pour estimer le prix m² et la zone PTZ d'une ville non référencée.
 *
 * Détail par commune : agrégat interne des transactions DVF 2025. Moyennes départementales :
 * références marché indicatives (MeilleursAgents, Notaires de France, etc.).
 * Les prix sont des moyennes départementales — la ville réelle peut varier de ±30 %.
 */

export type PtzZone = 'Abis' | 'A' | 'B1' | 'B2' | 'C'

export interface DepartmentData {
  nom: string
  avgPriceM2: number       // Prix moyen €/m² toutes surfaces
  ptzZone: PtzZone         // Zone PTZ dominante du département
  rateAdjust: number       // Écart par rapport au taux national moyen (points %)
}

export const DEPARTMENT_DATA: Record<string, DepartmentData> = {
  '01': { nom: 'Ain',                       avgPriceM2: 2800, ptzZone: 'B1', rateAdjust:  0.05 },
  '02': { nom: 'Aisne',                     avgPriceM2: 1600, ptzZone: 'C',  rateAdjust:  0.08 },
  '03': { nom: 'Allier',                    avgPriceM2: 1400, ptzZone: 'C',  rateAdjust:  0.10 },
  '04': { nom: 'Alpes-de-Haute-Provence',   avgPriceM2: 2200, ptzZone: 'B2', rateAdjust:  0.07 },
  '05': { nom: 'Hautes-Alpes',              avgPriceM2: 2800, ptzZone: 'B2', rateAdjust:  0.06 },
  '06': { nom: 'Alpes-Maritimes',           avgPriceM2: 5200, ptzZone: 'A',  rateAdjust: -0.03 },
  '07': { nom: 'Ardèche',                   avgPriceM2: 1900, ptzZone: 'C',  rateAdjust:  0.08 },
  '08': { nom: 'Ardennes',                  avgPriceM2: 1300, ptzZone: 'C',  rateAdjust:  0.12 },
  '09': { nom: 'Ariège',                    avgPriceM2: 1500, ptzZone: 'C',  rateAdjust:  0.10 },
  '10': { nom: 'Aube',                      avgPriceM2: 1800, ptzZone: 'C',  rateAdjust:  0.08 },
  '11': { nom: 'Aude',                      avgPriceM2: 2000, ptzZone: 'B2', rateAdjust:  0.07 },
  '12': { nom: 'Aveyron',                   avgPriceM2: 1600, ptzZone: 'C',  rateAdjust:  0.09 },
  '13': { nom: 'Bouches-du-Rhône',          avgPriceM2: 3400, ptzZone: 'A',  rateAdjust:  0.02 },
  '14': { nom: 'Calvados',                  avgPriceM2: 2600, ptzZone: 'B1', rateAdjust:  0.05 },
  '15': { nom: 'Cantal',                    avgPriceM2: 1200, ptzZone: 'C',  rateAdjust:  0.12 },
  '16': { nom: 'Charente',                  avgPriceM2: 1700, ptzZone: 'C',  rateAdjust:  0.09 },
  '17': { nom: 'Charente-Maritime',         avgPriceM2: 3200, ptzZone: 'B2', rateAdjust:  0.04 },
  '18': { nom: 'Cher',                      avgPriceM2: 1500, ptzZone: 'C',  rateAdjust:  0.10 },
  '19': { nom: 'Corrèze',                   avgPriceM2: 1400, ptzZone: 'C',  rateAdjust:  0.10 },
  '21': { nom: "Côte-d'Or",                 avgPriceM2: 2700, ptzZone: 'B1', rateAdjust:  0.05 },
  '22': { nom: "Côtes-d'Armor",             avgPriceM2: 2000, ptzZone: 'B2', rateAdjust:  0.07 },
  '23': { nom: 'Creuse',                    avgPriceM2:  800, ptzZone: 'C',  rateAdjust:  0.15 },
  '24': { nom: 'Dordogne',                  avgPriceM2: 1600, ptzZone: 'C',  rateAdjust:  0.09 },
  '25': { nom: 'Doubs',                     avgPriceM2: 2400, ptzZone: 'B1', rateAdjust:  0.06 },
  '26': { nom: 'Drôme',                     avgPriceM2: 2400, ptzZone: 'B1', rateAdjust:  0.06 },
  '27': { nom: 'Eure',                      avgPriceM2: 2000, ptzZone: 'B2', rateAdjust:  0.07 },
  '28': { nom: 'Eure-et-Loir',              avgPriceM2: 2000, ptzZone: 'B1', rateAdjust:  0.07 },
  '29': { nom: 'Finistère',                 avgPriceM2: 2300, ptzZone: 'B2', rateAdjust:  0.06 },
  '2A': { nom: 'Corse-du-Sud',              avgPriceM2: 4500, ptzZone: 'B2', rateAdjust:  0.02 },
  '2B': { nom: 'Haute-Corse',               avgPriceM2: 3000, ptzZone: 'B2', rateAdjust:  0.04 },
  '30': { nom: 'Gard',                      avgPriceM2: 2600, ptzZone: 'B1', rateAdjust:  0.05 },
  '31': { nom: 'Haute-Garonne',             avgPriceM2: 3800, ptzZone: 'B1', rateAdjust:  0.02 },
  '32': { nom: 'Gers',                      avgPriceM2: 1600, ptzZone: 'C',  rateAdjust:  0.09 },
  '33': { nom: 'Gironde',                   avgPriceM2: 4600, ptzZone: 'B1', rateAdjust:  0.01 },
  '34': { nom: 'Hérault',                   avgPriceM2: 3500, ptzZone: 'B1', rateAdjust:  0.03 },
  '35': { nom: 'Ille-et-Vilaine',           avgPriceM2: 3600, ptzZone: 'B1', rateAdjust:  0.03 },
  '36': { nom: 'Indre',                     avgPriceM2: 1200, ptzZone: 'C',  rateAdjust:  0.12 },
  '37': { nom: 'Indre-et-Loire',            avgPriceM2: 2700, ptzZone: 'B1', rateAdjust:  0.05 },
  '38': { nom: 'Isère',                     avgPriceM2: 3100, ptzZone: 'B1', rateAdjust:  0.04 },
  '39': { nom: 'Jura',                      avgPriceM2: 1700, ptzZone: 'C',  rateAdjust:  0.09 },
  '40': { nom: 'Landes',                    avgPriceM2: 3000, ptzZone: 'B2', rateAdjust:  0.04 },
  '41': { nom: 'Loir-et-Cher',              avgPriceM2: 1800, ptzZone: 'B2', rateAdjust:  0.08 },
  '42': { nom: 'Loire',                     avgPriceM2: 2000, ptzZone: 'B1', rateAdjust:  0.07 },
  '43': { nom: 'Haute-Loire',               avgPriceM2: 1500, ptzZone: 'C',  rateAdjust:  0.10 },
  '44': { nom: 'Loire-Atlantique',          avgPriceM2: 4000, ptzZone: 'B1', rateAdjust:  0.02 },
  '45': { nom: 'Loiret',                    avgPriceM2: 2300, ptzZone: 'B1', rateAdjust:  0.06 },
  '46': { nom: 'Lot',                       avgPriceM2: 1800, ptzZone: 'C',  rateAdjust:  0.08 },
  '47': { nom: 'Lot-et-Garonne',            avgPriceM2: 1700, ptzZone: 'C',  rateAdjust:  0.09 },
  '48': { nom: 'Lozère',                    avgPriceM2: 1400, ptzZone: 'C',  rateAdjust:  0.11 },
  '49': { nom: 'Maine-et-Loire',            avgPriceM2: 2500, ptzZone: 'B1', rateAdjust:  0.06 },
  '50': { nom: 'Manche',                    avgPriceM2: 1900, ptzZone: 'B2', rateAdjust:  0.08 },
  '51': { nom: 'Marne',                     avgPriceM2: 2300, ptzZone: 'B1', rateAdjust:  0.06 },
  '52': { nom: 'Haute-Marne',               avgPriceM2: 1300, ptzZone: 'C',  rateAdjust:  0.12 },
  '53': { nom: 'Mayenne',                   avgPriceM2: 1900, ptzZone: 'B2', rateAdjust:  0.08 },
  '54': { nom: 'Meurthe-et-Moselle',        avgPriceM2: 2100, ptzZone: 'B1', rateAdjust:  0.07 },
  '55': { nom: 'Meuse',                     avgPriceM2: 1300, ptzZone: 'C',  rateAdjust:  0.12 },
  '56': { nom: 'Morbihan',                  avgPriceM2: 2800, ptzZone: 'B2', rateAdjust:  0.05 },
  '57': { nom: 'Moselle',                   avgPriceM2: 2000, ptzZone: 'B1', rateAdjust:  0.07 },
  '58': { nom: 'Nièvre',                    avgPriceM2: 1200, ptzZone: 'C',  rateAdjust:  0.12 },
  '59': { nom: 'Nord',                      avgPriceM2: 2800, ptzZone: 'B1', rateAdjust:  0.05 },
  '60': { nom: 'Oise',                      avgPriceM2: 2600, ptzZone: 'B1', rateAdjust:  0.05 },
  '61': { nom: 'Orne',                      avgPriceM2: 1600, ptzZone: 'C',  rateAdjust:  0.10 },
  '62': { nom: 'Pas-de-Calais',             avgPriceM2: 2100, ptzZone: 'B1', rateAdjust:  0.07 },
  '63': { nom: 'Puy-de-Dôme',              avgPriceM2: 2200, ptzZone: 'B1', rateAdjust:  0.07 },
  '64': { nom: 'Pyrénées-Atlantiques',      avgPriceM2: 3400, ptzZone: 'B1', rateAdjust:  0.03 },
  '65': { nom: 'Hautes-Pyrénées',           avgPriceM2: 1900, ptzZone: 'B2', rateAdjust:  0.08 },
  '66': { nom: 'Pyrénées-Orientales',       avgPriceM2: 2800, ptzZone: 'B1', rateAdjust:  0.05 },
  '67': { nom: 'Bas-Rhin',                  avgPriceM2: 3500, ptzZone: 'B1', rateAdjust:  0.03 },
  '68': { nom: 'Haut-Rhin',                 avgPriceM2: 2900, ptzZone: 'B1', rateAdjust:  0.04 },
  '69': { nom: 'Rhône',                     avgPriceM2: 5000, ptzZone: 'A',  rateAdjust: -0.02 },
  '70': { nom: 'Haute-Saône',               avgPriceM2: 1500, ptzZone: 'C',  rateAdjust:  0.10 },
  '71': { nom: 'Saône-et-Loire',            avgPriceM2: 1600, ptzZone: 'C',  rateAdjust:  0.09 },
  '72': { nom: 'Sarthe',                    avgPriceM2: 2100, ptzZone: 'B1', rateAdjust:  0.07 },
  '73': { nom: 'Savoie',                    avgPriceM2: 4200, ptzZone: 'B1', rateAdjust:  0.01 },
  '74': { nom: 'Haute-Savoie',              avgPriceM2: 5500, ptzZone: 'A',  rateAdjust: -0.02 },
  '75': { nom: 'Paris',                     avgPriceM2: 9800, ptzZone: 'Abis', rateAdjust: -0.10 },
  '76': { nom: 'Seine-Maritime',            avgPriceM2: 2400, ptzZone: 'B1', rateAdjust:  0.06 },
  '77': { nom: 'Seine-et-Marne',            avgPriceM2: 2900, ptzZone: 'B1', rateAdjust:  0.04 },
  '78': { nom: 'Yvelines',                  avgPriceM2: 3800, ptzZone: 'Abis', rateAdjust: 0.01 },
  '79': { nom: 'Deux-Sèvres',               avgPriceM2: 1700, ptzZone: 'C',  rateAdjust:  0.09 },
  '80': { nom: 'Somme',                     avgPriceM2: 2000, ptzZone: 'B1', rateAdjust:  0.07 },
  '81': { nom: 'Tarn',                      avgPriceM2: 2000, ptzZone: 'B2', rateAdjust:  0.07 },
  '82': { nom: 'Tarn-et-Garonne',           avgPriceM2: 1900, ptzZone: 'B2', rateAdjust:  0.08 },
  '83': { nom: 'Var',                       avgPriceM2: 4500, ptzZone: 'A',  rateAdjust:  0.00 },
  '84': { nom: 'Vaucluse',                  avgPriceM2: 2900, ptzZone: 'B1', rateAdjust:  0.04 },
  '85': { nom: 'Vendée',                    avgPriceM2: 2800, ptzZone: 'B2', rateAdjust:  0.05 },
  '86': { nom: 'Vienne',                    avgPriceM2: 1900, ptzZone: 'B2', rateAdjust:  0.08 },
  '87': { nom: 'Haute-Vienne',              avgPriceM2: 1700, ptzZone: 'B2', rateAdjust:  0.09 },
  '88': { nom: 'Vosges',                    avgPriceM2: 1500, ptzZone: 'C',  rateAdjust:  0.10 },
  '89': { nom: 'Yonne',                     avgPriceM2: 1700, ptzZone: 'C',  rateAdjust:  0.09 },
  '90': { nom: 'Territoire de Belfort',     avgPriceM2: 2100, ptzZone: 'B1', rateAdjust:  0.07 },
  '91': { nom: 'Essonne',                   avgPriceM2: 3200, ptzZone: 'A',  rateAdjust:  0.03 },
  '92': { nom: 'Hauts-de-Seine',            avgPriceM2: 7500, ptzZone: 'Abis', rateAdjust: -0.05 },
  '93': { nom: 'Seine-Saint-Denis',         avgPriceM2: 3800, ptzZone: 'Abis', rateAdjust: 0.02 },
  '94': { nom: 'Val-de-Marne',              avgPriceM2: 5500, ptzZone: 'Abis', rateAdjust: -0.02 },
  '95': { nom: "Val-d'Oise",                avgPriceM2: 3100, ptzZone: 'A',  rateAdjust:  0.03 },
}

const FALLBACK: DepartmentData = {
  nom: 'France',
  avgPriceM2: 2500,
  ptzZone: 'B2',
  rateAdjust: 0.05,
}

export function getDepartmentData(deptCode: string): DepartmentData {
  return DEPARTMENT_DATA[deptCode] ?? FALLBACK
}

export const PTZ_ZONE_LABELS: Record<PtzZone, string> = {
  Abis: 'Zone A bis (très tendue)',
  A:    'Zone A (tendue)',
  B1:   'Zone B1 (intermédiaire)',
  B2:   'Zone B2 (modérée)',
  C:    'Zone C (détendue)',
}
