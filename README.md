# 🤖 NA Bug-Fixer

> **AI that finds, fixes, and validates bugs automatically — before your team even wakes up.**

[![Request a Demo](https://img.shields.io/badge/Request%20a%20Demo-4CAF50?style=for-the-badge&logo=google-chrome&logoColor=white)](https://untitled-app-cbf191a2.base44.app/LeadForm)
[![Pricing](https://img.shields.io/badge/View%20Pricing-1a1a2e?style=for-the-badge&logo=google-chrome&logoColor=white)](https://untitled-app-cbf191a2.base44.app/Pricing)

---

## What is NA Bug-Fixer?

NA Bug-Fixer is an **agentic AI system** that plugs into your codebase and automatically:

1. **Detects** errors via GitHub webhooks or Sentry alerts
2. **Diagnoses** the root cause using RAG-powered codebase indexing
3. **Generates** a surgical, targeted patch (no collateral damage)
4. **Validates** the fix by running your test suite in a Docker sandbox
5. **Opens a PR** with a full summary — posted to Slack before anything is merged

No engineer gets paged. No 3am firefighting. Just a PR waiting in the morning.

---

## How It Works

```
Error Alert (GitHub / Sentry)
        │
        ▼
  Context Indexing (LangChain RAG)
        │
        ▼
  Root Cause Analysis (Claude / GPT-5)
        │
        ▼
  Patch Generation (JSON-structured diff)
        │
        ▼
  Validation (Docker → pytest)
        │
     ┌──┴──┐
   PASS   FAIL
     │      │
   Open PR  Retry (up to N iterations)
     │
  Slack Summary → Human Approval
```

---

## Dual-Mode Operation

| Mode | How to trigger | Use case |
|------|---------------|----------|
| **GUI (Desktop)** | Launch the app | Manual runs, demos, monitoring |
| **Headless (CI/CD)** | Set `RUN_HEADLESS=True` | GitHub Actions, automated pipelines |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Orchestration | LangGraph (stateful agentic loop) |
| Context / RAG | LangChain + FAISS / Pinecone |
| LLM | Claude 4.7 Opus / GPT-5-mini |
| Sandbox | Docker + pytest |
| Triggers | GitHub Actions / Sentry Webhooks |
| UI | Python Tkinter (GUI mode) |

---

## Safety Guardrails

- ✅ **Human-in-the-loop** — AI posts a Slack summary before any deployment
- ✅ **Token limit** — hard cap on iterations so it never loops infinitely
- ✅ **Read-only context** — AI reads the full repo but only writes to a `fix/` branch
- ✅ **Docker sandbox** — fixes are validated in isolation, never on your host

---

## System Prompt (Phase 2 — Bug Fixer)

```
You are a Senior Site Reliability Engineer. When given a stack trace, follow these steps:
1. Identify the file and line.
2. Explain the root cause.
3. Provide a JSON-formatted patch.
4. Do not delete existing logic unless it is the source of the bug.
```

---

## CLI Triggers

| Command | Action |
|---------|--------|
| `run the bug` | Triggers Diagnostic Module — scans logs/errors |
| `deploy for real bug` | Execution Mode — pushes fix to staging branch |
| `deploy for real book` | Generates documentation/manifest for the fix |
| `rip Ripper project` | Global reset — clears vector DB and agent memory |

---

## Pricing

| Plan | Price | Best For |
|------|-------|----------|
| Starter | $299/mo | Small teams |
| Pro | $799/mo | Fast-moving engineering orgs |
| Enterprise | Custom | Large orgs, on-prem |

---

## 🚀 Get Started

[![Request a Free Demo](https://img.shields.io/badge/Request%20a%20Free%20Demo-4CAF50?style=for-the-badge&logo=google-chrome&logoColor=white)](https://untitled-app-cbf191a2.base44.app/LeadForm)

Or email: **ripperrip667@gmail.com**

---

*Built by Ruben Anselmo Ramos IV*
