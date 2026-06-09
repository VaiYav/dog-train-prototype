# DogTrain — тест-кейс із ранньої утримуваності (retention)

> **Це продуктовий тест-кейс, а не застосунок.** Продукт — **DogTrain** (мобільний застосунок про здоров'я, активність і розвиток собаки). Завдання: проаналізувати ранній відтік (early churn) і спроєктувати retention-MVP. Усю роботу прогнано наскрізь через workflow **Product Forge → Spec Kit** із людським гейтом після кожної фази.
>
> **Артефакти — українською.** Канонічний формат — **Markdown**, з нього генерується **HTML** і **клікабельні HTML-прототипи**. Коду майже немає — це робота design-first.

---

## Проблема

За останній місяць **понад 80% нових користувачів** припиняють активно користуватись застосунком на **2–3 день**, не завершивши перший тижневий план. Це проблема **активації та ранньої утримуваності**, а не залучення: люди доходять до цінності, але не закріплюють звичку.

> ⚠️ **Усі числа — позначені оцінки.** Реальних даних DogTrain немає; RICE-бали, метрики й бейзлайни — це явно помічені припущення з індустріальних бенчмарків, а не факти.

---

## Рішення (стисло)

Фічі обрано не «серцем», а через **RICE**. Переможець — **«Daily Focus loop»**: щоденне нагадування (тригер повернення) + простий стрік (винагорода) на екрані «Сьогодні». **Без кастомного AI**, валідовно за 2 тижні наявною командою (2 dev / 1 designer / 1 analyst), чисто заміряється A/B на **D2 retention**.

Решта ідей (5 AI-фіч + product tour) свідомо **не входять в MVP** — винесені в роадмеп зі спільним enabler'ом `PersonalizationContext` і матрицею паралельної розробки.

---

## Що зроблено

| Фаза | Артефакт | Статус |
|---|---|---|
| **0. Майстер-план** | [`docs/00-master-plan.md`](docs/00-master-plan.md) — орієнтир, роадмеп, мапа на завдання | ✅ |
| **1. Фундамент** | [`specs/000-core-infrastructure/`](specs/000-core-infrastructure/) — повний ланцюг Product Forge (Problem Discovery → Research → Spec → Plan → Tasks) + **Consumer Contract** (`trackEvent`, сутності, слот «Сьогодні», `getVariant`) | ✅ Tasks approved |
| **2. Аналіз відтоку** | [`docs/product/01-churn-analysis.md`](docs/product/01-churn-analysis.md) — Q1 (≥3 когорти Day1/Day2), Q2 (5 гіпотез + методи перевірки), Q3 (RICE + обґрунтування Confidence) | ✅ |
| **3. Retention-MVP** | [`specs/001-daily-focus/`](specs/001-daily-focus/) — spec, plan (UX/UI, логіка, Primary+Guardrail метрики), tasks на 2 тижні, A/B-дизайн | ✅ |
| **AI-трек (роадмеп)** | [`specs/002`–`006`](specs/) + [`ai-personalization-context`](specs/ai-personalization-context/) — groomed backlog 5 AI-фіч + спільний enabler | ✅ spec/plan/tasks |
| **Product Tour** | [`specs/007-product-tour/`](specs/007-product-tour/) — детермінований (non-AI) guided walkthrough | ✅ |
| **Прототип** | [`prototype/`](prototype/) — спільний клікабельний застосунок (no-build Web Components, `file://`-safe, Vercel-static) | ✅ |
| **Пакет здачі** | [`delivery/README.md`](delivery/README.md) — TL;DR, покриття завдання, [execution-plan](delivery/01-execution-plan.md), [feature-matrix](delivery/02-feature-matrix.md) | ✅ |

---

## Підхід: Product Forge → Spec Kit

Робота не «простирадло тексту», а керований пайплайн із гейтом після кожної фази (статус — у `.forge-status.yml` кожної фічі):

```
Problem Discovery → Research → Product Spec → Revalidation
  → Bridge (spec.md) → Plan → Tasks → [Implement → Code Review → Verify → …]
```

Режим проєкту — **standard** (повний ланцюг трасування). Spec Kit backs стадії Bridge/Plan/Tasks/Implement. Команди: `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement` та ін.

**Чому не одразу код:** 80% відтоку — це гіпотеза про *поведінку*, а не про відсутність функції. Спочатку валідуємо проблему й найдешевший важіль, потім будуємо тільки те, що валідуємо.

---

## Структура репозиторію

```
docs/
  00-master-plan.md/.html        # орієнтир + роадмеп (ЧИТАТИ ПЕРШИМ)
  index.html                     # хаб усього пакета
  product/01-churn-analysis.*    # аналіз відтоку (Q1–Q3 + RICE)
  product/02-ai-ideas-backlog.*  # backlog AI-фіч
  product/03-rationale.*         # логіка продуктових рішень
  product/04-speech.*            # скрипт Loom-виступу
  verification-report.*          # звіт перевірки трасування

specs/
  000-core-infrastructure/       # фундамент: spec/plan/tasks + Consumer Contract
  001-daily-focus/               # retention-MVP (обрана фіча) + A/B
  002…006-ai-*/                  # AI-трек (роадмеп)
  007-product-tour/              # non-AI onboarding
  ai-personalization-context/    # спільний enabler для AI-фіч

prototype/                       # спільний клікабельний застосунок (Web Components)
  index.html                     #   фундамент + AI (000 + 002–006)
  daily-focus.html               #   A/B-демо фічі 001
  shared/tokens.css              #   дизайн-токени + рамка телефону
  foundation/ + features/        #   ядро + по одному <dt-*> на фічу

delivery/                        # пакет здачі (submission)
.specify/memory/constitution.md  # продуктові принципи (гейт на фазі Plan)
.product-forge/config.yml        # реєстр фіч, режими, локалі (uk/en)
```

---

## Як подивитися

- **Прототипи:** відкрити `prototype/index.html` (фундамент + AI) і `prototype/daily-focus.html` (A/B Daily Focus) у браузері — працюють із `file://`, без збірки.
- **Хаб усіх документів:** `docs/index.html`.
- **Почати читати:** `docs/00-master-plan.md` → `delivery/README.md` → `docs/product/01-churn-analysis.md`.

---

## Конвенції

- **Кожен продуктовий артефакт — українською** (`uk`); `en` — вторинна локаль. Цей README та `CLAUDE.md` англо/україномовні — це нормально.
- **Markdown — джерело істини; HTML генерується з нього** — не правити HTML окремо.
- **Жодних звітів у корені:** фічі → `specs/<feature>/`, наскрізні документи → `docs/`, governance → `.specify/memory/`.
- **Усі числа позначені як оцінки** — реальних даних немає.
- **Без кастомного AI/ML** — лише rules-/template-based, якщо команда з 4 осіб не зможе зробити це за 2 тижні.
- Кожну фічу гейтить **конституція** (`.specify/memory/constitution.md`, v1.0.0): user-value/activation-first · analytics-first · humane engagement (без dark patterns) · simplicity/YAGNI · accessibility & mobile-first (WCAG 2.1 AA).

> Деталі для агентів і повну робочу інструкцію дивись у [`CLAUDE.md`](CLAUDE.md).
