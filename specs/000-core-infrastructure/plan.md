# Implementation Plan: Minimal Infrastructure (base DogTrain)

**Branch**: `000-core-infrastructure` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)

**Input**: [spec.md](./spec.md) (Product Forge bridge) · [product-spec/](./product-spec/README.md) · [research/](./research/README.md)

## Summary
Будуємо фундамент DogTrain як **клікабельні HTML-прототипи (mobile-first)**: профіль → 8-кроковий онбординг → rules-based план → «Сьогодні» (3 завдання) → відмітки/прогрес → нагадування догляду → trial одразу. Технічний підхід: single-file/few-file HTML + vanilla JS, `localStorage` для стану, імітований `trackEvent` за схемою з research, JS-rules-engine для плану, A/B-перемикач (імітація flag). Мета — валідувати потоки й інструментування метрик до проду.

## Technical Context

**Language/Version**: HTML5 + CSS3 + vanilla JavaScript (ES2020)
**Primary Dependencies**: немає білд-залежностей; опційно Alpine.js (CDN) для реактивності
**Storage**: `localStorage` (профіль, план, відмітки, прогрес); fallback — in-memory
**Testing**: ручний клік-прохід + легкі JS-юніти для rules-engine; (прод: Vitest/Playwright)
**Target Platform**: мобільний браузер (phone-frame ~390px), відкривається локально
**Project Type**: mobile-app prototype (clickable, mobile-first)
**Performance Goals**: «Сьогодні» <1с; генерація плану <2с; TTV <2 хв (8 кроків ≤10с кожен)
**Constraints**: без AI/ML; офлайн-first відмітки; аналітика з 1-го екрана; контекстний opt-in пушів; WCAG 2.1 AA
**Scale/Scope**: ~7 екранів фундаменту; 1 собака (мульти — пізніше)

## Constitution Check
*GATE: пройдено.*

| Принцип | Відповідність |
|---|---|
| I. User-Value & Activation First | ✅ Перша перемога ≤2 хв; activation — Primary KPI |
| II. Analytics-First | ✅ `trackEvent` з 1-го екрана; повна подієва схема |
| III. Humane Engagement | ✅ Без покарань; trial без картки; paywall не ріже перемогу; opt-in контекстний |
| IV. Simplicity & YAGNI | ✅ Rules-based без ML; прототипи замість повного проду |
| V. Accessibility & Mobile-First | ✅ Mobile-first, WCAG 2.1 AA, офлайн-відмітки |

**Порушень немає** → Complexity Tracking порожній.

## Project Structure

### Documentation (this feature)
```text
specs/000-core-infrastructure/
├── plan.md              # цей файл
├── spec.md              # SpecKit spec (bridge)
├── research/            # 5 дименсій + README + digest
├── product-spec/        # PRD, journeys, wireframes, metrics
├── review.md            # revalidation log (APPROVED)
└── tasks.md             # розбивка задач (Phase 5B)
```

### Source Code (prototype)
```text
specs/000-core-infrastructure/prototype/
├── index.html           # phone-frame + роутер екранів (hash-навігація)
├── styles.css           # mobile-first CSS, токени, phone-frame
├── app.js               # стан (localStorage), навігація, обробники
├── rules-engine.js      # генерація плану з шаблонів (без ML)
├── analytics.js         # trackEvent() → лог подій + дебаг-панель
└── data/templates.js    # куратовані шаблони завдань за сегментами
```
*(Прод-структура — RN/Flutter + бекенд — поза скоупом прототипу; див. research/tech-stack.md.)*

**Structure Decision**: фундамент реалізується як набір mobile-first HTML-екранів у `prototype/`, зі станом у `localStorage` та імітованою аналітикою. Це мінімальний носій, достатній, щоб валідувати потоки Активації (D0) і Повернення (D2) і зняти події для Фази 2.

## Data Model (для Phase 5B / прод)
- **Dog**{id, name, photo?, breed_group, age_band, weight?, activity_level}
- **Plan**{id, dog_id, goal, days[7]}
- **Task**{id, day_index, type(walk|training|care), title, est_min, trivial:bool, why}
- **Completion**{task_id, ts}
- **CareEvent**{id, type(vaccine|vet|grooming|deworm), due_date, status}
- **AnalyticsEvent**{name, props, user_id, ts}

## Rollout / Experiment Hook
A/B-перемикач (`getVariant`) закладається у фундамент — поверхня «Сьогодні» готова приймати retention-варіант Фази 3 без переписування.

## Complexity Tracking
*Порушень Constitution немає — таблиця порожня.*
