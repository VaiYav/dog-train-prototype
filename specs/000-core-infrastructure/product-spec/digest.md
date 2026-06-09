# Phase Digest — Product Spec (000-core-infrastructure)

**Phase:** 2 — Product Spec · **Date:** 2026-06-09 · **Mode:** standard

## Key decisions
- **Target users:** «Новачок-власник» (0–12 міс із собакою) + «Зайнятий досвідчений власник».
- **Топ-3 user stories:** US-1 профіль собаки; US-4 «Сьогодні» з 3 завданнями (дефолт); US-5 офлайн-відмітки + прогрес.
- **4 рішення користувача внесено:** trial одразу (без картки) · догляд/здоров'я у скоупі · D0 = 3 завдання · онбординг = 8 кроків.
- **Стек переорієнтовано** на клікабельні HTML-прототипи, mobile-first.

## Artifacts produced
- `product-spec/product-spec.md` — PRD v1.1 (persona, 10 stories, 11 FR, NFR, ризики, decision log).
- `product-spec/user-journey.md` — потоки Активація (D0) і Повернення (D2).
- `product-spec/wireframes.md` — 7 ASCII-екранів, mobile-first.
- `product-spec/metrics.md` — KPI, leading-індикатори, guardrails, anti-metrics.
- `product-spec/README.md` — індекс + key decisions.

## Open risks (forward to Revalidation / Bridge)
- **8 кроків ↑ drop-off** — мітигація: односкрокові екрани + per-step трекінг (verify у revalidation).
- **Trial одразу vs «ранній paywall антипаттерн»** — мітигація: повний доступ під час trial, paywall після першої перемоги; час paywall — A/B-кандидат.
- Фундамент не лікує відтік сам — лікування у Фазі 3.

## Handoff notes
- Bridge → `spec.md` має зберегти: 8 кроків, 3 завдання D0, догляд/здоров'я в Must, trial у Must, HTML-прототипи mobile-first, схему подій.
- Аналітику (імітований `trackEvent`) робити першою — це передумова Фази 2.
- Поверхня «Сьогодні» — точка, на яку стане retention-MVP «Daily Focus» (Фаза 3).
