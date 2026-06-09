# Spec: AI «порада дня» (`003-ai-daily-tip`) — lite

> Product Forge feature · mode: lite · RICE-lite: **731** (🥇 AI-track)
> Source: [AI backlog F2](../../docs/product/02-ai-ideas-backlog.md) · Depends on: `ai-personalization-context` + [foundation Consumer Contract](../000-core-infrastructure/spec.md)

## Гіпотеза
> **Як** власник собаки, **я хочу** щодня бачити коротку персональну пораду про мого песика (під породу/вік/ціль + мій прогрес), **щоб** мати свіжий привід відкривати застосунок і довіряти йому.

## Що і де
**Картка «💡 Порада дня для {ім'я}»** угорі екрана **«Сьогодні»** (над списком завдань). 1–2 речення, кнопка «інша порада» (↻) і 👍/👎. Персоналізовано на даних із `PersonalizationContext`.

## User Stories (Must)
- [ ] **US-1.** Бачити персональну пораду на «Сьогодні». **AC:** текст враховує породу-групу/вік/ціль + прогрес (стрік/виконане/пропущене); подія `ai_tip_shown`.
- [ ] **US-2.** Оновити пораду (↻). **AC:** інша релевантна порада; подія `ai_tip_refreshed`.
- [ ] **US-3.** Дати фідбек 👍/👎. **AC:** подія `ai_tip_feedback{helpful}` (сигнал якості).

## Acceptance
1. Порада явно персональна (згадує собаку/ціль/прогрес), не generic.
2. ≤2 речення; жодних медичних діагнозів (constitution III + AI-guardrails).
3. Усі 3 події емітяться; у прототипі — видно в лозі.
4. У control-армі (A/B) картки немає.

## Metrics
**Primary:** D2/D7 retention (tip vs control). **Guardrails:** 👎-rate, opt-out, LLM cost/latency, 0 медичних тверджень.

## Consumes
`PersonalizationContext` (dog + recentCompletions + streak + goal) · поверхня «Сьогодні» · `getVariant('ai_daily_tip')`.

## Prod vs прототип
**Prod:** PersonalizationContext → prompt → LLM (дешева модель) → кеш на день. **Прототип:** LLM імітовано детермінованими правилами на тих самих даних (демонструє персоналізацію без API).
