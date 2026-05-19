'use client'

import { useState, FormEvent } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: '/' }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const formNote =
    status === 'success'
      ? "You're on the list. We'll reach out personally."
      : status === 'error'
      ? 'Something went wrong. Please try again.'
      : "We’ll reach out personally."

  return (
    <>
      <div id="waitlist" />

      {/* NAV */}
      <nav>
        <a className="logo" href="#">
          kentos<span className="logo-period" /><span className="logo-ai">ai</span>
        </a>
        <div className="nav-right">
          <a className="nav-link" href="#">Product</a>
          <a className="btn-primary" href="https://calendly.com/tomasz-kentos/30min" target="_blank" rel="noopener noreferrer">Book a call →</a>
          <a className="btn-outline" href="#waitlist">Get Early Access →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <p className="eyebrow">AI Cost Intelligence · Early Access · 2026</p>
        <h1 className="hero-headline">
          Close the<br />open bar.
        </h1>
        <p className="hero-sub">
          Your agents are using Opus to review log files.{' '}
          <strong>Nobody&apos;s watching the meter — or routing the traffic.</strong>{' '}
          Kentos sits between your apps and your AI providers, cuts the bill by 40–60%, and gives
          your CFO/CTO a dashboard that proves it.
        </p>
        <div>
          <form className="email-form" onSubmit={handleSubmit}>
            <input
              className="email-input"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="email-submit" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending…' : 'Get Early Access →'}
            </button>
          </form>
          <p className="form-note">{formNote}</p>
        </div>
      </section>

      <hr className="rule" />

      {/* STATS */}
      <section className="stats">
        <div className="stats-inner">
          <div className="stat-block">
            <div className="stat-number">40–60%</div>
            <div className="stat-label">
              of current AI API spend is recoverable waste through routing and caching alone.
            </div>
            <div className="stat-source">Kentos field estimate · 2026</div>
          </div>
          <div className="stat-block">
            <div className="stat-number">15×</div>
            <div className="stat-label">
              average growth in token spend over 6 months for Series A+ teams shipping agents.
            </div>
            <div className="stat-source">15 engineering directors interviewed · Apr 2026</div>
          </div>
          <div className="stat-block">
            <div className="stat-number">$82K</div>
            <div className="stat-label">
              burned in 48 hours from a single leaked API key. Kentos would have caught it in 4
              minutes.
            </div>
            <div className="stat-source">Director of Eng, 10K-seat SaaS</div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem">
        <div className="problem-header">
          <span className="section-label">The problem</span>
          <h2 className="section-headline">
            Two problems.<br />One invoice.
          </h2>
        </div>
        <div className="problem-cols">
          <div className="problem-col">
            <div className="problem-col-label">01 · Waste</div>
            <h3 className="problem-col-title">
              Opus reviewing<br />production logs.
            </h3>
            <p className="problem-col-body">
              Companies use the most expensive models for the simplest tasks. Claude Opus reviewing
              log files. GPT-4o answering FAQ queries. No routing to cheaper models, no semantic
              caching, no prompt compression.
            </p>
            <p className="problem-col-body">
              The waste isn&apos;t a secret — it&apos;s just invisible. No one task looks
              expensive. The sum is ruinous.
            </p>
            <div className="problem-stat">↑ 40–60% of API spend is recoverable</div>
          </div>
          <div className="problem-col">
            <div className="problem-col-label">02 · Blindness</div>
            <h3 className="problem-col-title">
              The CFO learns from<br />the invoice.
            </h3>
            <p className="problem-col-body">
              Even if a company wanted to control AI costs, there is nothing to control them with.
              No cost attribution per department, per agent, or per project. No budget limits per
              team.
            </p>
            <p className="problem-col-body">
              No forecasting. The invoice is the first signal. By then, the damage is done.
            </p>
            <div className="problem-stat">The invoice shouldn&apos;t be the first signal.</div>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="solution">
        <div className="solution-inner">
          <div className="solution-header">
            <span className="section-label">Our solution</span>
            <h2 className="section-headline">
              A middleware layer.<br />Three jobs. One bill.
            </h2>
          </div>
          <div className="solution-cols">
            <div className="solution-col">
              <div className="sol-number">01 · Meter it</div>
              <h3 className="sol-title">
                Real-time visibility.<br />Per agent<span>.</span>
              </h3>
              <p className="sol-body">
                Cost attribution per department, team, and agent. Budget limits with real-time
                alerts. Chargeback reports your finance team can actually read.
              </p>
              <div className="sol-saving">CFO dashboard · Forecast · Chargeback</div>
            </div>
            <div className="solution-col">
              <div className="sol-number">02 · Optimise it</div>
              <h3 className="sol-title">
                Route smarter.<br />Spend less<span>.</span>
              </h3>
              <p className="sol-body">
                Routes each request to the cheapest model that meets the quality bar. Simple tasks
                to Haiku. Complex reasoning to Sonnet. Sensitive data to local models.
              </p>
              <div className="sol-saving">Estimated saving: 40–60% on API costs</div>
            </div>
            <div className="solution-col">
              <div className="sol-number">03 · Prove it</div>
              <h3 className="sol-title">
                Before / after.<br />Every time<span>.</span>
              </h3>
              <p className="sol-body">
                No other product on the market can produce a before/after ROI report, because
                generating it requires being both the optimization layer and the financial layer
                simultaneously. Kentos is both.
              </p>
              <div className="sol-saving">CFO-grade ROI proof · Every pilot</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section>
        <hr className="rule" />
        <div className="cta-band">
          <div>
            <h2 className="cta-headline">
              We&apos;re talking to 30 teams.<br />Is yours one of them?
            </h2>
            <p className="cta-sub">
              We&apos;re in early discovery — no pitch, no demo. We want to understand how AI spend
              works inside your org before we build anything. If it resonates, let&apos;s talk.
            </p>
          </div>
          <div className="cta-actions">
            <a
              className="btn-primary"
              href="https://calendly.com/tomasz-kentos/30min"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a call →
            </a>
            <a className="btn-outline" href="#waitlist">
              Get Early Access →
            </a>
            <p className="form-note" style={{ marginTop: '4px' }}>
              No pitch. Just a conversation.
            </p>
          </div>
        </div>
        <hr className="rule" />
      </section>

      {/* FOOTER */}
      <footer>
        <a className="logo" href="#">
          kentos<span className="logo-period" /><span className="logo-ai">ai</span>
        </a>
        <span className="footer-tagline">close the open bar.</span>
        <div className="footer-links">
          <a className="footer-link" href="mailto:hello@kentos.ai">hello@kentos.ai</a>
          <a className="footer-link" href="#">Privacy</a>
          <a className="footer-link" href="#">© 2026 Kentos AI</a>
        </div>
      </footer>
    </>
  )
}
