# Tasks: PersonalizationContext (`ai-personalization-context`)

**Plan**: [plan.md](./plan.md)

## Phase 1: Збирач
- [ ] T001 `getPersonalizationContext(userId)` — зчитати профіль/історію/care/flags із фундаменту
- [ ] T002 Похідні: streak, completedToday/Total, weekCompletionRate, skippedTaskTypes
- [ ] T003 Fallback для відсутніх полів (контекст завжди валідний)
- [ ] T004 Privacy: лише дані userId; без cross-user

## Phase 2: Контракт і тести
- [ ] T005 Зафіксувати `PersonalizationContext` як публічний контракт (типи)
- [ ] T006 Юніти: повна/порожня/часткова історія → валідна схема

## Phase 3: Демо
- [x] T007 `getPersonalizationContext()` у прототипі; 003 (AI порада) читає через нього ✅

> Реалізація-демо: [../../prototype/index.html](../../prototype/index.html).
