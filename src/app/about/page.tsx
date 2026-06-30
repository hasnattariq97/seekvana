import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Seekvana',
  description: 'Seekvana is a free AI learning platform built by a non-technical founder who went from zero to automating his workday with AI agents — and wants to help everyone do the same.',
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">About</span>
      </nav>

      <h1 className="font-fraunces text-4xl text-primary mb-2">About Seekvana</h1>
      <p className="text-sm text-secondary mb-10">Built by a learner, for learners.</p>

      <div className="space-y-10 text-primary">

        <section>
          <h2 className="font-fraunces text-2xl text-primary mb-4">Where this started</h2>
          <div className="space-y-4 text-secondary leading-relaxed">
            <p>
              Three months ago I was a complete non-technical person. My background is in life sciences
              and biotechnology. No engineering, no coding, no AI. I used AI to write documents, analyse
              data, make images, and answer questions. That was it.
            </p>
            <p>
              Then I started noticing what was actually possible. Agents that could take repetitive tasks
              off your plate entirely. Automation that could free up hours every day. I kept thinking about
              my own work. The monotonous, time-consuming tasks left little room for the things that
              mattered. If I could automate the noise, I could focus on what was meaningful.
            </p>
            <p>
              So I went looking for content on agentic AI. Most of what I found was built for engineers,
              not for someone like me. The knowledge existed. It just wasn&apos;t written for the people
              who needed it most.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-2xl text-primary mb-4">The turning point</h2>
          <div className="space-y-4 text-secondary leading-relaxed">
            <p>
              My organisation opened seats for an agentic AI course. I applied, got in, and everything
              changed. I learned how to set up environments, build files and documents, connect databases,
              create frontends and backends, design agent memories, and deploy working systems.
            </p>
            <p>
              Within weeks I had automated most of my daily work. What used to consume my entire day now
              takes two to three hours. The rest of my time is mine again.
            </p>
            <p>
              That experience made one thing clear: this is not just for engineers. Anyone in any field
              can learn it, apply it, and benefit from it. The barrier isn&apos;t ability. It&apos;s access
              to the right kind of explanation.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-2xl text-primary mb-4">Why I built Seekvana</h2>
          <div className="space-y-4 text-secondary leading-relaxed">
            <p>
              I built Seekvana because the content I needed three months ago didn&apos;t exist in the
              form I needed it.
            </p>
            <p>
              My name is <strong className="text-primary">Hasnat</strong>. I&apos;m not a software engineer.
              I&apos;m a biotechnology professional who, three months ago, had no idea how to build a website.
              I built Seekvana myself. The content, the design, the code, everything. If I could do it,
              so can you. That&apos;s the whole point.
            </p>
            <p>
              I share what I learn as I learn it. Every article is written the way I wish things had been
              explained to me: no unnecessary jargon, real-world examples, and a clear path from
              understanding to doing.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-2xl text-primary mb-4">What Seekvana is</h2>
          <div className="space-y-4 text-secondary leading-relaxed">
            <p>
              Seekvana is a free AI learning platform. It covers everything from how AI works to building
              production-grade agents, across{' '}
              <strong className="text-primary">9 topic pillars</strong> and{' '}
              <strong className="text-primary">5 structured learning paths</strong>.
            </p>
            <p>
              It&apos;s built for everyone: complete beginners with no technical background, students
              switching careers, developers going deeper, and professionals in any field who want to use
              AI to work smarter. The content cuts straight to what you need to know and lands on
              something you can actually use.
            </p>
            <p>
              The goal isn&apos;t to make you an AI researcher. It&apos;s to give you enough understanding
              and practical skill to build agents that work for you, whatever your field, whatever
              your goal.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-2xl text-primary mb-4">How we write</h2>
          <div className="space-y-4 text-secondary leading-relaxed">
            <p>Every article on Seekvana is written to a single standard:</p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>Plain language first — no jargon without explanation</li>
              <li>Real-world examples over abstract theory</li>
              <li>Accurate and up to date — the AI field moves fast and we move with it</li>
              <li>Honest about what we don&apos;t know</li>
              <li>No filler — every sentence earns its place</li>
            </ul>
            <p>
              If you spot an error or something outdated,{' '}
              <Link href="/contact" className="text-accent hover:underline">tell us</Link>. We take
              corrections seriously.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-2xl text-primary mb-4">Where we&apos;re going</h2>
          <div className="space-y-4 text-secondary leading-relaxed">
            <p>
              Seekvana is just getting started. The vision is to become the world&apos;s leading free
              learning platform for AI, built collaboratively with the people who use it.
            </p>
            <p>
              If you learn something here that changes how you work, share it. Tell someone. Help us
              build this together. The more people who find Seekvana, the better the content gets, and
              the more people we can help.
            </p>
            <p>
              AI isn&apos;t going anywhere. The question is whether you use it, or whether the people
              around you do. Seekvana exists to make sure you&apos;re on the right side of that.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-accent-soft border border-accent/20 rounded-xl p-6">
          <h2 className="font-fraunces text-xl text-primary mb-2">Start learning</h2>
          <p className="text-secondary text-sm leading-relaxed mb-4">
            Pick a learning path and start today. No prior experience required.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/paths/getting-started"
              className="bg-accent text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent-deep transition-colors"
            >
              Getting Started →
            </Link>
            <Link
              href="/library"
              className="border border-border text-primary text-sm font-medium px-4 py-2 rounded-lg hover:bg-surface-subtle transition-colors"
            >
              Browse the library
            </Link>
            <Link
              href="/contact"
              className="text-accent text-sm font-medium px-4 py-2 rounded-lg hover:bg-surface-subtle transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
