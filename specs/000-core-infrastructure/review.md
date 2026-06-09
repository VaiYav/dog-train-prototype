# Review Log: Minimal Infrastructure (base DogTrain)

> Feature: `000-core-infrastructure` | Status: ✅ APPROVED
> Started: 2026-06-09

## Current Status: APPROVED

## Open Questions Resolution

| # | Питання | Рішення | Обґрунтування | Внесено у |
|---|---|---|---|---|
| 1 | Скільки кроків онбордингу до плану без втрати персоналізації? | **8 кроків** | Рішення користувача; мітигуємо односкроковими екранами + per-step трекінгом | spec v1.1, US-2/FR-002 |
| 2 | Скільки завдань показувати в D0? | **3 завдання** | Рішення користувача; чіткий фокус, перше — тривіальне (перша перемога) | spec v1.1, US-4/FR-004 |
| 3 | Чи входять нагадування догляду/здоров'я у фундамент? | **Так, зараз** | Рішення користувача; підсилює унікальний єдиний цикл | spec v1.1, US-6/FR-007 |
| 4 | Монетизація у фундаменті? | **Trial одразу, без картки** | Рішення користувача; paywall не ріже першу перемогу | spec v1.1, US-7/FR-008 |
| 5 | Стек реалізації? | **HTML-прототипи, mobile-first** | Рішення користувача; дешева валідація потоків/метрик | tech-stack v2, наскрізно |
| 6 | Точний момент жорсткого paywall (одразу vs кінець trial)? | **Відкладено → A/B-кандидат** | Не блокер фундаменту; перевіримо експериментом | spec Open Questions |
| 7 | Глибина набору нагадувань «з коробки»? | **Відкладено** | Уточнюється на етапі контенту шаблонів | spec Open Questions |

## Decision Log

| Дата | Рішення | Обґрунтування |
|---|---|---|
| 2026-06-09 | Головний екран = «Сьогодні» (3 завдання), не тижневий план | Знижує перевантаження (підозра кореня відтоку) |
| 2026-06-09 | Аналітику (імітований trackEvent) робимо першою | Передумова Фази 2 |
| 2026-06-09 | План rules-based, без AI/ML | Обмеження завдання |
| 2026-06-09 | 8 кроків · 3 завдання · догляд у скоупі · trial одразу · HTML mobile-first | 5 рішень користувача |
| 2026-06-09 | Стрік/гейміфікація — поза фундаментом (Фаза 3) | Це окремий retention-важіль, валідуємо окремо |

## Change History
- v1.0 → v1.1: внесено 5 рішень користувача (8 кроків, 3 завдання D0, догляд/здоров'я у скоупі, trial одразу, HTML-прототипи mobile-first); переписано tech-stack; пропаговано в усі артефакти.

## Revision History

### Revision #1 — 2026-06-09
**User feedback (verbatim):**
> Монетизація у фундаменті: вмикати trial одразу · Скоуп блоку «догляд/здоров'я» у фундаменті (нагадування зараз) · Скільки завдань показувати в D0 — 3 завдання · кроків до першого плану без втрати персоналізації — 8
> Tech stack исправляй на html-prototypes, которые будут адаптированы под mobile-first app

**Changes applied:**
| Файл | Тип | Опис |
|---|---|---|
| product-spec.md | Modify | v1.1: 8 кроків, 3 завдання, догляд у Must, trial у Must, decision log |
| research/tech-stack.md | Restructure | переорієнтовано на HTML-прототипи mobile-first |
| .product-forge/config.yml, codebase-analysis.md, research/README.md, digest.md | Modify | пропаговано стек HTML mobile-first |
| user-journey.md, wireframes.md, metrics.md | Add | створено з урахуванням рішень |

**Agent notes:** зафіксовано дві напруги (trial vs ранній paywall; 8 кроків vs пісний онбординг) з явними мітигаціями у спеці.

---

## ✅ APPROVED — 2026-06-09

**Approved by user** (рух через гейти: «approve» Research, «continue» через Product Spec → Revalidation після внесення 5 рішень).

**Final document inventory:**
| Документ | Статус |
|---|---|
| product-spec/product-spec.md (v1.1) | LOCKED |
| product-spec/user-journey.md | LOCKED |
| product-spec/wireframes.md | LOCKED |
| product-spec/metrics.md | LOCKED |
| product-spec/README.md | LOCKED |

**Status: LOCKED — Ready for SpecKit Bridge (Phase 4)**
