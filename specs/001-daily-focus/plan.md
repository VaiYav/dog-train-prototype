# Implementation Plan / ТЗ: Daily Focus loop (`001-daily-focus`)

**Branch**: `001-daily-focus` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)
**Depends on**: [`000-core-infrastructure`](../000-core-infrastructure/spec.md) (Consumer Contract)

## Summary
Поверх «Сьогодні» фундаменту додаємо **Daily Focus loop**: щоденне локальне нагадування + гуманний стрік, під A/B-флагом `daily_focus`. Мета — підняти **D2 retention**. Реалізація — без AI/ML, повторно використовує події/сутності/поверхню фундаменту.

---

## 1. UX/UI — зміни в інтерфейсі (шаблони)

> Високофідельний клікабельний приклад — [prototype/daily-focus.html](../../prototype/daily-focus.html) (перемикач **Control ↔ Daily Focus**).

### 1.1 Стрік-чіп на «Сьогодні» (variant)
```
┌───────────────────────────────┐
│  Рекс 🐶               🔥 4     │  ← було 🔥0 (control); variant: жива серія
├───────────────────────────────┤
│   Сьогодні · Чт   ◌ 1/3        │
│   ┌─ 🔥 Серія: 4 дні ─────────┐ │  ← мікро-банер: «не загуби сьогодні»
│   │ ▓▓▓▓░░░  ще 3 до тижня!   │ │
│   └──────────────────────────┘ │
└───────────────────────────────┘
```

### 1.2 Контекстний opt-in нагадування (після першої перемоги)
```
┌───────────────────────────────┐
│  🔔  Чудово, перша перемога! 🎉 │
│  Нагадати завтра подбати       │
│  про Рекса? Обери час:         │
│  [ 🌅 Ранок ] [ ☀️ День ]       │
│  [ 🌙 Вечір ] [ ⏰ Свій час ]   │
│  [ Увімкнути нагадування ]     │
│        Не зараз                │
└───────────────────────────────┘
```

### 1.3 Щоденне нагадування (нотифікація)
```
🐶 Вечір 18:00 · DogTrain
Час подбати про Рекса 🐾 — 3 завдання. Серія: 4 🔥
(тап → «Сьогодні»)
```

### 1.4 Мікросвято стріку (3 / 7 днів) + гуманний пропуск
```
── 7 днів: ──                         ── пропустив день: ──
🎉 Тиждень поспіль!                    ❄️ Заморозка серії використана
Перший тижневий план — твій!          Серію збережено (4 🔥). Без паніки —
[ Поділитись 🐾 ]                      продовжуй сьогодні!
```

**Принципи (constitution III — Humane):** ≤1 нагадування/день; вимкнути в 1 тап; пропуск **не** обнуляє різко; конфеті поважає `prefers-reduced-motion`.

---

## 2. Логіка реалізації (кроки користувача + що в системі)

### Кроки користувача
1. D0: робить **першу перемогу** (відмічає завдання) → з'являється контекстний opt-in нагадування + вибір часу.
2. Щодня в обраний час → **нагадування** → тап → «Сьогодні».
3. Виконує ≥1 завдання → **стрік++**, прогрес до тижня; на 3/7 днів — мікросвято.
4. Пропустив день → **freeze-токен** рятує серію (якщо є), інакше м'який рестарт без сорому.

### Що в системі
```
onFirstWin():           getVariant('daily_focus')=='variant' → показати opt-in
onReminderSet(time):    schedule LocalNotification(daily, time); trackEvent('reminder_scheduled',{time})
dailyAt(time):          if !dayCompleted → fire notification; trackEvent('reminder_fired')
onNotificationOpen():   deep-link 'today'; trackEvent('reminder_opened')
onTaskComplete(day):    if firstCompletionOfDay → streak = computeStreak(Completions)
                        if streak in {3,7} → celebrate + trackEvent('streak_milestone',{n})
                        trackEvent('streak_incremented',{n})
onDayMissed():          if freezeTokens>0 → freezeTokens--; keep streak; trackEvent('streak_frozen')
                        else streak=0; trackEvent('streak_reset')   // без різкого UI-покарання
weeklyTick():           freezeTokens = min(freezeTokens+1, 1)
```
**Стрік** = к-сть послідовних календарних днів із ≥1 `Completion` (рахується локально з історії фундаменту; offline-ok). **Нагадування** = Capacitor LocalNotifications (прод) / імітований банер (прототип).

---

## 3. Метрики успіху

### Primary Metric
**D2 retention** — частка нових користувачів, які **повернулись на Day 2 і виконали ≥1 завдання** (variant vs control).
**Зв'язок із бізнесом:** рання утримуваність (D2) — найсильніший випереджальний індикатор D7/D30 і LTV; саме на D2–3 гине 80% — зрушення тут напряму збільшує активну базу й downstream-конверсію в підписку.

### Secondary
D7 retention; completion 1-го тижневого плану; середня к-сть днів поспіль; reminder_opened→session rate.

### Guardrail Metrics (НЕ повинні погіршитись)
| Guardrail | Чому | Поріг |
|---|---|---|
| Opt-out нагадувань / uninstall rate | не «перенагадати» в видалення | не вище control |
| Рейтинг у сторі / негативні відгуки | не дратувати | не нижче control |
| Onboarding completion / activation (`first_win` D0) | opt-in крок не має різати активацію | не нижче control |
| Сер. к-сть виконаних завдань на активного | не «накрутити» retention тривіалізацією | не нижче control |
| Crash-free sessions / час рендеру «Сьогодні» | стабільність | не гірше control |

---

## 4. A/B-дизайн (експеримент)

- **Юніт рандомізації:** новий користувач (по `device/user id`), **50/50** через `getVariant('daily_focus')`.
- **Control:** фундамент без активного стріку (🔥0) і без щоденного engagement-нагадування. **Variant:** повна петля.
- **Гіпотеза:** variant підвищує D2 retention vs control.
- **Правило рішення:** ship, якщо D2 lift статзначимий (95%) і **жоден guardrail не просів**; інакше kill/iterate.

### Sample size (чесно про 2 тижні)
Двопропорційний тест, 80% потужність, α=0.05; baseline D2 ≈ 25% (галузевий орієнтир).
- Виявити **+5 п.п.** (25%→30%): **≈ 1 250 / арм** (~2 500 разом).
- Виявити **+10 п.п.** (25%→35%): **≈ 330 / арм** (~660 разом).

При ~2 000 нових/міс (припущення/ESTIMATE) за 2-тижневе вікно набереться ≈ 1 000 нових **разом** → **≈ 500/арм** (спліт 50/50). Тож вікно **повністю потужне лише для ефекту ~+8–10 п.п.** (треба ≈330–500/арм); для **+5 п.п.** (треба ≈1 250/арм) — ~5–6 тижнів. Тому: **pre-register** план, на 2 тижні читаємо **директивно** (тренд + guardrails), а на повну потужність добиваємо, якщо тренд позитивний. Це і є валідація гіпотези без побудови повного функціоналу.

---

## 5. Technical Context
**Стек:** клікабельний HTML-прототип (mobile-first) для валідації; прод — RN/Flutter + Capacitor LocalNotifications + PostHog (flags+experiments). **Reuse:** події/сутності/поверхня/`getVariant` фундаменту — нічого не дублюємо.
**Нові події:** `reminder_scheduled`, `reminder_fired`, `reminder_opened`, `streak_incremented`, `streak_milestone`, `streak_frozen`, `streak_reset` (усі з тегом `variant`).
**Constitution Check:** ✅ Activation/Analytics/Humane/Simplicity/Mobile-first — без порушень (Humane — ключовий: гуманний стрік, ≤1 нагадування).

## 6. Complexity Tracking
*Порушень немає.* Стрік і нагадування — детерміновані, без ML; effort 2 л-тижні (див. [tasks.md](./tasks.md)).
