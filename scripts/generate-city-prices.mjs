#!/usr/bin/env node
/**
 * generate-city-prices.mjs
 *
 * Transforme le fichier DVF (pipe-separated) en JSON indexé par **code INSEE commune**
 * (ex. "38185" pour Grenoble) — une seule entrée par commune : toutes les ventes
 * (tous codes postaux : 38000, 38100, etc.) alimentent les mêmes médianes.
 * Le millésime suit le fichier source (ex. ValeursFoncieres-2025.txt → ventes enregistrées en 2025).
 *
 * Usage :
 *   node scripts/generate-city-prices.mjs
 *   node scripts/generate-city-prices.mjs --input public/ValeursFoncieres-2025.txt --output public/city-prices.json
 *
 * Nombre total de lignes (progression tous les 5 %) :
 *   - détection automatique via `wc -l` si disponible ;
 *   - sinon variable d'environnement DVF_LINE_COUNT=12345678 ;
 *   - sinon estimation à partir de la taille du fichier (affichage "lignes ~estim.").
 *
 * Colonnes DVF (index 0-based) : voir constante C ci-dessous.
 */

import fs         from 'fs'
import path       from 'path'
import readline   from 'readline'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── Arguments CLI ────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const getArg = (flag) => {
  const idx = args.indexOf(flag)
  return idx !== -1 ? args[idx + 1] : null
}

const INPUT  = getArg('--input')  ?? path.join(__dirname, '../public/ValeursFonciere.txt')
const OUTPUT = getArg('--output') ?? path.join(__dirname, '../public/city-prices.json')

// ─── Indices de colonnes ──────────────────────────────────────────────────────

const C = {
  ART1:    2,
  ART5:    6,
  DATE:    8,
  NATURE:  9,
  PRIX:    10,
  CP:      16,
  COMMUNE: 17,
  DEPT:    18,
  CODE_C:  19,
  TYPE_L:  36,
  SURF:    38,
}

// ─── Code INSEE ───────────────────────────────────────────────────────────────

function buildInsee(dept, codeCommune) {
  const d = String(dept).trim()
  const c = String(codeCommune).trim().padStart(3, '0')
  return d + c
}

// ─── Structures de données ────────────────────────────────────────────────────

/**
 * Agrégation par commune (code INSEE) uniquement — pas par code postal.
 * @type {Map<string, {
 *   nom: string,
 *   dept: string,
 *   cps: Set<string>,
 *   aptAnc: number[],
 *   maiAnc: number[],
 *   aptNeuf: number[],
 *   maiNeuf: number[],
 * }>}
 */
const byCommune = new Map()

function getCommune(insee, nom, dept) {
  if (!byCommune.has(insee)) {
    byCommune.set(insee, {
      nom:  nom.trim(),
      dept: String(dept).trim(),
      cps:  new Set(),
      aptAnc:  [],
      maiAnc:  [],
      aptNeuf: [],
      maiNeuf: [],
    })
  }
  return byCommune.get(insee)
}

// ─── Utilitaires ──────────────────────────────────────────────────────────────

function isNeuf(cols) {
  for (let i = C.ART1; i <= C.ART5; i++) {
    if (cols[i] && cols[i].startsWith('257')) return true
  }
  return false
}

function parsePrix(str) {
  return parseFloat(String(str).replace(',', '.').replace(/\s/g, '')) || 0
}

function median(arr) {
  if (!arr.length) return null
  const s = [...arr].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2)
}

/** Tente wc -l ; sinon DVF_LINE_COUNT ; sinon null */
function resolveTotalLines(filePath) {
  const env = process.env.DVF_LINE_COUNT
  if (env) {
    const n = parseInt(env, 10)
    if (!Number.isNaN(n) && n > 0) return n
  }
  try {
    const r = spawnSync('wc', ['-l', filePath], {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024,
    })
    if (r.error || r.status !== 0) return null
    const m = /^\s*(\d+)/.exec(r.stdout)
    if (m) {
      const n = parseInt(m[1], 10)
      if (!Number.isNaN(n) && n > 0) return n
    }
  } catch {
    /* ignore */
  }
  return null
}

// ─── Traitement des groupes (mutations) ───────────────────────────────────────

function processGroup(group) {
  const biens = []

  for (const cols of group) {
    const typeLocal = cols[C.TYPE_L]
    if (typeLocal !== 'Maison' && typeLocal !== 'Appartement') continue

    const surface = parseFloat(cols[C.SURF]) || 0
    if (surface < 9) continue

    const prix = parsePrix(cols[C.PRIX])
    if (prix < 10_000) continue

    biens.push({ cols, typeLocal, surface, prix })
  }

  if (biens.length !== 1) return

  const { cols, typeLocal, surface, prix } = biens[0]

  const prixM2 = prix / surface
  if (prixM2 < 500 || prixM2 > 30_000) return

  const dept   = cols[C.DEPT]
  const codeC  = cols[C.CODE_C]
  const insee  = buildInsee(dept, codeC)
  const nom    = cols[C.COMMUNE]
  const cpRaw  = cols[C.CP]?.trim()

  if (!insee || !nom) return

  const row = getCommune(insee, nom, dept)
  if (cpRaw) row.cps.add(cpRaw)

  const neuf = isNeuf(cols)
  const val  = Math.round(prixM2)

  if (typeLocal === 'Appartement') {
    neuf ? row.aptNeuf.push(val) : row.aptAnc.push(val)
  } else {
    neuf ? row.maiNeuf.push(val) : row.maiAnc.push(val)
  }
}

// ─── Progression (tous les 5 %) ───────────────────────────────────────────────

function makeProgressReporter(totalLines, fileSizeBytes) {
  let lastBucket = -1
  let bytesRead  = 0
  const startMs = Date.now()

  return function report(lineNum, extra = {}) {
    bytesRead += extra.lineBytes ?? 0

    let pct
    if (totalLines != null && totalLines > 0) {
      pct = Math.min(100, Math.floor((lineNum / totalLines) * 100))
    } else if (fileSizeBytes > 0 && bytesRead > 10_000) {
      pct = Math.min(100, Math.floor((bytesRead / fileSizeBytes) * 100))
    } else {
      return
    }

    const bucket = Math.min(100, Math.floor(pct / 5) * 5)
    if (bucket <= lastBucket && pct < 100) return
    lastBucket = bucket

    const elapsed = ((Date.now() - startMs) / 1000).toFixed(1)
    const lineStr = lineNum.toLocaleString('fr-FR')
    const totalStr =
      totalLines != null ? totalLines.toLocaleString('fr-FR') : 'n/c'
    const mode =
      totalLines != null
        ? `${bucket}% — ligne ${lineStr} / ${totalStr}`
        : `${bucket}% fichier — ligne ${lineStr}`
    process.stderr.write(`\r  ${mode} — ${elapsed}s    `)
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`❌  Fichier introuvable : ${INPUT}`)
    process.exit(1)
  }

  const stat         = fs.statSync(INPUT)
  const fileSize     = stat.size
  const totalLines   = resolveTotalLines(INPUT)
  const progressNote =
    totalLines != null
      ? `${totalLines.toLocaleString('fr-FR')} lignes (wc ou DVF_LINE_COUNT)`
      : 'total lignes inconnu — progression ~% fichier (posez DVF_LINE_COUNT ou installez wc pour un % exact)'

  console.error(`📂  Lecture : ${INPUT}`)
  console.error(`    ${progressNote}`)

  const startMs = Date.now()
  const report  = makeProgressReporter(totalLines, fileSize)

  const rl = readline.createInterface({
    input: fs.createReadStream(INPUT, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })

  let lineNum        = 0
  let mutations      = 0
  let retenues       = 0
  let currentKey     = null
  let currentGroup   = []

  for await (const line of rl) {
    lineNum++
    const lineBytes = Buffer.byteLength(line, 'utf8') + 1
    report(lineNum, { lineBytes })

    if (lineNum === 1) continue

    const cols = line.split('|')
    if (cols.length < 41) continue

    if (cols[C.NATURE] !== 'Vente') continue

    const prix  = cols[C.PRIX]
    const date  = cols[C.DATE]
    const dept  = cols[C.DEPT]
    const codeC = cols[C.CODE_C]

    if (!prix || !date || !dept || !codeC) continue

    const key = `${date}|${buildInsee(dept, codeC)}|${prix}`

    if (key !== currentKey) {
      if (currentGroup.length > 0) {
        mutations++
        const before = countSamples()
        processGroup(currentGroup)
        const after = countSamples()
        if (after > before) retenues++
      }
      currentKey   = key
      currentGroup = [cols]
    } else {
      currentGroup.push(cols)
    }
  }

  if (currentGroup.length > 0) {
    mutations++
    processGroup(currentGroup)
  }

  report(lineNum, { lineBytes: 0 })
  process.stderr.write(
    `\r  100% — ${lineNum.toLocaleString('fr-FR')} lignes — ${((Date.now() - startMs) / 1000).toFixed(1)}s\n`,
  )

  function countSamples() {
    let s = 0
    for (const c of byCommune.values()) {
      s += c.aptAnc.length + c.maiAnc.length + c.aptNeuf.length + c.maiNeuf.length
    }
    return s
  }

  // ─── JSON de sortie (clés = code INSEE commune) ────────────────────────────
  // Attributs lisibles mais courts : nom, dept, cps[], med_*, nb

  const result = {}
  let skipped = 0

  for (const [insee, data] of byCommune) {
    const med_apt_anc = median(data.aptAnc)
    const med_mai_anc = median(data.maiAnc)
    const med_apt_neuf = median(data.aptNeuf)
    const med_mai_neuf = median(data.maiNeuf)
    const nb =
      data.aptAnc.length +
      data.maiAnc.length +
      data.aptNeuf.length +
      data.maiNeuf.length

    if (nb < 3 || (!med_apt_anc && !med_mai_anc)) {
      skipped++
      continue
    }

    /** @type {Record<string, unknown>} */
    const entry = {
      nom:  data.nom,
      dept: data.dept,
      nb,
    }

    const cps = [...data.cps].sort()
    if (cps.length) entry.cps = cps

    if (med_apt_anc) entry.med_apt_anc = med_apt_anc
    if (med_mai_anc) entry.med_mai_anc = med_mai_anc
    if (med_apt_neuf && data.aptNeuf.length >= 3) entry.med_apt_neuf = med_apt_neuf
    if (med_mai_neuf && data.maiNeuf.length >= 3) entry.med_mai_neuf = med_mai_neuf

    result[insee] = entry
  }

  const json    = JSON.stringify(result)
  const elapsed = ((Date.now() - startMs) / 1000).toFixed(1)

  fs.writeFileSync(OUTPUT, json, 'utf8')

  const sizeKb = (Buffer.byteLength(json, 'utf8') / 1024).toFixed(0)

  console.log(`\n✅  Terminé en ${elapsed}s`)
  console.log(`   Lignes lues         : ${lineNum.toLocaleString('fr-FR')}`)
  console.log(`   Mutations Vente     : ${mutations.toLocaleString('fr-FR')}`)
  console.log(`   Retenues (1 bien)   : ${retenues.toLocaleString('fr-FR')}`)
  console.log(`   Communes dans JSON  : ${Object.keys(result).length.toLocaleString('fr-FR')}`)
  console.log(`   Ignorées (<3 tx)    : ${skipped.toLocaleString('fr-FR')}`)
  console.log(`   Taille JSON         : ${sizeKb} Ko`)
  console.log(`   Fichier             : ${OUTPUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
