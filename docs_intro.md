---
sidebar_position: 1
---

# Ripper Bug Fixer

NA Bug-Fixer is an agentic AI that detects errors, diagnoses the root cause, generates a surgical patch, validates it in a Docker sandbox, and opens a pull request — with a Slack summary for human approval.

## How it works

1. **Detect** — GitHub webhooks or Sentry alerts catch the error.
2. **Diagnose** — RAG over your codebase finds the root cause.
3. **Patch** — A surgical, JSON-structured diff is generated.
4. **Validate** — Your test suite runs in a Docker sandbox, with bounded retries.
5. **Open the PR** — A pull request opens with a Slack summary. A human approves.

## Run it

Desktop GUI or headless in CI/CD via GitHub Actions.

## Pricing

- **Starter — $79/mo**: 1,000 runs, $0.08 per extra run, up to 3 seats
- **Professional — $349/mo**: 10,000 runs, $0.05 per extra run, up to 15 seats
- **Scale — $899/mo**: 35,000 runs, $0.03 per extra run, unlimited seats
- **Custom deployments**: $1,500/mo base + per-execution pricing

Questions? Email ripperrip667@gmail.com.
