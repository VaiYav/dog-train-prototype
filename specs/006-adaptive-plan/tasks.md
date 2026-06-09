# Tasks: LLM-адаптація плану (`006-adaptive-plan`) — lite

**Plan**: [plan.md](./plan.md)

## Phase 1: Логіка
- [x] T001 `adaptivePreview(ctx)` — напрям (easier/harder/steady) з `PersonalizationContext` ✅
- [x] T002 **rules-межі** (1–3 завдання) ✅ — у демо прев'ю завжди в межах (`rules-validated` тег); повна `rulesValidator()` із застосуванням до плану — прод
- [x] T003 Подія `plan_adapted{direction}` (на зміну напряму) ✅; `plan_adaptation_rejected` — прод (реальне застосування до плану)

## Phase 2: UX + A/B
- [x] T004 Прев'ю «🔄 AI підлаштує завтра» на «Сьогодні» (rules-validated) ✅ — компонент `<dt-adaptive>`
- [x] T005 A/B `getVariant('adaptive_plan')` ✅ (control = без адаптації); мутація днів тижня — прод

## Phase 3: Демо / verify
- [x] T006 `adaptivePreview()` у прототипі через `getPersonalizationContext()` ✅
- [x] T007 Guardrail-поверхня (межі 1–3, без тривіалізації) показана; аналітичний рід (skip-rate, сер. завдань) — прод ✅

> Демо: [../../prototype/index.html](../../prototype/index.html) — компонент `<dt-adaptive>` (`foundation/features/adaptive.js`), прев'ю на «Сьогодні». A/B — у дровері «📊 events».
