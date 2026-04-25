export const cguSectionsFr = [
  { id: 'objet', title: '1. Objet' },
  { id: 'acces', title: '2. Accès au service' },
  { id: 'utilisation', title: '3. Utilisation du service' },
  { id: 'simulateurs', title: '4. Nature des simulateurs' },
  { id: 'publicite', title: '5. Publicités et liens' },
  { id: 'propriete', title: '6. Propriété intellectuelle' },
  { id: 'responsabilite', title: '7. Limitation de responsabilité' },
  { id: 'modification', title: '8. Modification des CGU' },
  { id: 'droit', title: '9. Droit applicable' },
]

export function CguFrContent() {
  return (
    <>
      <div className="legal-notice">
        En accédant et en utilisant le site <strong>PrêtImmoPro</strong>, vous acceptez sans
        réserve les présentes Conditions Générales d&apos;Utilisation (CGU). Si vous n&apos;acceptez pas
        ces conditions, veuillez ne pas utiliser ce site.
      </div>

      <h2 id="objet">1. Objet</h2>
      <p>
        Les présentes CGU ont pour objet de définir les conditions d&apos;accès et d&apos;utilisation du
        site <strong>PrêtImmoPro</strong> (ci-après « le Site »), accessible à l&apos;adresse
        <a href="https://pretimmopro.fr"> https://pretimmopro.fr</a>.
      </p>
      <p>
        PrêtImmoPro est un service d&apos;information et de simulation en ligne, gratuit et sans
        inscription, destiné aux particuliers souhaitant évaluer leurs projets d&apos;acquisition
        immobilière en France.
      </p>

      <h2 id="acces">2. Accès au service</h2>
      <p>
        L&apos;accès au Site est libre et gratuit pour tout utilisateur disposant d&apos;un accès à
        Internet. Aucune inscription, création de compte ou communication de données personnelles
        n&apos;est requise pour utiliser les simulateurs.
      </p>
      <p>
        L&apos;éditeur se réserve le droit de suspendre, modifier ou interrompre l&apos;accès au Site
        à tout moment, notamment pour des opérations de maintenance, sans que cela ne puisse
        engager sa responsabilité.
      </p>
      <p>Les frais d&apos;accès à Internet restent à la charge exclusive de l&apos;utilisateur.</p>

      <h2 id="utilisation">3. Utilisation du service</h2>
      <p>L&apos;utilisateur s&apos;engage à utiliser le Site conformément aux présentes CGU et à la législation en vigueur. Il s&apos;interdit notamment :</p>
      <ul>
        <li>Toute utilisation frauduleuse, abusive ou susceptible de perturber le fonctionnement du Site ;</li>
        <li>Toute tentative d&apos;accès non autorisé aux systèmes informatiques de l&apos;éditeur ;</li>
        <li>Toute collecte automatisée de données (scraping, crawling intensif) sans autorisation ;</li>
        <li>Toute reproduction ou diffusion des outils à des fins commerciales sans accord préalable ;</li>
        <li>Toute transmission de contenu illicite, diffamatoire, ou portant atteinte aux droits de tiers.</li>
      </ul>

      <h2 id="simulateurs">4. Nature des simulateurs et portée des résultats</h2>

      <div className="legal-notice">
        <strong>Information importante :</strong> PrêtImmoPro n&apos;est pas un établissement de
        crédit, un intermédiaire en opérations de banque (IOBSP) ni un conseiller financier.
        Les résultats des simulateurs sont fournis à titre <strong>indicatif et pédagogique uniquement</strong>.
      </div>

      <p>
        Les outils de simulation proposés sur le Site (simulateur de prêt, calculateur de
        capacité d&apos;emprunt, calculateur de frais de notaire, comparateur taux fixe/variable,
        outil de remboursement anticipé) utilisent des formules mathématiques financières
        standard basées sur les données saisies par l&apos;utilisateur.
      </p>

      <h3>Ce que les simulations ne prennent pas en compte</h3>
      <p>Les résultats obtenus ne reflètent pas nécessairement les offres réelles du marché, car ils ne tiennent pas compte :</p>
      <ul>
        <li>Du profil de risque spécifique de chaque emprunteur (score bancaire, historique de crédit) ;</li>
        <li>Des politiques commerciales et critères d&apos;octroi propres à chaque établissement bancaire ;</li>
        <li>Des frais annexes variables (garantie, frais de dossier bancaires, courtage) ;</li>
        <li>Des variations de taux individualisées selon le profil emprunteur ;</li>
        <li>Des conditions particulières des assurances emprunteur ;</li>
        <li>De la situation personnelle, patrimoniale et fiscale de l&apos;utilisateur.</li>
      </ul>

      <h3>Recommandation</h3>
      <p>
        Pour obtenir une offre de prêt ferme et personnalisée, l&apos;utilisateur est invité à
        contacter directement des établissements bancaires ou un courtier en crédit immobilier
        agréé (IOBSP enregistré à l&apos;ORIAS).
      </p>

      <h3>Précision sur les taux affichés</h3>
      <p>
        Les taux immobiliers affichés sur le Site sont des données indicatives provenant de
        données de référence intégrées au site. Ils sont mis à jour lors des publications du site et
        peuvent différer des taux effectivement pratiqués par les banques à la date de votre demande.
      </p>

      <h2 id="publicite">5. Publicités et liens tiers</h2>
      <p>
        Le Site est financé en partie par des espaces publicitaires fournis par Google AdSense.
        Les annonces publicitaires affichées sont sélectionnées par Google en fonction de
        critères contextuels et comportementaux selon la politique de Google Ads.
      </p>
      <p>
        PrêtImmoPro n&apos;entretient aucune relation commerciale ou partenariat avec les annonceurs
        dont les publicités sont diffusées sur le Site. L&apos;affichage d&apos;une publicité ne vaut en
        aucun cas recommandation ou validation de l&apos;annonceur par l&apos;éditeur.
      </p>
      <p>
        L&apos;utilisateur qui souhaite ne pas recevoir de publicités personnalisées peut configurer
        ses préférences via les{' '}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          paramètres publicitaires Google
        </a>
        {' '}ou installer un bloqueur de publicités.
      </p>

      <h2 id="propriete">6. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus du Site (textes, guides, algorithmes, design, structure) est
        protégé par le droit de la propriété intellectuelle et reste la propriété exclusive
        de l&apos;éditeur, sauf mention contraire.
      </p>
      <p>
        Toute reproduction, même partielle, à des fins autres que personnelles et non
        commerciales est interdite sans accord écrit préalable de l&apos;éditeur.
      </p>

      <h2 id="responsabilite">7. Limitation de responsabilité</h2>
      <p>
        L&apos;éditeur met en œuvre tous les moyens raisonnables pour assurer un accès de qualité
        au Site. Il ne peut toutefois garantir la continuité du service ni l&apos;absence d&apos;erreurs
        dans les résultats de simulation.
      </p>
      <p>
        <strong>L&apos;éditeur décline expressément toute responsabilité</strong> pour les
        conséquences, directes ou indirectes, résultant de l&apos;utilisation des informations
        ou des résultats de simulation fournis par le Site, notamment en cas de :
      </p>
      <ul>
        <li>Décision d&apos;emprunt ou d&apos;achat immobilier prise sur la base des simulations ;</li>
        <li>Différence entre les résultats simulés et les conditions bancaires réelles obtenues ;</li>
        <li>Perte financière liée à une erreur de saisie ou d&apos;interprétation des résultats ;</li>
        <li>Interruption du service ou indisponibilité temporaire du Site.</li>
      </ul>

      <h2 id="modification">8. Modification des CGU</h2>
      <p>
        L&apos;éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les
        modifications entrent en vigueur dès leur publication sur le Site. La date de
        dernière mise à jour est indiquée en haut de la présente page.
      </p>
      <p>
        Il appartient à l&apos;utilisateur de consulter régulièrement les CGU. La poursuite de
        l&apos;utilisation du Site après modification vaut acceptation des nouvelles conditions.
      </p>

      <h2 id="droit">9. Droit applicable et règlement des litiges</h2>
      <p>
        Les présentes CGU sont soumises au droit français. En cas de litige relatif à leur
        interprétation ou à leur exécution, les parties s&apos;efforceront de trouver une solution
        amiable. À défaut d&apos;accord, les tribunaux français compétents seront saisis.
      </p>
      <p>
        Conformément à l&apos;article 14 du Règlement (UE) n° 524/2013, la Commission européenne
        met à disposition une plateforme de règlement en ligne des litiges :{' '}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>.
      </p>
    </>
  )
}
