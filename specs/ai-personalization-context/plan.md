# Plan: PersonalizationContext (`ai-personalization-context`)

**Spec**: [spec.md](./spec.md) · type: shared infrastructure

## Архітектура
```
foundation data (Dog, Completion, CareEvent, Plan, AnalyticsEvent)
        │
        ▼
getPersonalizationContext(userId)   ← єдиний збирач (чиста функція + кеш)
        │
        ├──► 003 AI порада дня     (prompt + UI)
        ├──► 002 Запитай про Рекса (prompt + chat)
        ├──► 004 Місії / 005 Лог / 006 Адаптація плану
        (усі — тонкі обгортки поверх контексту)
```

## Логіка збирача
1. Зчитати профіль, історію `Completion`, події, `CareEvent`, `getVariant`.
2. Обчислити похідні: `streak`, `completedToday/Total`, `weekCompletionRate`, `skippedTaskTypes`.
3. Застосувати fallback для відсутніх полів.
4. Повернути типізований `PersonalizationContext` (кеш на короткий TTL у проді).

## Tech / guardrails
- **Чиста функція**, без побічних ефектів; легко тестувати й мокати.
- **Privacy:** лише дані цього userId; без cross-user; згода.
- **Без нових PII**; не зберігаємо окремо — складаємо з наявного.
- **Performance:** дешеве складання; кеш на день для важких полів.

## Prod vs прототип
**Prod:** сервіс/хук (читає БД + кеш). **Прототип:** JS-функція над станом фундаменту (демо контракту). Реалізовано в [основному прототипі](../../prototype/index.html) — AI-порада (003) читає через `getPersonalizationContext()`.

## Effort
~1 л-тиждень (збирач + тести). Окупається на кожній наступній AI-фічі (ефект ↓ у backlog §0/§2).
