# DogTrain — shared clickable prototype

The single, global home for all DogTrain clickable prototypes (extracted here from
`specs/000-core-infrastructure/` and `specs/001-daily-focus/`). **No build, no dependencies** —
open the HTML by double-click (`file://`) or serve statically. Mobile-first phone-frame (~390px),
`localStorage` state, simulated `trackEvent` analytics.

## Pages

| Page | What |
|---|---|
| [`index.html`](./index.html) | **Foundation + AI** — onboarding → plan → Today → Care → Progress → trial/paywall, plus AI features 002–006 |
| [`daily-focus.html`](./daily-focus.html) | **001 Daily Focus** — Control ↔ Daily Focus A/B (streak, humane freeze, contextual reminder) |

## Structure

```
prototype/
├── index.html                 # foundation shell (loads features first, then app.js)
├── daily-focus.html           # 001 A/B demo (own store — no global clash with foundation)
├── shared/
│   └── tokens.css             # design tokens + phone-frame chrome (shared by every page)
├── foundation/
│   ├── foundation.css         # foundation screen + component styles
│   ├── app.js                 # core app (global): state S, trackEvent, nav, onboarding,
│   │                          #   rules-engine, Today/Care/Progress, getPersonalizationContext, getVariant
│   └── features/              # ← AI features, ONE custom element per file
│       ├── ai-tip.js          #   <dt-ai-tip>     (003)
│       ├── adaptive.js        #   <dt-adaptive>   (006)
│       ├── missions.js        #   <dt-missions>   (004)
│       ├── quick-log.js       #   <dt-quick-log>    (005)
│       ├── ask-rex.js         #   <dt-ask-rex>      (002)
│       └── product-tour.js    #   <dt-product-tour> (007 — NON-AI coach marks)
└── daily-focus/
    ├── daily-focus.css
    └── daily-focus.js
```

## Architecture

- **Core stays global** (`app.js`): plain functions + a global `S`. Inline `onclick` and direct
  state mutation are intentional and unchanged from the original prototype — zero-risk to keep working.
- **Each AI feature is a `<dt-*>` Web Component** (custom element, light DOM, internal
  `addEventListener` — no inline `onclick`). They consume the core globals:
  `S`, `getPersonalizationContext()`, `getVariant()`/`setVariant()`, `trackEvent()`.
- **Script load order matters** (classic scripts, no modules): feature files load **first**
  (they only wire DOM in `connectedCallback`), then `app.js` **last** (defines globals + boots; by
  then every `<dt-*>` is upgraded, so `goToday()` can call `element.render()`/`.applyVariant()`).

## Add a new feature = 1 file + 1 tag

1. Create `foundation/features/my-feature.js`:
   ```js
   class DtMyFeature extends HTMLElement {
     render(){
       const ctx = getPersonalizationContext();          // shared enabler
       this.innerHTML = `<div class="mission">…${ctx.dog.name}…</div>`;
       this.querySelector('button')?.addEventListener('click', () => trackEvent('my_feature_x'));
     }
     connectedCallback(){ /* wire only; app calls .render() when its screen shows */ }
   }
   customElements.define('dt-my-feature', DtMyFeature);
   ```
2. Drop `<dt-my-feature></dt-my-feature>` into the right screen slot in `index.html`.
3. Add `<script src="foundation/features/my-feature.js"></script>` **before** `app.js`, and call
   `document.querySelector('dt-my-feature')?.render()` from the relevant `render*()` in `app.js`.

## Deploy (Vercel)

Pure static — **zero config**. Point a Vercel project at this `prototype/` directory (no build
command, no framework preset); it serves as-is. Served over HTTPS the `file://` constraint
disappears, so ES modules would also work there if ever wanted. (Prod AI backend — real LLM behind
`PersonalizationContext` — would be Vercel Functions + AI Gateway; out of scope for this static demo.)

## Notes

- **AI is simulated.** `askRex()`/`aiTipText()`/… are rules/keyword demos standing in for an LLM
  (constitution IV: rules-based until ML is justified). Prod = `PersonalizationContext` + curated KB →
  LLM with a safety filter.
- **Ask Rex safety guardrail** (constitution III): medical topics → vet redirect, never a diagnosis/dose.
- **Daily Focus demo scope.** The A/B toggle, contextual reminder opt-in (after first win), streak/freeze loop and `variant`-tagged event log are demoed. **Reminder opt-out (AC-6) and reminder-time change in Settings (FR-008, Should-Have)** are specified in `specs/001-daily-focus/` but intentionally out of this click-demo's scope.
- **Prod hardening TODO:** the demo interpolates the user-entered dog name into `innerHTML` in places
  (self-XSS only, local single-user demo). The Ask Rex chat already renders the user's *question* via
  `textContent`. Before any real multi-user deployment, sanitize/escape all user-supplied strings.
