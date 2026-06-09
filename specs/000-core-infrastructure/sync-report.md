# Sync & Verify Report: Minimal Infrastructure (base DogTrain)

> Feature: `000-core-infrastructure` | Date: 2026-06-09
> Layers checked: 5/7 (Layers 5–6 skipped — код ще не реалізовано на момент запуску)
> Phase: tasks completed

## Summary

| Severity | Count |
|---|---|
| ❌ CRITICAL | 0 |
| ⚠️ WARNING | 4 (всі виправлені) |
| ℹ️ INFO | 1 |
| ✅ CLEAN | layers 1, 2, 3, 4 (file-level) |

**Verdict:** ✅ **CONSISTENT** (після виправлення 4 anchor-drift; structural budget = 0 дотримано).

## Layer Results

### Layer 1: research/ ↔ product-spec/ — ✅ CLEAN
Усі ключові знахідки відображені у спеці: «Сьогодні» дефолтний екран, контекстний opt-in, без стіни тижневого плану, rules-based без ML, єдиний денний цикл. Одна свідома розбіжність — нижче (INFO-001).

### Layer 2: product-spec/ ↔ spec.md — ✅ CLEAN
Усі Must Have (US-1…US-8) і Should (US-9, US-10) присутні в `spec.md` з тими ж AC. Скоуп-кріпу немає; 5 рішень користувача відображені в обох.

### Layer 3: spec.md ↔ plan.md — ✅ CLEAN
FR-001…FR-011 покриті планом (структура `prototype/`, data-model, tech context). Plan не виходить за межі spec.

### Layer 4: plan.md ↔ tasks.md — ✅ CLEAN
Кожен компонент плану має задачі (Setup/Foundational/US-фази/Polish); orphan-задач немає; T001–T032 трасуються до stories/plan.

### Layer 5: tasks.md ↔ Code — ⏭ SKIPPED
Код ще не реалізовано (implement не запускався на момент перевірки). *Будується далі — прототип фундаменту.*

### Layer 6: spec.md ↔ Code — ⏭ SKIPPED
Те саме — немає коду для звірки.

### Layer 7: Cross-link Integrity — ⚠️ 4 findings → ✅ resolved
58/58 file-links валідні. Знайдено 4 розбиті intra-doc anchor через авто-слаги кириличних заголовків зі спецсимволами (`★`, `/`, `(...)`). Виправлено явними ASCII-id.

## All Drift Items

### DRIFT-001 [WARNING · structural] Layer 7 — broken anchor `#екран-3...`
| Поле | Значення |
|---|---|
| Source | wireframes.md nav + spec.md |
| Evidence | заголовок «Екран 3 … ★ головний» → слаг містить `--головний`; посилання обрізане |
| Resolution | ✅ додано `<a id="ekran-3">`, посилання → `#ekran-3` |

### DRIFT-002 [WARNING · structural] Layer 7 — broken anchor `#екран-4`
Заголовок «…виконано / день завершено» → слаг `…--день-завершено`; посилання обрізане. **Resolution:** ✅ `#ekran-4`.

### DRIFT-003 [WARNING · structural] Layer 7 — broken anchor `#екран-5`
Заголовок «…(вторинний)» → слаг `…-вторинний`; посилання обрізане. **Resolution:** ✅ `#ekran-5`.

### DRIFT-004 [WARNING · structural] Layer 7 — broken anchor `#екран-6`
Заголовок «Догляд/здоров'я + нагадування» → слаг `…доглядздоровя--нагадування`; посилання помилкове й обрізане. **Resolution:** ✅ `#ekran-6` (у nav і в spec.md).

### INFO-001 [INFO · acknowledged] Layer 1 — trial одразу vs «ранній paywall антипаттерн»
Рішення користувача «trial одразу» розходиться зі знахідкою дослідження. **Не drift:** розбіжність задокументована з мітигацією (trial без картки, повний доступ, paywall після першої перемоги; час — A/B). Лишаємо як свідомий, відстежуваний компроміс.

## Proposed Actions
1. ✅ DRIFT-001…004 — застосовано (явні ASCII-anchor `ekran-1…7`, посилання оновлені).
2. ℹ️ INFO-001 — підтверджено як свідомий компроміс; перевіримо A/B у Фазі 3.

## Sync History

| Run | Date | Layers | CRITICAL | WARNING | Verdict |
|---|---|---|---|---|---|
| #1 | 2026-06-09 | 5/7 | 0 | 4→0 | CONSISTENT (after fix) |
