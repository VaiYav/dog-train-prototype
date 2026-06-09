# Tasks: Minimal Infrastructure (base DogTrain)

**Input**: [plan.md](./plan.md) · [spec.md](./spec.md) · [product-spec/](./product-spec/README.md)
**Scope**: побудова фундаменту як клікабельних HTML-прототипів (mobile-first). Згруповано за user stories для незалежної реалізації/тесту.

## Format: `[ID] [P?] [Story] Опис`
- **[P]** — можна паралельно (різні файли, без залежностей)

---

## Phase 1: Setup
- [ ] T001 Створити структуру `prototype/` (index.html phone-frame, styles.css, app.js)
- [ ] T002 [P] Mobile-first CSS-токени + phone-frame ~390px + safe-area + base a11y (контраст, focus)
- [ ] T003 [P] Hash-роутер екранів у `app.js` (показ/приховування «екранів»)

## Phase 2: Foundational (блокує всі історії)
- [ ] T004 Шар стану на `localStorage` (Dog, Plan, Task, Completion, CareEvent) + in-memory fallback
- [ ] T005 [P] `analytics.js`: `trackEvent(name, props)` → лог `window.__events` + дебаг-панель
- [ ] T006 [P] `rules-engine.js` каркас + `data/templates.js` (шаблони за сегментами порода-група×вік×ціль)
- [ ] T007 A/B-хук `getVariant(flag)` (імітація feature flag) — поверхня для Фази 3

**Checkpoint:** фундамент готовий — історії можна робити паралельно.

---

## Phase 3: US-1 + US-2 — Профіль і 8-кроковий онбординг (P1) 🎯 MVP
- [ ] T008 [US2] Екрани онбордингу: 2–3 value-екрани + 8 односкрокових кроків + прогрес-бар
- [ ] T009 [US1] Форма профілю в кроках (порода-група/вік/активність обов'язкові; вага/фото skip-able)
- [ ] T010 [US2] Подія `onboarding_started` + `onboarding_step_completed{step}` на кожному кроці
- [ ] T011 [US1] Збереження профілю в `localStorage` + `dog_profile_completed`
- [ ] T012 [US2] Збереження прогресу онбордингу (повернення на той самий крок)

**Checkpoint:** онбординг проходиться за <2 хв, per-step події пишуться.

## Phase 4: US-3 — Генерація плану (P1)
- [ ] T013 [US3] Реалізувати `rules-engine`: сегмент → 7 днів × 3 завдання; fallback для рідкісної породи
- [ ] T014 [US3] Екран «План готовий» + подія `plan_generated{tasks_total}`
- [ ] T015 [US3] Тихий старт trial при генерації (`trial_started`, без картки)

## Phase 5: US-4 + US-5 — «Сьогодні» (3 завдання) + відмітки/прогрес (P1) 🎯
- [ ] T016 [US4] Екран «Сьогодні» (дефолтний): 3 картки-завдання, кільце прогресу, перше завдання тривіальне
- [ ] T017 [US5] Відмітка завдання: оптимістичний UI + вібрація + запис `Completion` (офлайн)
- [ ] T018 [US5] Події `task_completed{...}` (перше = перша перемога) + `day_completed` при 3/3
- [ ] T019 [US5] Стани: 0/3, частково, all-done (конфеті), empty, offline
- [ ] T020 [US4] Таб-бар (Сьогодні/Догляд/Прогрес) + `app_opened{day_since_install}`

**Checkpoint:** ядро щоденної цінності працює; активація вимірюється.

## Phase 6: US-6 — Догляд/здоров'я + нагадування (P1)
- [ ] T021 [US6] Екран «Догляд»: щеплення/вет/грумінг/дегельмінт. зі статусами
- [ ] T022 [US6] Базовий набір подій догляду за віком/породою + локальні нагадування (UI-банер)
- [ ] T023 [US6] `care_reminder_fired` + додавання/редагування події

## Phase 7: US-7 — Trial / soft-paywall (P1)
- [ ] T024 [US7] Бейдж «trial: N днів» + повний доступ під час trial
- [ ] T025 [US7] Стан «trial завершено» (paywall, прогрес лишається) + `paywall_viewed`; A/B час показу

## Phase 8: US-9 + US-10 — Тижневий план + контекстний opt-in (Should)
- [ ] T026 [US9] Екран тижневого плану (вторинна дія, згорнуто за замовч.)
- [ ] T027 [US10] Контекстний запит пушів після першого `task_completed` + `notification_permission{granted}`

## Phase 9: Polish & Cross-Cutting
- [ ] T028 [P] A11y-прохід: тач-таргети ≥44px, контраст ≥4.5:1, screen reader, `prefers-reduced-motion`
- [ ] T029 [P] Перевірка офлайн-сценарію (відмітка без мережі → синк)
- [ ] T030 [P] Верифікація подієвої схеми (усі події емітяться й видно в лозі)
- [ ] T031 [P] Легкі JS-юніти для rules-engine (TC-001..TC-004 зі spec)
- [ ] T032 Клік-прохід E2E: TC-E2E-001 (активація D0), TC-E2E-002 (повернення D2), TC-E2E-003 (trial не ріже перемогу)

---

## Dependencies & Execution Order
- **Setup (P1)** → **Foundational (P2, блокує все)** → історії P3–P8 (можна паралелити різними людьми) → **Polish (P9)**.
- US-3 (план) перед US-4 (Сьогодні показує згенеровані завдання).
- US-8 (аналітика) реалізується наскрізно в кожній історії (подія супроводжує дію).

## Parallel Opportunities
- T002, T003 (Setup) паралельно; T005, T006 (Foundational) паралельно.
- Після Foundational: US-6 (догляд) та US-7 (trial) можна вести паралельно з ядром US-4/US-5 різними розробниками.
- T028–T031 (Polish) паралельно.

## Implementation Strategy (MVP-фундамент)
1. Setup + Foundational.
2. US-1/US-2 → US-3 → US-4/US-5 = **ядро активації** (зупинка + валідація: перша перемога <2 хв).
3. US-6, US-7 додають унікальний цикл і монетизацію.
4. US-9/US-10 (Should) + Polish.

> Примітка: межі **2 тижні / 2 розробники** з тест-кейсу стосуються **retention-MVP (Фаза 3)**, а не побудови всього фундаменту. Детальний 2-тижневий To-Do команди — у `specs/001-daily-focus/tasks.md`.
