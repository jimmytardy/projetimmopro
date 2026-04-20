import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "CGU de PrêtImmoPro : conditions d'accès et d'utilisation des simulateurs de prêt immobilier gratuits.",
  robots: { index: true, follow: false },
}

const LAST_UPDATED = '2026-04-20'

const SECTIONS = [
  { id: 'objet',          title: '1. Objet' },
  { id: 'acces',          title: '2. Accès au service' },
  { id: 'utilisation',    title: '3. Utilisation du service' },
  { id: 'simulateurs',    title: '4. Nature des simulateurs' },
  { id: 'publicite',      title: '5. Publicités et liens' },
  { id: 'propriete',      title: '6. Propriété intellectuelle' },
  { id: 'responsabilite', title: '7. Limitation de responsabilité' },
  { id: 'modification',   title: '8. Modification des CGU' },
  { id: 'droit',          title: '9. Droit applicable' },
]

export default function CguPage() {
  return (
    <LegalLayout
      title="Conditions Générales d'Utilisation"
      lastUpdated={LAST_UPDATED}
      sections={SECTIONS}
    >

      <div className="legal-notice">
        En accédant et en utilisant le site <strong>PrêtImmoPro</strong>, vous acceptez sans
        réserve les présentes Conditions Générales d'Utilisation (CGU). Si vous n'acceptez pas
        ces conditions, veuillez ne pas utiliser ce site.
      </div>

      {/* 1 */}
      <h2 id="objet">1. Objet</h2>
      <p>
        Les présentes CGU ont pour objet de définir les conditions d'accès et d'utilisation du
        site <strong>PrêtImmoPro</strong> (ci-après « le Site »), accessible à l'adresse
        <a href="https://pretimmopro.fr"> https://pretimmopro.fr</a>.
      </p>
      <p>
        PrêtImmoPro est un service d'information et de simulation en ligne, gratuit et sans
        inscription, destiné aux particuliers souhaitant évaluer leurs projets d'acquisition
        immobilière en France.
      </p>

      {/* 2 */}
      <h2 id="acces">2. Accès au service</h2>
      <p>
        L'accès au Site est libre et gratuit pour tout utilisateur disposant d'un accès à
        Internet. Aucune inscription, création de compte ou communication de données personnelles
        n'est requise pour utiliser les simulateurs.
      </p>
      <p>
        L'éditeur se réserve le droit de suspendre, modifier ou interrompre l'accès au Site
        à tout moment, notamment pour des opérations de maintenance, sans que cela ne puisse
        engager sa responsabilité.
      </p>
      <p>Les frais d'accès à Internet restent à la charge exclusive de l'utilisateur.</p>

      {/* 3 */}
      <h2 id="utilisation">3. Utilisation du service</h2>
      <p>L'utilisateur s'engage à utiliser le Site conformément aux présentes CGU et à la législation en vigueur. Il s'interdit notamment :</p>
      <ul>
        <li>Toute utilisation frauduleuse, abusive ou susceptible de perturber le fonctionnement du Site ;</li>
        <li>Toute tentative d'accès non autorisé aux systèmes informatiques de l'éditeur ;</li>
        <li>Toute collecte automatisée de données (scraping, crawling intensif) sans autorisation ;</li>
        <li>Toute reproduction ou diffusion des outils à des fins commerciales sans accord préalable ;</li>
        <li>Toute transmission de contenu illicite, diffamatoire, ou portant atteinte aux droits de tiers.</li>
      </ul>

      {/* 4 */}
      <h2 id="simulateurs">4. Nature des simulateurs et portée des résultats</h2>

      <div className="legal-notice">
        <strong>Information importante :</strong> PrêtImmoPro n'est pas un établissement de
        crédit, un intermédiaire en opérations de banque (IOBSP) ni un conseiller financier.
        Les résultats des simulateurs sont fournis à titre <strong>indicatif et pédagogique uniquement</strong>.
      </div>

      <p>
        Les outils de simulation proposés sur le Site (simulateur de prêt, calculateur de
        capacité d'emprunt, calculateur de frais de notaire, comparateur taux fixe/variable,
        outil de remboursement anticipé) utilisent des formules mathématiques financières
        standard basées sur les données saisies par l'utilisateur.
      </p>

      <h3>Ce que les simulations ne prennent pas en compte</h3>
      <p>Les résultats obtenus ne reflètent pas nécessairement les offres réelles du marché, car ils ne tiennent pas compte :</p>
      <ul>
        <li>Du profil de risque spécifique de chaque emprunteur (score bancaire, historique de crédit) ;</li>
        <li>Des politiques commerciales et critères d'octroi propres à chaque établissement bancaire ;</li>
        <li>Des frais annexes variables (garantie, frais de dossier bancaires, courtage) ;</li>
        <li>Des variations de taux individualisées selon le profil emprunteur ;</li>
        <li>Des conditions particulières des assurances emprunteur ;</li>
        <li>De la situation personnelle, patrimoniale et fiscale de l'utilisateur.</li>
      </ul>

      <h3>Recommandation</h3>
      <p>
        Pour obtenir une offre de prêt ferme et personnalisée, l'utilisateur est invité à
        contacter directement des établissements bancaires ou un courtier en crédit immobilier
        agréé (IOBSP enregistré à l'ORIAS).
      </p>

      <h3>Précision sur les taux affichés</h3>
      <p>
        Les taux immobiliers affichés sur le Site sont des données indicatives provenant de
        sources publiques (Banque de France, BCE). Ils sont actualisés automatiquement toutes
        les 24 heures et peuvent différer des taux effectivement pratiqués par les banques à
        la date de votre demande.
      </p>

      {/* 5 */}
      <h2 id="publicite">5. Publicités et liens tiers</h2>
      <p>
        Le Site est financé en partie par des espaces publicitaires fournis par Google AdSense.
        Les annonces publicitaires affichées sont sélectionnées par Google en fonction de
        critères contextuels et comportementaux selon la politique de Google Ads.
      </p>
      <p>
        PrêtImmoPro n'entretient aucune relation commerciale ou partenariat avec les annonceurs
        dont les publicités sont diffusées sur le Site. L'affichage d'une publicité ne vaut en
        aucun cas recommandation ou validation de l'annonceur par l'éditeur.
      </p>
      <p>
        L'utilisateur qui souhaite ne pas recevoir de publicités personnalisées peut configurer
        ses préférences via les{' '}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          paramètres publicitaires Google
        </a>
        {' '}ou installer un bloqueur de publicités.
      </p>

      {/* 6 */}
      <h2 id="propriete">6. Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus du Site (textes, guides, algorithmes, design, structure) est
        protégé par le droit de la propriété intellectuelle et reste la propriété exclusive
        de l'éditeur, sauf mention contraire.
      </p>
      <p>
        Toute reproduction, même partielle, à des fins autres que personnelles et non
        commerciales est interdite sans accord écrit préalable de l'éditeur.
      </p>

      {/* 7 */}
      <h2 id="responsabilite">7. Limitation de responsabilité</h2>
      <p>
        L'éditeur met en œuvre tous les moyens raisonnables pour assurer un accès de qualité
        au Site. Il ne peut toutefois garantir la continuité du service ni l'absence d'erreurs
        dans les résultats de simulation.
      </p>
      <p>
        <strong>L'éditeur décline expressément toute responsabilité</strong> pour les
        conséquences, directes ou indirectes, résultant de l'utilisation des informations
        ou des résultats de simulation fournis par le Site, notamment en cas de :
      </p>
      <ul>
        <li>Décision d'emprunt ou d'achat immobilier prise sur la base des simulations ;</li>
        <li>Différence entre les résultats simulés et les conditions bancaires réelles obtenues ;</li>
        <li>Perte financière liée à une erreur de saisie ou d'interprétation des résultats ;</li>
        <li>Interruption du service ou indisponibilité temporaire du Site.</li>
      </ul>

      {/* 8 */}
      <h2 id="modification">8. Modification des CGU</h2>
      <p>
        L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les
        modifications entrent en vigueur dès leur publication sur le Site. La date de
        dernière mise à jour est indiquée en haut de la présente page.
      </p>
      <p>
        Il appartient à l'utilisateur de consulter régulièrement les CGU. La poursuite de
        l'utilisation du Site après modification vaut acceptation des nouvelles conditions.
      </p>

      {/* 9 */}
      <h2 id="droit">9. Droit applicable et règlement des litiges</h2>
      <p>
        Les présentes CGU sont soumises au droit français. En cas de litige relatif à leur
        interprétation ou à leur exécution, les parties s'efforceront de trouver une solution
        amiable. À défaut d'accord, les tribunaux français compétents seront saisis.
      </p>
      <p>
        Conformément à l'article 14 du Règlement (UE) n° 524/2013, la Commission européenne
        met à disposition une plateforme de règlement en ligne des litiges :{' '}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>.
      </p>

    </LegalLayout>
  )
}
