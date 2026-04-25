const matomoOptOutUrl = `${process.env.NEXT_PUBLIC_MATOMO_URL ?? 'https://analytics.votredomaine.fr'}/index.php?module=CoreAdminHome&action=optOut&language=en`

export const privacySectionsEn = [
  { id: 'responsable', title: '1. Data controller' },
  { id: 'collecte', title: '2. Data collected' },
  { id: 'matomo', title: '3. Matomo Analytics (no cookies)' },
  { id: 'adsense', title: '4. Google AdSense' },
  { id: 'vercel', title: '5. Hosting (OVH)' },
  { id: 'cookies', title: '6. Cookie policy' },
  { id: 'droits', title: '7. Your rights (GDPR)' },
  { id: 'conservation', title: '8. Retention periods' },
  { id: 'tiers', title: '9. Transfers outside the EU' },
  { id: 'mineurs', title: '10. Protection of minors' },
  { id: 'contact', title: '11. Contact & DPO' },
]

export function PrivacyEnContent() {
  return (
    <>
      <div className="legal-info">
        <strong>In short:</strong> PrêtImmoPro does <strong>not</strong> collect any identifiable
        personal data. No accounts, no contact forms, no third-party tracking cookies from us.
        Traffic statistics are measured with Matomo in anonymous mode (CNIL exemption — no consent
        banner required). The only cookies on the site are those set by Google AdSense for
        contextual advertising.
      </div>

      <h2 id="responsable">1. Data controller</h2>
      <p>The controller of personal data collected via PrêtImmoPro is the site publisher:</p>
      <ul>
        <li><strong>Identity:</strong> PrêtImmoPro (natural person)</li>
        <li><strong>Contact:</strong> <a href="mailto:contact@pretimmopro.fr">contact@pretimmopro.fr</a></li>
        <li><strong>Country:</strong> France</li>
      </ul>
      <p>
        Under the General Data Protection Regulation (GDPR — EU Regulation 2016/679) and the
        French Data Protection Act of 6 January 1978 as amended, you have rights detailed in
        Section 7.
      </p>

      <h2 id="collecte">2. Data collected</h2>

      <h3>Data we do NOT collect</h3>
      <p>PrêtImmoPro is designed to operate without collecting personal data:</p>
      <ul>
        <li>No sign-up or account creation;</li>
        <li>No contact form collecting identifying information;</li>
        <li>No storage of your simulations (calculations run locally in your browser);</li>
        <li>No application session cookie or first-party tracking cookie from us.</li>
      </ul>

      <h3>Data collected automatically</h3>
      <p>Like any website, PrêtImmoPro receives certain technical data on each visit from your browser:</p>
      <ul>
        <li>IP address (anonymised before processing — see Matomo section);</li>
        <li>Browser type and version;</li>
        <li>Operating system;</li>
        <li>Pages visited and visit duration;</li>
        <li>Referrer URL.</li>
      </ul>
      <p>
        These data are processed <strong>only in aggregated, anonymised form</strong> for audience
        measurement. They do not allow individual identification.
      </p>

      <h2 id="matomo">3. Matomo Analytics — audience measurement without cookies</h2>

      <div className="legal-info">
        <strong>CNIL exemption:</strong> The Matomo configuration used on PrêtImmoPro benefits from
        the consent exemption under the CNIL deliberation of 19 June 2023 on cookies and trackers,
        because it meets the strict anonymisation conditions listed below.
      </div>

      <h3>Tool used</h3>
      <p>
        PrêtImmoPro uses <strong>Matomo Analytics</strong>, an open-source audience analytics
        solution self-hosted on servers located in the European Union. Data are not sent to third
        parties.
      </p>

      <h3>Configuration (CNIL exemption conditions)</h3>
      <ul>
        <li>
          <strong>Cookies disabled:</strong> Matomo runs in &quot;no cookie&quot; mode (
          <code>disableCookies()</code>). No tracking cookie is placed on your device.
        </li>
        <li>
          <strong>IP anonymisation:</strong> The last two octets of your IP address are masked before
          storage. The full IP is never stored.
        </li>
        <li>
          <strong>Do Not Track honoured:</strong> If your browser sends a Do Not Track (DNT) signal,
          no data are collected.
        </li>
        <li>
          <strong>Strictly limited purpose:</strong> Data are used only to measure Site traffic
          (page views, session length, traffic sources) without individual profiling or merging with
          other databases.
        </li>
        <li>
          <strong>Limited retention:</strong> Aggregated data are kept for a maximum of 13 months, in
          line with CNIL guidance.
        </li>
      </ul>

      <h3>Data sent to Matomo</h3>
      <ul>
        <li>URL of the page visited;</li>
        <li>Page title;</li>
        <li>Anonymised IP address (2 octets masked);</li>
        <li>Visit timestamp;</li>
        <li>Browser type, screen resolution, browser language;</li>
        <li>Referrer URL.</li>
      </ul>

      <h3>Matomo opt-out</h3>
      <p>
        You can object to Matomo collection at any time by enabling Do Not Track in your browser, or
        by using the opt-out mechanism below:
      </p>
      <p>
        <a href={matomoOptOutUrl} target="_blank" rel="noopener noreferrer">
          → Matomo opt-out page
        </a>
      </p>

      <h2 id="adsense">4. Google AdSense — contextual ads</h2>
      <p>
        PrêtImmoPro displays ads through <strong>Google AdSense</strong>, provided by Google LLC
        (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA).
      </p>

      <h3>Data processed by Google AdSense</h3>
      <p>
        Google AdSense may place third-party cookies on your device to serve personalised ads based on
        your interests and browsing history. Processing is carried out under Google&apos;s
        responsibility as a separate controller.
      </p>
      <ul>
        <li><strong>DoubleClick/Google Ads cookies:</strong> identifiers, conversion tracking;</li>
        <li><strong>Duration:</strong> up to 13 months depending on the cookie;</li>
        <li><strong>Purpose:</strong> ad personalisation and ad performance measurement.</li>
      </ul>

      <h3>Managing your Google ad preferences</h3>
      <ul>
        <li>
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Google Ads settings
          </a>
          {' '}— turn off ad personalisation
        </li>
        <li>
          <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">
            YourOnlineChoices.eu
          </a>
          {' '}— opt out of IAB Europe member ad networks
        </li>
        <li>
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            Google Analytics opt-out browser add-on
          </a>
        </li>
      </ul>
      <p>
        For more on Google&apos;s privacy practices:
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          {' '}Google Privacy Policy
        </a>.
      </p>

      <h2 id="vercel">5. Hosting — OVH</h2>
      <p>
        The Site is hosted on a Virtual Private Server (VPS) operated by <strong>OVH SAS</strong>
        (2 rue Kellermann, 59100 Roubaix, France). Infrastructure is located in France within the
        European Union — no transfer outside the EU for server logs from our hosting.
      </p>
      <p>
        OVH may collect system and network logs for security and performance. These logs may include:
        IP address, timestamp, requested URL, HTTP status code. They are kept for 30 days.
      </p>
      <p>
        Legal basis: legitimate interest of the host in securing and maintaining its infrastructure
        (Article 6(1)(f) GDPR).
      </p>

      <h2 id="cookies">6. Cookie policy</h2>

      <h3>Summary of cookies on the site</h3>
      <p>Overview of cookies that may be placed when you visit PrêtImmoPro:</p>
      <ul>
        <li>
          <strong>Strictly necessary cookies:</strong> none (the site does not require a shopping
          cart or session).
        </li>
        <li>
          <strong>Audience measurement cookies:</strong> none (Matomo runs without cookies — CNIL
          exemption).
        </li>
        <li>
          <strong>Google AdSense advertising cookies:</strong> yes, placed by Google LLC for
          personalised ads. Consent is handled by Google&apos;s CMP where applicable.
        </li>
      </ul>

      <h3>Managing cookies in your browser</h3>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>

      <h2 id="droits">7. Your rights (GDPR)</h2>
      <p>Under the GDPR and French law, you have the following rights regarding personal data:</p>
      <ul>
        <li><strong>Right of access</strong> (Art. 15): obtain a copy of your data;</li>
        <li><strong>Right to rectification</strong> (Art. 16): correct inaccurate data;</li>
        <li><strong>Right to erasure</strong> (Art. 17): request deletion of your data;</li>
        <li><strong>Right to restriction</strong> (Art. 18): temporarily restrict processing;</li>
        <li><strong>Right to data portability</strong> (Art. 20): receive your data in a structured format;</li>
        <li>
          <strong>Right to object</strong> (Art. 21): object to processing based on legitimate interest
          or for direct marketing.
        </li>
      </ul>
      <p>
        Because PrêtImmoPro does not collect identifiable personal data, these rights are mainly
        exercised with third-party processors (Google AdSense, OVH) on their respective platforms.
      </p>
      <p>
        For any request regarding your rights, contact:{' '}
        <a href="mailto:contact@pretimmopro.fr">contact@pretimmopro.fr</a>
      </p>
      <p>
        You may also lodge a complaint with the supervisory authority: the{' '}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a> (French Data
        Protection Authority), 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 —{' '}
        <a href="https://www.cnil.fr/en/complaints" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.
      </p>

      <h2 id="conservation">8. Retention periods</h2>
      <ul>
        <li><strong>Matomo data:</strong> up to 13 months (aggregated, anonymised);</li>
        <li><strong>OVH logs:</strong> 30 days;</li>
        <li><strong>Google AdSense cookies:</strong> per Google settings (up to 13 months);</li>
        <li><strong>Contact emails:</strong> 3 years after the last interaction.</li>
      </ul>

      <h2 id="tiers">9. Transfers outside the European Union</h2>
      <p>Most processing takes place within the EU:</p>
      <ul>
        <li>
          <strong>OVH SAS</strong> (hosting) — servers in France. <strong>No transfer outside the EU.</strong>
        </li>
        <li>
          <strong>Matomo Analytics</strong> — self-hosted on the OVH VPS in France.{' '}
          <strong>No transfer outside the EU.</strong>
        </li>
        <li>
          <strong>Google LLC</strong> (AdSense) — involves transfer to the United States, covered by
          the EU–US Data Privacy Framework (Google DPF certified since July 2023) and Standard
          Contractual Clauses (SCCs).
        </li>
      </ul>

      <h2 id="mineurs">10. Protection of minors</h2>
      <p>
        PrêtImmoPro targets adults planning property purchases. No data about children under 15 is
        knowingly collected.
      </p>

      <h2 id="contact">11. Contact & DPO</h2>
      <p>For questions about this privacy policy or to exercise your GDPR rights:</p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:contact@pretimmopro.fr">contact@pretimmopro.fr</a></li>
        <li><strong>Subject line:</strong> please include &quot;Personal data — GDPR&quot;</li>
        <li><strong>Response time:</strong> within 30 days of receiving your request</li>
      </ul>
    </>
  )
}
