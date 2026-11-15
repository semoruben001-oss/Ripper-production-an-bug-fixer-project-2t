import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className="hero hero--primary">
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

const STEPS = [
  {
    title: 'Detect',
    text: 'GitHub webhooks or Sentry alerts catch the error the moment it happens.',
  },
  {
    title: 'Diagnose',
    text: 'RAG over your codebase finds the root cause, not just the symptom.',
  },
  {
    title: 'Patch',
    text: 'A surgical diff is generated — minimal, reviewable, no rewrites.',
  },
  {
    title: 'Validate',
    text: 'Your test suite runs in a Docker sandbox, with bounded retries.',
  },
  {
    title: 'Open the PR',
    text: 'A pull request opens with a Slack summary. A human approves.',
  },
];

const TIERS = [
  {
    name: 'Starter',
    price: '$79/mo',
    detail: '1,000 runs · $0.08 per extra run · up to 3 seats',
  },
  {
    name: 'Professional',
    price: '$349/mo',
    detail: '10,000 runs · $0.05 per extra run · up to 15 seats',
  },
  {
    name: 'Scale',
    price: '$899/mo',
    detail: '35,000 runs · $0.03 per extra run · unlimited seats',
  },
];

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="AI that finds, fixes, and validates bugs, then opens the PR">
      <HomepageHeader />
      <main>
        <section className="container" style={{paddingTop: '2rem'}}>
          <h2>From crash to commit in five moves</h2>
          {STEPS.map((step) => (
            <div key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </section>
        <section className="container" style={{paddingBottom: '2rem'}}>
          <h2>Pricing</h2>
          {TIERS.map((tier) => (
            <div key={tier.name}>
              <h3>
                {tier.name} — {tier.price}
              </h3>
              <p>{tier.detail}</p>
            </div>
          ))}
          <p>
            Custom deployments from $1,500/mo. Questions? Email
            ripperrip667@gmail.com.
          </p>
        </section>
      </main>
    </Layout>
  );
}
