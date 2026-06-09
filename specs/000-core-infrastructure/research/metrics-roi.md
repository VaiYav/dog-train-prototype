# Metrics & ROI: DogTrain (базовий продукт)

> Згенеровано: 2026-06-09 · Бенчмарки активації/утримання + KPI фундаменту.

## Industry Benchmarks (реальні дані)

- **77% денних активних користувачів кидають застосунок у перші 3 дні** після інсталу — це майже дзеркало нашого «80% на 2–3 день». DogTrain **у межах галузевої норми**, тож є явний простір для покращення, а не катастрофа. ([digia](https://www.digia.tech/post/mobile-app-onboarding-metrics/))
- **Day 1 retention** у середньому ~26%, «елітні» апи 25–30%. **Day 7** ~10–15%. Більшість апів втрачають ~90% за 30 днів. ([enable3](https://enable3.io/blog/app-retention-benchmarks-2025), [getstream](https://getstream.io/blog/app-retention-guide/))
- **Гладкий онбординг → до +50% retention тижня 1.** ([VWO](https://vwo.com/blog/mobile-app-onboarding-guide/))
- **Day 2 — «день рішення/commitment»:** якщо користувач повернувся — це треба винагородити (стрік/прогрес). ([appcues](https://www.appcues.com/blog/app-retention-is-hard-heres-how-to-improve-it))
- Найвищий важіль для D30: **скоротити time-to-value, прив'язати тригери звички до наявних рутин, персоналізація, цінні (не порожні) пуші.** ([appcues](https://www.appcues.com/blog/app-retention-is-hard-heres-how-to-improve-it))
- **Time-to-first-value** бажано хвилини, не >15 хв; онбординг 3–5 екранів. ([digia](https://www.digia.tech/post/mobile-app-onboarding-activation-retention/))

## User Impact Signals

| Метрика | Очікуваний вплив фундаменту | Впевненість | Джерело |
|---|---|---|---|
| Activation (перша перемога в D0) | Сильний предиктор D1/D7 | High | digia/appcues |
| D1 retention | Ціль вийти на 25–30% (елітна смуга) | Medium | enable3/getstream |
| D7 retention | Ціль 10–15%+ | Medium | enable3 |
| Time-to-value | <2 хв до першої дії | High | digia/VWO |

## Revenue Impact
Фундамент сам по собі **не монетизує** — він створює утримувану базу. Бізнес-логіка: рання утримуваність (D2/D7) — випереджальний індикатор D30/LTV і конверсії в підписку. Тому фундамент оптимізуємо під **активацію й утримання**, а монетизацію (trial → підписка, як у Dogo/Puppr) вмикаємо після «першої перемоги», а не до неї.

## Effort vs. Impact
- **Effort:** Medium (greenfield-фундамент, без ML).
- **Impact:** High (без фундаменту немає ні цінності, ні даних для Фази 2).

## Recommended KPIs

| KPI | Baseline (оцінка) | Ціль | Як міряємо |
|---|---|---|---|
| Activation rate (перша перемога в D0) | невідомо (нова метрика) | ≥60% | `task_completed` у D0 / `onboarding_started` |
| Onboarding completion | невідомо | ≥75% | `onboarding_completed` / `onboarding_started` |
| Time-to-first-value | — | <2 хв | медіана `onboarding_started → перший task_completed` |
| D1 retention | ~бенчмарк 26% | 25–30% | повернення в D1 |
| D2 retention (фокус кейсу) | низький (відтік 2–3 день) | +відносно контролю | повернення + `task_completed` у D2 |

## Measurement Plan
- **Day 0:** activation (перша перемога), onboarding completion, TTV, opt-in пушів.
- **Week 1:** D1/D2/D7 retention, к-сть виконаних завдань на активного.
- **Month 1:** D30 retention, перші сигнали trial→підписка.

> Усі baseline-числа без реальних даних DogTrain — **позначені оцінки**. Перше завдання фундаменту — підняти аналітику, щоб Фаза 2 рахувала це фактично, а не на око.

## Sources
- [digia — Onboarding Metrics](https://www.digia.tech/post/mobile-app-onboarding-metrics/) · [digia — Activation & Retention](https://www.digia.tech/post/mobile-app-onboarding-activation-retention/)
- [enable3 — Retention Benchmarks 2026](https://enable3.io/blog/app-retention-benchmarks-2025) · [getstream — App Retention Guide 2026](https://getstream.io/blog/app-retention-guide/)
- [appcues — App Retention](https://www.appcues.com/blog/app-retention-is-hard-heres-how-to-improve-it) · [VWO — Mobile App Onboarding Guide](https://vwo.com/blog/mobile-app-onboarding-guide/)
