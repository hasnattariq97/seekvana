import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Seekvana',
  description: 'How Seekvana collects, uses, and protects your personal information, including our use of cookies and advertising.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Privacy Policy</span>
      </nav>

      <h1 className="font-fraunces text-4xl text-primary mb-2">Privacy Policy</h1>
      <p className="text-sm text-secondary mb-10">Last updated: June 2026</p>

      <div className="prose-content space-y-8 text-primary">

        <section>
          <p className="text-secondary leading-relaxed">
            Seekvana (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates{' '}
            <strong>seekvana.com</strong> — a free AI learning website. This Privacy Policy explains
            what information we collect, how we use it, and your rights regarding that information.
            By using Seekvana, you agree to this policy.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">1. Information We Collect</h2>
          <div className="space-y-3 text-secondary leading-relaxed">
            <p><strong className="text-primary">Usage data.</strong> We use Google Analytics 4 to understand how visitors use the site. This includes pages viewed, time on site, device type, browser, and approximate geographic location (country/city level). This data is aggregated and does not personally identify you.</p>
            <p><strong className="text-primary">Email address.</strong> If you subscribe to our newsletter, we collect your email address to send you updates. You can unsubscribe at any time via the link in any email.</p>
            <p><strong className="text-primary">Cookies and tracking technologies.</strong> We and our third-party partners use cookies, web beacons, and similar tracking technologies to operate the site and serve advertising. See Section 3 for details.</p>
            <p><strong className="text-primary">Contact form submissions.</strong> If you contact us, we receive and store your name, email address, and message to respond to your inquiry.</p>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-outside ml-5 space-y-2 text-secondary leading-relaxed">
            <li>To operate and improve the website</li>
            <li>To send newsletters to subscribers who have opted in</li>
            <li>To respond to enquiries submitted via our contact form</li>
            <li>To display relevant advertising (see Section 3)</li>
            <li>To analyse site traffic and usage patterns via Google Analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">3. Advertising & Cookies</h2>
          <div className="space-y-3 text-secondary leading-relaxed">
            <p>
              We display advertisements through <strong className="text-primary">Google AdSense</strong>.
              Third-party vendors, including Google, use cookies to serve ads based on your prior visits
              to this website or other websites on the Internet.
            </p>
            <p>
              Google&rsquo;s use of advertising cookies enables it and its partners to serve ads to you
              based on your visit to our site and/or other sites on the Internet.
            </p>
            <p>
              In addition to cookies, third parties may place and read <strong className="text-primary">web beacons</strong> on
              your browser and collect information from your device in connection with the advertising
              services displayed on this site.
            </p>
            <p>
              You may opt out of personalised advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>
              . You can also opt out of third-party vendor personalised advertising by visiting{' '}
              <a href="https://www.aboutads.info" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                aboutads.info
              </a>
              {' '}or{' '}
              <a href="https://www.youronlinechoices.eu" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                youronlinechoices.eu
              </a>
              .
            </p>
            <p>
              We also use <strong className="text-primary">Google Analytics</strong> which sets cookies to
              measure site usage. You can opt out of Google Analytics tracking by installing the{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>
            <p>
              You can manage or disable cookies at any time through your browser settings. Note that
              disabling cookies may affect the functionality of some parts of the site.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">4. Affiliate Links</h2>
          <p className="text-secondary leading-relaxed">
            Some pages on Seekvana contain affiliate links to AI tools and services. If you click an
            affiliate link and make a purchase, we may earn a commission at no extra cost to you.
            Affiliate relationships do not influence our editorial opinions or recommendations.
            All affiliate links are disclosed on the relevant pages.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">5. Data Sharing</h2>
          <div className="space-y-3 text-secondary leading-relaxed">
            <p>We do not sell your personal information. We share data only with the following third-party service providers necessary to operate the site:</p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li><strong className="text-primary">Google LLC</strong> — Analytics (GA4) and advertising (AdSense). <a href="https://policies.google.com/privacy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
              <li><strong className="text-primary">Vercel Inc.</strong> — Website hosting and infrastructure. <a href="https://vercel.com/legal/privacy-policy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a></li>
              <li><strong className="text-primary">Supabase Inc.</strong> — Newsletter subscription storage. <a href="https://supabase.com/privacy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a></li>
              <li><strong className="text-primary">Resend Inc.</strong> — Email delivery for newsletters. <a href="https://resend.com/legal/privacy-policy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Resend Privacy Policy</a></li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">6. Data Retention</h2>
          <p className="text-secondary leading-relaxed">
            Newsletter email addresses are retained until you unsubscribe. Analytics data is retained
            per Google&rsquo;s default retention settings (26 months). Contact form messages are retained
            for as long as necessary to resolve your enquiry.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">7. Children&rsquo;s Privacy</h2>
          <p className="text-secondary leading-relaxed">
            Seekvana is not directed at children under 13. We do not knowingly collect personal
            information from children under 13. If you believe a child under 13 has provided us with
            personal information, please contact us immediately and we will delete it.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">8. Your Rights (GDPR / International)</h2>
          <div className="space-y-3 text-secondary leading-relaxed">
            <p>If you are located in the European Economic Area, United Kingdom, or another jurisdiction with applicable data protection laws, you have the following rights:</p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li><strong className="text-primary">Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong className="text-primary">Rectification</strong> — request correction of inaccurate data</li>
              <li><strong className="text-primary">Erasure</strong> — request deletion of your personal data</li>
              <li><strong className="text-primary">Portability</strong> — receive your data in a structured, machine-readable format</li>
              <li><strong className="text-primary">Objection</strong> — object to processing based on legitimate interests</li>
              <li><strong className="text-primary">Withdraw consent</strong> — unsubscribe from the newsletter at any time</li>
            </ul>
            <p>To exercise any of these rights, contact us at the address in Section 10.</p>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">9. Changes to This Policy</h2>
          <p className="text-secondary leading-relaxed">
            We may update this Privacy Policy from time to time. Changes are effective immediately
            upon posting. The &ldquo;Last updated&rdquo; date at the top of this page will always reflect
            the most recent version. Continued use of the site after changes constitutes acceptance
            of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">10. Contact Us</h2>
          <p className="text-secondary leading-relaxed">
            For privacy-related questions or to exercise your data rights, contact us via our{' '}
            <Link href="/contact" className="text-accent hover:underline">contact page</Link> or
            email us directly at{' '}
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
