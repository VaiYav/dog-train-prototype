# Feature: Product Tour (`007-product-tour`)

> Forge-документація готова · **NON-AI** (детерміновані coach marks) · `implement: pending` (за користувачем).

## Дуже коротко
**Що:** короткий guided tour по ключових екранах (coach marks: підсвітка + підказка) — навчання користуванню функціоналом. **Не** первинний онбординг. **Як:** фіксована послідовність кроків + флаг «показано раз» + перезапуск «?». **Без AI/LLM** — чиста детермінована логіка. **Навіщо:** швидше розуміння цінності → активація/feature adoption.

## Чесний нюанс
Тур не має псувати time-to-value → дефолт показу **після першої перемоги**, повністю skippable, ≤5 кроків.

## Артефакти (Product Forge)
[spec.md](./spec.md) · [plan.md](./plan.md) · [tasks.md](./tasks.md) · [.forge-status.yml](./.forge-status.yml)

## Зв'язки
Споживає поверхні фундаменту (Today/Care/Progress) + аналітику + `getVariant('product_tour')`. A/B: tour vs no-tour (Primary — активація, guardrail — TTV).
