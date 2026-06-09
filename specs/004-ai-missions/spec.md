# Spec: AI челенджі/місії (`004-ai-missions`) — lite

> Product Forge · lite · RICE-lite: **540** · Source: [AI backlog F3](../../docs/product/02-ai-ideas-backlog.md)
> Depends on: [`ai-personalization-context`](../ai-personalization-context/README.md) · A/B: `getVariant('ai_missions')`

## Гіпотеза
> **Як** власник, **я хочу** щотижневі цікаві місії під мою собаку («навчіть Рекса “дай п’ять”»), **щоб** мати свіжу ціль і не нудьгувати.

## Що і де
Картка **«🎯 Місія тижня для Рекса»** (на вкладці «Прогрес»). LLM пропонує місію під **ціль + уже опановані навички + вік/розмір**; кнопка «інша місія».

## User Stories (Must)
- [ ] **US-1.** Бачити щотижневу персональну місію. **AC:** під ціль/вік; **не пропонує вже опановане**; подія `ai_mission_shown`.
- [ ] **US-2.** Оновити місію. **AC:** інша релевантна; `ai_mission_refreshed`.
- [ ] **US-3.** Прийняти місію (стає завданням). **AC:** додається в план; `ai_mission_accepted`.

## Acceptance
1. Місія релевантна цілі й безпечна до віку/розміру.
2. Не повторює вже опановані навички.
3. У control місій немає.

## Metrics
**Primary:** D7 retention + прийняті місії (vs control). **Guardrails:** складність до віку/розміру; skip-rate місій не зашкалює.

## Consumes
`PersonalizationContext` (goal, dog, completedTotal/skills) · `getVariant('ai_missions')`.

## Prod vs прототип
**Prod:** LLM під контекст. **Прототип:** `missionText(ctx)` складає місію за ціллю/віком (демо; rules-безпека).
