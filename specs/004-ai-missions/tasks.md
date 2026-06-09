# Tasks: AI місії (`004-ai-missions`) — lite

**Plan**: [plan.md](./plan.md)

- [x] T001 `missionText(ctx)` під goal + вік/розмір ✅
- [x] T002 Rules-безпека місії; **не повторювати прийняте** ✅ (`S.missionsAccepted` → filter)
- [x] T003 Картка «Місія тижня» (Прогрес) + «прийняти»/«інша» ✅ — компонент `<dt-missions>`
- [x] T004 A/B `getVariant('ai_missions')` + події `ai_mission_shown/refreshed/accepted` ✅ (control = без місій)
- [x] T005 Демо `missionText(ctx)` у прототипі ✅

> Демо: [../../prototype/index.html](../../prototype/index.html) — компонент `<dt-missions>` (`foundation/features/missions.js`), вкладка «Прогрес». A/B — у дровері «📊 events».
