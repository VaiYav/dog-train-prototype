# Metrics & Success Criteria: DogTrain (базовий продукт)

> Feature: `000-core-infrastructure` | Related: [Product Spec](./product-spec.md)
> Усі baseline без реальних даних DogTrain — **позначені оцінки**. Перше завдання фундаменту — підняти аналітику, щоб міряти фактично.

## Success Definition
Через 30 днів після запуску фундаменту: користувачі **доходять до першої перемоги <2 хв**, повертаються на Day 1/Day 2 на рівні галузевої «елітної» смуги, а продукт **має повну воронку Day0→Day1→Day2** — без неї Фаза 2 (аналіз відтоку) сліпа.

## KPIs

| Метрика | Baseline (оцінка) | Ціль | Метод вимірювання |
|---|---|---|---|
| Activation rate (перша перемога в D0) | нова метрика | ≥60% | `task_completed` у D0 / `onboarding_started` |
| Onboarding completion (усі 8 кроків) | нова метрика | ≥75% | `plan_generated` / `onboarding_started` |
| Time-to-first-value | — | <2 хв | медіана `onboarding_started → перший task_completed` |
| D1 retention | ~26% (бенчмарк) | 25–30% | повернення в D1 |
| D2 retention | низький (відтік 2–3 день) | покращити vs baseline | повернення + `task_completed` у D2 |

## Leading Indicators
- `notification_permission{granted=true}` rate (тригер повернення).
- Медіана часу на кроці онбордингу (рання ознака перевантаження 8 кроків).
- Частка `day_completed` (3/3) серед активних D0.

## Guardrail Metrics (не повинні погіршитись)
- **Onboarding completion ≥75%** — 8 кроків не мають обвалити завершення.
- **Per-step drop-off** жодного кроку не вище ~15% — інакше різати кроки.
- **Crash-free / error rate** прототипу/застосунку — стабільні.
- **Uninstall / opt-out пушів** — не зростають (гуманні нагадування).
- **Trial → перша перемога:** trial не має знижувати activation (paywall не ріже перемогу).

## Measurement Plan
- **Day 0:** activation, onboarding completion, TTV, per-step drop-off, opt-in пушів.
- **Week 1:** D1/D2/D7 retention, завдань на активного, `day_completed` rate.
- **Day 30:** D30 retention, перші сигнали trial→підписка.
- **Quarter:** LTV-проксі, утримана база.

## Anti-metrics (ознаки провалу)
- Activation <40% або onboarding completion <60% → 8 кроків/план перевантажують.
- Зростання opt-out/uninstall після ввімкнення нагадувань → нагадування агресивні.
- Trial-paywall ріже першу перемогу (падіння D0 activation) → перенести paywall на кінець trial.
