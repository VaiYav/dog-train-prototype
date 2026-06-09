# Feature: LLM-адаптація плану (`006-adaptive-plan`)

> Друга AI-фіча за RICE-lite (550) · lite forge · демо в основному прототипі.

## Дуже коротко
**Що:** план підлаштовується під реальну поведінку (виконане/пропущене). **Де:** прев'ю «🔄 AI підлаштує завтра» на «Сьогодні»; адаптовані завдання — у тижні. **Як:** `getPersonalizationContext()` → **LLM пропонує** коригування → **rules-валідатор пропускає** (1–3 завдання, безпека, без тривіалізації) → застосувати. **Навіщо:** релевантність → completion → ретеншн.

## Ключове
**LLM пропонує, детермінований rules-валідатор — остання інстанція.** Це тримає передбачуваність і безпеку (constitution III/IV).

## Артефакти
[spec.md](./spec.md) · [plan.md](./plan.md) · [tasks.md](./tasks.md) · демо → [основний прототип](../../prototype/index.html)

## Зв'язки
Споживає [`ai-personalization-context`](../ai-personalization-context/README.md) + rules-engine фундаменту. A/B `getVariant('adaptive_plan')`.
