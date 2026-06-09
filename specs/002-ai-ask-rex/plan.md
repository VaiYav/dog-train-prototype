# Plan / ТЗ: «Запитай про Рекса» (`002-ai-ask-rex`) — lite

**Spec**: [spec.md](./spec.md)

## UX
```
[💬 Запитай про Рекса]  ← плаваюча кнопка
 → оверлей-чат:
   Підказки: [Скільки гуляти?] [Чому гавкає?] [Чим годувати?]
   ─ Q: Скільки гуляти?
   ─ A: Для середнього активного Рекса — ~40 хв на день,
        краще 2 виходи. (⚠️ загальна порада, не діагноз)
   [ввід питання…]
```

## Логіка
```
ctx = getPersonalizationContext(userId)
answer = LLM(prompt(ctx, question, curatedKB))
if isMedical(question) → answer = generalAdvice + «зверніться до ветеринара» (no diagnosis)
track('ai_qa_question',{topic})
```

## Метрики / guardrails
- **Primary:** D2/D7 + питань на користувача. **Guardrails:** 0 медичних діагнозів (safety-фільтр), 👎/скарги не зростають, cost/latency у межах.

## Prod vs прототип
**Prod:** LLM + KB + safety-фільтр. **Прототип:** `askRex(q)` — grounded відповіді за темами (прогулянка/їжа/поведінка/здоров'я→дисклеймер) на `getPersonalizationContext()`.

## Effort
~2 л-тижні поверх enabler (чат-UI + safety-фільтр + KB-prompt).
