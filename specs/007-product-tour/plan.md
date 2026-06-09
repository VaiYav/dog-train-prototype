# Plan / ТЗ: Product Tour (`007-product-tour`) — lite · NON-AI

**Spec**: [spec.md](./spec.md) · mode: lite · **без AI/LLM**

## UX (coach marks)
```
            ┌───────────────────────────┐
   (підсвічений елемент — ring)          │
            └───────────────────────────┘
┌───────────────────────────────────────┐
│ Крок 2/4                                │
│ 💡 Порада дня — персональна підказка    │
│ під твою собаку щодня.                  │
│ ○ ● ○ ○        [Пропустити]   [Далі →]  │
└───────────────────────────────────────┘
```
Кроки (приклад, ≤5): 1) «Сьогодні» — 1–3 завдання; 2) Порада дня; 3) таб-бар (Догляд/Прогрес); 4) «Запитай про Рекса». Останній крок → «Готово».

## Логіка (детермінована, без AI)
```
TOUR = [{selector, title, body}, …]            // фіксована послідовність
startTour(manual): if !state.tourSeen || manual → show; step(0); track('tour_started')
step(i): highlight(selector) + scrollIntoView + card(text, dots); track('tour_step',{n:i+1})
next(): i<last ? step(i+1) : end('completed')
skip(): end('skipped')
end(reason): clear highlight; hide; state.tourSeen=true; persist; track('tour_'+reason)
relaunch: кнопка «?» / налаштування
```
Жодного LLM/ML — це послідовність кроків + флаг «показано».

## Метрики
- **Primary:** активація / feature adoption (tour vs no-tour) + completion rate.
- **Guardrails:** **time-to-value не гірше** (тур не блокує першу перемогу); skip-rate; drop-off по кроках; uninstall не зростає.

## Guardrails (constitution III — Humane)
Skippable будь-коли; non-blocking; показ **раз**; ≤5 кроків; за дефолтом — **після першої перемоги**, щоб не псувати TTV; перезапуск доступний.

## A/B
`getVariant('product_tour')`: control без туру vs variant із туром. Гіпотеза — variant ↑ активацію/adoption без шкоди TTV. Час показу (одразу vs після перемоги) — окремий тест.

## Implementation notes (за користувачем)
Прототип: ring (`box-shadow`) на елементі + фіксована картка-крок + крапки; `state.tourSeen`. Прод: нативні coach marks або DAP (Pendo/Appcues/Userpilot/Whatfix). `implement: pending`.

## Effort
~1 л-тиждень (послідовність + підсвітка + події + перезапуск). Дешево, бо детерміновано.
