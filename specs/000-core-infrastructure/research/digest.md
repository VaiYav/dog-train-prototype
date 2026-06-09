# Phase Digest — Research (000-core-infrastructure)

**Phase:** 1 — Research · **Date:** 2026-06-09 · **Mode:** standard

## Key decisions
- Запущено 5 дименсій (competitors, ux-patterns, codebase, tech-stack, metrics-roi).
- **Топ-3 знахідки:** (1) розрив ринку — єдиний щоденний цикл догляду; (2) головний екран має бути «Сьогодні» з першою перемогою, без раннього paywall і без стіни тижневого плану; (3) галузеві бенчмарки підтверджують: корінь відтоку — активація/звичка → лікується retention-фічами поверх фундаменту.
- Стек: **клікабельні HTML-прототипи, mobile-first** (HTML+CSS+vanilla JS, phone-frame, localStorage, імітований `trackEvent`, rules-engine у JS, A/B-перемикач). Прод (майбутнє): RN/Flutter + PostHog.

## Artifacts produced
- `research/competitors.md` — 5 застосунків, патерни, розриви, топ-3 референси.
- `research/ux-patterns.md` — потоки, стани, патерни, a11y, антипаттерни.
- `research/codebase-analysis.md` — greenfield, цільова архітектура, обмеження, **стартова схема подій**.
- `research/tech-stack.md` — рекомендований стек без ML.
- `research/metrics-roi.md` — бенчмарки активації/утримання, KPI.
- `research/README.md` — індекс + синтез.

## Open risks (forward to Product Spec)
- Глибина онбордингу vs персоналізація; 1 чи 3 завдання в D0; скоуп блоку «догляд/здоров'я» у фундаменті.
- Фундамент не лікує відтік сам по собі — це робота Фаз 2–3.

## Handoff notes
- **Аналітику й модель даних робити першими** — без подій Фаза 2 неможлива.
- Екран «Сьогодні» — критична поверхня, на яку згодом стане retention-MVP «Daily Focus».
- Тримати ранній paywall поза фундаментом до першої перемоги.
