# Spec: Minimal Infrastructure (base DogTrain)

> **Product Forge Feature** | Generated: 2026-06-09
> Feature slug: `000-core-infrastructure` | SpecKit mode: classic | Feature type: shared infrastructure (foundation)
>
> **Source artifacts:**
> - Product Spec: [product-spec/README.md](./product-spec/README.md)
> - Research: [research/README.md](./research/README.md)
> - Review log: [review.md](./review.md)

---

## Overview

### What We're Building
Базовий продукт DogTrain як **клікабельні HTML-прототипи (mobile-first)**: профіль собаки → 8-кроковий онбординг → rules-based план → екран «Сьогодні» з 3 завданнями → відмітки/прогрес → нагадування догляду/здоров'я → 7-денний trial одразу. Це фундамент-платформа, на яку стане retention-MVP (Фаза 3).

### Why We're Building It
Без базового продукту немає ні цінності для користувача, ні **даних** (воронка Day0→Day1→Day2), щоб лікувати відтік (80% на 2–3 день). Фундамент доставляє цінність ≤2 хв і піднімає аналітику, без якої аналіз відтоку сліпий.

### Research Backing
- **Competitor analysis:** розрив ринку — ніхто не закриває єдиний щоденний цикл «здоров'я+активність+догляд+тренування»; Dogo — референс онбордингу (але прибираємо ранній paywall).
- **UX/UI patterns:** головний екран = «Сьогодні» з першою перемогою ≤2 хв; контекстний opt-in пушів; тижневий план не дефолтний.
- **Codebase analysis:** greenfield; аналітику й модель даних — першими; план rules-based без AI/ML; артефакт = HTML-прототипи mobile-first.

> Deep-dive: [research/README.md](./research/README.md)

---

## Goals

### Primary Goal
Власник доходить до **першої перемоги (`task_completed` у D0) за <2 хв** і отримує персональний щоденний цикл догляду.

### Secondary Goals
- Підняти продуктову аналітику (воронка активації/відтоку) як передумову Фази 2.
- Закрити унікальний єдиний цикл «здоров'я+активність+догляд» у легкому щоденному UX.
- Дати поверхню «Сьогодні», на яку стане retention-MVP.

### Non-Goals (v1 scope)
AI/ML-генерація плану; серверні пуш-кампанії; мультипрофіль; відео-контент; шеринг із ветеринаром; **гейміфікація/стрік (Фаза 3)**.

---

## Users

### Primary Persona
**«Новачок-власник»** — завів собаку (часто першу) за останні 0–12 міс. Key need: зрозумілий щоденний план і легкі відмітки, щоб дбати правильно й бачити прогрес.

### Secondary Persona
**«Зайнятий досвідчений власник»** — хоче структуру + нагадування (щеплення, грумінг) із мінімумом зусиль.

---

## User Stories

> Повні потоки: [product-spec/user-journey.md](./product-spec/user-journey.md)

### Must Have (MVP)
- [ ] **US-1** Як власник, я хочу створити профіль собаки, щоб план був персональним.
  - **AC:** порода-група/вік/активність обов'язкові; фото/вага — ні; профіль зберігається (`localStorage`).
  - **Wireframe:** [Онбординг](./product-spec/wireframes.md#ekran-1)
- [ ] **US-2** Як власник, я хочу пройти 8-кроковий онбординг, щоб план був точним.
  - **AC:** рівно 8 кроків, одне рішення/тап, прогрес-бар, подія `onboarding_step_completed{step}` на кожному.
- [ ] **US-3** Як власник, я хочу одразу отримати персональний план.
  - **AC:** rules-based із шаблонів (порода-група × вік × ціль), <2с, без AI/ML.
  - **Wireframe:** [План готовий](./product-spec/wireframes.md#ekran-2)
- [ ] **US-4** Як власник, я хочу «Сьогодні» з 3 завданнями, щоб мати чіткий фокус.
  - **AC:** дефолтний екран; D0 = 3 завдання; перше тривіальне (перша перемога).
  - **Wireframe:** [Сьогодні](./product-spec/wireframes.md#ekran-3)
- [ ] **US-5** Як власник, я хочу відмічати завдання офлайн і бачити прогрес.
  - **AC:** оптимістичний UI; запис у `localStorage`; прогрес миттєвий; `task_completed`/`day_completed`.
- [ ] **US-6** Як власник, я хочу нагадування про здоров'я/догляд (щеплення, вет, грумінг).
  - **AC:** локальні нагадування; базовий набір за віком/породою; події догляду в моделі.
  - **Wireframe:** [Догляд](./product-spec/wireframes.md#ekran-6)
- [ ] **US-7** Як власник, я хочу 7-денний trial одразу без картки.
  - **AC:** trial активний із реєстрації; повний доступ; paywall не блокує першу перемогу.
  - **Wireframe:** [Trial](./product-spec/wireframes.md#ekran-7)
- [ ] **US-8** Як команда продукту, ми хочемо аналітичну подію на кожну ключову дію.
  - **AC:** імітований `trackEvent(name, props)` за єдиною схемою (див. Consumer Contract).

### Should Have
- [ ] **US-9** Перегляд тижневого плану вторинною дією. **AC:** доступно з «Сьогодні», згорнуто за замовч.
- [ ] **US-10** Контекстний запит пушів після першої перемоги. **AC:** після першого `task_completed`, не на старті.

### Could Have (Future)
- [ ] Мультипрофіль; відео-контент; шеринг із ветом; **стрік/гейміфікація → Фаза 3**.

---

## Functional Requirements

| ID | Вимога | Пріоритет | Source |
|----|---|---|---|
| FR-001 | Створення/редагування профілю собаки | Must | US-1 |
| FR-002 | 8-кроковий онбординг (одне рішення/крок, подія на крок) | Must | US-2 |
| FR-003 | Rules-based генерація плану (<2с, без AI/ML) | Must | US-3 |
| FR-004 | «Сьогодні» з 3 завданнями як дефолт | Must | US-4 |
| FR-005 | Офлайн-відмітки (оптимістичний UI + збереження) | Must | US-5 |
| FR-006 | Прогрес дня/тижня без покарання за пропуск | Must | US-5 |
| FR-007 | Локальні нагадування догляду/здоров'я | Must | US-6 |
| FR-008 | 7-денний trial одразу без картки; paywall не ріже першу перемогу | Must | US-7 |
| FR-009 | Аналітичні події за єдиною схемою (`trackEvent`) | Must | US-8 |
| FR-010 | Перегляд тижневого плану (вторинно) | Should | US-9 |
| FR-011 | Контекстний opt-in пушів після першої перемоги | Should | US-10 |

---

## Non-Functional Requirements

| Категорія | Вимога | Source |
|---|---|---|
| Performance | «Сьогодні» <1с; план <2с; TTV <2 хв попри 8 кроків | research/codebase-analysis |
| Offline | Відмітки/перегляд дня офлайн; події буферизуються | research/ux-patterns |
| Accessibility | WCAG 2.1 AA (тач ≥44px, контраст ≥4.5:1, screen reader, reduced-motion) | research/ux-patterns |
| Analytics | Подієва схема стабільна/версіонована; per-step drop-off онбордингу | product-spec/metrics |
| Privacy | Мінімум PII; trial без картки; store-політики | product-spec |
| Localization | uk + en; рядки винесені | product-spec |

## NFR Measurement Contract

| NFR | Як міряємо | Сигнал / запит | Поріг |
|---|---|---|---|
| TTV <2 хв | медіана від `onboarding_started` до першого `task_completed` | подієвий лог | <120с |
| Onboarding completion ≥75% | `plan_generated` / `onboarding_started` | воронка | ≥75% |
| Per-step drop-off ≤15% | спад між `onboarding_step_completed{n}` і `{n+1}` | воронка по 8 кроках | ≤15%/крок |
| «Сьогодні» <1с | час рендеру екрана | таймер прототипу | <1000мс |
| Activation ≥60% | `task_completed` D0 / `onboarding_started` | воронка | ≥60% |

---

## Technical Context

> Детально: [research/codebase-analysis.md](./research/codebase-analysis.md) · [research/tech-stack.md](./research/tech-stack.md)

### Integration Points
Greenfield. Артефакт — HTML-прототипи (mobile-first): «екрани» онбордингу/профілю/плану/«Сьогодні»/прогресу/догляду + імітований шар аналітики й rules-engine у JS.

### Reusable Components
Немає наявного коду. Перевикористання — переходить у Фазу 3: retention-MVP **повторно використовує поверхню «Сьогодні», схему подій і модель даних** цього фундаменту (див. Consumer Contract).

### New Modules Required
Прототипи екранів; rules-engine (JS); шар `trackEvent`; локальні нагадування (UI); A/B-перемикач (імітація flag).

### Data Model Impact
Нові сутності: **Dog, Plan, Task, Completion, CareEvent, AnalyticsEvent** (деталі — Phase 5 Plan / data-model).

### Tech Stack Notes
Клікабельні HTML-прототипи, mobile-first (semantic HTML + CSS + vanilla JS, phone-frame ~390px, `localStorage`, імітований `trackEvent`). Прод (майбутнє): RN/Flutter + бекенд + PostHog.

### Codebase Constraints
| Обмеження | Source | Вплив |
|---|---|---|
| Без AI/ML для плану | завдання | лише rules-based шаблони |
| Офлайн-first відмітки | ux-research | запис локально, не блокувати на мережі |
| Аналітика з 1-го екрана | потреба Фази 2 | подія на кожну ключову дію |
| Контекстний opt-in пушів | ux-research | дозвіл після першої перемоги |

---

## Consumer Contract

> Цей фундамент — **shared infrastructure**: retention-MVP (`001-daily-focus`) та інші фічі залежать від наведених нижче поверхонь. Усе інше — внутрішня реалізація і може змінюватись.

### Поверхні, на які спираються майбутні фічі
| Поверхня | Контракт | Споживач |
|---|---|---|
| **Подієва схема `trackEvent(name, props)`** | `onboarding_started`, `onboarding_step_completed{step}`, `dog_profile_completed{breed_group,age_band,activity}`, `plan_generated{tasks_total}`, `task_completed{task_id,task_type,day_index}`, `day_completed{day_index}`, `care_reminder_fired`, `notification_permission{granted}`, `app_opened{day_since_install}`, `trial_started`, `paywall_viewed` | Аналітика Фази 2; A/B Фази 3 |
| **Сутності даних** | `Dog`, `Plan`, `Task{type,day_index,trivial:bool}`, `Completion{task_id,ts}`, `CareEvent` | retention-MVP (стрік рахується з `Completion`) |
| **Поверхня «Сьогодні»** | список завдань дня + хук відмітки + слот прогресу | Daily Focus (Фаза 3) додає стрік/нагадування в цей слот |
| **A/B-хук (імітація flag)** | `getVariant('feature') → 'control'|'variant'` | Експеримент Фази 3 |

### Fallback Behaviour
| Збій | Що отримує споживач | Дія |
|---|---|---|
| Немає завдань дня | порожній масив | показати empty-стан + 1 мікродію |
| Офлайн | дані з `localStorage` | працювати локально, синк пізніше |
| Trial завершено | прапор `trial_expired:true` | показати paywall, зберегти прогрес |

---

## Acceptance Criteria
Фіча вважається готовою, коли:
1. Усі Must Have (US-1…US-8) реалізовані в прототипі й клікабельні.
2. Екрани відповідають wireframes у межах допустимого.
3. NFR досягнуто (TTV <2 хв, «Сьогодні» <1с — за вимірюванням прототипу).
4. A11y: контраст/тач-таргети/reduced-motion перевірені.
5. Усі події зі схеми емітяться й видно в лозі прототипу.
6. Жодного раннього paywall до першої перемоги.

---

## Success Metrics

> Повна дефініція: [product-spec/metrics.md](./product-spec/metrics.md)

Primary KPI: **Activation rate (перша перемога в D0)** — Target: ≥60% (Baseline: нова метрика). Вторинні: D1 25–30%, D2 покращити vs baseline, onboarding completion ≥75%.

---

## Testing Specification

### Coverage Targets
| Модуль | Ціль | Тип |
|---|---|---|
| rules-engine (генерація плану) | happy + edge | unit (JS) |
| потік онбордингу (8 кроків) | повний прохід | e2e (клік) |
| відмітки/прогрес | happy + offline | unit + e2e |

### Critical Test Cases
| # | Сценарій | Вхід | Очікуваний вихід | Тип |
|---|---|---|---|---|
| TC-001 | Генерація плану для відомого сегмента | лабрадор, 1р, активність=помірна, ціль=здоров'я | план 7 днів × 3 завдання | unit |
| TC-002 | Рідкісна порода | невідома порода | fallback на породу-групу/розмір, план є | unit |
| TC-003 | Відмітка офлайн | task tap без мережі | оптимістична галочка + запис локально | unit |
| TC-004 | Перша перемога емітить подію | відмітка 1-го завдання D0 | `task_completed` у лозі | unit |

### E2E Scenarios
| TC-ID | Сценарій | Entry | Exit |
|---|---|---|---|
| TC-E2E-001 | Активація D0 | відкриття після інсталу | перша перемога <2 хв |
| TC-E2E-002 | Повернення D2 | відкриття day=2 | `task_completed` D2 |
| TC-E2E-003 | Trial без блокування перемоги | новий користувач | перша перемога відбулась під trial, paywall не блокував |

---

## Risks

| Ризик | Impact | Mitigation |
|---|---|---|
| Фундамент не лікує відтік сам по собі | High | Лікування — retention-MVP Фази 3; фундамент дає поверхню + дані |
| 8 кроків ↑ drop-off онбордингу | High | один тап/крок; прогрес-бар; per-step трекінг; різати за даними |
| Trial одразу демотивує до першої перемоги | Med | trial без картки; повний доступ; paywall після перемоги; час — A/B |
| Слабка бібліотека шаблонів плану | Med | куратований контент по сегментах; fallback-правила |

---

## Wireframes Reference
> Візуальні: [product-spec/wireframes.md](./product-spec/wireframes.md)

Ключові екрани: Онбординг(8 кроків) · План готовий · «Сьогодні»(3 завдання) · Виконано/день завершено · Тижневий план · Догляд/здоров'я · Trial/soft-paywall.

---

## Open Questions
- Точний момент жорсткого paywall (одразу vs кінець trial) — **A/B-кандидат**, не блокер.
- Глибина набору нагадувань догляду «з коробки» (мінімальний vs повний графік щеплень).
