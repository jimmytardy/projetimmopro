export const cguSectionsEn = [
  { id: 'objet', title: '1. Purpose' },
  { id: 'acces', title: '2. Access to the service' },
  { id: 'utilisation', title: '3. Use of the service' },
  { id: 'simulateurs', title: '4. Nature of the simulators' },
  { id: 'publicite', title: '5. Advertising and third-party links' },
  { id: 'propriete', title: '6. Intellectual property' },
  { id: 'responsabilite', title: '7. Limitation of liability' },
  { id: 'modification', title: '8. Changes to these terms' },
  { id: 'droit', title: '9. Applicable law' },
]

export function CguEnContent() {
  return (
    <>
      <div className="legal-notice">
        By accessing and using the <strong>PrêtImmoPro</strong> website, you accept these Terms of
        Service without reservation. If you do not agree, please do not use the site.
      </div>

      <h2 id="objet">1. Purpose</h2>
      <p>
        These Terms define the conditions of access to and use of the <strong>PrêtImmoPro</strong>{' '}
        website (the &quot;Site&quot;), available at
        <a href="https://pretimmopro.fr"> https://pretimmopro.fr</a>.
      </p>
      <p>
        PrêtImmoPro is a free, no-registration information and simulation service for individuals
        evaluating residential property projects in France.
      </p>

      <h2 id="acces">2. Access to the service</h2>
      <p>
        Access to the Site is free for anyone with an internet connection. No account or personal
        data is required to use the simulators.
      </p>
      <p>
        The publisher may suspend, change or interrupt access at any time, including for
        maintenance, without liability.
      </p>
      <p>Internet access costs remain solely your responsibility.</p>

      <h2 id="utilisation">3. Use of the service</h2>
      <p>You agree to use the Site in accordance with these Terms and applicable law. In particular, you must not:</p>
      <ul>
        <li>Use the Site fraudulently, abusively or in a way that could disrupt it;</li>
        <li>Attempt unauthorised access to the publisher&apos;s systems;</li>
        <li>Run automated data collection (scraping, intensive crawling) without permission;</li>
        <li>Copy or redistribute the tools for commercial purposes without prior agreement;</li>
        <li>Transmit unlawful, defamatory or third-party-rights-infringing content.</li>
      </ul>

      <h2 id="simulateurs">4. Nature of the simulators and scope of results</h2>

      <div className="legal-notice">
        <strong>Important:</strong> PrêtImmoPro is not a credit institution, a banking intermediary
        (IOBSP) or a financial adviser. Simulator results are provided for{' '}
        <strong>informational and educational purposes only</strong>.
      </div>

      <p>
        The tools on the Site (mortgage simulator, borrowing capacity, notary fees, fixed vs variable
        comparison, early repayment) use standard financial formulas based on your inputs.
      </p>

      <h3>What the simulations do not cover</h3>
      <p>Results may not reflect real market offers because they do not include:</p>
      <ul>
        <li>Each borrower&apos;s risk profile (credit score, history);</li>
        <li>Individual banks&apos; commercial policies and approval criteria;</li>
        <li>Variable ancillary costs (guarantees, bank fees, brokerage);</li>
        <li>Individualised rate variations;</li>
        <li>Specific borrower insurance conditions;</li>
        <li>Your personal, asset and tax situation.</li>
      </ul>

      <h3>Recommendation</h3>
      <p>
        For a firm, personalised loan offer, contact banks directly or a registered mortgage broker
        (IOBSP listed with ORIAS).
      </p>

      <h3>Rates shown on the Site</h3>
      <p>
        Mortgage rates are indicative reference data built into the Site. They are updated when the
        Site is published and may differ from rates banks actually offer when you apply.
      </p>

      <h2 id="publicite">5. Advertising and third-party links</h2>
      <p>
        The Site is partly funded by advertising spaces provided by Google AdSense. Ads are selected
        by Google according to its Google Ads policies.
      </p>
      <p>
        PrêtImmoPro has no commercial relationship with advertisers. Displaying an ad is not an
        endorsement by the publisher.
      </p>
      <p>
        To limit personalised ads, adjust your preferences in{' '}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google ad settings
        </a>
        {' '}or use an ad blocker.
      </p>

      <h2 id="propriete">6. Intellectual property</h2>
      <p>
        All Site content (text, guides, algorithms, design, structure) is protected by intellectual
        property law and belongs to the publisher unless stated otherwise.
      </p>
      <p>
        Any reproduction, even partial, for purposes other than private, non-commercial use is
        forbidden without prior written consent.
      </p>

      <h2 id="responsabilite">7. Limitation of liability</h2>
      <p>
        The publisher uses reasonable efforts to provide quality access but does not guarantee
        uninterrupted service or error-free simulation results.
      </p>
      <p>
        <strong>The publisher disclaims liability</strong> for direct or indirect consequences of
        using the Site or its results, including:
      </p>
      <ul>
        <li>Borrowing or purchase decisions based on simulations;</li>
        <li>Differences between simulated results and actual bank terms;</li>
        <li>Financial loss due to input or interpretation errors;</li>
        <li>Service interruption or temporary unavailability.</li>
      </ul>

      <h2 id="modification">8. Changes to these terms</h2>
      <p>
        The publisher may change these Terms at any time. Changes apply once published. The last
        update date appears at the top of this page.
      </p>
      <p>
        You should review these Terms regularly. Continued use after changes constitutes acceptance.
      </p>

      <h2 id="droit">9. Applicable law and disputes</h2>
      <p>
        These Terms are governed by French law. The parties will seek an amicable settlement; failing
        that, competent French courts shall have jurisdiction.
      </p>
      <p>
        Under Article 14 of Regulation (EU) No 524/2013, the European Commission provides an online
        dispute resolution platform:{' '}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>.
      </p>
    </>
  )
}
