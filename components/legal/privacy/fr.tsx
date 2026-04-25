const matomoOptOutUrl = `${process.env.NEXT_PUBLIC_MATOMO_URL ?? 'https://analytics.votredomaine.fr'}/index.php?module=CoreAdminHome&action=optOut&language=fr`

export const privacySectionsFr = [
  { id: 'responsable', title: '1. Responsable du traitement' },
  { id: 'collecte', title: '2. Données collectées' },
  { id: 'matomo', title: '3. Matomo Analytics (sans cookies)' },
  { id: 'adsense', title: '4. Google AdSense' },
  { id: 'vercel', title: '5. Hébergeur (OVH)' },
  { id: 'cookies', title: '6. Politique cookies' },
  { id: 'droits', title: '7. Vos droits (RGPD)' },
  { id: 'conservation', title: '8. Durée de conservation' },
  { id: 'tiers', title: '9. Transferts hors UE' },
  { id: 'mineurs', title: '10. Protection des mineurs' },
  { id: 'contact', title: '11. Contact & DPO' },
]

export function PrivacyFrContent() {
  return (
    <>
      <div className="legal-info">
        <strong>En résumé :</strong> PrêtImmoPro ne collecte <strong>aucune donnée personnelle
        identifiable</strong>. Aucun compte, aucun formulaire, aucun cookie de tracking tiers.
        Les statistiques de fréquentation sont mesurées via Matomo en mode anonyme (exemption
        CNIL — pas de bandeau de consentement requis). Les seuls cookies présents sur le site
        sont ceux de Google AdSense (publicités contextuelles).
      </div>

      <h2 id="responsable">1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données à caractère personnel collectées via le site
        PrêtImmoPro est l&apos;éditeur du site :
      </p>
      <ul>
        <li><strong>Identité :</strong> PrêtImmoPro (personne physique)</li>
        <li><strong>Contact :</strong> <a href="mailto:contact@pretimmopro.fr">contact@pretimmopro.fr</a></li>
        <li><strong>Pays :</strong> France</li>
      </ul>
      <p>
        Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE
        2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous
        disposez de droits sur vos données personnelles détaillés à l&apos;article 7.
      </p>

      <h2 id="collecte">2. Données collectées</h2>

      <h3>Données que nous ne collectons PAS</h3>
      <p>PrêtImmoPro est conçu pour fonctionner sans collecte de données personnelles :</p>
      <ul>
        <li>Aucune inscription ni création de compte ;</li>
        <li>Aucun formulaire de contact avec données nominatives ;</li>
        <li>Aucun stockage des simulations effectuées (les calculs sont réalisés localement dans votre navigateur) ;</li>
        <li>Aucun cookie de session applicatif ni cookie de tracking propre au site.</li>
      </ul>

      <h3>Données collectées automatiquement</h3>
      <p>
        Comme tout site web, PrêtImmoPro reçoit automatiquement certaines données techniques
        lors de chaque visite, transmises par votre navigateur :
      </p>
      <ul>
        <li>Adresse IP (anonymisée avant tout traitement — voir section Matomo) ;</li>
        <li>Type et version du navigateur ;</li>
        <li>Système d&apos;exploitation ;</li>
        <li>Pages visitées et durée de la visite ;</li>
        <li>URL de la page de provenance (referrer).</li>
      </ul>
      <p>
        Ces données sont traitées <strong>uniquement sous forme agrégée et anonymisée</strong>
        à des fins de mesure d&apos;audience. Elles ne permettent pas d&apos;identifier un utilisateur
        de façon individuelle.
      </p>

      <h2 id="matomo">3. Matomo Analytics — mesure d&apos;audience sans cookies</h2>

      <div className="legal-info">
        <strong>Exemption CNIL :</strong> La configuration Matomo utilisée sur PrêtImmoPro
        bénéficie de l&apos;exemption de consentement prévue par la délibération CNIL du
        19 juin 2023 relative aux cookies et traceurs, car elle répond aux conditions
        d&apos;anonymisation stricte listées ci-dessous.
      </div>

      <h3>Outil utilisé</h3>
      <p>
        PrêtImmoPro utilise <strong>Matomo Analytics</strong>, une solution d&apos;analyse
        d&apos;audience open source, auto-hébergée sur des serveurs localisés en Union Européenne.
        Les données ne sont pas transmises à des tiers.
      </p>

      <h3>Configuration appliquée (conditions de l&apos;exemption CNIL)</h3>
      <ul>
        <li>
          <strong>Cookies désactivés :</strong> Matomo est configuré en mode «&nbsp;sans
          cookie&nbsp;» (<code>disableCookies()</code>). Aucun cookie de tracking n&apos;est
          déposé sur votre terminal.
        </li>
        <li>
          <strong>Anonymisation IP :</strong> Les deux derniers octets de votre adresse IP
          sont masqués avant tout enregistrement. L&apos;adresse IP complète n&apos;est jamais stockée.
        </li>
        <li>
          <strong>Do Not Track respecté :</strong> Si votre navigateur envoie un signal
          Do Not Track (DNT), aucune donnée n&apos;est collectée.
        </li>
        <li>
          <strong>Finalité strictement limitée :</strong> Les données servent uniquement
          à mesurer la fréquentation du Site (pages vues, durée de session, source de trafic)
          sans aucun profilage individuel ni croisement avec d&apos;autres bases.
        </li>
        <li>
          <strong>Conservation limitée :</strong> Les données agrégées sont conservées
          13 mois maximum, conformément à la recommandation CNIL.
        </li>
      </ul>

      <h3>Données transmises à Matomo</h3>
      <ul>
        <li>URL de la page visitée ;</li>
        <li>Titre de la page ;</li>
        <li>Adresse IP anonymisée (2 octets masqués) ;</li>
        <li>Horodatage de la visite ;</li>
        <li>Type de navigateur, résolution d&apos;écran, langue du navigateur ;</li>
        <li>URL de provenance (referrer).</li>
      </ul>

      <h3>Opt-out Matomo</h3>
      <p>
        Vous pouvez vous opposer à la collecte Matomo à tout moment en activant le signal
        Do Not Track dans les paramètres de votre navigateur, ou en utilisant le mécanisme
        d&apos;opt-out ci-dessous :
      </p>
      <p>
        <a href={matomoOptOutUrl} target="_blank" rel="noopener noreferrer">
          → Page d&apos;opt-out Matomo
        </a>
      </p>

      <h2 id="adsense">4. Google AdSense — publicités contextuelles</h2>
      <p>
        PrêtImmoPro affiche des publicités via <strong>Google AdSense</strong>. Ce service
        est fourni par Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA).
      </p>

      <h3>Données traitées par Google AdSense</h3>
      <p>
        Google AdSense peut déposer des cookies tiers sur votre terminal afin de diffuser
        des publicités personnalisées basées sur vos intérêts et votre historique de navigation.
        Ces traitements sont réalisés sous la responsabilité de Google, en tant que responsable
        de traitement distinct.
      </p>
      <ul>
        <li><strong>Cookie DoubleClick/Google Ads :</strong> identifier, suivi des conversions ;</li>
        <li><strong>Durée :</strong> jusqu&apos;à 13 mois selon le cookie concerné ;</li>
        <li><strong>Finalité :</strong> personnalisation des annonces, mesure des performances publicitaires.</li>
      </ul>

      <h3>Gérer vos préférences publicitaires Google</h3>
      <ul>
        <li>
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Paramètres des annonces Google
          </a>{' '}
          — désactiver la personnalisation des annonces
        </li>
        <li>
          <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">
            YourOnlineChoices.eu
          </a>{' '}
          — opt-out des réseaux publicitaires membres de l&apos;IAB Europe
        </li>
        <li>
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            Extension de désactivation Google Analytics
          </a>
        </li>
      </ul>
      <p>
        Pour plus d&apos;informations sur les pratiques de Google en matière de confidentialité :
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          {' '}Politique de confidentialité Google
        </a>.
      </p>

      <h2 id="vercel">5. Hébergeur — OVH</h2>
      <p>
        Le Site est hébergé sur un Serveur Privé Virtuel (VPS) d&apos;<strong>OVH SAS</strong>
        (2 rue Kellermann, 59100 Roubaix, France). L&apos;infrastructure est localisée en France,
        au sein de l&apos;Union Européenne — aucun transfert hors UE n&apos;est effectué pour les
        données de journalisation.
      </p>
      <p>
        OVH peut collecter des données de journalisation (logs système et réseau) à des fins
        techniques de sécurité et de performance. Ces logs contiennent notamment : adresse IP,
        horodatage, URL demandée, code HTTP de réponse. Ils sont conservés 30 jours.
      </p>
      <p>
        Base légale : intérêt légitime de l&apos;hébergeur à assurer la sécurité et la disponibilité
        de son infrastructure (Article 6.1.f du RGPD).
      </p>

      <h2 id="cookies">6. Politique cookies</h2>

      <h3>Récapitulatif des cookies présents sur le site</h3>
      <p>
        Voici un tableau synthétique des cookies susceptibles d&apos;être déposés lors de votre
        visite sur PrêtImmoPro :
      </p>
      <ul>
        <li>
          <strong>Cookies strictement nécessaires :</strong> aucun (le site ne nécessite
          pas de session ou de panier).
        </li>
        <li>
          <strong>Cookies de mesure d&apos;audience :</strong> aucun (Matomo fonctionne
          sans cookie — exemption CNIL).
        </li>
        <li>
          <strong>Cookies publicitaires Google AdSense :</strong> oui, déposés par Google
          LLC pour la diffusion de publicités personnalisées. Ces cookies nécessitent
          votre consentement, géré par la plateforme CMP de Google.
        </li>
      </ul>

      <h3>Comment gérer les cookies dans votre navigateur</h3>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/fr-fr/windows/supprimer-et-g%C3%A9rer-les-cookies" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>

      <h2 id="droits">7. Vos droits (RGPD)</h2>
      <p>
        Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits
        suivants concernant vos données personnelles :
      </p>
      <ul>
        <li><strong>Droit d&apos;accès</strong> (art. 15 RGPD) : obtenir une copie de vos données ;</li>
        <li><strong>Droit de rectification</strong> (art. 16) : corriger des données inexactes ;</li>
        <li><strong>Droit à l&apos;effacement</strong> (art. 17) : demander la suppression de vos données ;</li>
        <li><strong>Droit à la limitation</strong> (art. 18) : restreindre temporairement le traitement ;</li>
        <li><strong>Droit à la portabilité</strong> (art. 20) : recevoir vos données dans un format structuré ;</li>
        <li>
          <strong>Droit d&apos;opposition</strong> (art. 21) : vous opposer au traitement fondé sur
          l&apos;intérêt légitime ou à des fins de prospection.
        </li>
      </ul>
      <p>
        Étant donné que PrêtImmoPro ne collecte aucune donnée personnelle identifiable, ces
        droits s&apos;exercent principalement vis-à-vis des sous-traitants tiers (Google AdSense,
        OVH) directement sur leurs plateformes respectives.
      </p>
      <p>
        Pour toute demande relative à vos droits, contactez : <a href="mailto:contact@pretimmopro.fr">contact@pretimmopro.fr</a>
      </p>
      <p>
        Vous avez également le droit de déposer une réclamation auprès de l&apos;autorité de contrôle
        compétente : la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>
        {' '}(Commission Nationale de l&apos;Informatique et des Libertés), 3 Place de Fontenoy,
        TSA 80715, 75334 Paris Cedex 07 — <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">www.cnil.fr/fr/plaintes</a>.
      </p>

      <h2 id="conservation">8. Durée de conservation</h2>
      <ul>
        <li><strong>Données Matomo :</strong> 13 mois maximum (données agrégées, anonymisées) ;</li>
        <li><strong>Logs OVH :</strong> 30 jours ;</li>
        <li><strong>Cookies Google AdSense :</strong> selon les paramètres Google (jusqu&apos;à 13 mois) ;</li>
        <li><strong>Emails de contact :</strong> 3 ans après la dernière interaction.</li>
      </ul>

      <h2 id="tiers">9. Transferts hors Union Européenne</h2>
      <p>
        La majorité des traitements de données du site s&apos;effectuent au sein de l&apos;Union
        Européenne :
      </p>
      <ul>
        <li>
          <strong>OVH SAS</strong> (hébergement) — serveurs localisés en France. <strong>Aucun
          transfert hors UE.</strong>
        </li>
        <li>
          <strong>Matomo Analytics</strong> — auto-hébergé sur le VPS OVH en France.
          <strong> Aucun transfert hors UE.</strong>
        </li>
        <li>
          <strong>Google LLC</strong> (AdSense) — implique un transfert vers les États-Unis,
          couvert par le Data Privacy Framework UE–États-Unis (Google certifié DPF depuis
          juillet 2023) et les Clauses Contractuelles Types (CCT).
        </li>
      </ul>

      <h2 id="mineurs">10. Protection des mineurs</h2>
      <p>
        Le site PrêtImmoPro s&apos;adresse à un public adulte dans le cadre de projets
        d&apos;acquisition immobilière. Aucune donnée concernant des mineurs de moins de 15 ans
        n&apos;est intentionnellement collectée.
      </p>

      <h2 id="contact">11. Contact & DPO</h2>
      <p>
        Pour toute question relative à la présente politique de confidentialité ou pour
        exercer vos droits RGPD :
      </p>
      <ul>
        <li><strong>Email :</strong> <a href="mailto:contact@pretimmopro.fr">contact@pretimmopro.fr</a></li>
        <li><strong>Objet de l&apos;email :</strong> mentionner « Données personnelles — RGPD »</li>
        <li><strong>Délai de réponse :</strong> dans les 30 jours suivant réception de la demande</li>
      </ul>
    </>
  )
}
