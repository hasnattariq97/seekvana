import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'What cookies Seekvana uses, why, how long they last, and how to accept, decline, or change your choices at any time.',
}

export default function CookiePolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Cookie Policy</span>
      </nav>

      <h1 className="font-fraunces text-4xl text-primary mb-2">Cookie Policy</h1>
      <p className="text-sm text-secondary mb-10">Last updated: July 2026</p>

      <div className="prose-content space-y-8 text-primary">

        <section>
          <p className="text-secondary leading-relaxed">
            This Cookie Policy explains how <strong className="text-primary">Seekvana</strong>{' '}
            (seekvana.com) uses cookies and similar technologies, what each one does, and how you
            control them. It sits alongside our{' '}
            <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>, which
            covers how we handle personal information more broadly.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">1. What Cookies Are</h2>
          <p className="text-secondary leading-relaxed">
            Cookies are small text files a website stores on your device. They let a site remember
            things between page loads and visits — like keeping you signed in, or measuring which
            pages are popular. Some cookies are set by us; others are set by third parties such as
            Google when their scripts run on our pages. We also use similar technologies, like web
            beacons and local storage, which this policy treats the same as cookies.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">2. The Categories We Use</h2>
          <div className="space-y-3 text-secondary leading-relaxed">
            <p>We group cookies into three categories:</p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                <strong className="text-primary">Necessary</strong> — required for the site to work
                (keeping you signed in, remembering your cookie choice). These are always on and
                are not subject to consent, because the site cannot function without them.
              </li>
              <li>
                <strong className="text-primary">Analytics</strong> — help us understand how visitors
                use Seekvana so we can improve it (via Google Analytics 4). You can opt out at any time —
                see Section 3.
              </li>
              <li>
                <strong className="text-primary">Advertising</strong> — used to show personalized ads
                via Google AdSense. You can opt out at any time — see Section 3.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">3. Your Choices &amp; Control</h2>
          <div className="space-y-3 text-secondary leading-relaxed">
            <p>
              You can control cookies in several ways:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                <strong className="text-primary">Browser settings</strong> — every major browser lets you
                block or delete cookies, either entirely or per site. Blocking Necessary cookies may break
                parts of the site, such as staying signed in.
              </li>
              <li>
                <strong className="text-primary">Personalized advertising</strong> — opt out via{' '}
                <a href="https://www.google.com/settings/ads" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>,{' '}
                <a href="https://youradchoices.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">youradchoices.com</a>, or{' '}
                <a href="https://www.youronlinechoices.eu" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">youronlinechoices.eu</a>.
              </li>
              <li>
                <strong className="text-primary">Analytics</strong> — opt out of Google Analytics with the{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">4. Cookies We Set</h2>
          <p className="text-secondary leading-relaxed mb-4">
            The table below lists the main cookies used on Seekvana. Third-party cookies may change as
            providers update their services; this reflects our current setup.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-surface-subtle text-left">
                  <th className="border border-border px-3 py-2 font-medium text-primary">Cookie</th>
                  <th className="border border-border px-3 py-2 font-medium text-primary">Category</th>
                  <th className="border border-border px-3 py-2 font-medium text-primary">Purpose</th>
                  <th className="border border-border px-3 py-2 font-medium text-primary">Duration</th>
                </tr>
              </thead>
              <tbody className="text-secondary">
                <tr>
                  <td className="border border-border px-3 py-2 font-mono text-xs">sb-*-auth-token</td>
                  <td className="border border-border px-3 py-2">Necessary</td>
                  <td className="border border-border px-3 py-2">Keeps you signed in (Supabase authentication).</td>
                  <td className="border border-border px-3 py-2">Session / until sign-out</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-mono text-xs">_ga, _ga_*</td>
                  <td className="border border-border px-3 py-2">Analytics</td>
                  <td className="border border-border px-3 py-2">Google Analytics — distinguishes visitors and sessions.</td>
                  <td className="border border-border px-3 py-2">2 years</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-mono text-xs">_gid</td>
                  <td className="border border-border px-3 py-2">Analytics</td>
                  <td className="border border-border px-3 py-2">Google Analytics — distinguishes visitors.</td>
                  <td className="border border-border px-3 py-2">24 hours</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-mono text-xs">__gads, __gpi</td>
                  <td className="border border-border px-3 py-2">Advertising</td>
                  <td className="border border-border px-3 py-2">Google AdSense — ad serving, frequency capping, and measurement.</td>
                  <td className="border border-border px-3 py-2">Up to 13 months</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-mono text-xs">_gcl_au</td>
                  <td className="border border-border px-3 py-2">Advertising</td>
                  <td className="border border-border px-3 py-2">Google — measures ad conversions.</td>
                  <td className="border border-border px-3 py-2">3 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">5. Third Parties</h2>
          <div className="space-y-3 text-secondary leading-relaxed">
            <p>
              When you allow Analytics or Advertising cookies, data is shared with the relevant
              provider under their own privacy terms:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                <strong className="text-primary">Google LLC</strong> — Analytics (GA4) and advertising
                (AdSense).{' '}
                <a href="https://policies.google.com/technologies/cookies" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">How Google uses cookies</a>
              </li>
            </ul>
            <p>
              You can opt out of personalized advertising directly through{' '}
              <a href="https://www.google.com/settings/ads" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>,{' '}
              <a href="https://youradchoices.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">youradchoices.com</a>, or{' '}
              <a href="https://www.youronlinechoices.eu" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">youronlinechoices.eu</a>. You can opt out of
              Google Analytics with the{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Add-on</a>.
            </p>
          </div>
        </section>

        <section id="do-not-sell">
          <h2 className="font-fraunces text-xl text-primary mb-3">6. Do Not Sell or Share My Personal Information (California)</h2>
          <div className="space-y-3 text-secondary leading-relaxed">
            <p>
              If you are a California resident, you have the right to opt out of the &ldquo;sale&rdquo;
              or &ldquo;sharing&rdquo; of your personal information under the CCPA/CPRA. To stop the
              sharing of your data with Google for ad personalization, opt out through{' '}
              <a href="https://www.google.com/settings/ads" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>{' '}
              and disable advertising cookies in your browser settings (see Section 3).
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-primary mb-3">7. Changes &amp; Contact</h2>
          <p className="text-secondary leading-relaxed">
            We may update this Cookie Policy as our services change. The &ldquo;Last updated&rdquo; date
            above always reflects the current version. Questions? Reach us via our{' '}
            <Link href="/contact" className="text-accent hover:underline">contact page</Link> or at{' '}
            <a href="mailto:contact@seekvana.com" className="text-accent hover:underline">contact@seekvana.com</a>.
          </p>
        </section>

      </div>
    </div>
  )
}
