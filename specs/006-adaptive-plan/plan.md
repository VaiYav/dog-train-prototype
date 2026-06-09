# Plan / ТЗ: LLM-адаптація плану (`006-adaptive-plan`) — lite

**Spec**: [spec.md](./spec.md) · mode: lite

## UX (шаблон)
```
┌───────────────────────────────┐
│ 🔄 AI підлаштує завтра          │
│    [rules-validated]            │
│ Сьогодні 3/3 — завтра трохи     │
│ складніше: +5 хв прогулянка     │
│ або новий трюк.                 │
└───────────────────────────────┘
```
Компактний прев'ю на «Сьогодні»; адаптовані завдання видно в тижневому плані.

## Логіка (LLM пропонує → rules валідує)
```
ctx = getPersonalizationContext(userId)
proposal = LLM.suggestAdjustment(ctx)        // напрям + конкретика
adjusted = rulesValidator(proposal, {
   minTasks:1, maxTasks:3,
   safeForAge(ctx.dog.ageBand), safeForSize(ctx.dog.breedGroup),
   noTrivialization:true, maxDifficultyStep:1
})
if adjusted.ok → apply to next days; track('plan_adapted',{direction})
else            → keep base plan; track('plan_adaptation_rejected',{reason})
```
Напрям: ≥2 пропуски → easier; стрік (3/3 кілька днів) → harder; інакше steady.

## Метрики
- **Primary:** completion 1-го тижня / D7 (adaptive vs control).
- **Guardrails:** сер. завдань на активного не падає; skip-rate не зростає; 0 небезпечних вправ; усі адаптації проходять валідатор.

## Guardrails (constitution III/IV)
Передбачуваність: **детермінований валідатор — остання інстанція**, LLM не може його обійти. Без тривіалізації, без різких стрибків, безпека до віку/розміру.

## Prod vs прототип
**Prod:** LLM + rules-валідатор, застосування до наступних днів. **Прототип:** `adaptivePreview()` над `getPersonalizationContext()` показує напрям адаптації на завтра ([основний прототип](../../prototype/index.html)).

## Effort
~1.5 л-тижні поверх enabler (логіка пропозиції + валідатор + UI-прев'ю).
