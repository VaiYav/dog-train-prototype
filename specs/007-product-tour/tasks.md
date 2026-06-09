# Tasks: Product Tour (`007-product-tour`) — lite · NON-AI

**Plan**: [plan.md](./plan.md) · Статус: **реалізовано** в прототипі (`<dt-product-tour>`)

## Phase 1: Каркас
- [x] T001 Послідовність кроків `TOUR[]` (selector + title + body) — 4 ключові поверхні ✅
- [x] T002 Підсвітка елемента (ring + spotlight box-shadow) + scrollIntoView; картка-крок із крапками прогресу ✅
- [x] T003 Кнопки «Далі / Пропустити»; останній крок → «Готово» ✅

## Phase 2: Поведінка
- [x] T004 `S.tourSeen` — показ **раз**; перезапуск кнопкою «?» ✅
- [x] T005 Дефолт-тригер **після першої перемоги** (через `pushDecision`; не блокує TTV) ✅
- [x] T006 Події `tour_started{manual}/step{n}/completed/skipped` + A/B `getVariant('product_tour')` (control = без туру) ✅

## Phase 3: Якість
- [x] T007 A11y: фокус на «Далі», `role=dialog`/`aria-modal`, `prefers-reduced-motion`, ring не лише колір (рамка) ✅
- [x] T008 Guardrail-поверхня: тур ≤4–5 кроків, після першої перемоги, skippable/non-blocking ✅ (аналітичний рід TTV/skip/drop-off — прод)

> NON-AI фіча (детерміновані coach marks) — без `PersonalizationContext`/LLM.
> Реалізація: [`../../prototype/foundation/features/product-tour.js`](../../prototype/foundation/features/product-tour.js) — компонент `<dt-product-tour>` у [прототипі](../../prototype/index.html). A/B-перемикач `product_tour` — у дровері «📊 events».
