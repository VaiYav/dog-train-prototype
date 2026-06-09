# Enabler: PersonalizationContext (`ai-personalization-context`)

> Спільний шар (shared infrastructure) під усі AI-фічі. Forge: standard.

## Дуже коротко
**Що:** один збирач `getPersonalizationContext(userId)`, що з даних фундаменту (профіль + історія + прогрес + care + ціль + A/B) складає **типізований персональний контекст**. **Навіщо:** усі AI-фічі (003–006) — тонкі обгортки поверх нього → дешевше будувати, менше галюцинацій, єдині guardrails. **Де демо:** `getPersonalizationContext()` в [основному прототипі](../../prototype/index.html), яким уже користується AI-порада (`003`).

## Артефакти
[spec.md](./spec.md) (Consumer Contract) · [plan.md](./plan.md) · [tasks.md](./tasks.md)

## Споживачі
`003-ai-daily-tip` (готово в прототипі) · `002-ai-ask-rex` · `004-ai-missions` · `005-quick-log` · `006-adaptive-plan`.
