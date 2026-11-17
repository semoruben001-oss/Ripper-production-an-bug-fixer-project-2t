import React, {useState} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const ACCENT = '#ff6b1a';
const ACCENT_SOFT = '#ffb27d';
const BG = '#0c0d10';
const CARD = '#171a21';
const TEXT = '#e8eaf0';
const MUTED = '#a7adbb';
const LINE = '#262b36';

const REPO_URL =
  'https://github.com/semoruben001-oss/Ripper-production-an-bug-fixer-project-2t';
const CONTACT = 'ripperrip667@gmail.com';
const STRIPE = {
  starter: 'https://buy.stripe.com/aFa28senb99u8tpd5f1VK06',
  professional: 'https://buy.stripe.com/5kQ28sdj75Xi8tp4yJ1VK07',
  scale: 'https://buy.stripe.com/00w14ogvj2L6eRN2qB1VK08',
};
const MAX_LOG_CHARS = 1800;

const sectionStyle = {padding: '48px 20px', maxWidth: 960, margin: '0 auto'};
const h2Style = {
  fontSize: 28,
  margin: '0 0 12px',
  color: '#fff',
  textTransform: 'uppercase',
  letterSpacing: '-0.01em',
};
const kickerStyle = {
  color: ACCENT,
  fontWeight: 800,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  fontSize: 13,
};

function PasteTool() {
  const [email, setEmail] = useState('');
  const [log, setLog] = useState('');
  const [model, setModel] = useState('Claude');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const truncated =
    log.length > MAX_LOG_CHARS
      ? log.slice(0, MAX_LOG_CHARS) +
        '\n\n[Truncated — first ' +
        MAX_LOG_CHARS +
        ' characters sent. Paste the rest in a follow-up email if needed.]'
      : log;
  const subject = 'NA Bug-Fixer — fix my error (' + model + ')';
  const body =
    'Model: ' + model + '\nFrom: ' + email + '\n\nError log:\n' + truncated;
  const mailto =
    'mailto:' +
    CONTACT +
    '?subject=' +
    encodeURIComponent(subject) +
    '&body=' +
    encodeURIComponent(body);
  const gmailUrl =
    'https://mail.google.com/mail/?view=cm&fs=1&to=' +
    CONTACT +
    '&su=' +
    encodeURIComponent(subject) +
    '&body=' +
    encodeURIComponent(body);

  function send() {
    setError('');
    setCopied(false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Add your email address so the fix can come back to you.');
      return;
    }
    if (!log.trim()) {
      setError('Paste your error log first — traceback, stack trace, or failing test output.');
      return;
    }
    const a = document.createElement('a');
    a.href = mailto;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setSent(true);
  }

  function copyLog() {
    const text = body;
    function done() {
      setCopied(true);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        fallbackCopy(text);
        done();
      });
    } else {
      fallbackCopy(text);
      done();
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      /* clipboard unavailable */
    }
    ta.remove();
  }

  const inputStyle = {
    width: '100%',
    background: '#0f1115',
    color: TEXT,
    border: '1px solid ' + LINE,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  };

  return (
    <div
      style={{
        background: CARD,
        border: '1px solid ' + LINE,
        borderRadius: 14,
        padding: 20,
        marginTop: 28,
      }}>
      <label
        htmlFor="errlog"
        style={{display: 'block', fontWeight: 700, marginBottom: 8}}>
        Paste your error log — try it now
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email — the fix comes back here"
        style={inputStyle}
      />
      <textarea
        id="errlog"
        value={log}
        onChange={(e) => setLog(e.target.value)}
        placeholder="Paste the traceback, stack trace, or failing test output here…"
        style={{
          width: '100%',
          minHeight: 140,
          background: '#0f1115',
          color: TEXT,
          border: '1px solid ' + LINE,
          borderRadius: 10,
          padding: 12,
          fontFamily:
            'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
          fontSize: 14,
          resize: 'vertical',
        }}
      />
      <div
        style={{display: 'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0'}}
        role="group"
        aria-label="Pick a model">
        {['Claude', 'ChatGPT', 'Gemini'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setModel(m)}
            style={{
              border: '1px solid ' + LINE,
              background: model === m ? ACCENT : 'transparent',
              borderColor: model === m ? ACCENT : LINE,
              color: model === m ? '#fff' : TEXT,
              borderRadius: 999,
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: model === m ? 700 : 400,
            }}>
            {m}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={send}
        style={{
          display: 'inline-block',
          padding: '12px 20px',
          borderRadius: 10,
          background: ACCENT,
          color: '#fff',
          fontWeight: 700,
          border: 0,
          cursor: 'pointer',
          fontSize: 16,
        }}>
        Send my error for a fix
      </button>
      {error && (
        <p style={{color: '#ff7a7a', margin: '12px 0 0'}}>{error}</p>
      )}
      {sent && (
        <p style={{color: MUTED, margin: '12px 0 0'}}>
          Opening your email app… If nothing opened, use one of these:
        </p>
      )}
      {sent && (
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12}}>
          <a
            href={gmailUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              borderRadius: 10,
              background: 'transparent',
              border: '1px solid ' + LINE,
              color: TEXT,
              textDecoration: 'none',
              fontWeight: 700,
            }}>
            Open in Gmail
          </a>
          <button
            type="button"
            onClick={copyLog}
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              borderRadius: 10,
              background: 'transparent',
              border: '1px solid ' + LINE,
              color: TEXT,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 15,
            }}>
            {copied ? 'Copied!' : 'Copy the email text'}
          </button>
        </div>
      )}
      <p style={{color: MUTED, fontSize: 14, margin: '16px 0 0'}}>
        This sends your pasted log by email to the founder, who runs it
        through the agent and replies with the diagnosis and patch. First
        customers onboard by email — a human reviews every fix before
        anything merges.
      </p>
    </div>
  );
}

const STEPS = [
  {
    n: '01',
    title: 'Paste the error',
    text: 'Drop in your stack trace, terminal dump or raw exception. No formatting. No cleanup.',
  },
  {
    n: '02',
    title: 'Pick your brain',
    text: 'Claude, ChatGPT or Gemini — switch brains on every fix. The fix is generated against your actual code and stack.',
  },
  {
    n: '03',
    title: 'Ship the fix',
    text: 'Get a 2-sentence diagnosis and a tested diff back by email. Paste it back, run your tests, ship it.',
  },
];

const CARDS = [
  {
    title: 'Works in every stack',
    text: 'Python, JS, TS, Go, Rust, Java, C#, Ruby, PHP, Swift — and more.',
  },
  {
    title: 'No cleanup required',
    text: 'Designed to read raw exceptions. No formatting required.',
  },
  {
    title: 'Your code stays yours',
    text: 'Your code is never used to train. Each fix is a fresh session.',
  },
  {
    title: 'Root-cause first',
    text: 'Get a 2-sentence diagnosis before the patch. Learn while you ship.',
  },
  {
    title: 'Three AI brains',
    text: 'Switch between Claude, ChatGPT and Gemini on every fix.',
  },
  {
    title: 'History on tap',
    text: 'Every fix saved. Search, copy, re-use across projects.',
  },
];

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    per: '/ forever',
    points: [
      '3 bug fixes / day',
      'Claude, ChatGPT & Gemini',
      'Screenshot & file uploads',
      'Fix history (last 50)',
      '1 seat',
    ],
    cta: 'Try it free',
    href: '#try-it',
  },
  {
    name: 'Starter',
    price: '$79',
    per: '/ month',
    tag: 'Most popular',
    points: [
      '1,000 runs / month',
      '$0.08 per extra run',
      'Up to 3 seats',
      'Claude, ChatGPT & Gemini',
      'Screenshot & file uploads',
      'Email support',
    ],
    cta: 'Get Starter',
    href: STRIPE.starter,
  },
  {
    name: 'Professional',
    price: '$349',
    per: '/ month',
    points: [
      '10,000 runs / month',
      '$0.05 per extra run',
      'Up to 15 seats',
      'Custom system prompts',
      'Everything in Starter',
      'Priority support',
    ],
    cta: 'Get Professional',
    href: STRIPE.professional,
  },
  {
    name: 'Scale',
    price: '$899',
    per: '/ month',
    tag: 'Highest tier',
    points: [
      '35,000 runs / month',
      '$0.03 per extra run',
      'Unlimited seats',
      'Custom system prompts',
      'Everything in Professional',
      'Dedicated success engineer',
    ],
    cta: 'Get Scale',
    href: STRIPE.scale,
  },
];

const cardStyle = {
  background: CARD,
  border: '1px solid ' + LINE,
  borderRadius: 14,
  padding: 20,
};

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Paste your error. Get a tested, production-ready fix. Built for the builders.">
      <main style={{background: BG, color: TEXT}}>
        <section style={sectionStyle}>
          <div style={kickerStyle}>[ The Bug Fixer ]</div>
          <h1
            style={{
              fontSize: 52,
              lineHeight: 1.05,
              margin: '12px 0',
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            }}>
            Stop debugging.
            <br />
            Start <span style={{color: ACCENT}}>shipping.</span>
          </h1>
          <p style={{fontSize: 19, color: MUTED, maxWidth: 720}}>
            Paste your error. Get a tested, production-ready fix — reviewed
            by a human before it ships. Built for the builders — no
            hand-holding, no guesswork, no 40-tab Stack Overflow spiral.
          </p>
          <div
            style={{display: 'flex', gap: 12, flexWrap: 'wrap', margin: '24px 0 8px'}}>
            <a
              href="#try-it"
              style={{
                display: 'inline-block',
                padding: '12px 20px',
                borderRadius: 10,
                background: ACCENT,
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 16,
              }}>
              Start fixing →
            </a>
            <a
              href="#pricing"
              style={{
                display: 'inline-block',
                padding: '12px 20px',
                borderRadius: 10,
                background: 'transparent',
                border: '1px solid ' + LINE,
                color: TEXT,
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 16,
              }}>
              See pricing
            </a>
          </div>
          <div id="try-it">
            <PasteTool />
          </div>
          <p style={{color: MUTED, fontSize: 14, marginTop: 16}}>
            Desktop GUI for manual runs and demos, or headless in CI/CD via
            GitHub Actions. Repo:{' '}
            <a href={REPO_URL} style={{color: ACCENT_SOFT}}>
              github.com/semoruben001-oss/Ripper-production-an-bug-fixer-project-2t
            </a>
          </p>
        </section>

        <section style={sectionStyle}>
          <div style={kickerStyle}>[ 01 / How it works ]</div>
          <h2 style={h2Style}>Fix any bug in three steps.</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: 16,
              marginTop: 20,
            }}>
            {STEPS.map((s) => (
              <div key={s.n} style={cardStyle}>
                <div
                  style={{
                    color: ACCENT,
                    fontWeight: 800,
                    fontSize: 13,
                    letterSpacing: '.14em',
                  }}>
                  {s.n}
                </div>
                <h3 style={{margin: '8px 0 6px', fontSize: 18, color: '#fff'}}>
                  {s.title}
                </h3>
                <p style={{color: MUTED, margin: 0}}>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={kickerStyle}>[ Grounded in your code ]</div>
          <h2 style={h2Style}>Not AI guesswork.</h2>
          <p style={{color: MUTED, maxWidth: 720}}>
            The diagnosis runs against your actual code — the agent searches
            the codebase the error points at and builds the fix from the
            files it finds. A generic chatbot guesses from training data;
            this one reads your repo first.
          </p>
        </section>

        <section style={sectionStyle}>
          <div style={kickerStyle}>[ 02 / Why Ripper ]</div>
          <h2 style={h2Style}>Built for builders who ship.</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: 16,
              marginTop: 20,
            }}>
            {CARDS.map((c) => (
              <div key={c.title} style={cardStyle}>
                <h3 style={{margin: '0 0 6px', fontSize: 18, color: '#fff'}}>
                  {c.title}
                </h3>
                <p style={{color: MUTED, margin: 0}}>{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" style={sectionStyle}>
          <div style={kickerStyle}>[ 03 / Pricing ]</div>
          <h2 style={h2Style}>
            Free to try. <span style={{color: ACCENT}}>$79 to scale.</span>
          </h2>
          <p style={{color: MUTED, maxWidth: 720}}>
            3 fixes per day on the free tier. Starter gives your team 1,000
            runs a month and 3 seats; Professional and Scale go up to 35,000
            runs. Every plan includes a monthly pool of AI runs shared by
            your whole team. Pick Claude, ChatGPT or Gemini on every fix.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: 16,
              marginTop: 20,
            }}>
            {TIERS.map((t) => (
              <div key={t.name} style={cardStyle}>
                {t.tag && (
                  <div
                    style={{
                      color: ACCENT,
                      fontWeight: 800,
                      fontSize: 12,
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                    }}>
                    {t.tag}
                  </div>
                )}
                <h3 style={{margin: '8px 0 0', fontSize: 18, color: '#fff'}}>
                  {t.name}
                </h3>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    margin: '4px 0 8px',
                    color: '#fff',
                  }}>
                  {t.price}
                  <span
                    style={{
                      fontSize: 15,
                      color: MUTED,
                      fontWeight: 400,
                    }}>
                    {t.per}
                  </span>
                </div>
                <ul
                  style={{
                    color: MUTED,
                    margin: '0 0 16px',
                    paddingLeft: 18,
                  }}>
                  {t.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <a
                  href={t.href}
                  style={{
                    display: 'inline-block',
                    padding: '12px 20px',
                    borderRadius: 10,
                    background: ACCENT,
                    border: '1px solid ' + ACCENT,
                    color: '#fff',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}>
                  {t.cta}
                </a>
              </div>
            ))}
          </div>
          <p style={{marginTop: 16, color: MUTED}}>
            <strong style={{color: TEXT}}>Custom deployments:</strong>{' '}
            $1,500/mo base platform fee, plus per execution — $0.04 (0–50,000
            runs/mo), $0.025 (50,001–250,000), $0.015 (250,001+).{' '}
            <a
              href={'mailto:' + CONTACT + '?subject=Custom%20deployment'}
              style={{color: ACCENT_SOFT}}>
              Email to talk
            </a>
            .
          </p>
          <p style={{color: MUTED, fontSize: 14}}>
            Runs reset every 30 days. Extra runs are sold in packs of 100.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Honest limitations</h2>
          <p style={{color: MUTED, maxWidth: 720}}>
            It is only as good as your test suite — if your tests don&apos;t
            catch the bug, validation won&apos;t either. And every patch
            still wants human eyes before merge. This replaces the 3am
            triage, not the engineer.
          </p>
          <p style={{color: MUTED}}>
            Built with LangGraph + Claude/GPT. Questions?{' '}
            <a href={'mailto:' + CONTACT} style={{color: ACCENT_SOFT}}>
              {CONTACT}
            </a>
          </p>
        </section>
      </main>
    </Layout>
  );
}
