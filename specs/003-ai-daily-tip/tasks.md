# Tasks: AI «порада дня» (`003-ai-daily-tip`) — lite

**Plan**: [plan.md](./plan.md)

## Phase 1: Enabler (prereq)
- [x] T001 `ai-personalization-context`: зібрати { dog, recentCompletions, skipped, streak, goal } ✅ (спільний enabler)

## Phase 2: Фіча
- [x] T002 Промпт + фільтр «без діагнозів» ✅ (proto: rules-simulated на ctx; prod: LLM + кеш на день)
- [x] T003 UI-картка «Порада дня» угорі «Сьогодні» (↻ + 👍/👎) ✅ — компонент `<dt-ai-tip>`
- [x] T004 Події `ai_tip_shown/refreshed/feedback` + A/B `getVariant('ai_daily_tip')` ✅ (control = без картки)

## Phase 3: Прототип / verify
- [x] T005 Вбудувати в основний прототип (LLM імітовано правилами на даних собаки+прогресі) ✅
- [x] T006 A/B-поверхня + 👎-подія реалізовані ✅ (аналітичний D2/D7-рід — прод)

> Реалізовано в прототипі: [../../prototype/index.html](../../prototype/index.html) — компонент `<dt-ai-tip>` (`foundation/features/ai-tip.js`), картка «💡 Порада дня» на «Сьогодні». A/B-перемикач — у дровері «📊 events».
