# Plan / ТЗ: AI місії (`004-ai-missions`) — lite

**Spec**: [spec.md](./spec.md)

## UX
```
┌───────────────────────────────┐
│ 🎯 Місія тижня для Рекса        │
│ Навчіть «дай п’ять» — 5 хв/день │
│ [ Прийняти ]      [ ↻ інша ]    │
└───────────────────────────────┘   (вкладка «Прогрес»)
```

## Логіка
```
ctx = getPersonalizationContext(userId)
mission = LLM.suggestMission(ctx)   // під goal + опановане + вік/розмір
rulesCheck(mission, safeForAge/Size)  // безпека
track('ai_mission_shown'); on accept → add to plan + 'ai_mission_accepted'
```

## Метрики / guardrails
**Primary:** D7 + прийняті місії. **Guardrails:** безпека до віку/розміру; не повторювати опановане; skip-rate місій помірний.

## Prod vs прототип
**Prod:** LLM. **Прототип:** `missionText(ctx)` за ціллю/віком ([прототип](../../prototype/index.html), вкладка «Прогрес»).

## Effort
~1.5 л-тижні поверх enabler.
