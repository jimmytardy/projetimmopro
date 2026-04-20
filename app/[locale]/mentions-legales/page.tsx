import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site PrêtImmoPro : éditeur, hébergeur, propriété intellectuelle et responsabilité.',
  robots: { index: true, follow: false },
}

const LAST_UPDATED = '2026-04-20'

const SECTIONS = [
  { id: 'editeur',        title: '1. Éditeur du site' },
  { id: 'hebergement',    title: '2. Hébergement' },
  { id: 'propriete',      title: '3. Propriété intellectuelle' },
  { id: 'responsabilite', title: '4. Limitation de responsabilité' },
  { id: 'liens',          title: '5. Liens hypertextes' },
  { id: 'droit',          title: '6. Droit applicable' },
  { id: 'contact',        title: '7. Contact' },
]

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" lastUpdated={LAST_UPDATED} sections={SECTIONS}>

      <div className="legal-notice">
        Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004
        pour la Confiance dans l'économie numérique (LCEN), les présentes mentions légales sont
        portées à la connaissance des utilisateurs et visiteurs du site <strong>pretimmopro.fr</strong>.
      </div>

      {/* 1 */}
      <h2 id="editeur">1. Éditeur du site</h2>
      <p>
        Le site <strong>PrêtImmoPro</strong> (accessible à l'adresse <strong>https://pretimmopro.fr</strong>)
        est édité par un particulier en tant que service d'information gratuit et indépendant.
      </p>
      <ul>
        <li><strong>Dénomination :</strong> PrêtImmoPro</li>
        <li><strong>Statut :</strong> Personne physique — éditeur non professionnel</li>
        <li>
          <strong>Directeur de la publication :</strong>{' '}
          Le responsable du site (coordonnées disponibles sur demande à l'adresse ci-dessous)
        </li>
        <li><strong>Contact :</strong> <a href="mailto:contact@pretimmopro.fr">contact@pretimmopro.fr</a></li>
      </ul>
      <p>
        PrêtImmoPro est un site d'information et de simulation à destination des particuliers.
        Il ne constitue pas un établissement de crédit, un intermédiaire en opérations de banque
        (IOBSP), un conseiller en investissement financier (CIF) ni un prestataire de services
        d'investissement. Aucune des informations présentes sur ce site ne constitue un conseil
        financier ou une offre de crédit.
      </p>

      {/* 2 */}
      <h2 id="hebergement">2. Hébergement</h2>
      <p>Le site est hébergé par :</p>
      <ul>
        <li><strong>Société :</strong> OVH SAS</li>
        <li><strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France</li>
        <li><strong>RCS :</strong> Roubaix-Tourcoing 424 761 419 00045</li>
        <li><strong>Site web :</strong> <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer">https://www.ovhcloud.com</a></li>
        <li><strong>Type :</strong> Serveur Privé Virtuel (VPS) — infrastructure localisée en France</li>
      </ul>
      <p>
        Les serveurs OVH utilisés pour le présent site sont hébergés en France, dans les
        centres de données d'OVH conformes aux normes ISO 27001. Les données de navigation
        sont traitées conformément à la politique de confidentialité d'OVH, disponible sur
        leur site.
      </p>

      {/* 3 */}
      <h2 id="propriete">3. Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments constituant le site PrêtImmoPro — structure, design, textes,
        algorithmes de calcul, logotypes, icônes, et tout autre contenu — est la propriété
        exclusive de l'éditeur, sauf mention contraire explicite.
      </p>
      <p>
        Toute reproduction, représentation, modification, publication, adaptation totale ou
        partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est
        interdite sans l'autorisation écrite préalable de l'éditeur, conformément aux
        articles L.122-4 et suivants du Code de la propriété intellectuelle.
      </p>
      <p>
        Les formules mathématiques utilisées dans les simulateurs (calcul de mensualité,
        d'amortissement, de capacité d'emprunt, de frais de notaire) sont des formules
        financières standard du domaine public. Leur implémentation sous forme de code
        informatique est en revanche protégée par le droit d'auteur.
      </p>

      {/* 4 */}
      <h2 id="responsabilite">4. Limitation de responsabilité</h2>
      <p>
        PrêtImmoPro s'efforce de fournir des informations et des résultats de simulation
        aussi précis que possible. Cependant, l'éditeur ne peut garantir l'exactitude,
        l'exhaustivité ou la pertinence des informations diffusées sur ce site.
      </p>
      <p>
        Les simulations produites par les outils du site sont <strong>indicatives</strong> et
        ne constituent en aucun cas une offre de crédit, une proposition commerciale, ni
        un engagement de la part d'un établissement financier. Les résultats obtenus peuvent
        différer significativement des offres réelles proposées par les banques, qui disposent
        de leurs propres critères d'analyse et de tarification.
      </p>
      <p>
        L'éditeur ne saurait être tenu responsable :
      </p>
      <ul>
        <li>Des décisions financières prises sur la base des informations ou simulations du site ;</li>
        <li>Des interruptions, indisponibilités ou dysfonctionnements techniques du site ;</li>
        <li>De l'utilisation frauduleuse ou détournée des outils mis à disposition ;</li>
        <li>Des dommages directs ou indirects résultant de l'accès ou de l'utilisation du site.</li>
      </ul>

      {/* 5 */}
      <h2 id="liens">5. Liens hypertextes</h2>
      <p>
        Le site PrêtImmoPro peut contenir des liens vers des sites tiers. Ces liens sont
        fournis à titre informatif. L'éditeur n'exerce aucun contrôle sur le contenu de ces
        sites et décline toute responsabilité quant à leur disponibilité, exactitude ou
        conformité à la réglementation en vigueur.
      </p>
      <p>
        La création de liens hypertextes pointant vers le site PrêtImmoPro est libre sous
        réserve de ne pas utiliser des techniques de présentation trompeuses (inline frame,
        deep linking masqué) et d'informer l'éditeur par email.
      </p>

      {/* 6 */}
      <h2 id="droit">6. Droit applicable et juridiction</h2>
      <p>
        Les présentes mentions légales sont régies par le droit français. En cas de litige,
        les tribunaux français seront seuls compétents.
      </p>
      <p>
        Conformément à l'article L.612-1 du Code de la consommation, tout consommateur a le
        droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution
        amiable du litige qui l'oppose à un professionnel.
      </p>

      {/* 7 */}
      <h2 id="contact">7. Contact</h2>
      <p>
        Pour toute question relative aux présentes mentions légales, ou pour exercer vos
        droits relatifs à vos données personnelles (voir notre{' '}
        <a href="/politique-confidentialite">Politique de confidentialité</a>),
        vous pouvez nous contacter :
      </p>
      <ul>
        <li><strong>Par email :</strong> <a href="mailto:contact@pretimmopro.fr">contact@pretimmopro.fr</a></li>
        <li><strong>Délai de réponse :</strong> sous 30 jours ouvrés</li>
      </ul>

    </LegalLayout>
  )
}
