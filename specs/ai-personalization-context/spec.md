# Spec: PersonalizationContext (`ai-personalization-context`) — shared enabler

> Product Forge feature · type: **shared infrastructure** · SpecKit: classic
> Source: [AI backlog §0](../../docs/product/02-ai-ideas-backlog.md) · Depends on: [foundation Consumer Contract](../000-core-infrastructure/spec.md)
> Consumed by: `003-ai-daily-tip`, `002-ai-ask-rex`, `004-ai-missions`, `005-quick-log`, `006-adaptive-plan`

## Навіщо
Усі AI-фічі роблять одне під капотом — перетворюють дані користувача на персональний LLM-контекст. Будуємо це **один раз** як спільний шар: ↓ effort кожної фічі, ↑ Confidence (єдине, узгоджене джерело → ↓ галюцинації), єдині guardrails.

## Що це
Чиста функція-збирач: `getPersonalizationContext(userId)` → типізований об'єкт із даних фундаменту (профіль + історія виконань + прогрес + care + ціль + A/B-варіант). Це **єдиний вхід** для всіх AI-фіч; решта — тонкі обгортки (prompt + UI).

## Goals
- Один контракт `PersonalizationContext` для всіх AI-фіч.
- Жодного дублювання збору даних; жодного cross-user витоку.
- **Non-goals:** сам LLM-виклик (це у фічах); навчання моделей; зберігання нових PII.

## User Stories (Must)
- [ ] **US-1.** Як AI-фіча, я хочу один виклик, що повертає повний персональний контекст, щоб не збирати дані самій. **AC:** `getPersonalizationContext(userId)` повертає схему нижче.
- [ ] **US-2.** Як система, я хочу безпечні fallback при браку даних, щоб фічі не падали. **AC:** відсутні поля → дефолти/null, контекст завжди валідний.
- [ ] **US-3.** Як користувач, я хочу, щоб персоналізація йшла лише з моїх даних. **AC:** жодних інших користувачів; згода врахована.

## Consumer Contract (публічна поверхня)

```ts
getPersonalizationContext(userId): PersonalizationContext

interface PersonalizationContext {
  dog:      { name; breedGroup; ageBand; weightKg?; activityLevel; livingContext };
  goal:     'health' | 'activity' | 'behavior';
  progress: { streak; completedToday; completedTotal; weekCompletionRate };
  behavior: { skippedTaskTypes: string[]; lastActiveDay; returnedToday: boolean };
  care:     { dueCareEvents: { type; dueInDays; status }[] };
  flags:    { variant: 'control' | 'variant' };   // per-feature A/B
}
```

### Звідки кожне поле (усе вже у фундаменті)
| Поле | Джерело (foundation Consumer Contract) |
|---|---|
| `dog`, `goal` | Dog profile (`dog_profile_completed`) |
| `progress` | `Completion` history + streak (`task_completed`, `day_completed`) |
| `behavior` | `AnalyticsEvent` (`app_opened`, skipped tasks) |
| `care` | `CareEvent` (дедлайни/статуси) |
| `flags` | `getVariant(feature)` |

### Fallback / safety
| Випадок | Поведінка |
|---|---|
| Немає історії | `progress` нулі; `behavior.skippedTaskTypes=[]` |
| Немає профілю | дефолти (breedGroup='Середня'); контекст валідний |
| Приватність | лише дані цього userId; без cross-user; згода |

## Acceptance
1. Один виклик повертає повну, валідну схему.
2. Брак даних → дефолти, не помилка.
3. Жодного cross-user; лише дані власника.
4. Усі 5 AI-фіч можуть будуватись поверх без власного збору даних.

## Prod vs прототип
**Prod:** сервіс/хук, що читає БД фундаменту + кеш. **Прототип:** `getPersonalizationContext()` у JS читає стан фундаменту (`S.dog`, `S.completions`, `S.variant`) — демонструє контракт; AI-порада (003) уже читає контекст через нього.
