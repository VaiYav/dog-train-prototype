# Feature: Daily Focus loop — retention MVP (`001-daily-focus`)

> Created: 2026-06-09 | Status: implement (clickable A/B prototype) complete
> RICE: **1275** (🥇) | Hypothesis: H2 reminders + minimal streak (H1)
> Depends on: [`000-core-infrastructure`](../000-core-infrastructure/README.md)

## Lifecycle Status
| Phase | Status | Doc |
|---|---|---|
| 0. Problem Discovery | ✅ | [problem-statement.md](./problem-discovery/problem-statement.md) |
| 1. Research | ✅ (reuse Phase 2) | [01-churn-analysis.md](../../docs/product/01-churn-analysis.md) |
| 2–4. Spec/Bridge | ✅ | [spec.md](./spec.md) |
| 5. Plan / ТЗ | ✅ | [plan.md](./plan.md) |
| 5B. Tasks / 2-week To-Do | ✅ | [tasks.md](./tasks.md) |
| Acceptance checklist | ✅ | [checklist.md](./checklist.md) |
| 6. Implement (MVP) | ✅ clickable A/B | [prototype/index.html](../../prototype/daily-focus.html) |

## Що це
Поверх «Сьогодні» фундаменту: **щоденне нагадування + гуманний стрік**, під A/B-флагом `daily_focus`. Замикає петлю **тригер → дія → винагорода** проти D2-обриву.

## Гіпотеза
> **Як** власник, який легко закидає догляд після першого дня, **я хочу** щоденне нагадування + видиму серію днів поспіль, **щоб** повертатись щодня й завершити перший тиждень.

## Deliverables тест-кейсу (частина 2) → де
| Вимога | Файл |
|---|---|
| Гіпотеза (формат) | [spec.md](./spec.md) §Гіпотеза |
| UX/UI ідеї + шаблони | [plan.md](./plan.md) §1 + [prototype/](../../prototype/daily-focus.html) |
| Логіка реалізації | [plan.md](./plan.md) §2 |
| Primary + Guardrail метрики | [plan.md](./plan.md) §3 |
| Acceptance criteria | [spec.md](./spec.md) + [checklist.md](./checklist.md) |
| To-Do команди на 2 тижні | [tasks.md](./tasks.md) |
| A/B-дизайн | [plan.md](./plan.md) §4 |
