# Product Spec Index: Minimal Infrastructure (base DogTrain)

> Status: DRAFT | Created: 2026-06-09 | Last updated: 2026-06-09
> Feature slug: `000-core-infrastructure`
> ← [Back to Feature Root](../README.md) | ← [Research](../research/README.md)

## What We're Building
Мінімальний фундамент DogTrain як **клікабельні HTML-прототипи (mobile-first)**: профіль собаки → 8-кроковий онбординг → rules-based план → екран **«Сьогодні» з 3 завданнями** → відмітки/прогрес → нагадування догляду/здоров'я → 7-денний trial одразу. Усе інструментовано імітованою аналітикою. Фундамент дає **цінність ≤2 хв** і **дані для Фази 2**.

## Document Map

| Документ | Призначення | Деталізація | Статус |
|---|---|---|---|
| [product-spec.md](./product-spec.md) | Головний PRD — цілі, історії, вимоги, рішення | Standard | DRAFT |
| [user-journey.md](./user-journey.md) | Потоки Активація (D0) і Повернення (D2) | Standard | DRAFT |
| [wireframes.md](./wireframes.md) | ASCII-екрани, mobile-first | Text/ASCII | DRAFT |
| [metrics.md](./metrics.md) | KPI, leading-індикатори, guardrails | Concise | DRAFT |

## Key Decisions

| Рішення | Вибір | Обґрунтування |
|---|---|---|
| Головний екран | «Сьогодні» (3 завдання), не тижневий план | Знижує перевантаження (підозра кореня відтоку) |
| Онбординг | 8 кроків (одне рішення/крок) | Персоналізація (рішення користувача) + мітигація drop-off |
| Догляд/здоров'я | У скоупі фундаменту, нагадування зараз | Унікальний єдиний цикл (рішення користувача) |
| Trial | Стартує одразу, без картки | Рішення користувача; paywall не ріже першу перемогу |
| Генерація плану | Rules-based, без AI/ML | Обмеження завдання |
| Стек | HTML-прототипи, mobile-first | Дешева валідація потоків/метрик до проду |
| Гейміфікація/стрік | Поза фундаментом | Це retention-MVP Фази 3 |

## Must Read
> Почни з [product-spec.md](./product-spec.md), далі [user-journey.md](./user-journey.md) і [wireframes.md](./wireframes.md). Дослідження — у [../research/](../research/README.md).
