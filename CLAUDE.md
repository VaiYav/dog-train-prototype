# DogTrain — Product Forge / Spec Kit test case

This repo is a **product-management deliverable, not an application codebase**. The product is **DogTrain** (a dog health / activity / training mobile app); the actual task is a test case — analyze the app's early-retention churn and design a retention MVP — run end-to-end through the **Product Forge → Spec Kit** spec-driven workflow. Outputs are **Markdown (canonical) + generated HTML + clickable HTML prototypes**. Very little code exists yet: this is design-first.

> **Start here:** `docs/00-master-plan.md` (orientation — what/why/in what order). Then `.specify/memory/constitution.md` (product principles) and the live status in `specs/000-core-infrastructure/.forge-status.yml`.

## Non-negotiable conventions

- **Every product deliverable is written in Ukrainian (uk).** (This meta file is English — that's fine.) `en` is a secondary locale.
- **Markdown is the source of truth; HTML is generated from it** — don't hand-author HTML that diverges from the MD.
- **No reports in the repo root.** Features → `specs/<feature>/`, cross-cutting docs → `docs/`, governance → `.specify/memory/`.
- **All numbers are marked estimates.** There is no real DogTrain data; RICE scores, metrics and baselines are explicitly-labeled assumptions from industry benchmarks — never present them as facts.
- **No custom AI/ML.** Rules-/template-based only, unless a 4-person team (2 dev / 1 designer / 1 analyst) could ship it in 2 weeks.
- **Honesty over polish** — surface tensions and risks; mark assumptions explicitly.
- The **constitution** (`.specify/memory/constitution.md`, Ukrainian, v1.0.0) gates every feature at the Plan phase: user-value/activation-first · analytics-first (every key action emits an event) · humane engagement (no dark patterns; no hard paywall before the user's first win) · simplicity/YAGNI · accessibility & mobile-first (WCAG 2.1 AA, offline-tolerant).

## Repo map

```
docs/00-master-plan.md/.html        # orientation + roadmap (READ FIRST)
docs/product/01-churn-analysis.*    # Phase 2 deliverable — NOT yet created
docs/index.html                     # Phase 4 hub — NOT yet created
.product-forge/config.yml           # feature registry, modes, locales (uk/en)
.specify/memory/constitution.md     # product principles (gate in Plan phase)
.specify/                           # Spec Kit engine: scripts/ templates/ extensions/ + extensions.yml hooks
prototype/                          # SHARED clickable app — no-build Web Components, file://-safe, Vercel-static
  index.html                        #   foundation + AI (000 + 002–006); daily-focus.html = 001 A/B demo
  shared/tokens.css                 #   design tokens + phone frame (linked by every page)
  foundation/app.js + features/     #   global core; each AI feature = one <dt-*>.js custom element
  README.md                         #   structure + "add a feature = 1 file + 1 tag" + Vercel deploy
specs/000-core-infrastructure/      # Phase 1 foundation (forged through Tasks; .forge-status.yml = status truth)
  problem-discovery/ research/ product-spec/ spec.md plan.md tasks.md review.md sync-report.md
specs/001-daily-focus/              # Phase 3 retention MVP (forged) · 002–006 = AI track · ai-personalization-context = shared enabler
```

## Workflow: Product Forge → Spec Kit

Product Forge orchestrates a phased pipeline with a **human gate after every phase**, recorded per feature in `.forge-status.yml`:

`Problem Discovery → Research → Product Spec → Revalidation → Bridge (spec.md) → Plan → Tasks → [Implement → Code Review → Verify → …]`

Spec Kit backs the Bridge/Plan/Tasks/Implement stages. Modes: `lite` / `standard` / `v-model` — this project uses **standard**.

## Current status (per `.forge-status.yml`, 2026-06-09)

`.forge-status.yml` is the status source of truth; the master-plan §9 table is stale — trust the tracker.

- **`000-core-infrastructure`** — Problem Discovery → **Tasks all completed/approved**. Prototype code (`prototype/*.html|*.js`) **not written yet**; next gate is pre-impl review.
- **Phase 2 — `docs/product/01-churn-analysis.md`** (≥3 Day1/Day2 event cohorts to compare, 5 hypotheses + test methods, RICE prioritization + Confidence rationale for the top feature): **not created** — this is the next major deliverable.
- **Phase 3 — `specs/001-daily-focus/`** (retention "Daily Focus" MVP + clickable prototype + 2-week to-dos + A/B design): **not created**. It MUST reuse the foundation's **Consumer Contract** in `specs/000-core-infrastructure/spec.md`: the `trackEvent` schema, the `Dog/Plan/Task/Completion/CareEvent` entities, the "Сьогодні" (Today) screen slot, and the `getVariant` A/B hook — breaking these cascades.

## Spec Kit commands (invoke separator is `-`)

`/speckit-specify` · `/speckit-clarify` · `/speckit-plan` · `/speckit-tasks` · `/speckit-analyze` · `/speckit-implement` · `/speckit-checklist` · `/speckit-constitution` · `/speckit-taskstoissues`. Typical order: specify → (clarify) → plan → tasks → (analyze) → implement. Backing scripts are in `.specify/scripts/bash/` (`script: sh`).

## Extensions & hooks

`.specify/extensions.yml` wires hooks that fire automatically (`auto_execute_hooks: true`):
- **git** — creates a sequential feature branch (`001-…`) before `/speckit-specify`. Auto-commit hooks are wired before/after phases but **disabled by default** (`.specify/extensions/git/git-config.yml` → `auto_commit.default: false`, every per-event flag `false`), so they don't actually commit.
- **agent-context** — after specify/plan, rewrites the managed block at the bottom of this file.

## ⚠️ This file is partly machine-managed

The block at the **bottom**, delimited by the HTML-comment `SPECKIT START` / `SPECKIT END` markers, is auto-rewritten by `.specify/extensions/agent-context/scripts/bash/update-agent-context.sh` (on `after_specify` / `after_plan`). **Keep the markers; don't hand-edit between them** — everything outside the markers is preserved. The script matches the *first* occurrence of each marker, so never reproduce the literal marker comment anywhere above the real block.

## Git

Branch `main`; one commit; most product artifacts are currently **untracked**. `branch_numbering: sequential`. Commit only when the user asks — don't auto-commit artifacts on their behalf.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/000-core-infrastructure/plan.md
<!-- SPECKIT END -->
