import { Link } from '@/i18n/navigation'

export const mentionsSectionsEn = [
  { id: 'editeur', title: '1. Publisher' },
  { id: 'hebergement', title: '2. Hosting' },
  { id: 'propriete', title: '3. Intellectual property' },
  { id: 'responsabilite', title: '4. Limitation of liability' },
  { id: 'liens', title: '5. Hyperlinks' },
  { id: 'droit', title: '6. Applicable law' },
  { id: 'contact', title: '7. Contact' },
]

export function MentionsEnContent() {
  return (
    <>
      <div className="legal-notice">
        In accordance with Articles 6-III and 19 of French Law No. 2004-575 of 21 June 2004 on
        confidence in the digital economy (LCEN), this legal notice is made available to users and
        visitors of <strong>pretimmopro.fr</strong>.
      </div>

      <h2 id="editeur">1. Publisher</h2>
      <p>
        The <strong>PrêtImmoPro</strong> website (at <strong>https://pretimmopro.fr</strong>) is
        published by an individual as a free, independent information service.
      </p>
      <ul>
        <li><strong>Name:</strong> PrêtImmoPro</li>
        <li><strong>Status:</strong> Natural person — non-professional publisher</li>
        <li>
          <strong>Publication director:</strong> the site owner (contact details available on request
          at the address below)
        </li>
        <li><strong>Contact:</strong> <a href="mailto:contact@pretimmopro.fr">contact@pretimmopro.fr</a></li>
      </ul>
      <p>
        PrêtImmoPro is an information and simulation site for individuals. It is not a credit
        institution, banking intermediary (IOBSP), investment adviser (CIF) or investment service
        provider. Nothing on this site constitutes financial advice or a credit offer.
      </p>

      <h2 id="hebergement">2. Hosting</h2>
      <p>The site is hosted by:</p>
      <ul>
        <li><strong>Company:</strong> OVH SAS</li>
        <li><strong>Address:</strong> 2 rue Kellermann, 59100 Roubaix, France</li>
        <li><strong>Company registration (RCS):</strong> Roubaix-Tourcoing 424 761 419 00045</li>
        <li><strong>Website:</strong> <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer">https://www.ovhcloud.com</a></li>
        <li><strong>Type:</strong> Virtual Private Server (VPS) — infrastructure located in France</li>
      </ul>
      <p>
        OVH servers used for this site are located in France in OVH data centres compliant with ISO
        27001. Traffic data is processed in line with OVH&apos;s privacy policy on their website.
      </p>

      <h2 id="propriete">3. Intellectual property</h2>
      <p>
        All elements of the PrêtImmoPro site — structure, design, text, calculation algorithms,
        logos, icons and any other content — are the exclusive property of the publisher unless
        expressly stated otherwise.
      </p>
      <p>
        Any reproduction, representation, modification, publication or adaptation, in whole or in
        part, by any means, is prohibited without prior written consent, in accordance with Articles
        L.122-4 et seq. of the French Intellectual Property Code.
      </p>
      <p>
        Mathematical formulas used in the simulators (monthly payment, amortisation, borrowing
        capacity, notary fees) are standard public-domain financial formulas. Their implementation in
        code is protected by copyright.
      </p>

      <h2 id="responsabilite">4. Limitation of liability</h2>
      <p>
        PrêtImmoPro strives to provide accurate information and simulation results. However, the
        publisher cannot guarantee accuracy, completeness or relevance of the information on this
        site.
      </p>
      <p>
        Simulations are <strong>indicative</strong> only and do not constitute a credit offer,
        commercial proposal or commitment by any financial institution. Results may differ
        materially from actual bank offers, which use their own underwriting and pricing criteria.
      </p>
      <p>The publisher shall not be liable for:</p>
      <ul>
        <li>Financial decisions based on the site&apos;s information or simulations;</li>
        <li>Interruptions, unavailability or technical malfunctions;</li>
        <li>Fraudulent or improper use of the tools;</li>
        <li>Direct or indirect damage arising from access to or use of the site.</li>
      </ul>

      <h2 id="liens">5. Hyperlinks</h2>
      <p>
        The site may contain links to third-party sites for information only. The publisher does
        not control their content and disclaims responsibility for their availability, accuracy or
        compliance with applicable law.
      </p>
      <p>
        Links to PrêtImmoPro are permitted provided misleading presentation (inline frames, hidden
        deep linking) is not used and the publisher is informed by email.
      </p>

      <h2 id="droit">6. Applicable law and jurisdiction</h2>
      <p>
        This legal notice is governed by French law. Any dispute shall fall within the exclusive
        jurisdiction of the French courts.
      </p>
      <p>
        Under Article L.612-1 of the French Consumer Code, any consumer may use a free consumer
        mediation service to seek an amicable settlement of a dispute with a professional.
      </p>

      <h2 id="contact">7. Contact</h2>
      <p>
        For questions about this legal notice, or to exercise your personal data rights (see our{' '}
        <Link href="/politique-confidentialite" className="text-primary-600 hover:underline">
          Privacy policy
        </Link>
        ), you can contact us:
      </p>
      <ul>
        <li><strong>By email:</strong> <a href="mailto:contact@pretimmopro.fr">contact@pretimmopro.fr</a></li>
        <li><strong>Response time:</strong> within 30 business days</li>
      </ul>
    </>
  )
}
