# Tasks: Швидкий лог (`005-quick-log`) — lite

**Plan**: [plan.md](./plan.md)

- [x] T001 `parseLog(text)` → події ✅ (proto: keywords; prod: LLM)
- [x] T002 UI підтвердження перед записом (виправлення/скасування) ✅
- [x] T003 Запис у догляд після підтвердження; події `ai_log_parsed`/`ai_log_confirmed` ✅
- [x] T004 A/B `getVariant('quick_log')` ✅ (control = без поля); (голос — наступна ітерація)
- [x] T005 Демо `parseLog()` у прототипі (вкладка «Догляд») ✅

> Демо: [../../prototype/index.html](../../prototype/index.html) — компонент `<dt-quick-log>` (`foundation/features/quick-log.js`), вкладка «Догляд». A/B — у дровері «📊 events».
