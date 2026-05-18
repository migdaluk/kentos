'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'

const TEAMS  = ['acme-prod', 'support-bot', 'ingest-pipe', 'sales-co', 'dev/jane', 'agent-7', 'eval-runner', 'cron/q']
const MODELS = [
  { name: 'opus-4.5',   base: 0.42 },
  { name: 'sonnet-4.5', base: 0.08 },
  { name: 'haiku-4.5',  base: 0.012 },
  { name: 'gpt-5',      base: 0.31 },
  { name: 'gemini-2.5', base: 0.07 },
  { name: 'mistral-l',  base: 0.04 },
]

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function fmtMoney(n: number) {
  if (n < 0.01) return '$' + n.toFixed(4)
  if (n < 1)    return '$' + n.toFixed(3)
  return '$' + n.toFixed(2)
}
function fmtTime(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`
}

interface TickerLine {
  id: number
  time: string
  who: string
  cost: string
  warn: boolean
  kill: boolean
}

export default function V2Page() {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [privacy, setPrivacy]     = useState(false)

  // Ticker state
  const [lines, setLines]   = useState<TickerLine[]>([])
  const [spendMin, setSpendMin] = useState(4.12)
  const [saved, setSaved]   = useState(38420)
  const [killed, setKilled] = useState(2)
  const lineId = useRef(0)

  // Seed + interval
  useEffect(() => {
    let spend = 4.12
    let sv    = 38420
    let kl    = 2

    function makeLine(): TickerLine {
      const model  = rand(MODELS)
      const team   = rand(TEAMS)
      const tokens = Math.floor(Math.random() * 80000) + 800
      const cost   = (tokens / 1000) * model.base * (0.8 + Math.random() * 0.5)
      const isWarn = Math.random() < 0.09
      const isKill = Math.random() < 0.03
      const action = isKill ? ' · KILL · loop · cap hit' : ''
      return {
        id:   ++lineId.current,
        time: fmtTime(new Date()),
        who:  `${team} · ${model.name} · ${tokens.toLocaleString()} tok${action}`,
        cost: fmtMoney(cost),
        warn: isWarn,
        kill: isKill,
      }
    }

    function tick() {
      const line = makeLine()
      if (line.kill) kl++
      spend += (Math.random() - 0.45) * 0.4
      if (spend < 1.2) spend = 1.2
      if (spend > 9.6) spend = 9.6
      sv += Math.random() * 24
      setLines(prev => [...prev.slice(-25), line])
      setSpendMin(spend)
      setSaved(sv)
      setKilled(kl)
    }

    // Seed 16 lines
    const seed: TickerLine[] = []
    for (let i = 0; i < 16; i++) seed.push(makeLine())
    setLines(seed)

    const id = setInterval(tick, 900)
    return () => clearInterval(id)
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {}
    setSubmitted(true)
  }

  // Close modal on backdrop click / Escape
  useEffect(() => {
    if (!privacy) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPrivacy(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [privacy])

  return (
    <div className="v2">

      {/* ── LOGO BAR ── */}
      <div className="logo-band">
        <div className="wrap">
          <div className="logo-bar">
            <a href="/" className="mark" aria-label="Kentos AI">
              kentos<span className="dot" /><span className="ai">ai</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── PAPER MAIN ── */}
      <div className="paper-main">

        {/* TOP BAR */}
        <div className="topbar">
          <div className="wrap">
            <div className="topbar-inner">
              <a href="/" className="mark" aria-label="Kentos AI">
                kentos<span className="dot" /><span className="ai">ai</span>
              </a>
              <nav className="nav">
                <a href="/">v1</a>
                <a className="live" href="#">Live beta</a>
              </nav>
              <div className="topbar-ctas">
                <a className="btn outline" href="https://calendly.com/tomasz-kentos/30min" target="_blank" rel="noopener noreferrer">
                  Book a call
                </a>
                <a className="btn" href="#hero-form">
                  Get early access <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <div className="hero-grid">

              {/* Left */}
              <div>
                <div className="eyebrow">Surprised with the AI invoice?</div>
                <h1 className="hero-head" style={{ fontSize: 'clamp(56px, 7vw, 100px)' }}>
                  Close<br />the open bar<span className="end-dot" />
                </h1>
                <p className="hero-lede" style={{ fontSize: '20px' }}>
                  AI costs are rising faster than any other line in your budget: unpredictable,
                  wasteful, and invisible until the bill arrives. Kentos gives you control to make
                  your token spend smarter.&nbsp;&nbsp;
                  <strong className="lede-bold">A modern payroll for your agents.</strong>
                </p>
                <form id="hero-form" className="hero-cta" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    className="hero-email"
                    placeholder="work email"
                    required
                    aria-label="Work email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={submitted}
                  />
                  <button type="submit" className="btn lg" disabled={submitted}>
                    {submitted
                      ? "Filed. We’ll reply by hand."
                      : <><span>Get early access</span><span className="arrow">→</span></>
                    }
                  </button>
                </form>
                <div className="hero-note">
                  <span className="swatch" style={{ backgroundColor: 'var(--ink)' }} />
                  NO SPAM — WE CONTROL OUR OWN EMAILS, TOO.
                </div>
              </div>

              {/* Right — Live ticker */}
              <div className="term" aria-label="Live spend ticker, sample data">
                <div className="term-bar">
                  <span className="left">Live · acme-prod · last 60s</span>
                  <span>kentos · mtr</span>
                </div>
                <div className="term-body">
                  {lines.map(l => (
                    <div
                      key={l.id}
                      className={`term-line${l.warn ? ' warn' : ''}${l.kill ? ' kill' : ''}`}
                    >
                      <span className="t">{l.time}</span>
                      <span className="who">{l.who}</span>
                      <span className="cost">{l.cost}</span>
                    </div>
                  ))}
                </div>
                <div className="term-foot">
                  <div>
                    Spend / min
                    <span className="num">${spendMin.toFixed(2)}</span>
                  </div>
                  <div>
                    Saved this month
                    <span className="num yellow">${Math.round(saved).toLocaleString()}</span>
                  </div>
                  <div>
                    Killed loops
                    <span className="num red">{String(killed).padStart(2, '0')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      {/* ── TICKER BAND ── */}
      <div className="tickerband" aria-hidden="true">
        <div className="tickerband-track">
          {[
            'Close the open bar',
            'Payroll, but for your agents',
            'The invoice shouldn’t be the first signal',
            '40–60% of agent calls are waste',
            '15× spread between cheapest valid model and the one engineers pick',
            '$82.4k preventable monthly spend at a 40-engineer Series A',
            '9 days · 14,000 retries / hr · $42,400 bill',
            'Close the open bar',
            'Payroll, but for your agents',
            'The invoice shouldn’t be the first signal',
            '40–60% of agent calls are waste',
            '15× spread between cheapest valid model and the one engineers pick',
            '$82.4k preventable monthly spend at a 40-engineer Series A',
            '9 days · 14,000 retries / hr · $42,400 bill',
          ].map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      {/* ── MINI FOOTER ── */}
      <div className="mini-foot-band">
        <div className="wrap">
          <div className="mini-foot">
            <span className="copy">© Kentos.AI 2026</span>
            <a href="mailto:contact@kentos.ai">contact@kentos.ai</a>
            <button onClick={() => setPrivacy(true)}>Privacy policy</button>
          </div>
        </div>
      </div>

      {/* ── PRIVACY MODAL ── */}
      <div
        className={`modal${privacy ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        onClick={() => setPrivacy(false)}
      >
        <div className="modal-card" onClick={e => e.stopPropagation()}>
          <div className="modal-head">
            <span className="label"><span className="dot" />Legal · Privacy</span>
            <button className="modal-close" type="button" aria-label="Close" onClick={() => setPrivacy(false)}>✕</button>
          </div>
          <div className="modal-body">
            <h1 id="privacy-title">Privacy <em>Policy</em></h1>
            <div className="updated">Kentos.ai — Early access · Last updated May 2026</div>

            <p>Kentos.ai is operated by <strong>Tomasz Rudolf Impact Hills</strong>, ul. Sarmacka 16/52, 02-972 Warszawa, NIP 5261142291 (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By submitting your email address, you agree to this notice.</p>

            <h2>What we collect</h2>
            <p>Your work email address.</p>

            <h2>Why we collect it</h2>
            <p>To contact you about early access to Kentos.ai, share product updates, and arrange introductory calls at your request.</p>

            <h2>Legal basis (GDPR)</h2>
            <p>We process your data on the basis of your consent (Art. 6(1)(a) GDPR), given at the moment of form submission.</p>

            <h2>How we use it</h2>
            <p>We will only use your email to communicate about Kentos.ai. We will not sell, rent, or share your data with third parties for marketing purposes.</p>

            <h2>Transfer to a new entity</h2>
            <p>Kentos.ai is currently operated as a sole trader business. When a new legal entity is incorporated to operate Kentos.ai (e.g. a limited company or corporation), your data may be transferred to that entity as part of a business continuation. You will be notified of any such transfer and retain the right to withdraw consent at any time.</p>

            <h2>Your rights</h2>
            <p>You have the right to access, correct, or delete your data at any time, as well as the right to withdraw consent and object to processing. To exercise any of these rights, email: <a href="mailto:contact@kentos.ai">contact@kentos.ai</a>.</p>

            <h2>How long we keep your data</h2>
            <p>Until you unsubscribe, ask us to delete it, or 24 months from the date of collection — whichever comes first.</p>

            <h2>Complaints</h2>
            <p>If you believe your data is being processed unlawfully, you have the right to lodge a complaint with the Polish supervisory authority: Urząd Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa, <a href="https://www.uodo.gov.pl" target="_blank" rel="noopener noreferrer">www.uodo.gov.pl</a>.</p>
          </div>
        </div>
      </div>

    </div>
  )
}
