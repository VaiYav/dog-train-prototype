# Tasks: «Запитай про Рекса» (`002-ai-ask-rex`) — lite

**Plan**: [plan.md](./plan.md)

- [x] T001 Prompt на `PersonalizationContext` + curated KB ✅ (`ASK_KB` — 5 тем + general, grounded на ctx)
- [x] T002 **Safety-фільтр**: медичні теми → дисклеймер + ескалація (no diagnosis) ✅ (`ASK_MEDICAL` regex → редирект до вета)
- [x] T003 Чат-UI (оверлей) + підказані питання + вільний ввід ✅ (+ typing/latency, ℹ️ docs-панель)
- [x] T004 A/B `getVariant('ask_rex')` + подія `ai_qa_question{topic,medical}` ✅ (control = чату немає; toggle у «📊 events»)
- [x] T005 Демо `askRex(q)` у прототипі (grounded, медичне→дисклеймер) ✅
- [x] T006 Guardrail-рід: 0 діагнозів (`ai_qa_medical_redirect`), 👎/скарги (`ai_qa_feedback`), latency (`ai_qa_answered`) ✅

> Демо: [../../prototype/index.html](../../prototype/index.html) (кнопка «💬 Запитай про Рекса»; A/B-перемикач і лог подій — у дровері «📊 events»).
>
> **Документація фічі** показана прямо в UI: у чаті кнопка **ℹ️** → панель (безпека-guardrail, на чому grounded, prod vs прототип, події, A/B).
