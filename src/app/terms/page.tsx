import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use — Seekvana',
  description: 'Terms and conditions governing your use of Seekvana, the free AI learning website.',
}

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Terms of Use</span>
      </nav>

      <h1 className="font-fraunces text-4xl text-primary mb-2">Terms of Use</h1>
      <p className="text-sm text-secondary mb-10">Last updated: June 2026</p>

      <div className="space-y-8 text-primary">

        <section>
          <p className="text-secondary leading-relaxed">
            Welcome to <strong className="text-primary">Seekvana</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a free AI learning website
            at <strong className="text-primary">seekvana.com</strong>. By accessing or using this website, you agree to be bound
            by these Terms of Use. If you do not agree, please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">1. About Seekvana</h2>
          <p className="text-secondary leading-relaxed">
            Seekvana is a free educational website providing articles, guides, learning paths, and
            resources about artificial intelligence topics. All content is provided for informational
            and educational purposes only. Seekvana is not affiliated with any AI company, tool, or
            service discussed on the site unless explicitly stated.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">2. Acceptable Use</h2>
          <div className="space-y-3 text-secondary leading-relaxed">
            <p>You may access and read content on Seekvana for personal, non-commercial educational purposes. You agree not to:</p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>Copy, reproduce, or republish substantial portions of Seekvana content without written permission</li>
              <li>Scrape, crawl, or use automated tools to extract content in bulk</li>
              <li>Use the site to distribute spam, malware, or harmful content</li>
              <li>Attempt to gain unauthorised access to any part of the site or its infrastructure</li>
              <li>Misrepresent your identity or impersonate Seekvana or its operators</li>
              <li>Use the site in any way that violates applicable laws or regulations</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">3. Intellectual Property</h2>
          <p className="text-secondary leading-relaxed">
            All content on Seekvana — including articles, guides, diagrams, code examples, and design
            elements — is owned by or licensed to Seekvana and is protected by copyright law. You may
            share links to our content freely. Brief quotations for commentary, review, or educational
            purposes are permitted with clear attribution and a link back to the original page. Any
            other reproduction or distribution requires prior written permission.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">4. Educational Content Disclaimer</h2>
          <p className="text-secondary leading-relaxed">
            The content on Seekvana is provided for general educational and informational purposes.
            While we strive for accuracy, the AI field evolves rapidly and information may become
            outdated. Nothing on this site constitutes professional, legal, financial, or technical
            advice. You use any information from Seekvana at your own risk and should independently
            verify anything before acting on it in a professional or commercial context.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">5. Advertising</h2>
          <p className="text-secondary leading-relaxed">
            Seekvana displays third-party advertisements via Google AdSense. These ads are served
            automatically and do not constitute endorsement of any product or service advertised. We
            are not responsible for the content of third-party advertisements or the products and
            services they promote.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">6. Affiliate Links</h2>
          <p className="text-secondary leading-relaxed">
            Some pages contain affiliate links. When you click an affiliate link and make a purchase,
            we may earn a commission at no additional cost to you. Affiliate relationships are
            disclosed on all relevant pages and do not influence our editorial content or
            recommendations. We only recommend tools and services we believe provide genuine value.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">7. Third-Party Links</h2>
          <p className="text-secondary leading-relaxed">
            Seekvana articles link to external websites and resources. We are not responsible for the
            content, privacy practices, or accuracy of any third-party site. Links to external sites
            do not constitute endorsement. We encourage you to review the privacy policies of any
            external sites you visit.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">8. Limitation of Liability</h2>
          <p className="text-secondary leading-relaxed">
            To the fullest extent permitted by law, Seekvana and its operators shall not be liable
            for any direct, indirect, incidental, consequential, or punitive damages arising from your
            use of the site or reliance on any content published here. The site is provided &ldquo;as is&rdquo;
            without warranties of any kind, express or implied.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">9. Privacy</h2>
          <p className="text-secondary leading-relaxed">
            Your use of Seekvana is also governed by our{' '}
            <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>,
            which is incorporated into these Terms by reference.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">10. Changes to These Terms</h2>
          <p className="text-secondary leading-relaxed">
            We may update these Terms of Use at any time. Changes are effective immediately upon
            posting. The &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent
            version. Continued use of the site after changes constitutes acceptance of the updated
            terms.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">11. Governing Law</h2>
          <p className="text-secondary leading-relaxed">
            These Terms are governed by the laws of Pakistan. Any disputes arising from your use of
            Seekvana shall be subject to the jurisdiction of courts in Pakistan, without regard to
            conflict of law principles.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">12. Contact</h2>
          <p className="text-secondary leading-relaxed">
            Questions about these Terms? Contact us via our{' '}
            <Link href="/contact" className="text-accent hover:underline">contact page</Link> or
            email{' '}
            <a href="mailto:seekvanateam@gmail.com" className="text-accent hover:underline">
              seekvanateam@gmail.com
            </a>
            .
          </p>
        </section>

      </div>
    </div>
  )
}
